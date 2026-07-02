// src/shared/lib/learning.js
//
// Active-learning engine for MedScope AI (Phase 2 + Phase 4).
//
// Adds real learning science on top of the existing storage layer WITHOUT
// touching its keys:
//   - Spaced repetition (SM-2 variant) with confidence grades
//   - Retrieval-practice review cards + a daily due queue
//   - An event log that powers analytics (streak, accuracy, retention,
//     weak/strong topics, estimated exam readiness)
//
// Progress here is earned by recall performance and review completion, not
// by page visits. Everything is local (localStorage) — no backend, matching
// the app's React + Vite + local-JSON architecture.

const KEYS = {
  cards: "medscope:srs:cards", // { [cardKey]: Card }
  events: "medscope:events", // Event[]  (capped)
};

const DAY = 24 * 60 * 60 * 1000;
const RELEARN_MS = 10 * 60 * 1000; // "again" -> ~10 minutes
const MAX_EVENTS = 4000;
const MATURE_DAYS = 21; // interval at/after which a card counts as "retained"

/** Confidence grades shown to the student, in order. */
export const GRADES = {
  again: 0, // نمی‌دانستم
  hard: 1, // سخت بود
  good: 2, // خوب
  easy: 3, // آسان
};

export const GRADE_LABELS_FA = {
  again: "بلد نبودم",
  hard: "سخت بود",
  good: "خوب",
  easy: "آسان",
};

/* ----------------------------- low-level io ---------------------------- */
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function cardKey(module, itemId) {
  return `${module}:${itemId}`;
}

/* ------------------------------ SM-2 core ------------------------------ */
function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * Pure scheduler. Given a card's current state and a grade, returns the next
 * ease / interval / reps / dueDate. Simplified, mobile-friendly SM-2.
 * @param {object} card
 * @param {"again"|"hard"|"good"|"easy"} grade
 * @param {number} now epoch ms
 */
export function schedule(card, grade, now = Date.now()) {
  let ease = typeof card.ease === "number" ? card.ease : 2.5;
  let interval = typeof card.interval === "number" ? card.interval : 0; // days
  let reps = typeof card.reps === "number" ? card.reps : 0;
  let lapses = typeof card.lapses === "number" ? card.lapses : 0;

  if (grade === "again") {
    reps = 0;
    lapses += 1;
    ease = clamp(ease - 0.2, 1.3, 2.8);
    interval = 0;
  } else {
    const delta = grade === "hard" ? -0.15 : grade === "easy" ? 0.15 : 0;
    ease = clamp(ease + delta, 1.3, 2.8);
    reps += 1;
    if (reps === 1) interval = grade === "easy" ? 2 : 1;
    else if (reps === 2) interval = grade === "hard" ? 3 : grade === "easy" ? 6 : 4;
    else interval = Math.round(interval * (grade === "hard" ? 1.2 : ease));
    interval = clamp(interval, 1, 365);
  }

  const dueDate = interval === 0 ? now + RELEARN_MS : now + interval * DAY;
  return { ...card, ease, interval, reps, lapses, dueDate, lastReviewed: now, lastGrade: grade };
}

/* --------------------------- cards + queue ----------------------------- */
export function getCards() {
  return read(KEYS.cards, {});
}

export function getCard(module, itemId) {
  return getCards()[cardKey(module, itemId)] || null;
}

/**
 * Ensure a review card exists for a topic the student has engaged with.
 * New cards are due immediately (they enter the next review session).
 */
export function ensureCard(module, itemId, meta = {}) {
  if (!module || !itemId) return null;
  const cards = getCards();
  const key = cardKey(module, itemId);
  if (!cards[key]) {
    cards[key] = {
      key,
      module,
      itemId,
      title_fa: meta.title_fa || "",
      title_en: meta.title_en || "",
      subtitle: meta.subtitle || "",
      ease: 2.5,
      interval: 0,
      reps: 0,
      lapses: 0,
      dueDate: Date.now(),
      lastReviewed: null,
      lastGrade: null,
      createdAt: Date.now(),
    };
    write(KEYS.cards, cards);
  } else if (meta.title_fa && !cards[key].title_fa) {
    cards[key] = { ...cards[key], ...meta };
    write(KEYS.cards, cards);
  }
  return cards[key];
}

/**
 * Record that a topic was studied: seeds a review card (idempotent) and logs a
 * study event for streak/activity analytics. Safe to call on every open.
 */
export function recordStudy(module, itemId, meta = {}) {
  if (!module || !itemId) return;
  ensureCard(module, itemId, meta);
  logEvent({ type: "study", module, itemId });
}

/** Record a review answer: reschedules the card and logs the event. */
export function reviewCard(module, itemId, grade, now = Date.now()) {
  const cards = getCards();
  const key = cardKey(module, itemId);
  const existing = cards[key] || ensureCard(module, itemId);
  const updated = schedule(existing, grade, now);
  cards[key] = updated;
  write(KEYS.cards, cards);
  logEvent({ type: "review", module, itemId, grade, correct: grade !== "again", t: now });
  return updated;
}

/** Cards due now, soonest-due first. */
export function getDueQueue(now = Date.now()) {
  return Object.values(getCards())
    .filter((c) => (c.dueDate ?? 0) <= now)
    .sort((a, b) => (a.dueDate ?? 0) - (b.dueDate ?? 0));
}

export function getDueCount(now = Date.now()) {
  return getDueQueue(now).length;
}

/* ------------------------------- events -------------------------------- */
export function logEvent(evt) {
  const events = read(KEYS.events, []);
  events.push({ t: Date.now(), ...evt });
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
  write(KEYS.events, events);
}

/** Log a whole quiz attempt (one event per question) and seed/refresh cards. */
export function logQuizAttempt(questions, wrongIds, resolveMeta) {
  const wrong = new Set(wrongIds);
  const now = Date.now();
  questions.forEach((q) => {
    const module = q.module || inferModule(q);
    const itemId = q.topicId || q.drugId || q.id;
    const correct = !wrong.has(q.id);
    logEvent({ type: "quiz", module, itemId, correct, t: now });
    if (itemId && module) {
      const meta = resolveMeta ? resolveMeta(module, itemId) : {};
      ensureCard(module, itemId, meta);
    }
  });
}

function inferModule(q) {
  const c = (q.category || "").toLowerCase();
  if (q.drugTitleEn || q.drugId) return "pharmacology";
  if (c.includes("بافت") || (q.id || "").startsWith("h-")) return "histology";
  if ((q.id || "").startsWith("pa-")) return "pathology";
  if ((q.id || "").startsWith("ph-")) return "pharmacology";
  return "pathology";
}

export function getEvents() {
  return read(KEYS.events, []);
}

/* ----------------------------- analytics ------------------------------- */
function dayStamp(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/** Consecutive-day streak ending today (or yesterday if nothing yet today). */
export function getStudyStreak(events = getEvents()) {
  if (events.length === 0) return 0;
  const days = new Set(events.map((e) => dayStamp(e.t)));
  let streak = 0;
  const cur = new Date();
  // allow the streak to still count if the student hasn't studied yet today
  if (!days.has(dayStamp(cur.getTime()))) cur.setDate(cur.getDate() - 1);
  for (;;) {
    if (days.has(dayStamp(cur.getTime()))) {
      streak += 1;
      cur.setDate(cur.getDate() - 1);
    } else break;
  }
  return streak;
}

export function getAccuracy(events = getEvents()) {
  const graded = events.filter((e) => typeof e.correct === "boolean");
  if (graded.length === 0) return null;
  const correct = graded.filter((e) => e.correct).length;
  return { correct, total: graded.length, pct: Math.round((correct / graded.length) * 100) };
}

/** Retention = recall accuracy on review (retrieval) events; falls back to quiz. */
export function getRetention(events = getEvents()) {
  const reviews = events.filter((e) => e.type === "review");
  const src = reviews.length >= 5 ? reviews : events.filter((e) => typeof e.correct === "boolean");
  if (src.length === 0) return null;
  const correct = src.filter((e) => e.correct).length;
  return Math.round((correct / src.length) * 100);
}

export function getMatureCount() {
  return Object.values(getCards()).filter((c) => (c.interval ?? 0) >= MATURE_DAYS).length;
}

/** Per-topic accuracy, split into weak / strong (min attempts to qualify). */
export function getTopicStats(events = getEvents(), minAttempts = 2) {
  const map = new Map();
  events
    .filter((e) => typeof e.correct === "boolean" && e.itemId)
    .forEach((e) => {
      const k = cardKey(e.module || "?", e.itemId);
      const s = map.get(k) || { module: e.module, itemId: e.itemId, correct: 0, total: 0 };
      s.total += 1;
      if (e.correct) s.correct += 1;
      map.set(k, s);
    });
  const rows = [...map.values()]
    .filter((s) => s.total >= minAttempts)
    .map((s) => ({ ...s, pct: Math.round((s.correct / s.total) * 100) }));
  const weak = rows.filter((r) => r.pct < 70).sort((a, b) => a.pct - b.pct);
  const strong = rows.filter((r) => r.pct >= 85).sort((a, b) => b.pct - a.pct);
  return { rows, weak, strong };
}

export function getDailyCounts(days = 7, events = getEvents()) {
  const out = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const stamp = dayStamp(d.getTime());
    out.push({ stamp, label: d.toLocaleDateString("fa-IR", { weekday: "short" }), count: 0 });
  }
  const idx = new Map(out.map((o) => [o.stamp, o]));
  events.forEach((e) => {
    const o = idx.get(dayStamp(e.t));
    if (o) o.count += 1;
  });
  return out;
}

/**
 * Estimated exam readiness (0–100): a transparent weighted blend of coverage,
 * accuracy, retention and review-queue health. Education signal only — not a
 * guarantee of any outcome.
 * @param {{coveragePct:number}} opts coverage computed by the caller from data
 */
export function getExamReadiness({ coveragePct = 0 } = {}) {
  const events = getEvents();
  const acc = getAccuracy(events);
  const ret = getRetention(events);
  const due = getDueCount();
  const cards = Object.values(getCards()).length;
  const accScore = acc ? acc.pct : 0;
  const retScore = ret ?? accScore;
  // review health: fewer overdue cards (relative to total) is better
  const reviewHealth = cards === 0 ? 0 : Math.round(100 * (1 - Math.min(1, due / cards)));
  const score =
    0.3 * coveragePct + 0.3 * accScore + 0.25 * retScore + 0.15 * reviewHealth;
  return {
    score: Math.round(clamp(score, 0, 100)),
    parts: { coveragePct: Math.round(coveragePct), accScore, retScore, reviewHealth },
  };
}

export function resetLearning() {
  localStorage.removeItem(KEYS.cards);
  localStorage.removeItem(KEYS.events);
}

export const LEARNING_KEYS = KEYS;

import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import ReviewPage from "../src/pages/Review/ReviewPage.jsx";
import ProgressPage from "../src/pages/Progress/ProgressPage.jsx";
import { buildImageIdentificationQuiz } from "../src/shared/lib/imageQuiz.js";
import { approvedPathologyQuizImages } from "../src/shared/lib/pathologyQuizImages.js";
import { resolveQuestionTopic, resolveReviewTopic, topicMeta } from "../src/shared/lib/topicResolver.js";
import { resetLearning, logQuizAttempt, ensureCard, getCards, getCard, getEvents, logEvent, LEARNING_KEYS } from "../src/shared/lib/learning.js";
import pathology from "../src/data/pathology.json";
import histologyQuestions from "../src/pages/Quiz/data/histologyQuestions.json";
import pharmacologyQuestions from "../src/pages/Quiz/data/pharmacologyQuestions.json";
import pathologyQuestions from "../src/pages/Quiz/data/pathologyQuestions.json";

window.IS_REACT_ACT_ENVIRONMENT = true;
const root = createRoot(document.getElementById("root"));
const check = (value, message) => { if (!value) throw Error(message); };
const questions = () => buildImageIdentificationQuiz(pathology.items, {
  count: 30, idPrefix: "p-img", questionText: "این یافته مربوط به کدام بیماری است؟", approvedImageUrls: approvedPathologyQuizImages,
});
const sourceTopic = q => pathology.items.find(item => item.image?.url === q.image_url);
const button = text => [...document.querySelectorAll("button")].find(b => b.textContent.trim() === text);
const click = b => { check(b && !b.disabled, "Missing usable control"); act(() => b.click()); };
function Location() { return <p data-testid="destination">{useLocation().pathname}</p>; }
function render(page = <ReviewPage />) {
  act(() => root.render(<MemoryRouter key={Math.random()} initialEntries={["/review"]}>
    <Routes><Route path="/review" element={page} /><Route path="/pathology/:id" element={<Location />} /><Route path="/subjects" element={<Location />} /></Routes>
  </MemoryRouter>));
}

window.runImageReviewTests = () => {
  try {
    resetLearning();
    const bank = questions(), original = JSON.stringify(bank);
    const first = sourceTopic(bank[0]);
    const existing = ensureCard("pathology", first.id, topicMeta("pathology", first.id));
    const saved = { ...existing, reps: 4, interval: 8, ease: 2.3, lapses: 2, dueDate: 123456 };
    localStorage.setItem(LEARNING_KEYS.cards, JSON.stringify({ [saved.key]: saved }));
    logQuizAttempt(bank, [bank[0].id, bank[1].id], topicMeta);
    check(Object.keys(getCards()).length === 30, "Image quizzes did not seed exactly the 30 real topics");
    check(JSON.stringify(getCard("pathology", first.id)) === JSON.stringify(saved), "Existing review schedule overwritten");
    bank.forEach(q => {
      const expected = sourceTopic(q), topic = resolveQuestionTopic(q);
      check(topic?.itemId === expected.id && topic.module === "pathology", "Image mapped to the wrong topic");
      const card = getCard("pathology", expected.id);
      check(card?.title_fa === expected.title_fa && card.title_en === expected.title_en, "Canonical bilingual title missing");
      check(!getCard("pathology", q.id), "Positional image ID was persisted as a topic");
    });
    check(getEvents().filter(e => e.correct === false).length === 2, "Quiz correctness logging changed");
    check(JSON.stringify(bank) === original, "Questions or answer keys mutated");
    // Same positional ID can refer to two different topics in independent attempts.
    const second = { ...bank[1], id: bank[0].id };
    logQuizAttempt([second], [], topicMeta);
    check(getEvents().at(-1).itemId === sourceTopic(second).id, "Resolver guessed from p-img sequence number");
    check(resolveReviewTopic({ module: "pathology", itemId: bank[0].id }) === null, "Unrecoverable legacy ID was guessed");
    check(resolveReviewTopic({ module: "pathology", itemId: bank[0].id, image_url: bank[0].image_url })?.itemId === first.id, "Recoverable saved image mapping lost");
    check(resolveQuestionTopic({ image_url: bank[0].image_url, image: bank[1].image }) === null, "Conflicting image evidence guessed a topic");
    check(resolveReviewTopic(null) === null && resolveQuestionTopic({ id: "obsolete" }) === null, "Unknown records are unsafe");
    for (const [module, items] of [["histology", histologyQuestions], ["pharmacology", pharmacologyQuestions], ["pathology", pathologyQuestions]]) {
      for (const q of items) {
        const topic = resolveQuestionTopic(q);
        check(topic?.module === module && topic.itemId === (q.topicId || q.drugId), "Existing text question mapping changed");
      }
    }

    resetLearning();
    const legacy = ensureCard("pathology", "p-img-1", { title_fa: "p-img-1" });
    const legacyBytes = JSON.stringify(legacy);
    ensureCard("pathology", first.id, topicMeta("pathology", first.id));
    render();
    check(document.querySelector('.review-page.academic-standard'), "Approved Review shell lost");
    check(!document.body.textContent.includes("p-img-1"), "Raw legacy ID exposed");
    check(document.querySelector('[role="status"]'), "Unknown review needs an accessible explanation");
    check(!button("نمایش پاسخ"), "Unknown record can be graded as a medical topic");
    click(button("مرور بعدی"));
    check(document.querySelector(".review-card__title").textContent === first.title_fa, "Skipping unknown card did not reach real topic");
    check(document.querySelector(".review-card__title-en").textContent === first.title_en, "English medical title lost");
    click(button("نمایش پاسخ"));
    click(button("باز کردن تاپیک کامل ↗"));
    check(document.querySelector('[data-testid="destination"]').textContent === `/pathology/${first.id}`, "Review topic navigation wrong");
    check(JSON.stringify(getCard("pathology", "p-img-1")) === legacyBytes, "Legacy saved card was deleted or changed");

    render(); click(button("مرور بعدی")); click(button("نمایش پاسخ")); click(button("خوب"));
    check(getCard("pathology", first.id).reps === 1, "Known topic review scheduling broken");
    check(getCard("pathology", "p-img-1").reps === 0, "Unknown card was falsely graded");
    check(document.body.textContent.includes("ناشناخته بدون تغییر حفظ"), "Completion falsely claims skipped legacy card was reviewed");

    // A saved record containing real source evidence is shown without migrating its key/schedule.
    resetLearning();
    const recoverable = { ...ensureCard("pathology", "p-img-7"), image_url: bank[0].image_url };
    localStorage.setItem(LEARNING_KEYS.cards, JSON.stringify({ [recoverable.key]: recoverable }));
    render();
    check(document.querySelector(".review-card__title").textContent === first.title_fa, "Stored image evidence not resolved");
    check(JSON.stringify(getCard("pathology", "p-img-7")) === JSON.stringify(recoverable), "Reading migrated saved record unexpectedly");

    resetLearning();
    ensureCard("obsolete-module", "obsolete-id", { title_fa: "obsolete-id" });
    render();
    check(!document.body.textContent.includes("obsolete-id") && !document.body.textContent.includes("obsolete-module"), "Unknown module/ID leaked");
    click(button("رفتن به درس‌ها"));
    check(document.querySelector('[data-testid="destination"]').textContent === "/subjects", "Unknown record return navigation broken");
    logEvent({ type: "quiz", module: "pathology", itemId: "p-img-1", correct: false });
    logEvent({ type: "quiz", module: "pathology", itemId: "p-img-1", correct: false });
    render(<ProgressPage />);
    check(!document.body.textContent.includes("p-img-1"), "Progress exposed unresolved Review identifier");
    return "PASS: 30 canonical image topics, 383 text mappings, immutable questions, saved schedules, unknown/recoverable legacy records, Review navigation/grading and no raw IDs";
  } finally { act(() => root.unmount()); }
};

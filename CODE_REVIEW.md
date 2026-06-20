# MedScope AI — Strict Code Review

Verification performed: fresh `npm install`, `npm run build`, `npm run dev`,
plus route smoke-tests (including deep links and invalid IDs) and direct
tracing of data flow through localStorage and the histology/pharmacology/quiz
JSON files.

---

## 1. Critical Bugs

### C1 — Favorites is unreachable by any real user
`FavoriteButton.jsx` exists and works in isolation, but it is imported
**nowhere** (`grep -rn "FavoriteButton" src/` → only its own file). Neither
`HistologyDetail.jsx` / `HistologyList.jsx` nor `DrugDetail.jsx` /
`DrugList.jsx` reference favoriting at all. `/favorites` will always show the
empty state — the module is fully built but has no entry point. One of the
six declared MVP modules cannot actually be used end-to-end.

### C2 — "Reset Progress" in Settings has no visible effect (and progress never moves anyway)
`src/pages/Home/hooks/useProgress.js`:
```js
const [done, setDone] = useState(() => {
  const store = readProgressStore();
  return store[moduleKey] ?? initial;     // line 19
});
useEffect(() => {
  const store = readProgressStore();
  store[moduleKey] = done;
  writeProgressStore(store);              // lines 22–26: re-seeds on every mount
}, [moduleKey, done]);
```
`Home.jsx` calls this with hardcoded `initial=8` (histology) and `initial=12`
(pharmacology). Sequence: Settings clears `medscope_progress` → user goes to
`/` → Home mounts → `store[moduleKey] ?? initial` finds nothing → falls back
to 8/12 → the effect **immediately writes 8/12 back to localStorage**. The
reset "succeeds" but the bars show the same numbers before and after.
Separately, `markDone` is never called anywhere in the codebase, so the
progress bars are permanently fixed at 8/20 and 12/50 regardless of any
actual studying — the whole progress feature is decorative.

---

## 2. Medium Issues

### M1 — Hardcoded totals can silently drift from real content
`HISTOLOGY_TOTAL = 20` in `Home.jsx` vs. `histology.json` having only **8**
items — the module card subtitle says "۲۰ موضوع" while the atlas has 8.
`PHARMACOLOGY_TOTAL = 50` happens to match `pharmacology.json`'s 50 drugs
today, but it's still a literal constant, not
`pharmacologyData.drugs.length` — it will go stale the moment content
changes.

### M2 — Quiz questions are a disconnected data source from the canonical content
- `histology.json` embeds a `quiz_questions` field per item (8 items, all
  populated) — confirmed via grep this is **never read by any component**
  (`HistologyDetail.jsx` explicitly skips it). Dead data in the canonical file.
- Quiz's own `histologyQuestions.json` / `pharmacologyQuestions.json` use
  `topicId` values that partially don't exist in the real data:
  `stratified-squamous-keratinized` and `transitional-epithelium` aren't in
  `histology.json`'s 8 items; 4 of 5 pharmacology `topicId`s
  (`ace-inhibitors`, `beta-blockers-contraindication`,
  `warfarin-interactions`, `beta-lactam-allergy`) aren't drug IDs in
  `pharmacology.json` (only `metformin` matches). Not a runtime bug —
  `topicId` is decorative only, never used for lookups — but a real
  content-consistency gap.

### M3 — Accessibility regressions/gaps
- The canonical `BottomNav` lost the `aria-label="پیمایش اصلی"` that the
  deleted duplicate had — `<nav>` is now unlabeled.
- `ConfirmModal` (Settings) has no `role="dialog"`, `aria-modal`, focus trap,
  or Escape-to-close.
- `AnswerOption` (Quiz) communicates correct/wrong **only via CSS color
  classes** — no text or `aria-live` equivalent for screen readers.

### M4 — Disclaimer only on `DrugDetail`, not `DrugList`
`MEDICAL_SAFETY_RULES.md` says "pharmacology pages" (plural). Defensible
since the list page shows no clinical claims, but worth an explicit decision
rather than an accident.

### M5 — `npm audit`: 2 vulnerabilities (1 moderate, 1 high)
Both in the `vite`/`esbuild` dev-tooling chain (dev-server-only exposure, not
a production risk). Fix requires `npm audit fix --force`, which bumps Vite
to v6 — a breaking change, not applied.

### M6 — Home's search input is non-functional
Typing does nothing (no search route/filter exists). Pre-existing,
intentional per the original module's own comment, but it looks broken
since it's styled identically to the working search bars in
Histology/Pharmacology.

---

## 3. Minor Cleanup

- **Duplicate shared components, by necessity, not oversight:** `SearchBar`
  / `CategoryFilter` / `EmptyState` exist separately in Histology and
  Pharmacology (incompatible prop shapes); `Card` / `Button` / `PageHeader`
  exist separately in the canonical kit, Settings, and Pharmacology
  (different visual specs). All scoped/renamed to avoid CSS collisions,
  verified via automated selector scan (zero duplicate class or `:root`
  variable definitions remain). Still, by a literal reading of "duplicate
  shared components," there are three card implementations and two
  search-bar implementations in this app.
- `Home.jsx` redundantly sets `dir="rtl" lang="fa"` on its own wrapper div —
  `index.html` already sets both globally. Harmless, just dead weight.
- `FavoriteButton.jsx` is 100% dead code (zero imports) — should either get
  wired in or be clearly marked as intentionally unintegrated.

---

## 4. Exact Files That Need Changes

| Issue | File(s) |
|---|---|
| C1 | `src/pages/Histology/HistologyDetail.jsx`, `HistologyList.jsx`, `src/pages/Pharmacology/DrugDetail.jsx`, `DrugList.jsx` |
| C2 | `src/pages/Home/hooks/useProgress.js`, `src/pages/Home/Home.jsx` |
| M1 | `src/pages/Home/Home.jsx` |
| M2 | `src/data/histology.json` (remove dead field, or wire it up), `src/pages/Quiz/data/*.json` |
| M3 | `src/shared/components/BottomNav.jsx`, `src/pages/Settings/components/ConfirmModal.jsx`, `src/pages/Quiz/components/AnswerOption.jsx` / `.css` |
| M4 | `src/pages/Pharmacology/DrugList.jsx` |

---

## 5. Recommended Fixes

- **C2 (safe, in-scope):** change `useProgress`'s effect to only write when
  `done` actually changes after mount (e.g. skip the write on initial mount,
  or only call `writeProgressStore` from `markDone`, never from the
  read-sync effect). Fixes the bug without touching any other module.
- **C1, M2, M4:** require editing Histology/Pharmacology source files
  (wiring `FavoriteButton`, reconciling quiz `topicId`s, adding a list-page
  disclaimer). Not applied — these go beyond "merge, don't rebuild" without
  explicit sign-off.
- **M1:** replace `HISTOLOGY_TOTAL` / `PHARMACOLOGY_TOTAL` literals with
  `histologyData.items.length` / `pharmacologyData.drugs.length`, or
  explicitly comment that they're a planned-curriculum target.
- **M3:** one-line additions (`aria-label`, `role="dialog"`, a short
  "(پاسخ صحیح)" / "(پاسخ شما)" text label) — no visual redesign needed.
- **M5:** leave as-is for MVP; re-evaluate when ready to move off Vite 5.

---

## 6. GitHub/Replit Readiness

**Yes, with disclosed caveats.** It installs, builds, and runs cleanly;
every route — including deep links and invalid IDs — resolves without
crashing. Safe to commit and demo. But anyone testing it thoroughly will
immediately notice Favorites doesn't work and that "Reset Progress" doesn't
visibly do anything — both should be called out in the repo's
README/known-issues section before sharing, so they read as known scope
gaps rather than surprises.

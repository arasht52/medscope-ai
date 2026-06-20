# MedScope AI — Unified App: Merge Notes

This merges six independently-built deliverables (Home, Histology, Pharmacology,
Quiz, Favorites, Settings) into one runnable app. **The build was actually run**
(`npm install && npm run build`) and **all routes were smoke-tested** via the
preview server — this is not a paper merge.

## What was NOT changed
No module's actual feature logic, markup, or visual styling was rewritten.
Every edit below is one of exactly three kinds:
1. **Moving a file** to its new location in the unified tree.
2. **Fixing an import path** that broke because of the move.
3. **Renaming a CSS class/variable token** that collided with another
   module's *same-named but differently-styled* class — renamed only the
   token, never the values, so nothing looks different.

## Key integration decisions

### 1. Routing — one router, real URLs for Histology
- Pharmacology and Quiz already shipped router-ready (`/pharmacology/:id`,
  `quizRoutes` array designed to be spread into an existing `<Routes>`).
- **Histology shipped as a self-contained component** using
  `onSelectItem`/`onBack` callbacks instead of routes (its own code comments
  said the real app should wire it "via whatever router the app shell
  uses"). Added two thin wrapper pages — `HistologyListPage.jsx` and
  `HistologyDetailPage.jsx` — that translate `useNavigate`/`useParams` into
  those callbacks. `HistologyList.jsx`/`HistologyDetail.jsx` themselves are
  untouched.
- Added a catch-all `<Route path="*" element={<Navigate to="/" replace />} />`
  so unknown URLs don't blank-screen.

### 2. BottomNav — one nav, not two
Two BottomNav components existed: a Tailwind/lucide-icon version (from the
Home refactor) and a plain-CSS/emoji version (from Pharmacology, rendered at
the app-shell level). Kept the Tailwind/lucide one as canonical (more
polished, icon-based) and deleted the other. Two small, necessary fixes:
- **"More" now points to `/settings`** instead of the old `/more` stub,
  since Settings is now built.
- **Active-tab detection now matches nested routes** (`pathname.startsWith(to)`
  instead of an exact match), so e.g. `/pharmacology/123` still highlights
  the Pharmacology tab.
- Moved its rendering out of `Home.jsx` (where it was previously hardcoded
  inline) and up to the shared `App.jsx` shell, so it appears once, on every
  page, instead of being duplicated per-page.
- **Hidden specifically on `/quiz/histology` and `/quiz/pharmacology`** —
  the Quiz module's gameplay screens ship their own fixed action footer that
  already reserves that exact screen region (its CSS comment literally says
  "leave room for footer + bottom nav"); showing both at once means the
  footer's background visually covers the nav. Every other route, including
  the Quiz home/result pages, keeps it.

### 3. Shared component kit — picked one, scoped the other two
Settings, Quiz, and Favorites had each *independently* built their own
`Card`/`Button`/`PageHeader` using the same `ms-` class-name convention but
with **different visual specs** (e.g. Settings' buttons are full-width with
10px corners; Quiz's are pill-shaped, auto-width). Merging them into one
shared file would have silently changed how one of them looks — exactly
what "do not redesign" rules out.

- **Quiz's kit was promoted to `src/shared/components/`** as the one true
  canonical version (its own README explicitly says other modules should
  reuse it, and it's the most complete: token-driven CSS, supports `as` for
  polymorphic rendering).
- **Favorites' `Card` usage was pointed at the canonical one** — its API
  (`children`, `onClick`, `className`) is a strict subset of Quiz's, so this
  is a safe, behavior-identical swap. Its own duplicate `.ms-card` CSS block
  was removed (it would otherwise have redefined the same global class a
  second time with slightly different values).
- **Settings' own kit was kept, but renamed** (`ms-` → `set-` for both
  classnames and CSS variables) so it no longer collides with the canonical
  `ms-` kit while remaining pixel-identical to how it shipped.

### 4. Histology vs. Pharmacology's duplicate components
Both modules separately built their own `SearchBar`, `CategoryFilter`, and
`EmptyState` — same names, **incompatible props** (e.g. Histology's
`CategoryFilter` expects `{id, label_fa}` objects and an `activeId` prop;
Pharmacology's expects plain strings and an `active` prop). These could not
be merged into one component without changing one module's call sites, so
both were kept, fully scoped to their own page folder. To stop their
identically-named CSS classes from clobbering each other globally,
**Histology's three copies were renamed with an `h-` prefix**
(`h-search-bar`, `h-category-filter`, `h-empty-state`) in both the `.jsx`
and `.css` — Pharmacology's keep their original names, unchanged.

### 5. Data — one `histology.json`, one `pharmacology.json`
The Home module's own stub JSON files (flat arrays, placeholder shape) were
**replaced by the real, content-rich JSON** from the Histology/Pharmacology
modules (`{ categories, items }` / `{ categories, drugs }`). `Home.jsx`'s
"recent items" section was updated (data-mapping only, not a redesign) to
read the real shape:
- Histology category ids are now resolved to their Persian label via the
  Histology module's own `categories` list, so the recent-item chips show
  "بافت همبند" instead of the raw id `connective`.
- Pharmacology drugs have no Persian display name in the real schema (by
  design, per `DATA_SCHEMA.md` — only `generic_name`), so recent pharmacology
  items show the generic name in both name slots instead of a fabricated
  Persian translation.

### 6. Storage — one `storage.js`
Three separate localStorage utilities existed (`useProgress`'s private
read/write, `favoritesStorage.js`, Settings' own `storage.js`). Merged into
`src/shared/lib/storage.js`, **keeping every original key name** so no
existing user data is orphaned:
- `medscope_progress` (Home's study-progress bars)
- `medscope:favorites` (Favorites)
- `medscope:settings:theme` (Settings' theme placeholder)
- Settings' "Reset progress" / "Reset favorites" buttons now call the same
  functions Home/Favorites actually read from, so they genuinely work
  end-to-end (previously they only cleared keys that nothing else used yet).

### 7. CSS tokens — one set of variables, additive only
Histology, Pharmacology, and Quiz each shipped their own `:root` token file
with the same variable names (`--color-primary`, `--color-bg`, etc.) but
slightly different hex values — three near-identical shades of "medical
blue" instead of one. Consolidated into one `src/index.css`:
- Shared names (`--color-primary`, `--color-bg`, `--color-text`, …) now
  resolve to **one** value (Pharmacology's, since its token set was the most
  complete) instead of whichever file happened to load last.
- Every module-specific alias any component actually references was kept
  (`--color-primary-soft` *and* `--color-primary-tint` both exist and point
  to the same color; same for `-secondary-*`, plus Quiz's
  `--color-correct`/`--color-wrong`/`--radius-card`/`--radius-pill`), so no
  component's CSS had to change.
- Three different class names that all meant "keep this English term LTR
  inside RTL text" (`.term-en`, `.en`/`.latin`, `.ltr-term`) are now aliased
  together in one rule instead of being defined three times.
- Tailwind was added (only Home uses it) via `@tailwind` directives in the
  same consolidated file, plus `tailwind.config.js`/`postcss.config.js`.

## Known follow-up (intentionally not done here)
**`FavoriteButton` is not wired into the Histology/Pharmacology detail
pages.** The Favorites module shipped this component with a comment saying
it's "ready to import" but deliberately not wired in, to avoid touching
those modules' files. Wiring it in is one import + one line per detail
page, but doing it now would mean editing Histology/Pharmacology source
files beyond what "merge, don't rebuild" covers — flagging it instead so
it can be a deliberate next step.

## Verified
```
npm install
npm run build     # ✓ succeeds — 1670 modules transformed, no errors
npm run preview   # ✓ all routes return 200, incl. deep links like
                   #   /pharmacology, /settings, /quiz/histology
```

## Final file tree
```
medscope-app/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx                       (NEW — single router + shell)
    ├── main.jsx
    ├── index.css                     (consolidated tokens + Tailwind)
    ├── data/
    │   ├── histology.json            (canonical, from Histology module)
    │   └── pharmacology.json         (canonical, from Pharmacology module)
    ├── shared/
    │   ├── components/
    │   │   ├── BottomNav.jsx         (canonical — from Home refactor)
    │   │   ├── Card.jsx / .css       (canonical "ms-" kit — from Quiz)
    │   │   ├── Button.jsx / .css
    │   │   ├── PageHeader.jsx / .css
    │   │   └── ProgressBar.jsx / .css
    │   └── lib/
    │       └── storage.js            (consolidated: progress + favorites + settings)
    └── pages/
        ├── Home/
        │   ├── Home.jsx
        │   ├── components/ (ModuleCard, RecentItemCard, CardNotch, ProgressBar)
        │   ├── hooks/useProgress.js
        │   └── utils/toFaDigits.js
        ├── Histology/
        │   ├── HistologyListPage.jsx     (NEW — route wrapper)
        │   ├── HistologyDetailPage.jsx   (NEW — route wrapper)
        │   ├── HistologyList.jsx / .css
        │   ├── HistologyDetail.jsx / .css
        │   ├── useHistologyData.js
        │   └── components/ (Header, Section, ImageWithFallback, ListItemCard,
        │       HistologySearchBar, HistologyCategoryFilter, HistologyEmptyState — h- scoped)
        ├── Pharmacology/
        │   ├── DrugList.jsx
        │   ├── DrugDetail.jsx
        │   ├── Pharmacology.css
        │   └── components/ (Card, Disclaimer, SearchBar, CategoryFilter, EmptyState)
        ├── Quiz/
        │   ├── quiz.routes.jsx, index.js
        │   ├── components/ (AnswerOption, QuestionCard, ScoreSummary, WrongAnswerList)
        │   ├── data/ (histologyQuestions.json, pharmacologyQuestions.json)
        │   ├── hooks/useQuiz.js
        │   └── pages/ (QuizHome, HistologyQuiz, PharmacologyQuiz, QuizPlay, QuizResult)
        ├── Favorites/
        │   ├── FavoritesPage.jsx / .css
        │   ├── FavoritesRoute.jsx        (NEW — route wrapper, wires onOpenItem)
        │   ├── useFavorites.js
        │   └── components/ (EmptyState, FavoriteButton)
        └── Settings/
            ├── Settings.jsx / .css
            └── components/ (Button, Card, PageHeader, ConfirmModal — set- scoped)
```

## Test instructions

```bash
npm install
npm run dev
```

1. **Home (`/`)** — module grid, progress bars, and recent items render;
   tapping a module card navigates correctly; bottom nav visible.
2. **Histology (`/histology`)** — list loads with search + category filter;
   tapping an item navigates to `/histology/:id` and shows full detail;
   back button returns to the list; URL is shareable/refreshable.
3. **Pharmacology (`/pharmacology`)** — 50 drugs listed; search and category
   filter work together; tapping a drug opens `/pharmacology/:id` with the
   safety disclaimer visible at the top.
4. **Quiz (`/quiz`)** — choose Histology or Pharmacology quiz; answer
   questions (locks in, shows correct/wrong); on the last question, lands
   on the result page with score + wrong-answer review.
   - **Confirm the bottom nav is hidden during gameplay** (`/quiz/histology`,
     `/quiz/pharmacology`) but visible again on `/quiz` and the result page.
5. **Favorites (`/favorites`)** — tab filters (همه / هیستولوژی / داروشناسی)
   work; empty state shows when nothing's been favorited yet (no
   FavoriteButton is wired into detail pages yet — see "Known follow-up").
6. **Settings (`/settings`)** — About text, version, disabled theme toggle,
   and the two reset buttons all render with their own visual style intact
   (not affected by the canonical Card/Button used elsewhere).
   - In devtools: `localStorage.setItem('medscope_progress', '{"histology":5}')`,
     tap "بازنشانی پیشرفت کوئیز", confirm the key clears and Home's progress
     bar resets on next visit.
7. **Bottom nav, every page** — confirm exactly one nav bar renders (no
   duplicates), the active tab highlights correctly including on detail
   routes (`/pharmacology/123`, `/histology/abc`), and "بیشتر" opens
   Settings.
8. **RTL** — confirm Persian text flows right-to-left and English medical
   terms (drug names, tissue names) stay left-to-right inline, across all
   six modules.
9. **Build check**:
   ```bash
   npm run build && npm run preview
   ```
   Confirm it builds with zero errors and all routes load when visited
   directly (deep link, not just client-side navigation).

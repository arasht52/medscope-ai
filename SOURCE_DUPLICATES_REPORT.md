# Source Duplicates Report

Companion to [SOURCE_LIBRARY_INDEX.md](SOURCE_LIBRARY_INDEX.md). Covers everything found under `source-notes/` that is redundant, corrupted-looking, or otherwise not a clean unique lecture PDF.

## 1. macOS resource-fork junk (`__MACOSX/`) — 87 files, not real PDFs

`source-notes/__MACOSX/` contains 87 files named `._<original filename>.pdf`. These are **AppleDouble resource-fork metadata files**, an artifact of extracting a ZIP archive on macOS (Finder writes a hidden `._*` shadow file alongside every real file to preserve Mac-specific metadata). They:

- Are typically a few KB and contain no usable PDF content (they are not valid, renderable PDFs).
- Exactly mirror the filename of a real PDF sitting at `source-notes/` root.
- Should **not** be counted as part of the library and were excluded from the 87-file index.

**Recommendation:** delete the entire `source-notes/__MACOSX/` folder. It carries no content value and only adds confusion (174 "PDF" hits on a naive recursive scan vs. the real count of 87). Not deleted in this pass, since the task was index-only — flagging for a future cleanup task.

## 2. Empty subfolders

`source-notes/histology/`, `source-notes/pathology/`, and `source-notes/pharmacology/` all exist but are **completely empty** (0 files). All 87 real PDFs sit flat at the `source-notes/` root instead of being sorted into these folders. This looks like scaffolding that was created but never used for the actual file drop.

**Recommendation:** either move the 87 PDFs into `pathology/`/`pharmacology/` per the index in this report (histology/ would stay empty — no histology-relevant PDFs were found in this library), or delete the three empty folders if a flat layout is preferred. No files were moved in this pass.

## 3. Exact duplicate files (MD5-verified) — 4 groups, 8 redundant copies

Four pharmacology lecture topics each exist as **three byte-identical copies** in the library (verified by MD5 checksum, not just matching file size):

| Topic | Files (all MD5-identical within group) | Size | MD5 |
|---|---|---|---|
| Antiamoebic drugs | `Anti amoebiasis.pdf`, `Anti amoebiasis 2.pdf`, `Anti amoebiasis 3.pdf` | 255,365 bytes | `1d53febf09161c467278c7876df77e09` |
| Anthelmintic drugs | `Antihelminthic drugs.pdf`, `Antihelminthic drugs 2.pdf`, `Antihelminthic drugs 3.pdf` | 411,302 bytes | `5bad8d93f7e96754dea0b75ad14fa231` |
| Antidiarrheal agents & laxatives | `3.Antidiarrheal Agents and Laxatives.pdf`, `3.Antidiarrheal Agents and Laxatives 2.pdf`, `3.Antidiarrheal Agents and Laxatives 3.pdf` | 488,422 bytes | `eae1fa83c3ecaead7287c5c6baac3042` |
| Acid-peptic disease | `acid-peptic disease.pdf`, `acid-peptic disease 2.pdf`, `acid-peptic disease 3.pdf` | 489,229 bytes | `f8a59a864911cad0e3343a25fd46a6b5` |

All 12 files are pixel-for-pixel the same PDF saved/uploaded three times under slightly different names. **8 of the 12 files are pure redundancy** — one copy of each topic is sufficient.

**Recommendation:** keep the un-suffixed filename in each group (`Anti amoebiasis.pdf`, `Antihelminthic drugs.pdf`, `3.Antidiarrheal Agents and Laxatives.pdf`, `acid-peptic disease.pdf`) and delete the six `" 2"`/`" 3"`-suffixed copies. Not deleted in this pass.

## 4. Filename-suffix artifacts that are *not* duplicates (no matching counterpart exists)

Several files carry a `(1)`, `(2)`, or `" - Copy"` suffix that *looks* like duplicate-naming, but no matching base file or earlier-numbered copy exists anywhere in the library — these suffixes are leftover download/save artifacts (e.g. from a browser auto-renaming a second download, or a user re-saving a file) with no actual duplicate content to reconcile:

- `Drugs Used in Fluid and Electrolyte Disorders (1).pdf`
- `General Anesthetics - Copy (1).pdf`
- `Local Anesthetics - Copy (1).pdf`
- `neoplastic disease of GI tract(1).pdf`
- `vasculitidis ,vascular tumors (1).pdf`
- `dugs related to ADH,PRL,GH (2).pdf`
- `Anti-inflammatory - Copy.pdf`
- `Antiseizure Drugs - Copy.pdf`
- `Parkinsonism - Copy.pdf`
- `The Gonadal Hormones - Copy.pdf`

**Recommendation:** no action needed — these are unique files. The naming is just cosmetic noise; no content is lost by treating them as normal singletons.

## 5. Likely continuation gaps (numbered "part N" with missing earlier/later parts)

Unlike the exact duplicates in §3, these are lectures that are explicitly numbered as part of a multi-part series, where **only one part physically exists in the library** — meaning the topic may be only partially covered by what's here:

| File | Series | What's present | What's missing |
|---|---|---|---|
| `Endocrine System- Pituitary.pdf` | "The Endocrine System" (Dr. Ahmet Özyiğit) | Part 1 | — |
| `Endocrine System- Metabolic Syndrome and Diabetes 2.pdf` | Same series | Part 2 | — |
| `Lecture 3- PTH and Calcium.pdf` | Same series (filename says "Lecture 3" but slide content says "Part 4") | Part 4 | **Part 3 is missing** |
| `HODGKIN LYMPHOMA PATHOLOGY 2.pdf` | Hodgkin lymphoma (Dr. Irandoust) | Labeled "2" | **Part 1 is missing** — app coverage exists but its original source lecture part isn't in this library |
| `pathology of reticuluendothelial system.spleen,thymus 3.pdf` | Reticuloendothelial system/spleen/thymus (Dr. Irandoust) | Labeled "3" | **Parts 1–2 are missing** |
| `Pituitary gland pathology1.pdf` | Pituitary gland pathology (Dr. Irandoust) | Labeled "1" | Possible "part 2" not present (unconfirmed — may simply be a one-part lecture) |
| `10.lung tumor3.pdf` | Lung tumors (Dr. Irandoust) | Labeled "3" in filename, but title page just says "Lung Tumors" with no part number visible | Ambiguous — could be course lecture #10 rather than "part 3"; treat the "3" as unverified |

**Recommendation:** if the source institution/course can be asked for the missing parts (Endocrine System Part 3, Hodgkin Lymphoma Part 1, Reticuloendothelial System Parts 1–2), request them before treating those topics as "fully sourced." Not a blocker for current content since the app's existing coverage was evidently built from other sources already.

## 6. Same-topic, different-course overlaps (not duplicates — different authors/angles)

Four pairs of files cover overlapping subject matter but come from **different lecturers/courses** (one physiology-flavored overview, one diagnostic-pathology-focused), confirmed by reading the author line on page 1 of each:

| Pathology file (Dr. Irandoust) | Physiology/other file | Why they're not duplicates |
|---|---|---|
| `Pituitary gland pathology1.pdf` | `Endocrine System- Pituitary.pdf` (Dr. Özyiğit) | One is disease pathology, the other is a general physiology/endocrinology overview |
| `Endocrine pancreas and DM.pdf` | `Endocrine System- Metabolic Syndrome and Diabetes 2.pdf` (Dr. Özyiğit) | Same — pathology vs. physiology overview |
| `Pathology of Parathyroid Glands.pdf` | `Lecture 3- PTH and Calcium.pdf` (Dr. Özyiğit, actually "Part 4") | Same — pathology vs. physiology overview |
| `The Gonadal Hormones - Copy.pdf` (Dr. Abdi, pharmacology) | `gonades.pdf` (unattributed, physiology) | One is drug pharmacology, the other is neurohormonal physiology |

**Recommendation:** treat these as complementary, not redundant — no action needed. Flagged only so future content work doesn't mistakenly merge or drop one thinking it's a copy of the other.

## 7. Probable duplicate-topic pharmacology files (different file sizes — content not verified identical)

| File | Size | Author | Note |
|---|---|---|---|
| `Principles_of_Endocrine_Pharmacology_and_Mechanisms_of_Hormone_Action.pdf` | 238,053 bytes | Dr. Azadeh Abdi | Opens directly into anterior pituitary hormone content |
| `principles of endocrine pharmacology.pdf` | 311,800 bytes | Dr. Azadeh Abdi | Opens with "Introduction to Endocrine Pharmacology and Mechanism of Hormone Action" |

Same author, near-identical titles, but **different file sizes** — these are not byte-identical duplicates (unlike §3), so they may be two different versions/revisions of the same intro deck, or an intro lecture plus its direct continuation. Recommend a manual side-by-side comparison before generating any content from this topic, to avoid drawing from a stale or superseded version.

## 8. Filename corruption (control characters)

Three filenames contain a literal `^J` sequence (a Ctrl-J / line-feed character embedded directly in the filename, likely from a corrupted paste or export where a line break survived into a filename field) where a `/` or `,` was probably intended:

- `Atherosclerosis ^JIschemic Heart Disease.pdf` → likely meant "Atherosclerosis / Ischemic Heart Disease"
- `RHD and Valve dis^.pdf` → likely truncated/corrupted, probably "RHD and Valve disease"
- `Urethra^Jbladder^Jureter pathology.pdf` → likely meant "Urethra, bladder, ureter pathology"

**Recommendation:** rename these three files to remove the stray control characters once the library is being cleaned up. Not renamed in this pass since it touches `source-notes/` content, which is out of scope for an index-only task — flagged for the user to decide.

---

## Net effect

Of the 87 real PDFs indexed, **8 are pure redundant copies** (§3) that can be deleted outright with zero content loss, **10 have cosmetic-only suffixes** (§4) needing no action, **7 are part of series with missing companion parts** (§5) worth chasing down from the source, **4 pairs are same-topic-different-course** (§6, keep both), **2 files need manual comparison** before use (§7), and **3 have corrupted filenames** (§8) worth a rename. No content was altered, generated, or copied into the app in producing this report.

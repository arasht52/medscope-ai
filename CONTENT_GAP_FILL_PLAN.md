# Content Gap-Fill Plan

Builds directly on [CONTENT_IMPORT_AUDIT.md](CONTENT_IMPORT_AUDIT.md). Groups every identified gap by module → body system → priority, then commits to a concrete implementation order. **This sprint implements Pathology items 1–6 only** (below). Pharmacology and Histology are catalogued here for future sprints but are not touched.

Priority definitions (same as the source-library index):
- **High** — topic is absent or barely represented; also clinically/exam high-yield.
- **Medium** — topic exists but is missing meaningful subtypes/depth.
- **Low** — minor gap, low exam yield, or good existing partial coverage.

---

## Pathology

### General Pathology
*(no gaps identified — all General Pathology source PDFs are fully represented)*

### Cardiovascular
| Gap | Priority | Source | Sprint |
|---|---|---|---|
| Calcific aortic stenosis + Mitral valve prolapse (myxomatous degeneration) | **High** | `RHD and Valve dis^.pdf` | ✅ This sprint (#6) |
| Infective endocarditis | Medium | Not in this PDF library — would need a supplemental reference | Future |

### Respiratory
| Gap | Priority | Source | Sprint |
|---|---|---|---|
| Lung abscess | Medium | `11.Non-Specific lung infections.pdf` | Future |
| Sarcoidosis / hypersensitivity pneumonitis | Medium | `12.CHRONIC DIFFUSE INTERSTITIAL...pdf` | Future |
| Sinusitis, nasal polyps, nasopharyngeal carcinoma | Medium | `Pathology of upper respiratory tract and larynx disease.pdf` | Future |
| Benign lung tumors (hamartoma) | Low | `10.lung tumor3.pdf` | Future |

### GI
| Gap | Priority | Source | Sprint |
|---|---|---|---|
| Appendicitis, diverticulitis, ischemic colitis | Medium | `Non-neoplastic disease of gastrointestinal tract.pdf` | Future |

### Hepatobiliary
*(no gaps identified — fully represented)*

### Renal
| Gap | Priority | Source | Sprint |
|---|---|---|---|
| Renal agenesis, dysplasia, horseshoe kidney | Medium | `Congenital and Developmental Anomalies...Kidney.pdf` | Future |
| Urethral stricture/carcinoma, ureteral-specific pathology | Medium | `Urethra^Jbladder^Jureter pathology.pdf` | Future |

### Endocrine
| Gap | Priority | Source | Sprint |
|---|---|---|---|
| Primary/secondary hyperparathyroidism (+ hypoparathyroidism) | **High** | `Pathology of Parathyroid Glands.pdf` | ✅ This sprint (#2) |

### Hematologic & Lymphoid
| Gap | Priority | Source | Sprint |
|---|---|---|---|
| Non-Hodgkin lymphoma subtypes (DLBCL, follicular, Burkitt, mantle cell) | Medium | `Non-hodgkin lymphoma.pdf` | Future |
| Vascular tumors (hemangioma, angiosarcoma, Kaposi sarcoma) | Medium | `vasculitidis ,vascular tumors (1).pdf` | Future |

### Musculoskeletal
| Gap | Priority | Source | Sprint |
|---|---|---|---|
| Other myopathies (metabolic/congenital) | Low | `PATHOLOGY OF MUSCLE DISEASE.pdf` | Future |

### Nervous System
| Gap | Priority | Source | Sprint |
|---|---|---|---|
| Oligodendroglioma, primary CNS lymphoma, brain metastases | Medium | `CNS tumors.pdf` | Future |
| Brain abscess, prion disease, neurosyphilis | Medium | `PATHOLOGY OF CENTRAL NERVOUS SYSTEM INFECTIONS.pdf` | Future |

### Male Reproductive System
| Gap | Priority | Source | Sprint |
|---|---|---|---|
| Prostatic adenocarcinoma (+ prostatitis) | **High** | `Pathology of Prostate.pdf` | ✅ This sprint (#3) |

### Female Reproductive System
| Gap | Priority | Source | Sprint |
|---|---|---|---|
| Gestational trophoblastic disease (hydatidiform mole, choriocarcinoma) | **High** | `GESTATIONAL TROPHOBLASTIC DISEASE.pdf` | ✅ This sprint (#1) |
| Endometrial hyperplasia & carcinoma | **High** | `pathology of endometrium and myometrium.pdf` | ✅ This sprint (#4) |
| Invasive/in-situ breast carcinoma (+ fibrocystic change, Paget disease) | **High** | `Breast dis.pathology.pdf` | ✅ This sprint (#5) |
| Uterine leiomyoma/leiomyosarcoma, adenomyosis, endometriosis | Medium | `pathology of endometrium and myometrium.pdf` (same lecture, different entities) | Future |

---

## Pharmacology (catalogued, not implemented this sprint)

| Gap | Priority | Source |
|---|---|---|
| Antiamoebic-specific agent (beyond metronidazole) | Medium | `Anti amoebiasis.pdf` |
| Broader fluid/electrolyte replacement drugs | Medium | `Drugs Used in Fluid and Electrolyte Disorders (1).pdf` |
| Inhalational general anesthetics | Medium | `General Anesthetics - Copy (1).pdf` |
| Local anesthetic class detail beyond lidocaine | Medium | `Local Anesthetics - Copy (1).pdf` |
| Prolactin/GH-specific agents (bromocriptine, cabergoline) | Medium | `dugs related to ADH,PRL,GH (2).pdf` |
| Obesity-specific pharmacotherapy framing | Medium | `obesity.pdf` |
| Endocrine pharmacology principles as a standalone foundational entry | Medium | `Principles_of_Endocrine_Pharmacology...pdf` / `principles of endocrine pharmacology.pdf` |
| Quiz bank expansion from `Pharma 6 .pdf` (MCQ source, not a monograph) | Medium | `Pharma 6 .pdf` |

## Histology (catalogued, not implemented this sprint)

No source-notes PDFs are histology-relevant (see audit Part C). Any histology gap-fill needs a different source library — nothing actionable from this pass.

---

## Implementation order for this sprint (Pathology only)

Ranked by (a) complete absence from the app and (b) exam/clinical-teaching importance:

1. **Gestational Trophoblastic Disease** (Female Reproductive System) — classic boards topic, zero existing coverage.
2. **Primary Hyperparathyroidism** (Endocrine) — classic "stones, bones, groans, moans" topic, zero existing coverage, no parathyroid item of any kind exists.
3. **Prostatic Adenocarcinoma** (Male Reproductive System) — top-tier male cancer, only the benign BPH counterpart exists.
4. **Endometrial Hyperplasia & Carcinoma** (Female Reproductive System) — most common GYN cancer, zero existing coverage.
5. **Invasive Breast Carcinoma** (Female Reproductive System) — most common cancer in women, only benign fibroadenoma exists.
6. **Calcific Aortic Stenosis & Mitral Valve Prolapse** (Cardiovascular) — most common valve lesion + a classic murmur/exam topic, zero existing coverage (only rheumatic valve disease exists).

Each of the six is added as a **standalone `pathology.json` item** (not a new disease cluster) — matching the majority (123 of 130) of existing items, keeping this sprint additive-only with no architecture change. Two of the six intentionally bundle a closely related pair of entities from the same lecture into one item (GTD = mole spectrum + choriocarcinoma; item #6 = calcific AS + MVP) rather than atomizing further, to stay within a 6-topic budget while still surfacing every clinically distinct entity the source lecture covers. Adjacent entities each source PDF also covers but that didn't make this batch (e.g., prostatitis, DCIS/Paget as a separate item, uterine leiomyoma, NHL subtypes) are logged above as Medium-priority follow-ups.

Each item gets: `definition`, `etiology`, `pathogenesis`, `gross_features`, `microscopic_features`, `clinical_features` (framed as educational/descriptive only — no treatment recommendations), `diagnostic_clues`, `complications`, `common_confusions`, `exam_tips`, `differential_diagnosis`, `exam_trap` (all fields already used elsewhere in the schema), plus two new **additive** fields not previously used in `pathology.json` — `mnemonic` and `quick_summary` — added the same way `definition`/`differential_diagnosis`/`exam_trap` were added for the two most recent clusters: present in the data, not yet wired into `PathologyDetail.jsx`'s rendering (that page currently only renders a fixed `SECTIONS` list — see `src/pages/Pathology/PathologyDetail.jsx:15`). This keeps the sprint additive-only per the "no UI, no architecture changes" constraint; wiring those fields into the detail page is a separate, future UI task. A self-made schematic SVG (CC0, `verifiedOpenLicense: true`, matching the existing `epidural-hematoma.svg` pattern) is added per item so `ImageViewer` renders content instead of the placeholder. 5 new quiz questions per item go into `pathologyQuestions.json` using the existing `pa-<categoryslug>-<n>` id scheme. Source-PDF and supplemental-reference provenance per topic is logged in the Implementation Log below rather than as a new JSON field, to avoid growing the data schema beyond what's needed.

---

## Implementation Log (filled in as each topic ships)

### 1. Gestational Trophoblastic Disease — `gestational-trophoblastic-disease`
- **Source PDFs used:** `source-notes/GESTATIONAL TROPHOBLASTIC DISEASE.pdf` (primary and only source — the lecture is comprehensive: risk factors, complete vs. partial mole genetics, invasive mole, choriocarcinoma, PSTT, morphology, hCG kinetics, metastatic pattern).
- **Supplemental references used:** None needed.

### 2. Primary Hyperparathyroidism — `primary-hyperparathyroidism`
- **Source PDFs used:** `source-notes/Pathology of Parathyroid Glands.pdf` (primary and only source — covers anatomy/histology, primary/secondary/tertiary hyperparathyroidism, adenoma vs. hyperplasia vs. carcinoma, clinical "stones/bones/groans/moans", labs, and hypoparathyroidism).
- **Supplemental references used:** None needed.

### 3. Prostatic Adenocarcinoma — `prostatic-adenocarcinoma`
- **Source PDFs used:** `source-notes/Pathology of Prostate.pdf` (primary and only source — zone anatomy, risk factors, morphology, Gleason grading, spread pattern, PSA/DRE/TRUS diagnostic workup).
- **Supplemental references used:** None needed.

### 4. Endometrial Hyperplasia & Carcinoma — `endometrial-hyperplasia-carcinoma`
- **Source PDFs used:** `source-notes/pathology of endometrium and myometrium.pdf` (primary and only source — endometrial hyperplasia classification, PTEN pathogenesis, Type I endometrioid vs. Type II serous carcinoma with TP53, carcinosarcoma, staging).
- **Supplemental references used:** None needed.

### 5. Invasive Breast Carcinoma — `invasive-breast-carcinoma`
- **Source PDFs used:** `source-notes/Breast dis.pathology.pdf` (primary and only source — risk factors, molecular subtypes (luminal/HER2/basal-like), BRCA1/2, DCIS architectural patterns, Paget disease, invasive carcinoma morphology and prognostic factors).
- **Supplemental references used:** None needed.

### 6. Calcific Aortic Stenosis & Mitral Valve Prolapse — `calcific-aortic-stenosis-mitral-valve-prolapse`
- **Source PDFs used:** `source-notes/RHD and Valve dis^.pdf` (primary and only source — the same lecture that already backs `rheumatic-heart-disease`; the calcific AS and MVP sections were previously unused).
- **Supplemental references used:** None needed.

---

## Session 2 — additional Lane-1 topics + UI (all PDF-sourced unless noted)

Continued the value-first plan: added genuinely-missing high-yield topics, each verified to have real PDF coverage before authoring (candidates without coverage — e.g. sarcoidosis, appendicitis/diverticulitis, prion disease/CJD — were **skipped**, not fabricated). Every field is written from the named `source-notes/` PDF; no external/model-generated medical content was added. All items also carry the two additive fields `mnemonic` and `quick_summary` plus a self-made CC0 SVG, and 5 quiz questions each.

**Content added:**
- `ischemic-bowel-disease` (GI) — `Non-neoplastic disease of gastrointestinal tract.pdf`. Note logged: the classic "splenic-flexure watershed" point is NOT in the PDF and was deliberately omitted.
- `uterine-leiomyoma-leiomyosarcoma`, `endometriosis-adenomyosis` (Female Repro) — `pathology of endometrium and myometrium.pdf`.
- `prostatitis` (Male Repro) — `Pathology of Prostate.pdf`.
- `vascular-tumors` (General Pathology) — `vasculitidis ,vascular tumors (1).pdf`.
- `diffuse-large-b-cell-lymphoma`, `follicular-lymphoma`, `burkitt-lymphoma`, `mantle-cell-lymphoma`, `hairy-cell-leukemia`, `malt-marginal-zone-lymphoma` (Hematologic) — `Non-hodgkin lymphoma.pdf`. Completes the translocation trio: follicular t(14;18), Burkitt t(8;14), mantle t(11;14).
- `oligodendroglioma`, `ependymoma`, `cns-lymphoma-brain-metastasis`, `brain-abscess` (Nervous System) — `CNS tumors.pdf` + `PATHOLOGY OF CENTRAL NERVOUS SYSTEM INFECTIONS.pdf`.
- `congenital-renal-anomalies` (Renal) — `Congenital and Developmental Anomalies Cystic Disease of the Kidney.pdf`.
- `lung-abscess`, `sinonasal-nasopharyngeal-disease` (Respiratory) — `11.Non-Specific lung infections.pdf` + `Pathology of upper respiratory tract and larynx disease.pdf`.

**Totals after session 2:** pathology items 130 → 154; quiz questions 47 → 167.

**UI additions (additive, notes layout untouched):**
- `PathologyDetail.jsx` now renders the previously-hidden `definition`, `differential_diagnosis`, `exam_trap`, `mnemonic`, `quick_summary` fields.
- New memory-friendly "🧠 نقشه‌ذهنی" (mind-map) tab per disease (`PathologyMindMap.jsx` + `.css`), auto-generated from existing data, toggled against the "📄 جزوه" notes view. Per the med-student user's feedback (tree/shape layout, easier to memorize).

**Other fixes:**
- Removed a misleading suffix note (`Aripiprazole … not PPI`) from `src/pages/Pharmacology/suffixTips.js` — `-piprazole` is already its own suffix entry (per user feedback).
- Fixed 2 pre-existing orphan quiz references: `pa-nervoussystem-1` topicId `cerebrovascular-disease` → `ischemic-stroke`; `pa-nervoussystem-2` topicId `cns-tumors` → `medulloblastoma` (both previously pointed at non-existent item ids).

**Still open (Lane 1, lower yield or partial PDF coverage):** neurosyphilis (thin coverage), benign lung tumors/hamartoma, NSIP, other myopathies, salivary-gland subtypes. Not covered by any PDF (do not fabricate): sarcoidosis, appendicitis/diverticulitis, prion disease.

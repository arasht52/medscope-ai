# Source Library Index

Inventory of the raw lecture-PDF library at [`source-notes/`](source-notes/), scanned recursively. This is a **planning document only** — no app code, `src/`, or `public/` files were touched, no JSON was generated, and no lecture content was copied into the app.

## Method

- Recursive scan found **174 files** under `source-notes/` matching `*.pdf`, but **87 of those are macOS `__MACOSX/._*` AppleDouble resource-fork junk** (metadata shadow files created when the original ZIP was extracted on a Mac), not real PDFs. See [SOURCE_DUPLICATES_REPORT.md](SOURCE_DUPLICATES_REPORT.md) for details. **87 real PDFs** remain and are indexed below.
- The three subfolders `source-notes/histology/`, `source-notes/pathology/`, `source-notes/pharmacology/` exist but are **empty** — all 87 real PDFs sit flat at the `source-notes/` root.
- Subject, body system, and topic were determined from filename **plus** a first-page/authorship text snippet (via `pdftotext`) for every file that was ambiguous by filename alone — no page beyond page 3 was read, and no content was transcribed into this document beyond a title/author line used for classification.
- Two lecturers/authors are present in the library, which strongly disambiguates subject where filenames are generic:
  - **Dr. Behnaz Irandoust** (pathologist, 2025–2026 term) → Pathology lectures
  - **Dr./A. Azadeh Abdi, Pharm.D., PhD** → Pharmacology lectures
  - **Dr. Ahmet Özyiğit** (Clinical Embryology/Endocrinology) → a 4-part "The Endocrine System" **physiology** series (not disease pathology, not drug pharmacology) — parts 1, 2, and 4 are present; **part 3 is missing** from the library.
- "Recommended MedScope category" uses the exact category strings already defined in [pathology.json](src/data/pathology.json) and [pharmacology.json](src/data/pharmacology.json). No histology-relevant PDFs were found in this library.
- Priority reflects how much the topic is currently a **gap** in the live app (`src/data/pathology.json` has 130 items across 12 categories; `pharmacology.json` has 97 drug monographs across 12 categories) — not lecture quality:
  - **High** = topic is absent or barely represented in the app today.
  - **Medium** = topic exists but this source likely adds meaningful missing depth/subtypes.
  - **Low** = topic is already thoroughly covered by existing app content, or the file is an exact duplicate of another entry in this table.

## Summary

| Subject | Files (incl. duplicates) | Unique topics |
|---|---|---|
| Pathology (Dr. Irandoust) | 49 | 49 |
| Pharmacology (Dr. Abdi) | 34 | 26 (8 files are exact duplicates of 4 topics) |
| Physiology (Dr. Özyiğit + 1 unattributed) | 4 | 4 |
| **Total real PDFs** | **87** | **79** |

High-priority gaps identified: **Breast pathology, Gestational Trophoblastic Disease, Parathyroid pathology, Prostate pathology, Peripheral Nervous System pathology, Endometrium/Myometrium pathology** — six topics with little-to-no existing coverage in `pathology.json`. See [SOURCE_DUPLICATES_REPORT.md](SOURCE_DUPLICATES_REPORT.md) for the full duplicate/continuation breakdown.

---

## A. Pathology source files (Dr. Behnaz Irandoust)

| Filename | Body System | Estimated Topic | Dup/Continuation Status | Recommended Category | Priority |
|---|---|---|---|---|---|
| `9.Tuberculosis.pdf` | Respiratory | Pulmonary tuberculosis | Unique | Respiratory | Low — `pulmonary-tuberculosis` already exists |
| `10.lung tumor3.pdf` | Respiratory | Lung tumors (benign + malignant) | Unique (trailing "3" not part of a 1/2/3 set found in library) | Respiratory | Medium |
| `11.Non-Specific lung infections.pdf` | Respiratory | Non-specific pneumonia/lung infections | Unique | Respiratory | Medium |
| `12.CHRONIC DIFFUSE INTERSTITIAL (RESTRICTIVE) DISEASES.pdf` | Respiratory | Interstitial lung disease | Unique | Respiratory | Medium |
| `Adrenal gland1.pdf` | Endocrine | Adrenal gland pathology | Unique | Endocrine | Low — Addison/Cushing/pheochromocytoma/hyperaldosteronism all exist |
| `Approach to cholestatic liver disease.pdf` | Hepatobiliary | Cholestatic liver disease | Unique | Hepatobiliary | Low — `cholestatic-liver-disease-pbc-psc` exists |
| `Atherosclerosis ^JIschemic Heart Disease.pdf` | Cardiovascular | Atherosclerosis / IHD | Unique (filename has a literal `^J`/newline control character — see report) | Cardiovascular | Low — `atherosclerosis` + `myocardial-infarction` exist |
| `Breast dis.pathology.pdf` | Female Reproductive System | Breast pathology (general) | Unique | Female Reproductive System | **High** — only `fibroadenoma-breast` exists; breast carcinoma/fibrocystic change likely missing |
| `CEREBROVASCULAR DISEASE.pdf` | Nervous System | Stroke / cerebrovascular disease | Unique | Nervous System | Low — full stroke/hemorrhage cluster already exists |
| `CNS tumors.pdf` | Nervous System | CNS tumors | Unique | Nervous System | Medium |
| `Congenital and Developmental Anomalies Cystic Disease of the Kidney.pdf` | Renal | Renal congenital/cystic anomalies | Unique | Renal | Medium — PKD covered, other congenital anomalies likely not |
| `Endocrine pancreas and DM.pdf` | Endocrine | Endocrine pancreas & diabetes mellitus | Topic overlaps physiology file `Endocrine System- Metabolic Syndrome and Diabetes 2.pdf` (different course/author, not a duplicate) | Endocrine | Low — DM/MODY already comprehensively covered |
| `GALLBLADDER AND EXOCRINE PANCREAS.pdf` | Hepatobiliary | Gallbladder & exocrine pancreas disease | Unique | Hepatobiliary | Low |
| `GESTATIONAL TROPHOBLASTIC DISEASE.pdf` | Female Reproductive System | Gestational trophoblastic disease | Unique | Female Reproductive System | **High** — not covered at all |
| `HODGKIN LYMPHOMA PATHOLOGY 2.pdf` | Hematologic & Lymphoid | Hodgkin lymphoma | Filename suggests "part 2"; no "part 1" file found in library | Hematologic & Lymphoid | Low — `hodgkin-lymphoma` exists (recently upgraded with real photo) |
| `Liver tumors  .pdf` | Hepatobiliary | Liver tumors | Unique | Hepatobiliary | Low — HCC/cholangiocarcinoma/hepatic adenoma/FNH cluster exists |
| `METABOLIC LIVER DISEASE.pdf` | Hepatobiliary | Metabolic liver disease | Unique | Hepatobiliary | Low — hemochromatosis/Wilson/A1AT deficiency exist |
| `Non-hodgkin lymphoma.pdf` | Hematologic & Lymphoid | Non-Hodgkin lymphoma | Unique | Hematologic & Lymphoid | Medium — app only has an "overview" item; subtypes may be missing |
| `Non-neoplastic disease of gastrointestinal tract.pdf` | GI | Non-neoplastic GI disease | Unique | GI | Medium |
| `Obstructive lung diseases.pdf` | Respiratory | Asthma/COPD | Unique | Respiratory | Low |
| `PATHOLOGY OF CENTRAL NERVOUS SYSTEM INFECTIONS.pdf` | Nervous System | CNS infections | Unique | Nervous System | Medium |
| `PATHOLOGY OF MUSCLE DISEASE.pdf` | Musculoskeletal | Myopathies | Unique | Musculoskeletal | Medium |
| `PERIPHERAL NERVOUS  SYSTEM PATHOLOGY.pdf` | Nervous System | Peripheral nervous system pathology | Unique | Nervous System | **High** — only nerve sheath tumors exist; neuropathies/Guillain-Barré etc. likely missing |
| `Pathological Approach to Chronic Hepatitis.pdf` | Hepatobiliary | Chronic hepatitis | Unique | Hepatobiliary | Low — `chronic-viral-hepatitis-cirrhosis` exists |
| `Pathology of Bone Tumors.pdf` | Musculoskeletal | Bone tumors | Unique | Musculoskeletal | Low — comprehensive coverage already exists |
| `Pathology of CNS Degenerative and Demyelinating Diseases.pdf` | Nervous System | Neurodegenerative/demyelinating disease | Unique | Nervous System | Low — Alzheimer/Parkinson/MS exist |
| `Pathology of Parathyroid Glands.pdf` | Endocrine | Parathyroid pathology | Pairs topically with physiology file `Lecture 3- PTH and Calcium.pdf` (different course) | Endocrine | **High** — no parathyroid/hyperparathyroidism item exists |
| `Pathology of Prostate.pdf` | Male Reproductive System | Prostate pathology | Unique | Male Reproductive System | **High** — only BPH exists; prostate carcinoma likely missing |
| `Pathology of Testis and Epididymis.pdf` | Male Reproductive System | Testis/epididymis pathology | Unique | Male Reproductive System | Low — cryptorchidism/torsion/epididymo-orchitis/seminoma/yolk sac/sex cord tumors already comprehensive |
| `Pathology of myocardium and pericardium.pdf` | Cardiovascular | Myocardium/pericardium disease | Unique | Cardiovascular | Low — myocarditis/pericarditis + cardiomyopathy cluster exists |
| `Pathology of oral cavity and  salivary gland diseases.pdf` | GI | Oral cavity/salivary gland disease | Unique | GI | Medium |
| `Pathology of stomach disease.pdf` | GI | Stomach disease | Unique | GI | Low — gastritis/gastric carcinoma exist |
| `Pathology of upper respiratory tract and larynx disease.pdf` | Respiratory | Upper respiratory tract/larynx disease | Unique | Respiratory | Medium |
| `Pituitary gland pathology1.pdf` | Endocrine | Pituitary gland pathology | Topic overlaps physiology file `Endocrine System- Pituitary.pdf` (different course/author — not a duplicate); trailing "1" may imply a missing "part 2" | Endocrine | Low — pituitary adenoma/hypopituitarism-Sheehan exist |
| `Pleura and mediastinum.pdf` | Respiratory | Pleura/mediastinum disease | Unique | Respiratory | Medium |
| `Pulmonary vascular disease.pdf` | Respiratory | Pulmonary vascular disease | Unique | Respiratory | Low — PE/pulmonary hypertension exist |
| `RENAL TUMORS.pdf` | Renal | Renal tumors | Unique | Renal | Low — RCC/Wilms/angiomyolipoma exist |
| `RHD and Valve dis^.pdf` | Cardiovascular | Rheumatic heart disease & valvular disease | Unique (filename has a literal `^J` control character) | Cardiovascular | Medium — RHD exists but infective endocarditis/other valve disease may not |
| `Renal Vascular Diseases.pdf` | Renal | Renal vascular disease | Unique | Renal | Low — nephrosclerosis/renal artery stenosis exist |
| `TUMOR GROWTH AND METASTASES.pdf` | General Pathology | Tumor biology/metastasis | Unique | General Pathology | Low — `tumor-metastasis-cascade` exists |
| `Tubular and Interstitial Diseases.pdf` | Renal | Tubulointerstitial disease | Unique | Renal | Low — ATN/TIN-pyelonephritis exist |
| `Urethra^Jbladder^Jureter pathology.pdf` | Renal | Urethra/bladder/ureter pathology | Unique (filename has literal `^J` control characters) | Renal | Medium — bladder carcinoma covered, urethra/ureter-specific pathology likely not |
| `glumerulonephritis.pdf` | Renal | Glomerulonephritis | Unique | Renal | Low — full GN cluster (5 items) already exists |
| `neoplastic disease of GI tract(1).pdf` | GI | GI neoplasms | Unique ("(1)" is a filesystem download artifact, no counterpart file exists) | GI | Low — colorectal/gastric/esophageal carcinoma exist |
| `pathology of Cervix ,vagina, vulva.pdf` | Female Reproductive System | Cervix/vagina/vulva pathology | Unique — likely the exact source of the existing cluster | Female Reproductive System | Low — comprehensive cluster (7 items) already exists |
| `pathology of endometrium and myometrium.pdf` | Female Reproductive System | Endometrium/myometrium pathology | Unique | Female Reproductive System | **High** — no endometrial hyperplasia/carcinoma/leiomyoma item exists |
| `pathology of esophagus.pdf` | GI | Esophageal pathology | Unique | GI | Low — achalasia/Mallory-Weiss/carcinoma/Barrett exist |
| `pathology of reticuluendothelial system.spleen,thymus 3.pdf` | Hematologic & Lymphoid | Spleen/thymus pathology | Filename suggests "part 3"; parts 1–2 not found in library | Hematologic & Lymphoid | Medium — splenomegaly/thymoma exist but source itself is incomplete |
| `vasculitidis ,vascular tumors (1).pdf` | General Pathology | Vasculitis & vascular tumors | Unique ("(1)" is a filesystem download artifact) | General Pathology | Medium — vasculitis overview exists, vascular tumors (hemangioma etc.) likely not |

## B. Pharmacology source files (Dr. Azadeh Abdi)

| Filename | Body System | Estimated Topic | Dup/Continuation Status | Recommended Category | Priority |
|---|---|---|---|---|---|
| `1.Introduction to the Pharmacology of CNS Drugs copy.pdf` | CNS | Intro to CNS pharmacology | Unique | CNS | Medium — foundational overview |
| `2.Diuretics drugs.pdf` | Cardiovascular/Renal | Diuretics | Unique | Cardiovascular | Low — furosemide/HCTZ/spironolactone/mannitol/acetazolamide all exist |
| `2.Sedative-Hypnotic Drugs.pdf` | CNS | Sedative-hypnotics | Unique | CNS | Low — benzodiazepines/Z-drugs/flumazenil exist |
| `3.Antidiarrheal Agents and Laxatives.pdf` | GI | Antidiarrheals & laxatives | **Exact duplicate** — see report | GI | Low — loperamide/bisacodyl/lactulose exist |
| `3.Antidiarrheal Agents and Laxatives 2.pdf` | GI | Antidiarrheals & laxatives | **Exact duplicate** of the file above (MD5-identical) | GI | Low |
| `3.Antidiarrheal Agents and Laxatives 3.pdf` | GI | Antidiarrheals & laxatives | **Exact duplicate** of the file above (MD5-identical) | GI | Low |
| `4. Antipsychotic Agents & Lithium.pdf` | Psychiatry | Antipsychotics & lithium | Unique | Psychiatry | Low — chlorpromazine/clozapine/haloperidol/risperidone/lithium exist |
| `Adrenocorticosterons.pdf` | Endocrine | Adrenocorticosteroids | Unique (filename typo for "Adrenocorticosteroids") | Endocrine | Low — hydrocortisone/prednisone/dexamethasone/fludrocortisone exist |
| `Agents Affecting Bone Mineral Homeostasis.pdf` | Endocrine | Bone/calcium drugs | Unique | Endocrine | Low — alendronate/calcitriol/denosumab exist |
| `Anti amoebiasis.pdf` | Antiparasitic | Antiamoebic drugs | **Exact duplicate** — see report | Antiparasitic | Medium — no amoebiasis-specific agent (e.g. diloxanide) yet distinct from metronidazole |
| `Anti amoebiasis 2.pdf` | Antiparasitic | Antiamoebic drugs | **Exact duplicate** of the file above (MD5-identical) | Antiparasitic | Medium |
| `Anti amoebiasis 3.pdf` | Antiparasitic | Antiamoebic drugs | **Exact duplicate** of the file above (MD5-identical) | Antiparasitic | Medium |
| `Anti-inflammatory - Copy.pdf` | Analgesics & NSAIDs | Anti-inflammatory drugs (NSAIDs) | Unique ("- Copy" is a filesystem artifact, no counterpart exists) | Analgesics & NSAIDs | Low — aspirin/ibuprofen/celecoxib exist |
| `Antidepressant Agents.pdf` | Psychiatry | Antidepressants | Unique | Psychiatry | Low — TCA/SSRI/SNRI/NDRI/mirtazapine all exist |
| `Antihelminthic drugs.pdf` | Antiparasitic | Anthelmintics | **Exact duplicate** — see report | Antiparasitic | Low — albendazole/ivermectin/praziquantel exist |
| `Antihelminthic drugs 2.pdf` | Antiparasitic | Anthelmintics | **Exact duplicate** of the file above (MD5-identical) | Antiparasitic | Low |
| `Antihelminthic drugs 3.pdf` | Antiparasitic | Anthelmintics | **Exact duplicate** of the file above (MD5-identical) | Antiparasitic | Low |
| `Antiseizure Drugs - Copy.pdf` | CNS | Antiepileptics | Unique ("- Copy" filesystem artifact) | CNS | Low — carbamazepine/gabapentin/lamotrigine/phenytoin/valproate exist |
| `Drugs Used in Fluid and Electrolyte Disorders (1).pdf` | Cardiovascular/Renal | Fluid & electrolyte drugs | Unique ("(1)" filesystem artifact) | Cardiovascular | Medium — broader electrolyte replacement therapy likely not covered |
| `General Anesthetics - Copy (1).pdf` | Anesthetics | General anesthetics | Unique ("- Copy (1)" filesystem artifact) | Anesthetics | Medium — propofol/ketamine exist, inhalational agents likely gap |
| `Local Anesthetics - Copy (1).pdf` | Anesthetics | Local anesthetics | Unique ("- Copy (1)" filesystem artifact) | Anesthetics | Medium — only lidocaine exists |
| `Opioid -1.pdf` | Analgesics & NSAIDs | Opioid analgesics | Unique | Analgesics & NSAIDs | Low — fentanyl/methadone/morphine/naloxone/tramadol all exist |
| `Pancreatic Hormones & Antidiabetic Drugs.pdf` | Endocrine | Antidiabetic drugs | Unique | Endocrine | Low — insulin/metformin/glipizide/empagliflozin/semaglutide/sitagliptin all exist |
| `Parkinsonism - Copy.pdf` | CNS | Antiparkinsonian drugs | Unique ("- Copy" filesystem artifact) | CNS | Low — levodopa-carbidopa/amantadine/selegiline exist |
| `Pharma 6 .pdf` | Mixed | **Question bank**, not lecture notes — first item is a sedative-hypnotic MCQ | Unique; different content type from all other files | N/A — candidate for `pharmacologyQuestions.json`, not a lecture topic | Medium |
| `Principles_of_Endocrine_Pharmacology_and_Mechanisms_of_Hormone_Action.pdf` | Endocrine | Endocrine pharmacology principles | Likely topic-overlaps `principles of endocrine pharmacology.pdf` (same author, different file size — not identical) — see report | Endocrine | Medium — foundational |
| `The Gonadal Hormones - Copy.pdf` | Endocrine | Gonadal hormone drugs | Unique ("- Copy" filesystem artifact) | Endocrine | Low — testosterone/OCP/tamoxifen/leuprolide exist |
| `Thyroid and Antithyroid Drugs.pdf` | Endocrine | Thyroid drugs | Unique | Endocrine | Low — levothyroxine/methimazole exist |
| `dugs related to ADH,PRL,GH (2).pdf` | Endocrine | ADH/prolactin/GH drugs | Unique (filename typo "dugs"→"drugs"; "(2)" filesystem artifact) | Endocrine | Medium — desmopressin exists, but GH/prolactin-specific agents (e.g. bromocriptine, cabergoline) likely gap |
| `obesity.pdf` | Endocrine | Obesity pharmacology | Unique | Endocrine | Medium — no obesity-specific drug framing exists yet (semaglutide exists but not framed for obesity) |
| `principles of endocrine pharmacology.pdf` | Endocrine | Intro to endocrine pharmacology | See note on `Principles_of_Endocrine_Pharmacology...pdf` above | Endocrine | Medium |
| `acid-peptic disease.pdf` | GI | Acid-peptic disease drugs (PPI/H2 blockers) | **Exact duplicate** — see report | GI | Low — omeprazole/famotidine exist |
| `acid-peptic disease 2.pdf` | GI | Acid-peptic disease drugs | **Exact duplicate** of the file above (MD5-identical) | GI | Low |
| `acid-peptic disease 3.pdf` | GI | Acid-peptic disease drugs | **Exact duplicate** of the file above (MD5-identical) | GI | Low |

## C. Physiology source files (non-diagnostic — do not map cleanly to Pathology or Pharmacology)

These four files are physiology/endocrinology-fundamentals lectures, not disease pathology or drug pharmacology. MedScope currently has no physiology module, so no MedScope category is a clean fit; they're listed here for completeness and to explain otherwise-confusing topic overlaps with the Pathology/Pharmacology sections above.

| Filename | Body System | Estimated Topic | Dup/Continuation Status | Recommended Category | Priority |
|---|---|---|---|---|---|
| `Endocrine System- Pituitary.pdf` | Endocrine | "The Endocrine System Part 1 – The Pituitary" (Dr. Ahmet Özyiğit) | Part 1 of a 4-part series; part 3 is missing from the library | No direct module — background/physiology only | Low |
| `Endocrine System- Metabolic Syndrome and Diabetes 2.pdf` | Endocrine | "The Endocrine System Part 2 – Metabolic Syndrome & Diabetes" (Dr. Özyiğit) | Part 2 of the same 4-part series | No direct module | Low |
| `Lecture 3- PTH and Calcium.pdf` | Endocrine | "The Endocrine System Part 4 – Parathyroid & Calcium Homeostasis" (Dr. Özyiğit) — **filename says "Lecture 3" but the slide content says "Part 4"** | Part 4 of the same series; part 3 is missing | No direct module | Low |
| `gonades.pdf` | Female Reproductive/Endocrine | "Neurohormonal Control of the Female Reproductive System" | Unattributed author on page 1; distinct from the pharmacology file `The Gonadal Hormones - Copy.pdf` (different subject/author) | No direct module | Low |

---

*Generated by scanning `source-notes/` on 2026-07-03. No files under `src/`, `public/`, or any JSON data file were modified to produce this index.*

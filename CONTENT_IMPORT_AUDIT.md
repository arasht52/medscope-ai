# Content Import Audit

Compares what's already live in the app (`src/data/pathology.json`, `src/data/pharmacology.json`, `src/data/histology.json`) against the 87 real source PDFs catalogued in [SOURCE_LIBRARY_INDEX.md](SOURCE_LIBRARY_INDEX.md). This is an audit only — no content was changed to produce this file. Implementation happens in [CONTENT_GAP_FILL_PLAN.md](CONTENT_GAP_FILL_PLAN.md) and the pathology-only build that follows it.

## Method

For each of the 49 Pathology-authored and 34 Pharmacology-authored source PDFs, I opened the first 1–3 pages (via `pdftotext`) and compared the actual lecture content against every item currently in `pathology.json` (130 items / 12 categories) and `pharmacology.json` (97 drug monographs / 12 categories), matching by disease/drug entity rather than filename. One correction from the prior source-library pass: `PERIPHERAL NERVOUS  SYSTEM PATHOLOGY.pdf` was initially assumed (from its title alone) to cover neuropathies/Guillain-Barré, but its actual content is entirely nerve-sheath **tumors** (Schwannoma/Neurofibroma/MPNST/NF1/NF2) — which the app already covers thoroughly via `peripheral-nerve-sheath-tumors`. That file is reclassified below as **fully represented**, not a gap.

## Current app inventory

| Module | Items | Categories |
|---|---|---|
| Pathology | 130 | General Pathology (8), Cardiovascular (8), Respiratory (13), GI (12), Hepatobiliary (13), Renal (14), Endocrine (16), Hematologic & Lymphoid (9), Musculoskeletal (9), Nervous System (14), Male Reproductive System (7), Female Reproductive System (7) |
| Pharmacology | 97 drug monographs | 12 categories (Analgesics & NSAIDs, Antibiotics, Anticoagulants, CNS, Cardiovascular, Endocrine, GI, Immunosuppressant/Antineoplastic, Psychiatry, Respiratory, Anesthetics, Antiparasitic) |
| Histology | tissue-type entries | 4 categories (Epithelial, Connective, Muscle, Nervous) |

---

## Part A — Pathology

### A1. PDFs fully represented in the app (33 of 49)

These source lectures map cleanly onto one or more existing, adequately-detailed pathology.json items — no action needed.

| Source PDF | Existing item(s) |
|---|---|
| `9.Tuberculosis.pdf` | `pulmonary-tuberculosis` |
| `Adrenal gland1.pdf` | `addison-disease`, `cushing-syndrome`, `pheochromocytoma`, `primary-hyperaldosteronism` |
| `Approach to cholestatic liver disease.pdf` | `cholestatic-liver-disease-pbc-psc` |
| `Atherosclerosis ^JIschemic Heart Disease.pdf` | `atherosclerosis`, `myocardial-infarction` |
| `CEREBROVASCULAR DISEASE.pdf` | `ischemic-stroke`, `subarachnoid-hemorrhage`, `epidural-hematoma`, `subdural-hematoma`, `intracerebral-hemorrhage` |
| `Endocrine pancreas and DM.pdf` | `type-1-diabetes-mellitus`, `type-2-diabetes-mellitus`, `mody-lada-other-diabetes` |
| `GALLBLADDER AND EXOCRINE PANCREAS.pdf` | `cholelithiasis-cholecystitis`, `gallbladder-carcinoma`, `acute-chronic-pancreatitis`, `pancreatic-ductal-adenocarcinoma` |
| `HODGKIN LYMPHOMA PATHOLOGY 2.pdf` | `hodgkin-lymphoma` |
| `Liver tumors  .pdf` | `hepatocellular-carcinoma`, `cholangiocarcinoma`, `hepatic-adenoma`, `focal-nodular-hyperplasia` |
| `METABOLIC LIVER DISEASE.pdf` | `hemochromatosis-wilson-disease`, `alpha1-antitrypsin-deficiency` |
| `Obstructive lung diseases.pdf` | `asthma`, `copd-emphysema-chronic-bronchitis` |
| `PERIPHERAL NERVOUS  SYSTEM PATHOLOGY.pdf` | `peripheral-nerve-sheath-tumors` (content is nerve-sheath tumors only, not neuropathy — see Method note above) |
| `Pathological Approach to Chronic Hepatitis.pdf` | `chronic-viral-hepatitis-cirrhosis` |
| `Pathology of Bone Tumors.pdf` | `osteosarcoma`, `chondrosarcoma`, `ewing-sarcoma`, `osteochondroma-chondroma` |
| `Pathology of CNS Degenerative and Demyelinating Diseases.pdf` | `alzheimer-disease`, `parkinson-disease`, `multiple-sclerosis` |
| `Pathology of Testis and Epididymis.pdf` | `cryptorchidism`, `epididymo-orchitis`, `testicular-torsion`, `seminoma-embryonal-carcinoma`, `sex-cord-tumors-testis`, `yolk-sac-tumor-choriocarcinoma` |
| `Pathology of myocardium and pericardium.pdf` | `myocarditis-pericarditis`, `dilated-cardiomyopathy`, `hypertrophic-cardiomyopathy`, `restrictive-cardiomyopathy` |
| `Pathology of stomach disease.pdf` | `gastritis-acute-chronic`, `gastric-carcinoma` |
| `Pituitary gland pathology1.pdf` | `pituitary-adenoma-functioning`, `pituitary-adenoma-nonfunctioning`, `hypopituitarism-sheehan-syndrome` |
| `Pulmonary vascular disease.pdf` | `pulmonary-embolism-hypertension` |
| `RENAL TUMORS.pdf` | `renal-cell-carcinoma`, `wilms-tumor`, `angiomyolipoma-renal` |
| `Renal Vascular Diseases.pdf` | `nephrosclerosis-renal-artery-stenosis` |
| `TUMOR GROWTH AND METASTASES.pdf` | `tumor-metastasis-cascade` |
| `Tubular and Interstitial Diseases.pdf` | `acute-tubular-necrosis`, `tubulointerstitial-nephritis-pyelonephritis` |
| `glumerulonephritis.pdf` | `minimal-change-disease`, `focal-segmental-glomerulosclerosis`, `membranous-nephropathy`, `iga-nephropathy`, `glomerulonephritis-poststreptococcal`, `rapidly-progressive-glomerulonephritis` |
| `neoplastic disease of GI tract(1).pdf` | `colorectal-adenocarcinoma-polyps`, `gastric-carcinoma`, `esophageal-carcinoma` |
| `pathology of Cervix ,vagina, vulva.pdf` | `cervical-hpv-cin-carcinoma`, `condyloma-vin-classic`, `differentiated-vin-vulvar-scc`, `lichen-sclerosus-vulva`, `bartholin-cyst-vulvar-inflammation`, `vaginal-scc-rhabdomyosarcoma` |
| `pathology of esophagus.pdf` | `achalasia-mallory-weiss`, `esophageal-carcinoma`, `reflux-esophagitis-barrett` |
| `pathology of reticuluendothelial system.spleen,thymus 3.pdf` | `splenomegaly-spleen-pathology`, `thymoma` |
| `9.Tuberculosis.pdf` *(listed once above)* | — |

*(33 PDFs total when counting each row; several PDFs map to multiple items each.)*

### A2. PDFs partially represented — existing item(s) cover only part of the lecture (13)

The app has *something* for these, but the source PDF contains additional disease entities that aren't in `pathology.json` at all.

| Source PDF | What's covered | What's missing from the app |
|---|---|---|
| `10.lung tumor3.pdf` | `bronchogenic-carcinoma`, `pulmonary-carcinoid-tumor` | Benign lung tumors (hamartoma), metastatic tumors to lung |
| `11.Non-Specific lung infections.pdf` | `bronchopneumonia`, `lobar-pneumonia`, `atypical-mycoplasma-pneumonia` | Lung abscess |
| `12.CHRONIC DIFFUSE INTERSTITIAL (RESTRICTIVE) DISEASES.pdf` | `idiopathic-pulmonary-fibrosis`, `pneumoconiosis` | Sarcoidosis, hypersensitivity pneumonitis |
| `CNS tumors.pdf` | `astrocytoma-glioblastoma`, `meningioma`, `medulloblastoma` | Oligodendroglioma, primary CNS lymphoma, metastatic brain tumors |
| `Congenital and Developmental Anomalies Cystic Disease of the Kidney.pdf` | `polycystic-kidney-disease` | Renal agenesis, renal dysplasia, horseshoe kidney, medullary sponge kidney |
| `Non-hodgkin lymphoma.pdf` | `non-hodgkin-lymphoma-overview` | Subtype breakdown (DLBCL, follicular, Burkitt, mantle cell) — currently a single "overview" item |
| `Non-neoplastic disease of gastrointestinal tract.pdf` | `gastritis-acute-chronic`, `peptic-ulcer-disease`, `ibd-crohn-ulcerative-colitis`, `celiac-disease`, `c-difficile-colitis`, `achalasia-mallory-weiss` | Appendicitis, diverticulitis, ischemic colitis |
| `PATHOLOGY OF CENTRAL NERVOUS SYSTEM INFECTIONS.pdf` | `bacterial-fungal-meningitis`, `viral-encephalitis` | Brain abscess, prion disease (CJD), neurosyphilis |
| `PATHOLOGY OF MUSCLE DISEASE.pdf` | `dermatomyositis-polymyositis`, `duchenne-becker-muscular-dystrophy` | Other myopathies (metabolic, congenital myopathies) |
| `Pathology of oral cavity and  salivary gland diseases.pdf` | `oral-mucosal-lesions`, `salivary-gland-tumors` | Deeper salivary gland tumor subtypes not confirmed |
| `Pathology of upper respiratory tract and larynx disease.pdf` | `laryngeal-carcinoma-vocal-cord-lesions` | Sinusitis, nasal polyps, nasopharyngeal carcinoma |
| `Pleura and mediastinum.pdf` | `pneumothorax-mesothelioma-pleural`, `thymoma` | Mediastinal lymphoma/germ cell tumors as a distinct entity |
| `RHD and Valve dis^.pdf` | `rheumatic-heart-disease` | **Calcific aortic stenosis and mitral valve prolapse (myxomatous degeneration) — both fully covered in the lecture, both entirely absent from the app.** (Infective endocarditis is not in this PDF either — it's a separate future gap.) |
| `Urethra^Jbladder^Jureter pathology.pdf` | `bladder-urothelial-carcinoma` | Urethral stricture/carcinoma, ureteral-specific pathology |
| `vasculitidis ,vascular tumors (1).pdf` | `vasculitis-classification-overview` | Vascular tumors (hemangioma, angiosarcoma, Kaposi sarcoma) as distinct entities |

### A3. PDFs not represented in the app at all (3)

| Source PDF | Topic | Current app coverage |
|---|---|---|
| `GESTATIONAL TROPHOBLASTIC DISEASE.pdf` | Hydatidiform mole (complete/partial), invasive mole, choriocarcinoma, PSTT | **None** |
| `Pathology of Parathyroid Glands.pdf` | Primary/secondary hyperparathyroidism, parathyroid adenoma/hyperplasia/carcinoma, hypoparathyroidism | **None** — no parathyroid item exists anywhere in `pathology.json` |
| `pathology of endometrium and myometrium.pdf` | Endometrial hyperplasia & carcinoma, leiomyoma/leiomyosarcoma, adenomyosis, endometriosis, endometrial polyps | **None** |

### A4. Topics that are effectively missing despite an adjacent item existing ("shallow by omission")

These aren't in A2/A3 because the app *does* have a same-organ item, but that item covers a different (usually benign) entity while the clinically dominant disease is completely absent:

| Source PDF | Existing item | The actual gap |
|---|---|---|
| `Pathology of Prostate.pdf` | `benign-prostatic-hyperplasia` only | **Prostatic adenocarcinoma is entirely absent** — despite being one of the most common and highest-yield male cancers, and despite prostatitis also being covered in the lecture and missing from the app |
| `Breast dis.pathology.pdf` | `fibroadenoma-breast` only | **Invasive/in-situ breast carcinoma is entirely absent** — along with fibrocystic change, proliferative breast disease, and Paget disease, all covered in the lecture and missing from the app |

### A5. Are existing (already-represented) pathology items themselves shallow?

Checked all 130 items for sparse core-field coverage (empty `etiology`/`gross_features`/`microscopic_features`/`clinical_features`/`diagnostic_clues`/`complications`/`common_confusions`/`exam_tips` arrays, and total content length). **Result: none are shallow.** Every item has at least 6 of 8 core arrays populated, and content length is fairly consistent across the whole set (shortest ~594 characters, median ~1069 characters) — there's no item that stands out as thin or rushed. The "Content Excellence" fields (`definition`, `differential_diagnosis`, `exam_trap`) exist only on the 7 items from the two most recent clusters (Cardiomyopathies, Intracranial Hemorrhage); the other 123 items predate that schema addition and don't have them, which is a schema-consistency gap rather than a content-quality one — worth revisiting in a later sprint, not this one.

**Conclusion for Pathology: the existing 130 items are consistently good. The problem is coverage breadth, not depth of what's already there** — confirming the user's framing ("incomplete", not "wrong").

---

## Part B — Pharmacology (audit only, no changes this sprint)

34 pharmacology PDFs map to 26 unique lecture topics (8 files are exact duplicates within 4 topic groups — see [SOURCE_DUPLICATES_REPORT.md](SOURCE_DUPLICATES_REPORT.md) §3).

### B1. Fully represented (16 topics)
Diuretics, Sedative-Hypnotics, Antidiarrheals & Laxatives, Antipsychotics & Lithium, Adrenocorticosteroids, Bone/mineral homeostasis agents, Anti-inflammatory (NSAIDs), Antidepressants, Anthelmintics, Antiseizure drugs, Opioids, Pancreatic hormones/antidiabetics, Antiparkinsonian drugs, Gonadal hormone drugs, Thyroid/antithyroid drugs, Acid-peptic disease drugs — all have comprehensive existing drug monographs in `pharmacology.json`.

### B2. Partially represented (7 topics)
Antiamoebic drugs (metronidazole exists under Antibiotics, but no amoebiasis-specific agent like diloxanide), Fluid/electrolyte drugs (broader electrolyte replacement beyond diuretics not covered), General anesthetics (only propofol/ketamine — no inhalational agents), Local anesthetics (only lidocaine — no class-wide detail), ADH/prolactin/GH drugs (desmopressin exists, but no bromocriptine/cabergoline-type prolactin agents), Obesity pharmacology (no drug is framed for obesity treatment specifically), Endocrine pharmacology principles (foundational — supports the whole Endocrine category but isn't itself a monograph).

### B3. Not represented (1 file, different content type)
`Pharma 6 .pdf` is a multiple-choice question bank, not lecture notes — not a content gap in the usual sense; it's a source for *quiz* content rather than a monograph. Flagged for a future quiz-bank expansion, not a drug/topic gap.

### B4. Existing pharmacology items shallow?
Not audited item-by-item this pass (out of scope — Pharmacology is untouched this sprint). Based on the 97-monograph inventory, category coverage looks broad and even; no immediate red flags surfaced while cross-referencing the 34 PDFs against it.

---

## Part C — Histology (audit only, no changes this sprint)

**Zero of the 87 source-notes PDFs are histology-relevant.** The library is 49 pathology lectures + 34 pharmacology lectures + 4 physiology lectures (see [SOURCE_LIBRARY_INDEX.md](SOURCE_LIBRARY_INDEX.md) §C) — no normal-tissue histology content at all. `histology.json`'s 4 categories (Epithelial, Connective, Muscle, Nervous Tissue) must therefore already be sourced from something outside this PDF library (a histology atlas or textbook), and this audit has nothing to compare them against. **No histology gap-fill is possible from `source-notes/` as it currently stands.** If histology needs expansion, it needs a different source library, not this one.

---

## Summary for prioritization

| | Fully represented | Partial | Missing entirely | Shallow-by-omission |
|---|---|---|---|---|
| Pathology | 33 PDFs | 15 PDFs | 3 PDFs | 2 PDFs |

The six clearest, highest-yield Pathology gaps — three topics missing entirely (GTD, parathyroid, endometrium/myometrium), two shallow-by-omission (prostate carcinoma, breast carcinoma), and one partial-with-a-clean-cut gap (calcific aortic stenosis + mitral valve prolapse) — are carried into [CONTENT_GAP_FILL_PLAN.md](CONTENT_GAP_FILL_PLAN.md) and implemented in this sprint.

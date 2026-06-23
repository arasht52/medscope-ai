/**
 * Suffix learning tips — quick pattern-recognition cues medical students
 * use to guess a drug's class from its generic name ending.
 * Static reference data per student feedback; not tied to any one drug.
 */
export const SUFFIX_TIPS = [
  {
    suffix: "-pril",
    class_fa: "مهارکننده‌های ACE",
    class_en: "ACE inhibitors",
    example_en: "Captopril, Enalapril, Lisinopril",
  },
  {
    suffix: "-sartan",
    class_fa: "بلوک‌کننده‌های گیرنده آنژیوتانسین II",
    class_en: "ARBs (Angiotensin II Receptor Blockers)",
    example_en: "Losartan, Valsartan",
  },
  {
    suffix: "-olol",
    class_fa: "بتابلوکرها",
    class_en: "Beta blockers",
    example_en: "Metoprolol, Propranolol, Atenolol",
  },
  {
    suffix: "-statin",
    class_fa: "مهارکننده‌های HMG-CoA ردوکتاز (استاتین‌ها)",
    class_en: "HMG-CoA reductase inhibitors (statins)",
    example_en: "Atorvastatin, Simvastatin",
  },
  {
    suffix: "-cillin",
    class_fa: "پنی‌سیلین‌ها",
    class_en: "Penicillins",
    example_en: "Amoxicillin, Ampicillin",
  },
  {
    suffix: "-prazole",
    class_fa: "مهارکننده‌های پمپ پروتون (PPI)",
    class_en: "Proton pump inhibitors (PPIs)",
    example_en: "Omeprazole, Pantoprazole",
    note_fa: "⚠️ Aripiprazole با وجود پسوند مشابه، آنتی‌سایکوتیکه نه PPI",
  },
  {
    suffix: "-gliflozin",
    class_fa: "مهارکننده‌های SGLT2 (دیابت)",
    class_en: "SGLT2 inhibitors",
    example_en: "Empagliflozin, Dapagliflozin",
  },
  {
    suffix: "-tide",
    class_fa: "آگونیست‌های GLP-1",
    class_en: "GLP-1 agonists",
    example_en: "Semaglutide, Liraglutide",
    note_fa: "⚠️ Octreotide برای هورمون رشد/اسهاله، نه دیابت",
  },
  {
    suffix: "-relin",
    class_fa: "آگونیست‌های GnRH",
    class_en: "GnRH agonists",
    example_en: "Leuprolide, Goserelin",
  },
  {
    suffix: "-tidine",
    class_fa: "بلوک‌کننده‌های H2",
    class_en: "H2 blockers",
    example_en: "Ranitidine, Famotidine",
  },
  {
    suffix: "-azine",
    class_fa: "آنتی‌سایکوتیک نسل اول",
    class_en: "1st-generation antipsychotics",
    example_en: "Chlorpromazine, Fluphenazine",
  },
  {
    suffix: "-apine",
    class_fa: "آنتی‌سایکوتیک نسل دوم",
    class_en: "2nd-generation antipsychotics",
    example_en: "Olanzapine, Clozapine",
  },
  {
    suffix: "-idone",
    class_fa: "آنتی‌سایکوتیک نسل دوم",
    class_en: "2nd-generation antipsychotics",
    example_en: "Risperidone, Ziprasidone",
  },
  {
    suffix: "-piprazole",
    class_fa: "آنتی‌سایکوتیک آتیپیک",
    class_en: "Atypical antipsychotic",
    example_en: "Aripiprazole",
  },
  {
    suffix: "-azole",
    class_fa: "ضدقارچ",
    class_en: "Antifungals",
    example_en: "Fluconazole, Ketoconazole",
  },
  {
    suffix: "-dazole",
    class_fa: "نیترو‌ایمیدازول (ضدآنروب/تک‌یاخته)",
    class_en: "Nitroimidazoles (antianaerobic/antiprotozoal)",
    example_en: "Metronidazole, Tinidazole",
  },
  {
    suffix: "-semide",
    class_fa: "دیورتیک لوپ",
    class_en: "Loop diuretic",
    example_en: "Furosemide",
  },
  {
    suffix: "-tanide",
    class_fa: "دیورتیک لوپ",
    class_en: "Loop diuretic",
    example_en: "Bumetanide",
    note_fa: "⚠️ Ethacrynic acid هم دیورتیک لوپه ولی پسوند مشخصی ندارد؛ در حساسیت به سولفا کاربرد دارد",
  },
  {
    suffix: "-dronate",
    class_fa: "بیس‌فسفونات",
    class_en: "Bisphosphonates",
    example_en: "Alendronate, Risedronate",
  },
];

/**
 * Returns the matching suffix tip for a drug's generic name, if any
 * (case-insensitive suffix match). Used on DrugDetail to surface a
 * relevant tip inline, without forcing the student to open the
 * reference list separately.
 */
export function matchSuffixTip(genericName) {
  if (!genericName) return null;
  const lower = genericName.toLowerCase();
  return SUFFIX_TIPS.find((tip) => lower.endsWith(tip.suffix)) || null;
}

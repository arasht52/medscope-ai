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

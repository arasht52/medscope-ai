// Study presentation applies to each educational discipline.
// This rule does not grant scientific or licensing approval to any image.
export const studyLayoutDisciplines = Object.freeze(["histology", "pharmacology", "pathology"]);

export function usesStudyLayout(subject) {
  return studyLayoutDisciplines.includes(subject);
}

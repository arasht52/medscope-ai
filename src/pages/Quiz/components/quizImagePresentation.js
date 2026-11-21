import { isImageUsable, normalizeImage } from "../../../shared/lib/imageSafety.js";

// Question-specific review of answer visibility, not scientific/image approval.
// These six stems are independently answerable from their existing text.
export const supplementaryHistologyDiagrams = Object.freeze({
  "h-epithelial-1": false,
  "h-epithelial-2": false,
  "h-connective-1": false,
  "h-muscle-1": false,
  "h-muscle-2": false,
  "h-nervous-1": true, // "Peripheral nerve" repeats the stem, not Endoneurium.
});

export function shouldShowQuizImage(question, image, hasAnswered) {
  if (!isImageUsable(normalizeImage(image))) return false;
  if (image.type !== "diagram" || hasAnswered) return true;
  return supplementaryHistologyDiagrams[question.id] === true &&
    question.topicId === "peripheral-nerve" &&
    image.url === "/images/histology/peripheral-nerve.svg";
}

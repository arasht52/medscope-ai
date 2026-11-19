import { useMemo } from "react";
import QuizPlay from "./QuizPlay";
import pathologyData from "../../../data/pathology.json";
import { buildImageIdentificationQuiz } from "../../../shared/lib/imageQuiz.js";
import { approvedPathologyQuizImages } from "../../../shared/lib/pathologyQuizImages.js";

/**
 * PathologyImageQuiz
 * Same image-first structure as HistologyImageQuiz, per the requirement
 * that Pathology's image workflow mirror Histology's exactly:
 * image → diagnosis quiz, no preceding descriptive text.
 */
export default function PathologyImageQuiz() {
  const questions = useMemo(
    () =>
      buildImageIdentificationQuiz(pathologyData.items, {
        count: 8,
        approvedImageUrls: approvedPathologyQuizImages,
        questionText: "این یافته مربوط به کدام بیماری است؟",
        idPrefix: "p-img",
      }),
    []
  );

  return (
    <QuizPlay
      title="آزمون تصویری پاتولوژی"
      questions={questions}
      resultPath="/quiz/pathology-image/result"
      homePath="/quiz"
    />
  );
}

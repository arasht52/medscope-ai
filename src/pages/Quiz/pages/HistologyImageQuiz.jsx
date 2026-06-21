import { useMemo } from "react";
import QuizPlay from "./QuizPlay";
import histologyData from "../../../data/histology.json";
import { buildImageIdentificationQuiz } from "../../../shared/lib/imageQuiz.js";

/**
 * HistologyImageQuiz
 * Image-first quiz mode: shows a tissue image, asks "این بافت کدام
 * است؟" with four tissue-name options — no descriptive text shown
 * beforehand, per student feedback on how visual identification is
 * actually practiced.
 */
export default function HistologyImageQuiz() {
  const questions = useMemo(
    () =>
      buildImageIdentificationQuiz(histologyData.items, {
        count: 8,
        questionText: "این بافت کدام است؟",
        idPrefix: "h-img",
      }),
    []
  );

  return (
    <QuizPlay
      title="آزمون تصویری بافت‌شناسی"
      questions={questions}
      resultPath="/quiz/histology-image/result"
      homePath="/quiz"
    />
  );
}

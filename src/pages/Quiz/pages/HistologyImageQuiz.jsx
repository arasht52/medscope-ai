import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader";
import Button from "../../../shared/components/Button";
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
// Retain the generator for future reactivation after image review.
function AvailableHistologyImageQuiz() {
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

export default function HistologyImageQuiz() {
  const navigate = useNavigate();
  return (
    <div className="quiz-play" dir="rtl">
      <PageHeader title="آزمون تصویری بافت‌شناسی" onBack={() => navigate("/quiz")} />
      <p role="status">آزمون تصویری بافت‌شناسی تا آماده‌شدن تصاویر مناسب و تأییدشده موقتاً در دسترس نیست.</p>
      <Button onClick={() => navigate("/quiz")}>بازگشت به آزمون‌ها</Button>
    </div>
  );
}

import { useParams } from "react-router-dom";
import QuizPlay from "./QuizPlay";
import QuizCategoryPicker from "../components/QuizCategoryPicker";
import histologyQuestions from "../data/histologyQuestions.json";

/**
 * HistologyQuiz
 * Entry point at /quiz/histology — category picker (بافت پوششی، همبند،
 * عضلانی، عصبی) instead of one combined exam, matching the same
 * per-system pattern now used by Pharmacology and Pathology.
 */
export default function HistologyQuiz() {
  return (
    <QuizCategoryPicker
      title="آزمون بافت‌شناسی"
      questions={histologyQuestions}
      basePath="/quiz/histology"
    />
  );
}

export function HistologyCategoryQuiz() {
  const { category } = useParams();
  const decoded = decodeURIComponent(category);
  const filtered = histologyQuestions.filter((q) => q.category === decoded);

  return (
    <QuizPlay
      title={`آزمون بافت‌شناسی — ${decoded}`}
      questions={filtered}
      resultPath={`/quiz/histology/${category}/result`}
      homePath="/quiz/histology"
    />
  );
}

/**
 * HistologyCombinedQuiz
 * Custom mix-and-match quiz across whatever categories the student
 * picked on the QuizCategoryPicker screen.
 */
export function HistologyCombinedQuiz() {
  const { cats } = useParams();
  const selected = decodeURIComponent(cats).split("|").filter(Boolean);
  const filtered = histologyQuestions.filter((q) => selected.includes(q.category));

  return (
    <QuizPlay
      title={`آزمون بافت‌شناسی — ترکیبی (${selected.length} موضوع)`}
      questions={filtered}
      resultPath={`/quiz/histology/custom/${cats}/result`}
      homePath="/quiz/histology"
    />
  );
}

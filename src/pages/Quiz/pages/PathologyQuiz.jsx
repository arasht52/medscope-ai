import { useParams } from "react-router-dom";
import QuizPlay from "./QuizPlay";
import QuizCategoryPicker from "../components/QuizCategoryPicker";
import pathologyQuestions from "../data/pathologyQuestions.json";

/**
 * PathologyQuiz
 * Text-based Pathology quiz, entry point at /quiz/pathology.
 *
 * Note: an earlier text-based Pathology quiz was removed because it
 * shipped as an empty stub with no real question content (see
 * quiz.routes.jsx history). This is a fresh implementation with a real
 * question bank (pathologyQuestions.json, tagged by category) and the
 * same per-system category picker used by Pharmacology, so it doesn't
 * repeat that mistake. Pathology Image Quiz (/quiz/pathology-image) is
 * a separate, unrelated feature and is unaffected.
 */
export default function PathologyQuiz() {
  return (
    <QuizCategoryPicker
      title="آزمون پاتولوژی"
      questions={pathologyQuestions}
      basePath="/quiz/pathology"
    />
  );
}

export function PathologyCategoryQuiz() {
  const { category } = useParams();
  const decoded = decodeURIComponent(category);
  const filtered = pathologyQuestions.filter((q) => q.category === decoded);

  return (
    <QuizPlay
      title={`آزمون پاتولوژی — ${decoded}`}
      questions={filtered}
      resultPath={`/quiz/pathology/${category}/result`}
      homePath="/quiz/pathology"
    />
  );
}

/**
 * PathologyCombinedQuiz
 * Custom mix-and-match quiz across whatever categories the student
 * picked on the QuizCategoryPicker screen.
 */
export function PathologyCombinedQuiz() {
  const { cats } = useParams();
  const selected = decodeURIComponent(cats).split("|").filter(Boolean);
  const filtered = pathologyQuestions.filter((q) => selected.includes(q.category));

  return (
    <QuizPlay
      title={`آزمون پاتولوژی — ترکیبی (${selected.length} موضوع)`}
      questions={filtered}
      resultPath={`/quiz/pathology/custom/${cats}/result`}
      homePath="/quiz/pathology"
    />
  );
}

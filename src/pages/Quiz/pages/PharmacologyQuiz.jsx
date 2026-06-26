import { useParams } from "react-router-dom";
import QuizPlay from "./QuizPlay";
import QuizCategoryPicker from "../components/QuizCategoryPicker";
import pharmacologyQuestions from "../data/pharmacologyQuestions.json";

/**
 * PharmacologyQuiz
 * Entry point at /quiz/pharmacology — shows a category picker (CNS,
 * Cardiovascular, GI, ...) instead of one combined exam, per the
 * project's quiz-structure rule. Selecting a category renders the
 * actual quiz for just that system at /quiz/pharmacology/:category.
 */
export default function PharmacologyQuiz() {
  return (
    <QuizCategoryPicker
      title="آزمون داروشناسی"
      questions={pharmacologyQuestions}
      basePath="/quiz/pharmacology"
    />
  );
}

export function PharmacologyCategoryQuiz() {
  const { category } = useParams();
  const decoded = decodeURIComponent(category);
  const filtered = pharmacologyQuestions.filter((q) => q.category === decoded);

  return (
    <QuizPlay
      title={`آزمون داروشناسی — ${decoded}`}
      questions={filtered}
      resultPath={`/quiz/pharmacology/${category}/result`}
      homePath="/quiz/pharmacology"
    />
  );
}

/**
 * PharmacologyCombinedQuiz
 * Custom mix-and-match quiz across whatever categories the student
 * picked on the QuizCategoryPicker screen (e.g. CNS + Endocrine
 * together), per the project's "custom topic-selection quiz" requirement.
 */
export function PharmacologyCombinedQuiz() {
  const { cats } = useParams();
  const selected = decodeURIComponent(cats).split("|").filter(Boolean);
  const filtered = pharmacologyQuestions.filter((q) => selected.includes(q.category));

  return (
    <QuizPlay
      title={`آزمون داروشناسی — ترکیبی (${selected.length} موضوع)`}
      questions={filtered}
      resultPath={`/quiz/pharmacology/custom/${cats}/result`}
      homePath="/quiz/pharmacology"
    />
  );
}

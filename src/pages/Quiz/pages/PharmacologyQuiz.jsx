import QuizPlay from "./QuizPlay";
import pharmacologyQuestions from "../data/pharmacologyQuestions.json";

/**
 * PharmacologyQuiz
 * Required page per APP_STRUCTURE.md. Delegates all logic to the
 * shared QuizPlay engine to avoid duplicating quiz-taking code.
 */
export default function PharmacologyQuiz() {
  return (
    <QuizPlay
      title="آزمون داروشناسی"
      questions={pharmacologyQuestions}
      resultPath="/quiz/pharmacology/result"
      homePath="/quiz"
    />
  );
}

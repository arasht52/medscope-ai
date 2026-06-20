import QuizPlay from "./QuizPlay";
import histologyQuestions from "../data/histologyQuestions.json";

/**
 * HistologyQuiz
 * Required page per APP_STRUCTURE.md. Delegates all logic to the
 * shared QuizPlay engine to avoid duplicating quiz-taking code.
 */
export default function HistologyQuiz() {
  return (
    <QuizPlay
      title="آزمون بافت‌شناسی"
      questions={histologyQuestions}
      resultPath="/quiz/histology/result"
      homePath="/quiz"
    />
  );
}

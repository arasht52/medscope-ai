import { useMemo, useState } from "react";
import createQuizAttempt from "./createQuizAttempt.js";

/**
 * useQuiz
 * Generic quiz engine reused by both Histology and Pharmacology quizzes.
 * Pure client-side state — no backend dependency, matches MVP (local JSON).
 *
 * @param {Array} questions - question bank for the selected quiz type
 */
export default function useQuiz(questions) {
  const [attemptQuestions, setAttemptQuestions] = useState(() => createQuizAttempt(questions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedOptionId }
  const [finished, setFinished] = useState(false);

  const total = attemptQuestions.length;
  const currentQuestion = attemptQuestions[currentIndex] ?? null;
  const isLast = currentIndex === total - 1;
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;
  const hasAnswered = selectedOptionId !== undefined;

  function selectAnswer(optionId) {
    if (!currentQuestion || hasAnswered) return; // lock answer once chosen
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  }

  function goNext() {
    if (!hasAnswered) return;
    if (isLast) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function restart() {
    setAttemptQuestions(createQuizAttempt(questions));
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
  }

  const score = useMemo(() => {
    return attemptQuestions.reduce((acc, q) => {
      return answers[q.id] !== undefined && answers[q.id] === q.correctOptionId ? acc + 1 : acc;
    }, 0);
  }, [answers, attemptQuestions]);

  const wrongAnswers = useMemo(() => {
    return attemptQuestions
      .filter((q) => answers[q.id] !== undefined && answers[q.id] !== q.correctOptionId)
      .map((q) => ({
        question: q,
        selectedOptionId: answers[q.id],
      }));
  }, [answers, attemptQuestions]);

  return {
    total,
    currentIndex,
    currentQuestion,
    isLast,
    selectedOptionId,
    hasAnswered,
    finished,
    score,
    wrongAnswers,
    answeredCount: Object.keys(answers).length,
    selectAnswer,
    goNext,
    restart,
  };
}

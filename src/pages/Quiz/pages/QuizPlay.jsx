import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader";
import ProgressBar from "../../../shared/components/ProgressBar";
import Button from "../../../shared/components/Button";
import QuestionCard from "../components/QuestionCard";
import useQuiz from "../hooks/useQuiz";
import "./QuizPlay.css";

/**
 * QuizPlay
 * Generic quiz-taking flow shared by Histology and Pharmacology quizzes,
 * to avoid duplicating question/answer/navigation logic (see useQuiz).
 *
 * @param {string} title - page title shown in the header
 * @param {Array} questions - question bank for this quiz type
 * @param {string} resultPath - route to navigate to once the quiz is finished
 * @param {string} homePath - route to go back to (QuizHome)
 */
export default function QuizPlay({ title, questions, resultPath, homePath }) {
  const navigate = useNavigate();
  const quiz = useQuiz(questions);

  useEffect(() => {
    if (quiz.finished) {
      navigate(resultPath, {
        state: { score: quiz.score, total: quiz.total, wrongAnswers: quiz.wrongAnswers },
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.finished]);

  if (quiz.finished) {
    return null;
  }

  if (!quiz.currentQuestion) {
    return (
      <div className="quiz-play">
        <PageHeader title={title} onBack={() => navigate(homePath)} />
        <p className="quiz-play__empty">سوالی برای این آزمون ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="quiz-play">
      <PageHeader title={title} onBack={() => navigate(homePath)} />
      <div className="quiz-play__progress">
        <ProgressBar value={quiz.currentIndex + (quiz.hasAnswered ? 1 : 0)} max={quiz.total} />
      </div>
      <div className="quiz-play__content">
        <QuestionCard
          question={quiz.currentQuestion}
          selectedOptionId={quiz.selectedOptionId}
          onSelect={quiz.selectAnswer}
          index={quiz.currentIndex}
          total={quiz.total}
        />
      </div>
      <div className="quiz-play__footer">
        <Button onClick={quiz.goNext} disabled={!quiz.hasAnswered} fullWidth>
          {quiz.isLast ? "مشاهده نتیجه" : "سوال بعدی"}
        </Button>
      </div>
    </div>
  );
}

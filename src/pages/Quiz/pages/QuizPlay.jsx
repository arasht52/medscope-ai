import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader";
import ProgressBar from "../../../shared/components/ProgressBar";
import Button from "../../../shared/components/Button";
import QuestionCard from "../components/QuestionCard";
import useQuiz from "../hooks/useQuiz";
import { logQuizAttempt } from "../../../shared/lib/learning";
import { topicMeta } from "../../../shared/lib/topicResolver";
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
export default function QuizPlay({ title, questions, resultPath, homePath, scrollOnAdvance = false }) {
  return (
    <QuizAttempt
      key={resultPath}
      title={title}
      questions={questions}
      resultPath={resultPath}
      homePath={homePath}
      scrollOnAdvance={scrollOnAdvance}
    />
  );
}

function QuizAttempt({ title, questions, resultPath, homePath, scrollOnAdvance }) {
  const navigate = useNavigate();
  const quiz = useQuiz(questions);

  useLayoutEffect(() => {
    if (scrollOnAdvance && quiz.currentIndex > 0) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [scrollOnAdvance, quiz.currentIndex]);

  useEffect(() => {
    if (quiz.finished) {
      // Feed results into the active-learning engine: per-topic accuracy for
      // analytics + seed/refresh spaced-repetition cards for quizzed topics.
      const wrongIds = quiz.wrongAnswers.map((w) => w.question.id);
      logQuizAttempt(questions, wrongIds, topicMeta);
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

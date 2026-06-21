import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader";
import Button from "../../../shared/components/Button";
import ScoreSummary from "../components/ScoreSummary";
import WrongAnswerList from "../components/WrongAnswerList";
import "./QuizResult.css";

/**
 * QuizResult
 * Generic result screen used after either quiz finishes.
 * Reads { score, total, wrongAnswers } from navigation state so it
 * works for both Histology and Pharmacology without duplication.
 */
export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    // Defensive fallback: user landed here directly without taking a quiz.
    return (
      <div className="quiz-result">
        <PageHeader title="نتیجه آزمون" onBack={() => navigate("/quiz")} />
        <div className="quiz-result__empty">
          <p>نتیجه‌ای برای نمایش وجود ندارد.</p>
          <Button onClick={() => navigate("/quiz")}>بازگشت به آزمون‌ها</Button>
        </div>
      </div>
    );
  }

  const { score, total, wrongAnswers } = state;
  // Derived generically so it works for every quiz type automatically
  // (histology, pharmacology, pathology, and the image-quiz variants)
  // instead of a binary histology/pharmacology check that had already
  // gone stale once Pathology was added.
  const retakePath = location.pathname.replace(/\/result$/, "");

  return (
    <div className="quiz-result">
      <PageHeader title="نتیجه آزمون" onBack={() => navigate("/quiz")} />
      <div className="quiz-result__content">
        <ScoreSummary score={score} total={total} />
        <WrongAnswerList wrongAnswers={wrongAnswers} />
      </div>
      <div className="quiz-result__footer">
        <Button variant="ghost" onClick={() => navigate("/quiz")} fullWidth>
          بازگشت به فهرست آزمون‌ها
        </Button>
        <Button onClick={() => navigate(retakePath)} fullWidth>
          تکرار آزمون
        </Button>
      </div>
    </div>
  );
}

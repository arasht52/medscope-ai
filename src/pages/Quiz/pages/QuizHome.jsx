import { useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader";
import Card from "../../../shared/components/Card";
import histologyQuestions from "../data/histologyQuestions.json";
import pharmacologyQuestions from "../data/pharmacologyQuestions.json";
import "./QuizHome.css";

/**
 * QuizHome
 * Entry point of the Quiz module. Student chooses which quiz to take.
 *
 * Note: the text-based Pathology Quiz was removed for MVP stability
 * (it shipped as an empty stub, never had real content) — see
 * quiz.routes.jsx for details. Pathology Image Quiz is unaffected.
 */
export default function QuizHome() {
  const navigate = useNavigate();

  const quizTypes = [
    {
      key: "histology",
      title: "آزمون بافت‌شناسی",
      subtitle: "Histology Quiz",
      count: histologyQuestions.length,
      path: "/quiz/histology",
      accent: "primary",
    },
    {
      key: "pharmacology",
      title: "آزمون داروشناسی",
      subtitle: "Pharmacology Quiz",
      count: pharmacologyQuestions.length,
      path: "/quiz/pharmacology",
      accent: "secondary",
    },
    {
      key: "histology-image",
      title: "🖼️ آزمون تصویری بافت‌شناسی",
      subtitle: "Histology Image Quiz",
      count: 8,
      path: "/quiz/histology-image",
      accent: "primary",
    },
    {
      key: "pathology-image",
      title: "🖼️ آزمون تصویری پاتولوژی",
      subtitle: "Pathology Image Quiz",
      count: 8,
      path: "/quiz/pathology-image",
      accent: "tertiary",
    },
  ];

  return (
    <div className="quiz-home">
      <PageHeader title="آزمون‌ها" />
      <div className="quiz-home__list">
        {quizTypes.map((q) => (
          <Card key={q.key} className="quiz-home__item" onClick={() => navigate(q.path)}>
            <div className={`quiz-home__badge quiz-home__badge--${q.accent}`}>
              {q.count} سوال
            </div>
            <div className="quiz-home__title">{q.title}</div>
            <div className="quiz-home__subtitle ltr-term">{q.subtitle}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

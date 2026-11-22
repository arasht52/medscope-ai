import { useNavigate } from "react-router-dom";
import Card from "../../../shared/components/Card";
import AcademicPageHeading from "../../../shared/components/AcademicPageHeading.jsx";
import MedicalIcon from "../../../shared/components/MedicalIcon.jsx";
import histologyQuestions from "../data/histologyQuestions.json";
import pharmacologyQuestions from "../data/pharmacologyQuestions.json";
import pathologyQuestions from "../data/pathologyQuestions.json";
import "./QuizHome.css";

/**
 * QuizHome
 * Entry point of the Quiz module. Student chooses which quiz to take.
 *
 * Pharmacology and Pathology now route to a per-system category picker
 * (see quiz.routes.jsx) rather than one combined exam, so their counts
 * here reflect the full question bank across all systems.
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
      subtitle: "Pharmacology Quiz — بر اساس سیستم",
      count: pharmacologyQuestions.length,
      path: "/quiz/pharmacology",
      accent: "secondary",
    },
    {
      key: "pathology",
      title: "آزمون پاتولوژی",
      subtitle: "Pathology Quiz — بر اساس سیستم",
      count: pathologyQuestions.length,
      path: "/quiz/pathology",
      accent: "tertiary",
    },
    {
      key: "histology-image",
      title: "آزمون تصویری بافت‌شناسی",
      subtitle: "Histology Image Quiz",
      count: 8,
      path: "/quiz/histology-image",
      accent: "primary",
    },
    {
      key: "pathology-image",
      title: "آزمون تصویری پاتولوژی",
      subtitle: "Pathology Image Quiz",
      count: 8,
      path: "/quiz/pathology-image",
      accent: "tertiary",
    },
  ];

  return (
    <div className="quiz-home academic-standard">
      <AcademicPageHeading icon="quiz" title="آزمون‌ها" />
      <div className="quiz-home__list">
        {quizTypes.filter((q) => q.key !== "histology-image").map((q) => (
          <Card key={q.key} className="quiz-home__item" onClick={() => navigate(q.path)}>
            <MedicalIcon className="quiz-home__icon" name={q.key === "pathology-image" ? "pathology" : q.key} size={48} />
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

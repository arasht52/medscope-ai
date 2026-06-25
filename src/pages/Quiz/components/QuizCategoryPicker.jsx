import { useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader";
import Card from "../../../shared/components/Card";
import "./QuizCategoryPicker.css";

/**
 * QuizCategoryPicker
 * Generic "choose a category" screen reused by both the Pharmacology
 * and Pathology text quizzes, so a student takes a focused quiz per
 * system (CNS, Cardiovascular, GI, ...) instead of one giant combined
 * exam for the whole subject — per the project's quiz-structure rule.
 *
 * @param {string} title - page header title (e.g. "آزمون داروشناسی")
 * @param {Array} questions - full question bank for this subject, each
 *   item must carry a `category` field matching the subject's own
 *   category names (so it stays in sync automatically as content grows)
 * @param {string} basePath - e.g. "/quiz/pharmacology"
 * @param {string} homePath - back target, normally "/quiz"
 */
export default function QuizCategoryPicker({ title, questions, basePath, homePath = "/quiz" }) {
  const navigate = useNavigate();

  const categories = [];
  const seen = new Map();
  for (const q of questions) {
    if (!seen.has(q.category)) {
      seen.set(q.category, categories.length);
      categories.push({ name: q.category, count: 0 });
    }
    categories[seen.get(q.category)].count += 1;
  }

  return (
    <div className="quiz-category-picker">
      <PageHeader title={title} onBack={() => navigate(homePath)} />
      <p className="quiz-category-picker__hint">یک سیستم را برای شروع آزمون انتخاب کنید.</p>
      <div className="quiz-category-picker__grid" role="list" aria-label="دسته‌بندی آزمون">
        {categories.map((cat) => (
          <Card
            key={cat.name}
            as="button"
            interactive
            className="quiz-category-picker__item"
            onClick={() => navigate(`${basePath}/${encodeURIComponent(cat.name)}`)}
          >
            <span className="quiz-category-picker__name en">{cat.name}</span>
            <span className="quiz-category-picker__count">{cat.count} سوال</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import "./QuizCategoryPicker.css";

/**
 * QuizCategoryPicker
 * "Choose a category" screen reused by the Histology, Pharmacology, and
 * Pathology text quizzes, so a student takes a focused quiz per system
 * (CNS, Cardiovascular, GI, ...) instead of one giant combined exam for
 * the whole subject — per the project's quiz-structure rule.
 *
 * Also supports building a custom combined quiz: tapping a category's
 * checkbox (without tapping the card itself) adds it to a selection;
 * once at least one is selected, a footer button starts a single quiz
 * mixing questions from just those chosen categories. Tapping the card
 * body directly still starts that one category's quiz immediately,
 * unchanged from before, so the common single-category flow stays a
 * single tap.
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
  const [selected, setSelected] = useState([]);

  const categories = [];
  const seen = new Map();
  for (const q of questions) {
    if (!seen.has(q.category)) {
      seen.set(q.category, categories.length);
      categories.push({ name: q.category, count: 0 });
    }
    categories[seen.get(q.category)].count += 1;
  }

  function toggle(name) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  function startCustomQuiz() {
    if (selected.length === 0) return;
    navigate(`${basePath}/custom/${encodeURIComponent(selected.join("|"))}`);
  }

  return (
    <div className="quiz-category-picker">
      <PageHeader title={title} onBack={() => navigate(homePath)} />
      <p className="quiz-category-picker__hint">
        برای شروع آزمون یک سیستم را لمس کنید، یا چند سیستم را با تیک علامت بزنید تا آزمون ترکیبی بسازید.
      </p>
      <div className="quiz-category-picker__grid" role="list" aria-label="دسته‌بندی آزمون">
        {categories.map((cat) => {
          const isSelected = selected.includes(cat.name);
          return (
            <Card key={cat.name} className="quiz-category-picker__item">
              <button
                type="button"
                className={`quiz-category-picker__checkbox${isSelected ? " quiz-category-picker__checkbox--checked" : ""}`}
                aria-pressed={isSelected}
                aria-label={`افزودن ${cat.name} به آزمون ترکیبی`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(cat.name);
                }}
              >
                {isSelected ? "✓" : ""}
              </button>
              <button
                type="button"
                className="quiz-category-picker__main"
                onClick={() => navigate(`${basePath}/${encodeURIComponent(cat.name)}`)}
              >
                <span className={`quiz-category-picker__name${/^[A-Za-z]/.test(cat.name) ? " en" : ""}`}>
                  {cat.name}
                </span>
                <span className="quiz-category-picker__count">{cat.count} سوال</span>
              </button>
            </Card>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="quiz-category-picker__custom-bar">
          <Button onClick={startCustomQuiz} fullWidth>
            شروع آزمون ترکیبی ({selected.length} موضوع، {categories
              .filter((c) => selected.includes(c.name))
              .reduce((sum, c) => sum + c.count, 0)} سوال)
          </Button>
        </div>
      )}
    </div>
  );
}

import histologyData from "../../data/histology.json";
import "./HistologyList.css";

/**
 * Category-first landing view for Histology — same rationale and shape
 * as Pathology's/Pharmacology's CategoryGrid: tapping a category tile
 * hands off to the filtered list instead of making the student swipe
 * through a horizontally-scrolling chip row.
 *
 * Histology categories are {id, label_fa, label_en} objects (not plain
 * strings like Pathology/Pharmacology), so counting and rendering use
 * cat.id / cat.label_fa instead of the bare string.
 */
export default function CategoryGrid({ categories, onSelectCategory }) {
  const items = histologyData.items;

  return (
    <div className="category-grid histology-list__category-grid" role="list" aria-label="دسته‌بندی بافت‌شناسی">
      {categories.map((cat) => {
        const count = items.filter((it) => it.category === cat.id).length;
        return (
          <button
            key={cat.id}
            type="button"
            className="category-grid__item"
            onClick={() => onSelectCategory(cat.id)}
          >
            <span className="category-grid__name">{cat.label_fa}</span>
            <span className="category-grid__count">{count} موضوع</span>
          </button>
        );
      })}
    </div>
  );
}

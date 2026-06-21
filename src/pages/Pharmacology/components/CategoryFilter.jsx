import "./CategoryFilter.css";

/**
 * Shared CategoryFilter — horizontally scrollable chip list.
 * Reusable by any module that needs single-select category filtering
 * (Pharmacology now; Histology can reuse later).
 *
 * Props:
 *  - categories: string[]
 *  - active: string | null   (null means no filter)
 *  - onChange: (category: string | null) => void
 *  - allLabel: string
 *  - showAll: boolean — set false to hide the "all" chip entirely
 *    (Pharmacology is now category-first, so it never shows an
 *    unfiltered "all drugs" view from this control)
 */
export default function CategoryFilter({
  categories,
  active,
  onChange,
  allLabel = "همه",
  showAll = true,
}) {
  return (
    <div className="category-filter" role="tablist" aria-label="فیلتر دسته‌بندی">
      {showAll && (
        <button
          type="button"
          role="tab"
          aria-selected={active === null}
          className={`category-filter__chip ${active === null ? "is-active" : ""}`}
          onClick={() => onChange(null)}
        >
          {allLabel}
        </button>
      )}
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={active === cat}
          className={`category-filter__chip ${active === cat ? "is-active" : ""}`}
          onClick={() => onChange(cat)}
        >
          <span className="en">{cat}</span>
        </button>
      ))}
    </div>
  );
}

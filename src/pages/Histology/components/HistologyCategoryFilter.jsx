import "./HistologyCategoryFilter.css";

/**
 * Horizontal scrollable chip filter. Reused by any module that has
 * a "category" concept (Histology now, Pharmacology drug classes later).
 *
 * props:
 *  - categories: { id: string, label_fa: string }[]
 *  - activeId: string | null   (null = "all")
 *  - onChange: (id: string | null) => void
 *  - allLabel: string
 */
export default function CategoryFilter({ categories, activeId, onChange, allLabel = "همه" }) {
  return (
    <div className="h-category-filter" role="tablist" aria-label="فیلتر دسته‌بندی">
      <button
        type="button"
        role="tab"
        aria-selected={activeId === null}
        className={`h-category-filter__chip ${activeId === null ? "is-active" : ""}`}
        onClick={() => onChange(null)}
      >
        {allLabel}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          role="tab"
          aria-selected={activeId === cat.id}
          className={`h-category-filter__chip ${activeId === cat.id ? "is-active" : ""}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label_fa}
        </button>
      ))}
    </div>
  );
}

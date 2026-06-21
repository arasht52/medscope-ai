import Card from "./components/Card.jsx";
import "./Pharmacology.css";

/**
 * The default Pharmacology landing view, per student feedback:
 * "category-first" browsing instead of one flat list of every drug.
 * Tapping a category hands off to DrugList's filtered list view.
 */
export default function CategoryGrid({ categories, drugs, onSelectCategory }) {
  return (
    <div className="category-grid" role="list" aria-label="دسته‌بندی داروها">
      {categories.map((cat) => {
        const count = drugs.filter((d) => d.category === cat).length;
        return (
          <Card
            key={cat}
            as="button"
            interactive
            className="category-grid__item"
            onClick={() => onSelectCategory(cat)}
          >
            <span className="category-grid__name en">{cat}</span>
            <span className="category-grid__count">{count} دارو</span>
          </Card>
        );
      })}
    </div>
  );
}

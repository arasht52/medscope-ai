import Card from "./components/Card.jsx";
import "./Pathology.css";

/**
 * The default Pathology landing view — mirrors Pharmacology's
 * CategoryGrid exactly (same component shape, same "category-first"
 * rationale): with 13 categories, a horizontally-scrolling chip row
 * forced the student to keep swiping past chips to find the one they
 * wanted. Tapping a category tile here hands off to PathologyList's
 * filtered list view instead.
 */
export default function CategoryGrid({ categories, items, onSelectCategory }) {
  return (
    <div className="category-grid" role="list" aria-label="دسته‌بندی پاتولوژی">
      {categories.map((cat) => {
        const count = items.filter((it) => it.category === cat).length;
        return (
          <Card
            key={cat}
            as="button"
            interactive
            className="category-grid__item"
            onClick={() => onSelectCategory(cat)}
          >
            <span className="category-grid__name en">{cat}</span>
            <span className="category-grid__count">{count} مورد</span>
          </Card>
        );
      })}
    </div>
  );
}

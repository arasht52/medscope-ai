import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import pathologyData from "../../data/pathology.json";
import PathologySearchBar from "./components/PathologySearchBar.jsx";
import PathologyCategoryFilter from "./components/PathologyCategoryFilter.jsx";
import Card from "./components/Card.jsx";
import PathologyEmptyState from "./components/PathologyEmptyState.jsx";
import "./Pathology.css";

const { items, categories } = pathologyData;

/** Normalizes text for case/diacritic-insensitive matching across fa/en. */
function normalize(text) {
  return (text || "").toString().toLowerCase().trim();
}

function matchesQuery(item, query) {
  if (!query) return true;
  const q = normalize(query);
  const haystack = [item.title_fa, item.title_en, item.category]
    .map(normalize)
    .join(" | ");
  return haystack.includes(q);
}

export default function PathologyList() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = useMemo(() => {
    return items.filter(
      (it) => (!activeCategory || it.category === activeCategory) && matchesQuery(it, query)
    );
  }, [query, activeCategory]);

  return (
    <div className="page path-page">
      <div className="page-header path-page__header">
        <h1 className="page-title">پاتولوژی</h1>
        <p className="page-subtitle">
          {items.length} مورد پاتولوژی برای مرور درسی و امتحان
        </p>
        <div className="path-page__controls">
          <PathologySearchBar
            value={query}
            onChange={setQuery}
            placeholder="جستجوی نام بیماری یا دسته‌بندی..."
          />
          <PathologyCategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <PathologyEmptyState
          icon="🔬"
          title="موردی پیدا نشد"
          description="عبارت جستجو یا فیلتر دسته‌بندی را تغییر دهید."
        />
      ) : (
        <ul className="path-list" aria-label="فهرست موارد پاتولوژی">
          {filtered.map((it) => (
            <li key={it.id}>
              <Card as={Link} to={`/pathology/${it.id}`} interactive className="path-list__card">
                <div className="path-list__row">
                  <div className="path-list__main">
                    <p className="path-list__name-fa">{it.title_fa}</p>
                    <p className="path-list__name-en en">{it.title_en}</p>
                  </div>
                  <span className="path-list__chip en">{it.category}</span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

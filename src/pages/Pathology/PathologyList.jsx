import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import pathologyData from "../../data/pathology.json";
import PathologySearchBar from "./components/PathologySearchBar.jsx";
import PathologyCategoryFilter from "./components/PathologyCategoryFilter.jsx";
import Card from "./components/Card.jsx";
import PathologyEmptyState from "./components/PathologyEmptyState.jsx";
import CategoryGrid from "./CategoryGrid.jsx";
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
  // Category/search state lives in the URL (not plain useState) so that
  // pressing the browser/in-app back button from an item's detail page
  // restores the exact filtered view (e.g. GI) the student came from,
  // instead of losing that selection on remount and falling back to the
  // unfiltered category grid. Selecting a category pushes a new history
  // entry (so back steps category -> grid, then exits), typing in search
  // replaces in place (so each keystroke doesn't spam the history stack).
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || null;
  const query = searchParams.get("q") || "";

  function setActiveCategory(cat) {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    if (cat) next.set("category", cat);
    else next.delete("category");
    setSearchParams(next);
  }

  function setQuery(q) {
    const next = new URLSearchParams(searchParams);
    if (q) next.set("q", q);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  }

  const filtered = useMemo(() => {
    return items.filter(
      (it) => (!activeCategory || it.category === activeCategory) && matchesQuery(it, query)
    );
  }, [query, activeCategory]);

  // Category-first, same rationale as Pharmacology: with 13 categories a
  // horizontally-scrolling chip row meant endless swiping to find one.
  // The flat list (via chips) is now only reachable while actively
  // searching or after picking a category from the grid below.
  const showCategoryGrid = !activeCategory && query.trim() === "";

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
          {!showCategoryGrid && (
            <PathologyCategoryFilter
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
              showAll={false}
            />
          )}
        </div>
      </div>

      {showCategoryGrid ? (
        <CategoryGrid categories={categories} items={items} onSelectCategory={setActiveCategory} />
      ) : (
        <>
          <button
            type="button"
            className="path-page__back-to-categories"
            onClick={() => {
              setActiveCategory(null);
              setQuery("");
            }}
          >
            ← بازگشت به دسته‌بندی‌ها
          </button>

          {filtered.length === 0 ? (
            <PathologyEmptyState
              icon="🔬"
              title="موردی پیدا نشد"
              description="عبارت جستجو یا فیلتر دسته‌بندی را تغییر دهید."
            />
          ) : (
            (() => {
              // Group by subcategory_fa when present (e.g. GI: مری/معده/روده).
              // Items without a subcategory fall into a single unlabeled
              // group, so other categories render exactly as before.
              const groups = [];
              const groupIndex = new Map();
              for (const it of filtered) {
                const key = it.subcategory_fa || "";
                if (!groupIndex.has(key)) {
                  groupIndex.set(key, groups.length);
                  groups.push({ key, items: [] });
                }
                groups[groupIndex.get(key)].items.push(it);
              }
              const showHeadings = groups.length > 1 || groups[0]?.key;

              return groups.map((group) => (
                <div key={group.key || "default"} className="path-list__group">
                  {showHeadings && group.key && (
                    <h2 className="path-list__group-heading">{group.key}</h2>
                  )}
                  <ul className="path-list" aria-label="فهرست موارد پاتولوژی">
                    {group.items.map((it) => (
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
                </div>
              ));
            })()
          )}
        </>
      )}
    </div>
  );
}

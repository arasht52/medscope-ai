import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import pharmacologyData from "../../data/pharmacology.json";
import SearchBar from "./components/SearchBar.jsx";
import CategoryFilter from "./components/CategoryFilter.jsx";
import Card from "./components/Card.jsx";
import EmptyState from "./components/EmptyState.jsx";
import CategoryGrid from "./CategoryGrid.jsx";
import SuffixTipsCard from "./SuffixTipsCard.jsx";
import "./Pharmacology.css";

const { drugs, categories } = pharmacologyData;

/** Normalizes text for case/diacritic-insensitive matching across fa/en. */
function normalize(text) {
  return (text || "").toString().toLowerCase().trim();
}

function matchesQuery(drug, query) {
  if (!query) return true;
  const q = normalize(query);
  const haystack = [drug.generic_name, ...(drug.brand_names || []), drug.drug_class, drug.category]
    .map(normalize)
    .join(" | ");
  return haystack.includes(q);
}

export default function DrugList() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = useMemo(() => {
    return drugs.filter(
      (d) => (!activeCategory || d.category === activeCategory) && matchesQuery(d, query)
    );
  }, [query, activeCategory]);

  // Category-first: a flat "all drugs" list is only shown while actively
  // searching. Otherwise the student must pick a category before seeing
  // any drug list — this is the whole point of the redesign, so there is
  // intentionally no "all" fallback view here anymore.
  const showCategoryGrid = !activeCategory && query.trim() === "";

  return (
    <div className="page pharma-page">
      <div className="page-header pharma-page__header">
        <h1 className="page-title">فارماکولوژی</h1>
        <p className="page-subtitle">
          {drugs.length} داروی پرکاربرد برای مرور درسی و امتحان
        </p>
        <div className="pharma-page__controls">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="جستجوی نام دارو، برند یا گروه دارویی..."
          />
          {!showCategoryGrid && (
            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
              showAll={false}
            />
          )}
        </div>
      </div>

      {showCategoryGrid ? (
        <>
          <SuffixTipsCard />
          <CategoryGrid categories={categories} drugs={drugs} onSelectCategory={setActiveCategory} />
        </>
      ) : (
        <>
          {!showCategoryGrid && (
            <button
              type="button"
              className="pharma-page__back-to-categories"
              onClick={() => {
                setActiveCategory(null);
                setQuery("");
              }}
            >
              ← بازگشت به دسته‌بندی‌ها
            </button>
          )}

          {filtered.length === 0 ? (
            <EmptyState
              icon="💊"
              title="دارویی پیدا نشد"
              description="عبارت جستجو یا فیلتر دسته‌بندی را تغییر دهید."
            />
          ) : (
            (() => {
              // Group by subcategory_fa when present (e.g. CNS: خواب‌آور/ضدتشنج).
              // Drugs without a subcategory fall into a single unlabeled
              // group, so other categories render exactly as before.
              const groups = [];
              const groupIndex = new Map();
              for (const d of filtered) {
                const key = d.subcategory_fa || "";
                if (!groupIndex.has(key)) {
                  groupIndex.set(key, groups.length);
                  groups.push({ key, drugs: [] });
                }
                groups[groupIndex.get(key)].drugs.push(d);
              }
              const showHeadings = groups.length > 1 || groups[0]?.key;

              return groups.map((group) => (
                <div key={group.key || "default"} className="drug-list__group">
                  {showHeadings && group.key && (
                    <h2 className="drug-list__group-heading">{group.key}</h2>
                  )}
                  <ul className="drug-list" aria-label="فهرست داروها">
                    {group.drugs.map((drug) => (
                      <li key={drug.id}>
                        <Card as={Link} to={`/pharmacology/${drug.id}`} interactive className="drug-list__card">
                          <div className="drug-list__row">
                            <div className="drug-list__main">
                              <p className="drug-list__name en">{drug.generic_name}</p>
                              <p className="drug-list__class">{drug.drug_class}</p>
                            </div>
                            <span className="drug-list__chip">{drug.category}</span>
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

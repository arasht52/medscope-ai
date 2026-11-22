import AcademicPageHeading from "../../shared/components/AcademicPageHeading.jsx";
import MedicalIcon from "../../shared/components/MedicalIcon.jsx";
import SearchBar from "./components/HistologySearchBar";
import CategoryFilter from "./components/HistologyCategoryFilter";
import CategoryGrid from "./CategoryGrid";
import ListItemCard from "./components/ListItemCard";
import EmptyState from "./components/HistologyEmptyState";
import { useHistologyData, getCategoryLabel } from "./useHistologyData";
import "./HistologyList.css";

/**
 * Histology List screen (APP_STRUCTURE.md → Histology → Histology List).
 *
 * Category-first, same pattern as Pathology/Pharmacology: a tile grid is
 * shown until a category is picked or a search starts, instead of asking
 * the student to swipe through a chip row to find one.
 *
 * props:
 *  - onSelectItem: (id: string) => void
 *  - onBack: (() => void) | undefined
 */
export default function HistologyList({ onSelectItem, onBack, onOpenAtlas }) {
  const { categories, query, setQuery, categoryId, setCategoryId, filteredItems } =
    useHistologyData();

  const showCategoryGrid = categoryId === null && query.trim() === "";

  return (
    <div className="histology-list academic-standard">
      <AcademicPageHeading icon="histology" title="آتلاس هیستولوژی" />
      {onBack && <button type="button" onClick={onBack}>بازگشت</button>}

      {onOpenAtlas && (
        <button type="button" className="histology-list__atlas-btn" onClick={onOpenAtlas}>
          <MedicalIcon name="histology" size={22} /> حالت اطلس تصویری — فقط مرور عکس‌ها
        </button>
      )}

      <div className="histology-list__controls">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="جستجوی بافت... (مثلاً Epithelium)"
        />
        {!showCategoryGrid && (
          <CategoryFilter categories={categories} activeId={categoryId} onChange={setCategoryId} />
        )}
      </div>

      {showCategoryGrid ? (
        <CategoryGrid categories={categories} onSelectCategory={setCategoryId} />
      ) : (
        <>
          <button
            type="button"
            className="histology-list__back-to-categories"
            onClick={() => setCategoryId(null)}
          >
            ← بازگشت به دسته‌بندی‌ها
          </button>

          <div className="histology-list__count">{filteredItems.length} مورد</div>

          {filteredItems.length === 0 ? (
            <EmptyState
              title="نتیجه‌ای یافت نشد"
              description="عبارت جستجو یا دسته‌بندی دیگری را امتحان کنید."
            />
          ) : (
            <ul className="histology-list__items">
              {filteredItems.map((item) => (
                <li key={item.id}>
                  <ListItemCard
                    titleFa={item.title_fa}
                    titleEn={item.title_en}
                    tagLabel={getCategoryLabel(item.category)}
                    imageUrl={item.image_url}
                    onClick={() => onSelectItem(item.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

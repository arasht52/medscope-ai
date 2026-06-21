import Header from "./components/Header";
import SearchBar from "./components/HistologySearchBar";
import CategoryFilter from "./components/HistologyCategoryFilter";
import ListItemCard from "./components/ListItemCard";
import EmptyState from "./components/HistologyEmptyState";
import { useHistologyData, getCategoryLabel } from "./useHistologyData";
import "./HistologyList.css";

/**
 * Histology List screen (APP_STRUCTURE.md → Histology → Histology List).
 *
 * props:
 *  - onSelectItem: (id: string) => void
 *  - onBack: (() => void) | undefined
 */
export default function HistologyList({ onSelectItem, onBack, onOpenAtlas }) {
  const { categories, query, setQuery, categoryId, setCategoryId, filteredItems } =
    useHistologyData();

  return (
    <div className="histology-list">
      <Header title="آتلاس هیستولوژی" onBack={onBack} />

      {onOpenAtlas && (
        <button type="button" className="histology-list__atlas-btn" onClick={onOpenAtlas}>
          🖼️ حالت اطلس تصویری — فقط مرور عکس‌ها
        </button>
      )}

      <div className="histology-list__controls">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="جستجوی بافت... (مثلاً Epithelium)"
        />
        <CategoryFilter categories={categories} activeId={categoryId} onChange={setCategoryId} />
      </div>

      <div className="histology-list__count">
        {filteredItems.length} مورد
      </div>

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
    </div>
  );
}

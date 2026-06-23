import { useEffect } from "react";
import Header from "./components/Header";
import Section from "./components/Section";
import ImageCarousel from "../../shared/components/ImageCarousel.jsx";
import EmptyState from "./components/HistologyEmptyState";
import FavoriteButton from "../Favorites/components/FavoriteButton";
import { FAVORITE_TYPES, markItemViewed } from "../../shared/lib/storage";
import { getHistologyItemById, getCategoryLabel } from "./useHistologyData";
import "./HistologyDetail.css";

/**
 * Histology Detail screen — image-first per student feedback: the
 * tissue's image carousel is the first thing shown, with "stain •
 * magnification" directly underneath it, before any reading material.
 * Renders every field defined for "Histology Item" in DATA_SCHEMA.md,
 * except quiz_questions (owned by the separate Quiz module, out of
 * scope for this task).
 *
 * props:
 *  - itemId: string
 *  - onBack: () => void
 */
export default function HistologyDetail({ itemId, onBack }) {
  const item = getHistologyItemById(itemId);

  // Real progress tracking: opening a detail page counts as "studied".
  useEffect(() => {
    if (item) markItemViewed("histology", item.id);
  }, [item]);

  if (!item) {
    return (
      <div className="histology-detail">
        <Header title="جزئیات بافت" onBack={onBack} />
        <EmptyState title="موردی یافت نشد" description="این مورد در دیتاست هیستولوژی موجود نیست." />
      </div>
    );
  }

  return (
    <div className="histology-detail">
      <Header title={getCategoryLabel(item.category)} onBack={onBack} />

      <div className="histology-detail__hero">
        <ImageCarousel images={item.images} stain={item.stain} alt={item.title_en} />

        <div className="histology-detail__title-row">
          <div>
            <h2 className="histology-detail__title-fa">{item.title_fa}</h2>
            <span className="histology-detail__title-en term-en">{item.title_en}</span>
          </div>
          <FavoriteButton
            item={{
              id: item.id,
              type: FAVORITE_TYPES.HISTOLOGY,
              title_en: item.title_en,
              title_fa: item.title_fa,
              subtitle: getCategoryLabel(item.category),
            }}
          />
        </div>
      </div>

      <div className="histology-detail__sections">
        <Section title="ویژگی‌های میکروسکوپی" items={item.microscopic_features} />
        <Section title="محل‌های آناتومیک" items={item.locations} />
        <Section title="نکات تشخیصی" items={item.diagnostic_clues} />
        <Section title="اشتباهات رایج" items={item.common_confusions} tone="warning" />
        <Section title="نکات امتحانی" items={item.exam_tips} />
      </div>
    </div>
  );
}

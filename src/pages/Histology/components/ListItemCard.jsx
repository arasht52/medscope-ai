import "./ListItemCard.css";
import ImageWithFallback from "../../../shared/components/ImageWithFallback";

/**
 * Generic tappable list card: thumbnail + title (fa/en) + a category tag.
 * Module-agnostic — Histology uses it today, Pharmacology can reuse it
 * later with drug_class instead of category.
 *
 * props:
 *  - titleFa, titleEn: string
 *  - tagLabel: string
 *  - imageUrl: string
 *  - onClick: () => void
 */
export default function ListItemCard({ titleFa, titleEn, tagLabel, imageUrl, onClick }) {
  return (
    <button type="button" className="list-item-card" onClick={onClick}>
      <ImageWithFallback className="list-item-card__thumb" src={imageUrl} alt={titleEn} />
      <div className="list-item-card__body">
        <h3 className="list-item-card__title-fa">{titleFa}</h3>
        <span className="list-item-card__title-en term-en">{titleEn}</span>
        {tagLabel && <span className="list-item-card__tag">{tagLabel}</span>}
      </div>
      <span className="list-item-card__chevron" aria-hidden="true">‹</span>
    </button>
  );
}

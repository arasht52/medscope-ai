import "./HistologyEmptyState.css";

/**
 * Generic empty/no-results state. Reusable wherever a search or
 * filter can return zero items.
 */
export default function EmptyState({ title = "نتیجه‌ای یافت نشد", description }) {
  return (
    <div className="h-empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
        <line x1="16.6" y1="16.6" x2="21" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <h3 className="h-empty-state__title">{title}</h3>
      {description && <p className="h-empty-state__desc">{description}</p>}
    </div>
  );
}

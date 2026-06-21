import "./PathologyEmptyState.css";

/**
 * Shared EmptyState — shown for empty search results / empty lists.
 * Reusable by any module.
 */
export default function EmptyState({ title, description, icon = "🔍" }) {
  return (
    <div className="path-empty-state" role="status">
      <div className="path-empty-state__icon" aria-hidden="true">{icon}</div>
      <p className="path-empty-state__title">{title}</p>
      {description && <p className="path-empty-state__desc">{description}</p>}
    </div>
  );
}

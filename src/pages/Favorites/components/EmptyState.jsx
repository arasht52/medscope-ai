// src/shared/components/EmptyState.jsx
//
// Generic empty state, reusable wherever a list can be empty
// (Favorites, Search results, Quiz history, etc.)

export default function EmptyState({ icon = '⭐', title, description }) {
  return (
    <div className="ms-empty-state">
      <div className="ms-empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <p className="ms-empty-state__title">{title}</p>
      {description && <p className="ms-empty-state__description">{description}</p>}
    </div>
  )
}

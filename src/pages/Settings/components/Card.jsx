import "./settingsComponents.css";

/**
 * Shared Card. Generic container used across all modules
 * (Histology, Pharmacology, Quiz, Favorites, Settings).
 */
export default function Card({ title, children }) {
  return (
    <div className="set-card">
      {title && <h3 className="set-card__title">{title}</h3>}
      <div className="set-card__body">{children}</div>
    </div>
  );
}

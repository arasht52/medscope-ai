import "./PageHeader.css";

/**
 * Shared PageHeader.
 * Used at the top of every screen (Home, Histology, Pharmacology, Quiz, ...).
 */
export default function PageHeader({ title, onBack, right = null }) {
  return (
    <header className="ms-header">
      {onBack && (
        <button className="ms-header__back" onClick={onBack} aria-label="بازگشت">
          →
        </button>
      )}
      <h1 className="ms-header__title">{title}</h1>
      <div className="ms-header__right">{right}</div>
    </header>
  );
}

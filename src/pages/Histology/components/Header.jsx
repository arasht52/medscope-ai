import "./Header.css";

/**
 * Top bar: title + optional back button. Shared across modules.
 * In RTL, "back" visually points to the right.
 *
 * props:
 *  - title: string
 *  - onBack: (() => void) | undefined  — omit to hide the back button
 */
export default function Header({ title, onBack }) {
  return (
    <header className="app-header">
      {onBack && (
        <button type="button" className="app-header__back" onClick={onBack} aria-label="بازگشت">
          ›
        </button>
      )}
      <h1 className="app-header__title">{title}</h1>
    </header>
  );
}

import "./BackButton.css";

/**
 * Shared back-navigation button — round icon button, visually identical
 * to the shared PageHeader's back button (used in Quiz/Settings) and to
 * Histology's own Header back button, so every Detail page in the app
 * looks the same regardless of which header component it uses.
 *
 * props:
 *  - onClick: () => void
 *  - label: string — used only as the accessible name (aria-label),
 *    not rendered visibly, to match the icon-only style used elsewhere.
 */
export default function BackButton({ onClick, label = "بازگشت" }) {
  return (
    <button type="button" className="back-button" onClick={onClick} aria-label={label}>
      <span aria-hidden="true">→</span>
    </button>
  );
}

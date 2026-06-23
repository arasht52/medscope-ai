import "./BackButton.css";

/**
 * Shared back-navigation button — used by Detail pages across modules
 * (Pathology, Pharmacology) so "go back" always looks and behaves the
 * same way instead of each module inventing its own plain text link.
 *
 * props:
 *  - onClick: () => void
 *  - label: string — defaults to a generic "بازگشت"; pass something
 *    more specific (e.g. "فهرست پاتولوژی") where it adds clarity.
 */
export default function BackButton({ onClick, label = "بازگشت" }) {
  return (
    <button type="button" className="back-button" onClick={onClick} aria-label={label}>
      <span aria-hidden="true">←</span> {label}
    </button>
  );
}

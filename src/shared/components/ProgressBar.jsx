import "./ProgressBar.css";

/**
 * Shared ProgressBar.
 * value/max -> percentage fill. Reusable beyond Quiz (e.g. study progress).
 */
export default function ProgressBar({ value, max, label }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="ms-progress">
      {label && <div className="ms-progress__label">{label}</div>}
      <div
        className="ms-progress__track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div className="ms-progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

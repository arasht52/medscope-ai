import "./Disclaimer.css";

/**
 * Shared Disclaimer — required per MEDICAL_SAFETY_RULES.md on pharmacology pages.
 * "This content is for medical education only and must not be used for
 * diagnosis, prescribing, or treatment decisions."
 */
export default function Disclaimer() {
  return (
    <div className="disclaimer" role="note">
      <span className="disclaimer__icon" aria-hidden="true">⚠️</span>
      <p className="disclaimer__text">
        این محتوا صرفاً برای{" "}
        <strong>آموزش پزشکی</strong> است و نباید برای تشخیص، تجویز یا تصمیم‌گیری
        درمانی واقعی استفاده شود.
      </p>
    </div>
  );
}

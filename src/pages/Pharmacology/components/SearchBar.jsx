import "./SearchBar.css";

/**
 * Shared SearchBar — used across modules (Pharmacology, future Histology, etc.)
 *
 * Props:
 *  - value: string
 *  - onChange: (value: string) => void
 *  - placeholder: string
 */
export default function SearchBar({ value, onChange, placeholder = "جستجو..." }) {
  return (
    <div className="search-bar">
      <svg
        className="search-bar__icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        inputMode="search"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onChange("")}
          aria-label="پاک‌کردن جستجو"
        >
          ×
        </button>
      )}
    </div>
  );
}

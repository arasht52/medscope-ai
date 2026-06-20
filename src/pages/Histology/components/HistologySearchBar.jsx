import "./HistologySearchBar.css";

/**
 * Generic search input. Reused across modules (Histology now,
 * Pharmacology / others later) — no module-specific logic here.
 *
 * props:
 *  - value: string
 *  - onChange: (value: string) => void
 *  - placeholder: string
 */
export default function SearchBar({ value, onChange, placeholder = "جستجو..." }) {
  return (
    <div className="h-search-bar">
      <svg
        className="h-search-bar__icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <line x1="16.6" y1="16.6" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        className="h-search-bar__input"
        type="search"
        inputMode="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          className="h-search-bar__clear"
          onClick={() => onChange("")}
          aria-label="پاک کردن جستجو"
        >
          ×
        </button>
      )}
    </div>
  );
}

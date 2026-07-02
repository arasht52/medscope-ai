import "./RouteFallback.css";

/**
 * Minimal loading state shown while a code-split route chunk loads.
 * Kept tiny and dependency-free so it stays in the main bundle.
 */
export default function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback__spinner" aria-hidden="true" />
      <span className="route-fallback__text">در حال بارگذاری…</span>
    </div>
  );
}

import { useState } from "react";
import "./ImageWithFallback.css";

/**
 * Renders an <img>, but swaps to a neutral placeholder block if the
 * source 404s or hasn't been added yet. MVP datasets reference image
 * paths that aren't all shot yet, so this keeps the UI calm instead
 * of showing a broken-image icon.
 */
export default function ImageWithFallback({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={alt || "بدون تصویر"}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8.5" cy="10" r="1.6" fill="currentColor" />
          <path d="M5 17l4.5-4.5a1.5 1.5 0 0 1 2.1 0L15 16l1.2-1.2a1.5 1.5 0 0 1 2.1 0L21 17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

import { useMemo, useRef, useState } from "react";
import {
  isImageUsable,
  normalizeImage,
  MAGNIFICATION_LABELS_FA,
  IMAGE_TYPE_LABELS_FA,
  PLACEHOLDER_TEXT_FA,
  PLACEHOLDER_TEXT_EN,
} from "../lib/imageSafety";
import "./ImageViewer.css";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const STEP = 0.5;

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * ImageViewer — mobile-first viewer for a single histology/pathology image.
 *
 * Shows the educational placeholder unless the image is verified open-license
 * (see imageSafety.isImageUsable). When usable, supports pinch/button zoom,
 * drag pan, a toggleable label overlay, magnification/stain/type badges, and
 * a source + license line. Persian captions run RTL; English medical terms
 * (stain codes, source names) are preserved left-to-right.
 *
 * Props:
 *  - image: the item's `image` object (or null)
 *  - titleEn: string — used as an accessible fallback label
 *  - compact: boolean — smaller framing (used inside quizzes)
 */
export default function ImageViewer({ image, titleEn = "", compact = false }) {
  const img = useMemo(() => normalizeImage(image), [image]);
  const usable = isImageUsable(img);

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [activeLabel, setActiveLabel] = useState(null);

  const frameRef = useRef(null);
  const pointers = useRef(new Map());
  const pinchStart = useRef(null);
  const panStart = useRef(null);

  function resetView() {
    setScale(1);
    setTx(0);
    setTy(0);
  }

  function zoomBy(delta) {
    setScale((s) => {
      const next = clamp(+(s + delta).toFixed(2), MIN_SCALE, MAX_SCALE);
      if (next === MIN_SCALE) {
        setTx(0);
        setTy(0);
      }
      return next;
    });
  }

  // ---- Pointer-based pinch-zoom + pan (no external deps) ----
  function onPointerDown(e) {
    if (!usable) return;
    frameRef.current?.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: distance(a, b), scale };
      panStart.current = null;
    } else if (pointers.current.size === 1 && scale > 1) {
      panStart.current = { x: e.clientX, y: e.clientY, tx, ty };
    }
  }

  function onPointerMove(e) {
    if (!usable || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const ratio = distance(a, b) / (pinchStart.current.dist || 1);
      setScale(clamp(+(pinchStart.current.scale * ratio).toFixed(2), MIN_SCALE, MAX_SCALE));
    } else if (pointers.current.size === 1 && panStart.current && scale > 1) {
      const bound = 60 * scale;
      setTx(clamp(panStart.current.tx + (e.clientX - panStart.current.x), -bound, bound));
      setTy(clamp(panStart.current.ty + (e.clientY - panStart.current.y), -bound, bound));
    }
  }

  function onPointerUp(e) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) panStart.current = null;
    if (scale <= MIN_SCALE) {
      setTx(0);
      setTy(0);
    }
  }

  // ---------- Placeholder (safety fallback) ----------
  if (!usable) {
    return (
      <div className={`image-viewer image-viewer--placeholder ${compact ? "is-compact" : ""}`}>
        <div className="image-viewer__placeholder" role="img" aria-label={PLACEHOLDER_TEXT_FA}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="8.5" cy="10" r="1.6" fill="currentColor" />
            <path d="M5 17l4.5-4.5a1.5 1.5 0 0 1 2.1 0L15 16l1.2-1.2a1.5 1.5 0 0 1 2.1 0L21 17.5"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="image-viewer__placeholder-fa">{PLACEHOLDER_TEXT_FA}</p>
          <p className="image-viewer__placeholder-en" dir="ltr">{PLACEHOLDER_TEXT_EN}</p>
        </div>
      </div>
    );
  }

  const magLabel = img.magnification ? MAGNIFICATION_LABELS_FA[img.magnification] : null;
  const typeLabel = IMAGE_TYPE_LABELS_FA[img.type] || null;
  const hasLabels = img.labels.length > 0;
  const attributionLine = [img.source, img.attribution].filter(Boolean).join(" — ");

  return (
    <div className={`image-viewer ${compact ? "is-compact" : ""}`}>
      {/* Badges */}
      <div className="image-viewer__badges">
        {typeLabel && <span className="image-viewer__badge image-viewer__badge--type">{typeLabel}</span>}
        {magLabel && <span className="image-viewer__badge">{magLabel}</span>}
        {img.stain && (
          <span className="image-viewer__badge image-viewer__badge--stain">
            رنگ‌آمیزی <span className="ltr-term" dir="ltr">{img.stain}</span>
          </span>
        )}
      </div>

      {/* Zoom / pan frame */}
      <div
        ref={frameRef}
        className="image-viewer__frame"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => (scale > 1 ? resetView() : setScale(2))}
        style={{ cursor: scale > 1 ? "grab" : "default" }}
      >
        <div
          className="image-viewer__stage"
          style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
        >
          <img
            className="image-viewer__img"
            src={img.url}
            alt={img.alt || titleEn}
            draggable={false}
          />

          {showLabels && hasLabels && (
            <div className="image-viewer__labels" aria-hidden={false}>
              {img.labels.map((lb, i) => (
                <button
                  key={`${lb.name}-${i}`}
                  type="button"
                  className={`image-viewer__label ${activeLabel === i ? "is-active" : ""}`}
                  style={{ left: `${lb.x}%`, top: `${lb.y}%`, transform: `scale(${1 / scale})` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLabel(activeLabel === i ? null : i);
                  }}
                  aria-label={lb.name}
                >
                  <span className="image-viewer__label-dot">{i + 1}</span>
                  {activeLabel === i && (
                    <span className="image-viewer__label-tip">
                      <strong className="ltr-term" dir="ltr">{lb.name}</strong>
                      {lb.description && <span>{lb.description}</span>}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="image-viewer__controls">
        <div className="image-viewer__zoom">
          <button type="button" onClick={() => zoomBy(-STEP)} aria-label="کوچک‌نمایی" disabled={scale <= MIN_SCALE}>−</button>
          <button type="button" onClick={resetView} aria-label="بازنشانی بزرگ‌نمایی">۱:۱</button>
          <button type="button" onClick={() => zoomBy(STEP)} aria-label="بزرگ‌نمایی" disabled={scale >= MAX_SCALE}>+</button>
        </div>
        {hasLabels && (
          <button
            type="button"
            className={`image-viewer__labels-toggle ${showLabels ? "is-on" : ""}`}
            onClick={() => setShowLabels((v) => !v)}
            aria-pressed={showLabels}
          >
            {showLabels ? "پنهان‌کردن برچسب‌ها" : "نمایش برچسب‌ها"}
          </button>
        )}
      </div>

      {/* Caption + license */}
      {img.alt && <p className="image-viewer__caption">{img.alt}</p>}
      {(attributionLine || img.license) && (
        <p className="image-viewer__license">
          {attributionLine && <span className="image-viewer__source" dir="ltr">{attributionLine}</span>}
          {img.license && <span className="image-viewer__license-tag" dir="ltr">{img.license}</span>}
        </p>
      )}
    </div>
  );
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

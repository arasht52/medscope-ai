import { useState, useRef } from "react";
import ImageWithFallback from "./ImageWithFallback.jsx";
import "./ImageCarousel.css";

/**
 * ImageCarousel
 * Swipeable, multi-image viewer. Built for Histology's image-first
 * detail page (and reusable anywhere a tissue/condition has more than
 * one reference image).
 *
 * Props:
 *  - images: Array<{ url, caption, magnification }>
 *  - stain: string | undefined — shown as "stain • magnification" under
 *    the image (the exact format requested: "H&E • 400x")
 *  - alt: string — accessible label for the image (e.g. English title)
 */
export default function ImageCarousel({ images, stain, alt }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  if (!images || images.length === 0) {
    return <ImageWithFallback className="image-carousel__image" src={null} alt={alt} />;
  }

  const current = images[index];
  const hasMultiple = images.length > 1;

  function goTo(i) {
    setIndex(((i % images.length) + images.length) % images.length);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 40;
    if (delta > SWIPE_THRESHOLD) {
      // swiped right -> previous image
      goTo(index - 1);
    } else if (delta < -SWIPE_THRESHOLD) {
      // swiped left -> next image
      goTo(index + 1);
    }
    touchStartX.current = null;
  }

  const metaLine = [stain, current.magnification].filter(Boolean).join(" • ");

  return (
    <div className="image-carousel">
      <div
        className="image-carousel__viewport"
        onTouchStart={hasMultiple ? handleTouchStart : undefined}
        onTouchEnd={hasMultiple ? handleTouchEnd : undefined}
      >
        <ImageWithFallback
          key={current.url}
          className="image-carousel__image"
          src={current.url}
          alt={alt}
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              className="image-carousel__arrow image-carousel__arrow--prev"
              onClick={() => goTo(index - 1)}
              aria-label="تصویر قبلی"
            >
              ›
            </button>
            <button
              type="button"
              className="image-carousel__arrow image-carousel__arrow--next"
              onClick={() => goTo(index + 1)}
              aria-label="تصویر بعدی"
            >
              ‹
            </button>
          </>
        )}
      </div>

      {metaLine && <p className="image-carousel__meta">{metaLine}</p>}
      {current.caption && <p className="image-carousel__caption">{current.caption}</p>}

      {hasMultiple && (
        <div className="image-carousel__dots" role="tablist" aria-label="تصاویر">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`تصویر ${i + 1} از ${images.length}`}
              className={`image-carousel__dot ${i === index ? "is-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import histologyData from "../../data/histology.json";
import ImageWithFallback from "../../shared/components/ImageWithFallback.jsx";
import "./HistologyAtlas.css";

// Flatten every tissue's images into one continuous swipeable sequence —
// the whole point of Atlas mode is browsing images quickly without
// reading the long descriptive sections from the regular detail page.
const SLIDES = histologyData.items.flatMap((item) =>
  item.images.map((img) => ({
    itemId: item.id,
    title_fa: item.title_fa,
    title_en: item.title_en,
    stain: item.stain,
    ...img,
  }))
);

export default function HistologyAtlas() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const slide = SLIDES[index];
  const metaLine = [slide.stain, slide.magnification].filter(Boolean).join(" • ");

  function goTo(i) {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) goTo(index - 1);
    else if (delta < -40) goTo(index + 1);
    touchStartX.current = null;
  }

  return (
    <div className="histology-atlas" dir="rtl">
      <header className="histology-atlas__header">
        <button
          type="button"
          className="histology-atlas__exit"
          onClick={() => navigate("/histology")}
          aria-label="بازگشت به فهرست بافت‌شناسی"
        >
          ✕
        </button>
        <span className="histology-atlas__counter">
          {index + 1} / {SLIDES.length}
        </span>
      </header>

      <div
        className="histology-atlas__stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ImageWithFallback
          key={slide.url}
          className="histology-atlas__image"
          src={slide.url}
          alt={slide.title_en}
        />
      </div>

      <div className="histology-atlas__footer">
        <p className="histology-atlas__title-fa">{slide.title_fa}</p>
        <p className="histology-atlas__title-en en">{slide.title_en}</p>
        {metaLine && <p className="histology-atlas__meta">{metaLine}</p>}

        <button
          type="button"
          className="histology-atlas__detail-link"
          onClick={() => navigate(`/histology/${slide.itemId}`)}
        >
          مشاهده توضیحات کامل ←
        </button>
      </div>

      <div className="histology-atlas__nav">
        <button
          type="button"
          className="histology-atlas__nav-btn"
          onClick={() => goTo(index - 1)}
          aria-label="تصویر قبلی"
        >
          ›
        </button>
        <button
          type="button"
          className="histology-atlas__nav-btn"
          onClick={() => goTo(index + 1)}
          aria-label="تصویر بعدی"
        >
          ‹
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Section from "./components/Section";
import ImageViewer from "../../shared/components/ImageViewer.jsx";
import EmptyState from "./components/HistologyEmptyState";
import FavoriteButton from "../Favorites/components/FavoriteButton";
import { FAVORITE_TYPES, markItemViewed } from "../../shared/lib/storage";
import { recordStudy } from "../../shared/lib/learning";
import { getHistologyItemById, getCategoryLabel } from "./useHistologyData";
import "./HistologyDetail.css";

/**
 * Histology Detail screen — image-first per student feedback: the
 * tissue's image carousel is the first thing shown, with "stain •
 * magnification" directly underneath it, before any reading material.
 * Renders every field defined for "Histology Item" in DATA_SCHEMA.md,
 * except quiz_questions (owned by the separate Quiz module, out of
 * scope for this task).
 *
 * props:
 *  - itemId: string
 *  - onBack: () => void
 */
export default function HistologyDetail({ itemId, onBack }) {
  const item = getHistologyItemById(itemId);

  // Real progress tracking: opening a detail page counts as "studied".
  useEffect(() => {
    if (item) markItemViewed("histology", item.id);
    if (item) recordStudy("histology", item.id, { title_fa: item.title_fa, title_en: item.title_en, subtitle: item.category });
  }, [item]);

  if (!item) {
    return (
      <div className="histology-detail">
        <Header title="جزئیات بافت" onBack={onBack} />
        <EmptyState title="موردی یافت نشد" description="این مورد در دیتاست هیستولوژی موجود نیست." />
      </div>
    );
  }

  return (
    <div className="histology-detail">
      <Header title={getCategoryLabel(item.category)} onBack={onBack} />

      <div className="histology-detail__hero">
        <ImageViewer image={item.image} titleEn={item.title_en} />

        <div className="histology-detail__title-row">
          <div>
            <h2 className="histology-detail__title-fa">{item.title_fa}</h2>
            <span className="histology-detail__title-en term-en">{item.title_en}</span>
          </div>
          <FavoriteButton
            item={{
              id: item.id,
              type: FAVORITE_TYPES.HISTOLOGY,
              title_en: item.title_en,
              title_fa: item.title_fa,
              subtitle: getCategoryLabel(item.category),
            }}
          />
        </div>
      </div>

      <div className="histology-detail__sections">
        {/* Pedagogical module fields (Phase 1) — each renders only when the
            item provides it, so existing items are unaffected. */}
        <Section title="اهداف یادگیری" items={item.learning_objectives} />
        <Section title="مرور کلی بافت" items={toList(item.tissue_overview)} />
        <Section title="راهبرد شناسایی" items={item.identification_strategy} />
        <Section title="شناسایی گام‌به‌گام زیر میکروسکوپ" items={item.recognition_steps} />

        <Section title="ویژگی‌های میکروسکوپی" items={item.microscopic_features} />
        <Section title="یافته‌های بزرگ‌نمایی کم" items={item.low_power_findings} />
        <Section title="یافته‌های بزرگ‌نمایی زیاد" items={item.high_power_findings} />
        <Section title="نشانه‌های تشخیصی کلیدی" items={item.diagnostic_landmarks} />
        <Section title="محل‌های آناتومیک" items={item.locations} />
        <Section title="نکات تشخیصی" items={item.diagnostic_clues} />

        <Section title="ساختارهایی که معمولاً از قلم می‌افتند" items={item.structures_missed} tone="warning" />
        <Section title="اشتباهات رایج" items={item.common_confusions} tone="warning" />
        <Section title="تله‌های امتحانی" items={item.exam_traps} tone="warning" />
        <Section title="افتراق شناسایی" items={item.differential_identification} />

        <Section title="اهمیت بالینی" items={item.clinical_relevance} />
        <Section title="یادیارها (Mnemonics)" items={item.mnemonics} />
        <Section title="نکات امتحانی" items={item.exam_tips} />

        {Array.isArray(item.self_check) && item.self_check.length > 0 && (
          <section className="section">
            <h2 className="section__title">خودآزمایی</h2>
            <div className="histology-detail__selfcheck">
              {item.self_check.map((qa, i) => (
                <SelfCheckItem key={i} q={qa.q} a={qa.a} />
              ))}
            </div>
          </section>
        )}

        {item.summary && (
          <section className="section section--summary">
            <h2 className="section__title">جمع‌بندی سریع</h2>
            <p className="histology-detail__summary">{item.summary}</p>
          </section>
        )}
      </div>
    </div>
  );
}

/** Accepts a string or string[] and returns a clean string[] for <Section>. */
function toList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

/** Collapsible self-check Q&A used for active recall on the detail page. */
function SelfCheckItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="histology-detail__selfcheck-item">
      <button
        type="button"
        className="histology-detail__selfcheck-q"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="histology-detail__selfcheck-a">{a}</p>}
    </div>
  );
}

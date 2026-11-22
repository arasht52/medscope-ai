import { usesStudyLayout } from "../../shared/lib/studyLayoutScope.js";
import DisciplinePilot from "../../shared/components/DisciplinePilot.jsx";
import { useEffect } from "react";
import Header from "./components/Header";
import { StudyHeader, StudySection, StudyQuizLink } from "../../shared/components/StudyExperience.jsx";
import ImageViewer from "../../shared/components/ImageViewer.jsx";
import EmptyState from "./components/HistologyEmptyState";
import { markItemViewed } from "../../shared/lib/storage";
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
      <div className="histology-detail academic-standard">
        <Header title="جزئیات بافت" onBack={onBack} />
        <EmptyState title="موردی یافت نشد" description="این مورد در دیتاست هیستولوژی موجود نیست." />
      </div>
    );
  }

  return <HistologyStudy item={item} />;
}

const histologySections = [
  ["learning_objectives", "اهداف یادگیری"], ["tissue_overview", "مرور کلی بافت"],
  ["identification_strategy", "راهبرد شناسایی"], ["recognition_steps", "شناسایی گام‌به‌گام زیر میکروسکوپ"],
  ["microscopic_features", "ویژگی‌های میکروسکوپی"], ["low_power_findings", "یافته‌های بزرگ‌نمایی کم"],
  ["high_power_findings", "یافته‌های بزرگ‌نمایی زیاد"], ["diagnostic_landmarks", "نشانه‌های تشخیصی کلیدی"],
  ["locations", "محل‌های آناتومیک"], ["diagnostic_clues", "نکات تشخیصی"],
  ["structures_missed", "ساختارهایی که معمولاً از قلم می‌افتند"], ["common_confusions", "اشتباهات رایج"],
  ["exam_traps", "تله‌های امتحانی"], ["differential_identification", "افتراق شناسایی"],
  ["clinical_relevance", "اهمیت بالینی"], ["mnemonics", "یادیارها (Mnemonics)"],
];

export function HistologyStudy({ item }) {
  const category = getCategoryLabel(item.category);
  if (usesStudyLayout("histology", item.id)) return <DisciplinePilot item={item} discipline="histology" category={category} />;
  return <main className="academic-ui academic-topic academic-shared-study" dir="rtl" lang="fa">
    <StudyHeader subject="بافت‌شناسی" subjectPath="/histology" category={category} titleFa={item.title_fa} titleEn={item.title_en}
      favorite={{ id: item.id, type: "histology", title_fa: item.title_fa, title_en: item.title_en, subtitle: category }} />
    <section className="academic-image academic-study-image" aria-label="تصویر آموزشی بافت"><ImageViewer image={item.image} titleEn={item.title_en} neutralSourceLabel enlargeLabel="بزرگ‌نمایی تصویر" /></section>
    <div className="academic-reading">{histologySections.map(([key, title]) => <StudySection key={key} title={title} value={item[key]} expanded={key === "microscopic_features"} />)}
      <StudySection title="نکات امتحانی" value={item.exam_tips} exam />
      {item.self_check?.length > 0 && <StudySection title="خودآزمایی">{item.self_check.map((qa, i) => <details key={i} className="academic-self-check"><summary>{qa.q}</summary><p>{qa.a}</p></details>)}</StudySection>}
      <StudySection title="جمع‌بندی سریع" value={item.summary} expanded />
    </div>
    <StudyQuizLink to={`/quiz/histology/${encodeURIComponent(category)}`} category={category} />
  </main>;
}

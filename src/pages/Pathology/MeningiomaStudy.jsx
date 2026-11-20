import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, BookOpen, Network, GraduationCap } from "lucide-react";
import MedicalIcon from "../../shared/components/MedicalIcon.jsx";
import ImageViewer from "../../shared/components/ImageViewer.jsx";
import FavoriteButton from "../Favorites/components/FavoriteButton";
import PathologyMindMap from "./PathologyMindMap.jsx";
import "../../shared/components/AcademicPrototype.css";

const sections = [
  ["etiology", "علل و منشأ"],
  ["gross_features", "یافته‌های ماکروسکوپی"],
  ["microscopic_features", "یافته‌های میکروسکوپی"],
  ["clinical_features", "تظاهرات بالینی"],
  ["diagnostic_clues", "نکات تشخیصی"],
  ["differential_diagnosis", "تشخیص افتراقی"],
  ["complications", "عوارض"],
  ["common_confusions", "اشتباهات رایج"],
  ["exam_trap", "تلهٔ امتحانی"],
];

// Presentational emphasis only: concatenating these pieces reproduces the input.
function MedicalText({ text }) {
  return String(text).split(/([A-Za-z][A-Za-z0-9]*(?:[ -][A-Za-z0-9]+)*|پساموما(?:یی)?|چرخشی|دورا)/g)
    .map((part, i) => /[A-Za-z]/.test(part)
      ? <bdi key={i} dir="ltr" className="academic-term">{part}</bdi>
      : /^(پساموما(?:یی)?|چرخشی|دورا)$/.test(part)
        ? <strong key={i} className="academic-term">{part}</strong> : part);
}

function MedicalParagraphs({ text }) {
  return <div className="academic-prose">{String(text).split(/(?<=\.) (?=[\u0600-\u06ff])/).map((sentence, i) =>
    <p key={i}><MedicalText text={sentence} />{" "}</p>)}</div>;
}

export default function MeningiomaStudy({ item, view, onViewChange }) {
  // Verbatim excerpt, not newly authored medical content. Full text is below.
  const overview = (item.definition || item.pathogenesis || "").split(/(?<=\.)\s/)[0];
  return (
    <main className="academic-topic academic-ui" dir="rtl" lang="fa">
      <header className="academic-topic__toolbar">
        <Link to="/pathology" className="academic-back"><ArrowRight size={18} />پاتولوژی</Link>
        <span className="academic-small-brand" dir="ltr">MedScope</span>
        <FavoriteButton icon={<MedicalIcon name="favorites" size={22} />} item={{ id: item.id, type: "pathology", title_fa: item.title_fa, title_en: item.title_en, subtitle: item.category }} />
      </header>
      <div className="academic-topic__heading">
        <p className="academic-eyebrow">یادداشت آموزشی <span aria-hidden="true">/</span> <bdi dir="ltr">{item.category}</bdi></p>
        <h1>{item.title_fa}</h1><p className="academic-topic__english" dir="ltr">{item.title_en}</p>
      </div>
      <div className="academic-tabs" role="tablist" aria-label="نمای مطالعه">
        <button role="tab" id="academic-notes-tab" aria-controls="academic-notes" aria-selected={view === "notes"} onClick={() => onViewChange("notes")}><BookOpen size={18} />یادداشت درس</button>
        <button role="tab" id="academic-map-tab" aria-controls="academic-map" aria-selected={view === "mindmap"} onClick={() => onViewChange("mindmap")}><Network size={18} />نقشهٔ ذهنی</button>
      </div>
      {view === "mindmap" ? <div id="academic-map" role="tabpanel" aria-labelledby="academic-map-tab"><PathologyMindMap item={item} /></div> :
        <div id="academic-notes" role="tabpanel" aria-labelledby="academic-notes-tab">
          {overview && <section className="academic-overview"><h2>در یک نگاه</h2><p><MedicalText text={overview} /></p></section>}
          <section className="academic-image" aria-labelledby="academic-image-title"><div className="academic-section-heading"><h2 id="academic-image-title"><MedicalIcon name="histology" size={22} />نمای بافت‌شناسی</h2><span>برای بررسی دقیق‌تر</span></div><ImageViewer image={item.image} titleEn={item.title_en} neutralSourceLabel enlargeLabel="بزرگ‌نمایی تصویر" /></section>
          <nav className="academic-jump" aria-label="بخش‌های درس"><a href="#academic-microscopic_features">مورفولوژی</a><a href="#academic-diagnostic_clues">نکات تشخیصی</a><a href="#academic-exam">نکات امتحانی</a></nav>
          <div className="academic-reading">
            {item.definition && <section className="academic-reading-section"><h2>تعریف</h2><MedicalParagraphs text={item.definition} /></section>}
            {item.pathogenesis && <details className="academic-reading-section"><summary>پاتوژنز</summary><MedicalParagraphs text={item.pathogenesis} /></details>}
            {sections.map(([key, label]) => Array.isArray(item[key]) && item[key].length > 0 && <details key={key} id={`academic-${key}`} className="academic-reading-section" open={key === "microscopic_features"}><summary>{label}</summary><ul>{item[key].map((line, i) => <li key={i}><MedicalText text={line} /></li>)}</ul></details>)}
            {item.exam_tips?.length > 0 && <section id="academic-exam" className="academic-exam"><h2><GraduationCap size={21} />برای مرور امتحان</h2><ul>{item.exam_tips.map((line, i) => <li key={i}><MedicalText text={line} /></li>)}</ul></section>}
            {item.mnemonic && <section className="academic-reading-section"><h2>یادیار</h2><MedicalParagraphs text={item.mnemonic} /></section>}
            {item.quick_summary && <section className="academic-reading-section"><h2>جمع‌بندی سریع</h2><MedicalParagraphs text={item.quick_summary} /></section>}
          </div>
          <aside className="academic-study-next"><div><span className="academic-eyebrow">از مطالعه به بازیابی</span><h2>آموخته‌هایت را مرور کن.</h2><p>آزمون دستهٔ <bdi dir="ltr">{item.category}</bdi>؛ شامل مباحث دیگر این دسته.</p></div><Link className="academic-primary" to={`/quiz/pathology/${encodeURIComponent(item.category)}`}>رفتن به آزمون <ArrowLeft size={18} /></Link></aside>
        </div>}
    </main>
  );
}

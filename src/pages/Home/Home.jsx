import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, CalendarCheck, BookOpen, ArrowLeft } from "lucide-react";
import { getDueCount, getEvents } from "../../shared/lib/learning.js";

import MedicalIcon from "../../shared/components/MedicalIcon.jsx";
import { resolveTopic } from "../../shared/lib/topicResolver.js";
import "../../shared/components/AcademicPrototype.css";
import SearchResults from "./components/SearchResults.jsx";
import { useProgress } from "./hooks/useProgress.js";
import { toFaDigits } from "./utils/toFaDigits.js";

import histologyData from "../../data/histology.json";
import pharmacologyData from "../../data/pharmacology.json";
import pathologyData from "../../data/pathology.json";

// Per QA fix: totals must reflect the actual content available, not a
// hardcoded MVP-curriculum target — otherwise the count shown on the
// module cards can silently drift from what's really in the data files.
const HISTOLOGY_TOTAL = histologyData.items.length;
const PHARMACOLOGY_TOTAL = pharmacologyData.drugs.length;
const PATHOLOGY_TOTAL = pathologyData.items.length;

/**
 * The real Histology module stores items as { categories, items } with a
 * category *id* (e.g. "connective") rather than a Persian label directly
 * on each item, and Pharmacology drugs have no Persian display name
 * (per DATA_SCHEMA.md — only generic_name in English). Both adaptations
 * below are integration glue only: no module's own files were changed.
 */
/** Normalizes text for case/diacritic-insensitive matching across fa/en. */
function normalize(text) {
  return (text || "").toString().toLowerCase().trim();
}

/**
 * Real cross-module search (replaces the old "visual only" search bar).
 * Matches against title_fa/title_en (+ brand names for drugs) across all
 * three datasets and returns a flat, capped list ready to render.
 */
function searchAllModules(query) {
  const q = normalize(query);
  if (!q) return [];

  const fromHistology = histologyData.items
    .filter((i) => normalize(i.title_fa).includes(q) || normalize(i.title_en).includes(q))
    .map((i) => ({ id: i.id, type: "histology", title_fa: i.title_fa, title_en: i.title_en }));

  const fromPharmacology = pharmacologyData.drugs
    .filter(
      (d) =>
        normalize(d.generic_name).includes(q) ||
        (d.brand_names || []).some((b) => normalize(b).includes(q))
    )
    .map((d) => ({ id: d.id, type: "pharmacology", title_fa: d.generic_name, title_en: d.generic_name }));

  const fromPathology = pathologyData.items
    .filter((p) => normalize(p.title_fa).includes(q) || normalize(p.title_en).includes(q))
    .map((p) => ({ id: p.id, type: "pathology", title_fa: p.title_fa, title_en: p.title_en }));

  return [...fromHistology, ...fromPharmacology, ...fromPathology].slice(0, 8);
}

export default function Home() {
  const [query, setQuery] = useState("");
  const dueCount = useMemo(() => getDueCount(), []);
  const searchResults = useMemo(() => searchAllModules(query), [query]);
  const recent = useMemo(() => {
    const seen = new Set();
    return [...getEvents()].reverse().filter(event => event.type === "study")
      .map(event => resolveTopic(event.module, event.itemId)).filter(topic => {
        if (!topic || seen.has(topic.href)) return false;
        seen.add(topic.href);
        return true;
      }).slice(0, 3);
  }, []);
  const progress = [useProgress("histology", HISTOLOGY_TOTAL), useProgress("pharmacology", PHARMACOLOGY_TOTAL), useProgress("pathology", PATHOLOGY_TOTAL)];
  const subjects = [
    { id: "histology", fa: "بافت‌شناسی", en: "Histology", icon: "histology", unit: "موضوع" },
    { id: "pharmacology", fa: "داروشناسی", en: "Pharmacology", icon: "pharmacology", unit: "دارو" },
    { id: "pathology", fa: "پاتولوژی", en: "Pathology", icon: "pathology", unit: "موضوع" },
  ];
  const last = recent[0];
  const done = progress.reduce((sum, p) => sum + p.done, 0);
  const total = progress.reduce((sum, p) => sum + p.total, 0);
  return (
    <main className="academic-home academic-ui" dir="rtl" lang="fa">
      <header className="academic-brand">
        <Link to="/" aria-label="خانه MedScope" className="academic-wordmark" dir="ltr"><span className="academic-monogram">M<span>+</span></span><strong>MedScope<span>MEDICAL LEARNING</span></strong></Link>
        <Link to="/favorites" className="academic-icon-button" aria-label="علاقه‌مندی‌ها"><MedicalIcon name="favorites" size={22} /></Link>
      </header>
      <div className="academic-welcome"><p className="academic-eyebrow">فضای یادگیری شما</p><h1>مطالعهٔ امروز را ادامه بده.</h1></div>
      <label className="academic-search"><Search size={20} aria-hidden="true" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="جستجوی بافت، دارو یا بیماری" aria-label="جستجو در بافت‌شناسی، داروها و پاتولوژی" /></label>
      {query.trim() ? <SearchResults results={searchResults} /> : <>
        <section className="academic-continue" aria-label="ادامه مطالعه">
          <div className="academic-continue__label"><BookOpen size={17} aria-hidden="true" /><span>{last ? "ادامه از آخرین مطالعه" : "اولین قدم یادگیری"}</span></div>
          <h2>{last ? last.title_fa : "یک مبحث، یک قدم جلوتر"}</h2>
          <p>{last ? <bdi dir="ltr">{last.title_en}</bdi> : "از بافت‌شناسی، داروشناسی یا پاتولوژی شروع کن."}</p>
          <Link to={last?.href || "/histology"} className="academic-primary">{last ? "ادامهٔ مطالعه" : "شروع مطالعه"}<ArrowLeft size={18} aria-hidden="true" /></Link>
        </section>
        <section className="academic-subjects" aria-labelledby="subject-heading"><div className="academic-section-heading"><h2 id="subject-heading">مسیرهای یادگیری</h2><span>سه درس، یک فضای مطالعه</span></div>
          {subjects.map((subject, i) => <Link key={subject.id} to={`/${subject.id}`} className="academic-subject"><span className="academic-subject__icon"><MedicalIcon name={subject.icon} size={48} /></span><span className="academic-subject__name"><strong>{subject.fa}</strong><span dir="ltr">{subject.en}</span></span><span className="academic-subject__count">{toFaDigits(progress[i].total)} {subject.unit}</span><ChevronLeft size={17} aria-hidden="true" /></Link>)}
        </section>
        <section className="academic-progress" aria-labelledby="progress-heading"><div className="academic-section-heading"><h2 id="progress-heading"><MedicalIcon name="progress" size={22} />مسیر طی‌شده</h2><Link to="/progress">جزئیات <ChevronLeft size={14} /></Link></div><p><strong>{toFaDigits(done)}</strong> از {toFaDigits(total)} مبحث را باز کرده‌ای<span>بازدید از محتوا؛ نه سنجش تسلط علمی</span></p><div className="academic-progress__track" role="progressbar" aria-label="مباحث بازشده" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total}><span style={{width: `${done / total * 100}%`}} /></div></section>
        <div className="academic-tools"><Link to="/review"><CalendarCheck size={19} /><span>مرور امروز</span><b>{toFaDigits(dueCount)}</b></Link><Link to="/quiz"><MedicalIcon name="quiz" size={22} /><span>آزمون دانش</span><ChevronLeft size={16} /></Link></div>
        {recent.length > 0 && <section className="academic-recent"><h2>آخرین مطالعه‌ها</h2>{recent.map(topic => <Link key={topic.href} to={topic.href}><span>{topic.title_fa}</span><ChevronLeft size={16} /></Link>)}</section>}
      </>}
    </main>
  );
}

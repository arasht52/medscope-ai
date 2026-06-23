import { useState, useMemo } from "react";
import { Search, Microscope, Pill, Stethoscope, Brain, Star, ChevronLeft } from "lucide-react";

import ProgressBar from "./components/ProgressBar.jsx";
import CardNotch from "./components/CardNotch.jsx";
import ModuleCard from "./components/ModuleCard.jsx";
import RecentItemCard from "./components/RecentItemCard.jsx";
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
function histologyCategoryLabel(categoryId) {
  return histologyData.categories.find((c) => c.id === categoryId)?.label_fa ?? categoryId;
}

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

const recentItems = [
  ...histologyData.items.slice(0, 2).map((i) => ({
    id: i.id,
    type: "histology",
    title_fa: i.title_fa,
    title_en: i.title_en,
    category: histologyCategoryLabel(i.category),
  })),
  ...pharmacologyData.drugs.slice(0, 2).map((d) => ({
    id: d.id,
    type: "pharmacology",
    title_fa: d.generic_name,
    title_en: d.generic_name,
    category: d.drug_class,
  })),
];

export default function Home() {
  const [query, setQuery] = useState("");
  const isSearching = query.trim().length > 0;
  const searchResults = useMemo(() => searchAllModules(query), [query]);

  // Real progress: each module's Detail page calls markDone(itemId) when
  // opened (see useProgress.js), so these counts reflect actual distinct
  // items the student has viewed, persisted in localStorage.
  const histology = useProgress("histology", HISTOLOGY_TOTAL);
  const pharmacology = useProgress("pharmacology", PHARMACOLOGY_TOTAL);
  const pathology = useProgress("pathology", PATHOLOGY_TOTAL);

  return (
    <div dir="rtl" lang="fa" className="w-full max-w-md mx-auto flex flex-col bg-bg">
      {/* Header */}
      <header className="px-5 pt-6 pb-3">
        <p className="text-sm text-muted">صبح بخیر، دانشجو</p>
        <h1 className="text-xl font-bold mt-0.5 text-ink">امروز چی می‌خوای مرور کنی؟</h1>
      </header>

      {/* Search bar — real cross-module search (Histology + Pharmacology +
          Pathology); results render below, replacing the rest of Home
          while a query is active. */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2 rounded-2xl px-3 py-3 bg-surface border border-border">
          <Search size={18} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="جستجو در بافت‌شناسی، داروها و پاتولوژی..."
            aria-label="جستجو در بافت‌شناسی، داروها و پاتولوژی"
            className="flex-1 bg-transparent outline-none text-sm text-right text-ink"
          />
        </div>
      </div>

      {isSearching && <SearchResults results={searchResults} />}

      {!isSearching && (
        <>
      {/* Progress section */}
      <section className="px-5 pb-4">
        <div className="relative rounded-2xl p-4 bg-surface border border-border">
          <CardNotch variant="histology" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-ink">پیشرفت مطالعه</span>
            <span className="text-xs text-muted">این هفته</span>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-ink">بافت‌شناسی · Histology</span>
                <span className="text-xs text-histology">
                  {toFaDigits(histology.done)}/{toFaDigits(histology.total)}
                </span>
              </div>
              <ProgressBar value={histology.done} total={histology.total} variant="histology" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-ink">داروشناسی · Pharmacology</span>
                <span className="text-xs text-pharm">
                  {toFaDigits(pharmacology.done)}/{toFaDigits(pharmacology.total)}
                </span>
              </div>
              <ProgressBar value={pharmacology.done} total={pharmacology.total} variant="pharm" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-ink">پاتولوژی · Pathology</span>
                <span className="text-xs text-path">
                  {toFaDigits(pathology.done)}/{toFaDigits(pathology.total)}
                </span>
              </div>
              <ProgressBar value={pathology.done} total={pathology.total} variant="path" />
            </div>
          </div>
        </div>
      </section>

      {/* Module grid */}
      <section className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-3">
          <ModuleCard
            to="/histology"
            variant="histology"
            icon={Microscope}
            titleFa="بافت‌شناسی"
            titleEn="Histology Atlas"
            subtitle={`${toFaDigits(HISTOLOGY_TOTAL)} موضوع`}
          />
          <ModuleCard
            to="/pharmacology"
            variant="pharm"
            icon={Pill}
            titleFa="داروشناسی"
            titleEn="Pharmacology"
            subtitle={`${toFaDigits(PHARMACOLOGY_TOTAL)} دارو`}
          />
          <ModuleCard
            to="/pathology"
            variant="path"
            icon={Stethoscope}
            titleFa="پاتولوژی"
            titleEn="Pathology"
            subtitle={`${toFaDigits(PATHOLOGY_TOTAL)} مورد`}
          />
          <ModuleCard
            to="/quiz"
            variant="quiz"
            icon={Brain}
            titleFa="آزمون"
            titleEn="Quiz"
            subtitle="تست دانش"
          />
          <ModuleCard
            to="/favorites"
            variant="fav"
            icon={Star}
            titleFa="علاقه‌مندی‌ها"
            titleEn="Favorites"
            subtitle="موارد ذخیره‌شده"
          />
        </div>
      </section>

      {/* Recent items */}
      <section className="pb-5">
        <div className="px-5 flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-ink">موارد اخیر</span>
          <ChevronLeft size={16} className="text-muted" />
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {recentItems.map((item) => (
            <RecentItemCard key={`${item.type}:${item.id}`} item={item} />
          ))}
        </div>
      </section>
        </>
      )}
    </div>
  );
}

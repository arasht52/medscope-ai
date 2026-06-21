import { useState } from "react";
import { Search, Microscope, Pill, Stethoscope, Brain, Star, ChevronLeft } from "lucide-react";

import ProgressBar from "./components/ProgressBar.jsx";
import CardNotch from "./components/CardNotch.jsx";
import ModuleCard from "./components/ModuleCard.jsx";
import RecentItemCard from "./components/RecentItemCard.jsx";
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

  // No screen currently calls markDone() — real progress tracking is not
  // implemented yet (documented in useProgress.js). Until it is, this
  // correctly shows 0/total rather than a fake non-zero demo value, so
  // "Reset Progress" in Settings has a real, visible effect.
  const histology = useProgress("histology", HISTOLOGY_TOTAL, 0);
  const pharmacology = useProgress("pharmacology", PHARMACOLOGY_TOTAL, 0);

  return (
    <div dir="rtl" lang="fa" className="w-full max-w-md mx-auto flex flex-col bg-bg">
      {/* Header */}
      <header className="px-5 pt-6 pb-3">
        <p className="text-sm text-muted">صبح بخیر، دانشجو</p>
        <h1 className="text-xl font-bold mt-0.5 text-ink">امروز چی می‌خوای مرور کنی؟</h1>
      </header>

      {/* Search bar — visual only for now: no search route exists yet,
          so Enter intentionally does nothing rather than half-navigating. */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2 rounded-2xl px-3 py-3 bg-surface border border-border">
          <Search size={18} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="جستجو در بافت‌شناسی و داروها..."
            aria-label="جستجو در بافت‌شناسی و داروها"
            className="flex-1 bg-transparent outline-none text-sm text-right text-ink"
          />
        </div>
      </div>

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
    </div>
  );
}

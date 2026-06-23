import { Link } from "react-router-dom";
import CardNotch from "./CardNotch.jsx";

const VARIANT = {
  histology: { tag: "bg-histologySoft text-histology", to: "/histology" },
  pharmacology: { tag: "bg-pharmSoft text-pharm", to: "/pharmacology" },
  pathology: { tag: "bg-pathSoft text-path", to: "/pathology" },
};

const TYPE_LABEL_FA = {
  histology: "بافت‌شناسی",
  pharmacology: "داروشناسی",
  pathology: "پاتولوژی",
};

/**
 * Cross-module search results — replaces the Home search bar's old
 * "visual only" behavior. Renders matches from all three datasets as a
 * single tappable list, each navigating straight to its real detail page.
 */
export default function SearchResults({ results }) {
  if (results.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-sm text-muted">
        نتیجه‌ای برای این عبارت پیدا نشد.
      </div>
    );
  }

  return (
    <ul className="px-5 flex flex-col gap-2" aria-label="نتایج جستجو">
      {results.map((r) => {
        const v = VARIANT[r.type];
        return (
          <li key={`${r.type}:${r.id}`}>
            <Link
              to={`${v.to}/${r.id}`}
              className="relative flex items-center justify-between gap-3 rounded-xl p-3 w-full text-right bg-surface border border-border active:scale-[0.98] transition-transform"
            >
              <CardNotch variant={r.type === "pharmacology" ? "pharm" : r.type === "pathology" ? "path" : "histology"} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-ink">{r.title_fa}</span>
                <span className="text-xs text-muted en">{r.title_en}</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 ${v.tag}`}>
                {TYPE_LABEL_FA[r.type]}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

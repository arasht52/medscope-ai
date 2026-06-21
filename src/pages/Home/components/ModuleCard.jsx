import { Link } from "react-router-dom";
import CardNotch from "./CardNotch.jsx";

const VARIANT = {
  histology: { iconBg: "bg-histologySoft", iconColor: "text-histology", subtitle: "text-histology" },
  pharm: { iconBg: "bg-pharmSoft", iconColor: "text-pharm", subtitle: "text-pharm" },
  path: { iconBg: "bg-pathSoft", iconColor: "text-path", subtitle: "text-path" },
  quiz: { iconBg: "bg-quizSoft", iconColor: "text-quiz", subtitle: "text-quiz" },
  fav: { iconBg: "bg-favSoft", iconColor: "text-fav", subtitle: "text-fav" },
};

export default function ModuleCard({ to, variant, icon: Icon, titleFa, titleEn, subtitle }) {
  const v = VARIANT[variant];
  return (
    <Link
      to={to}
      className="relative flex flex-col items-start text-right w-full rounded-2xl p-4 transition-transform active:scale-95 focus:outline-none bg-surface border border-border shadow-sm"
    >
      <CardNotch variant={variant} />
      <div className={`flex items-center justify-center rounded-xl mb-3 w-11 h-11 ${v.iconBg}`}>
        <Icon size={22} className={v.iconColor} strokeWidth={2} />
      </div>
      <div className="text-base font-semibold leading-tight text-ink">{titleFa}</div>
      <div className="text-xs mb-1 text-muted">{titleEn}</div>
      <div className={`text-xs mt-auto pt-2 ${v.subtitle}`}>{subtitle}</div>
    </Link>
  );
}

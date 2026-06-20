import { Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, Microscope, Pill, Brain, Grid2x2 } from "lucide-react";

const ITEMS = [
  { to: "/", label: "خانه", icon: HomeIcon },
  { to: "/histology", label: "بافت‌شناسی", icon: Microscope },
  { to: "/pharmacology", label: "داروشناسی", icon: Pill },
  { to: "/quiz", label: "آزمون", icon: Brain },
  { to: "/settings", label: "بیشتر", icon: Grid2x2 },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav aria-label="پیمایش اصلی" className="sticky bottom-0 flex items-stretch px-2 bg-surface border-t border-border">
      {ITEMS.map(({ to, label, icon: Icon }) => {
        // "/" must match exactly; other tabs should stay highlighted on
        // their nested routes too (e.g. /pharmacology/:id, /quiz/histology).
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 focus:outline-none ${
              active ? "text-histology" : "text-muted"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.3 : 1.8} />
            <span className={`text-[11px] ${active ? "font-semibold" : "font-normal"}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

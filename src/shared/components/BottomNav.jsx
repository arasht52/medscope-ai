import { Link, useLocation } from "react-router-dom";
import MedicalIcon from "./MedicalIcon.jsx";
import "./StudyExperience.css";

const destinations = [
  { to: "/", label: "خانه", icon: "home", matches: path => path === "/" },
  { to: "/subjects", label: "درس‌ها", icon: "subjects", matches: path => /^\/(subjects|histology|pharmacology|pathology)(\/|$)/.test(path) },
  { to: "/quiz", label: "آزمون", icon: "quiz", matches: path => path.startsWith("/quiz") },
  { to: "/game", label: "بازی", icon: "memory", matches: path => path.startsWith("/game") },
  { to: "/settings", label: "بیشتر", icon: "more", matches: path => /^\/(settings|favorites|progress|review)(\/|$)/.test(path) },
];

function NavIcon({ name }) {
  if (name === "quiz") return <MedicalIcon name={name} size={22} />;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#183347" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === "home" && <><path d="m3 11 9-8 9 8" fill="#90c2b9" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>}
    {name === "subjects" && <><path d="M12 5C9 3 5 3 2 4v16c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 1Z" fill="#e8f0ec" /><path d="M12 5v16M5 8h4M5 12h4m6-4h4m-4 4h4" /></>}
    {name === "memory" && <><path d="M12 5C11 2 7 2 6 5 3 5 2 8 3 10 1 13 2 17 5 17 5 21 10 22 12 19Z" fill="#90c2b9" /><path d="M12 5C13 2 17 2 18 5 21 5 22 8 21 10 23 13 22 17 19 17 19 21 14 22 12 19Z" fill="#d9ebe6" /><path d="M6 5c0 2 1 3 3 3M3 10c2-1 4 0 4 2m-2 5c2 0 3-1 3-3m10-9c0 2-1 3-3 3m6 2c-2-1-4 0-4 2m2 5c-2 0-3-1-3-3M12 5v14" /></>}
    {name === "more" && <>{[[4,4],[14,4],[4,14],[14,14]].map(([x,y]) => <rect key={x+":"+y} x={x} y={y} width="6" height="6" rx="1.5" fill="#90c2b9" />)}</>}
  </svg>;
}

export default function BottomNav() {
  const { pathname } = useLocation();
  return <nav aria-label="پیمایش اصلی" className="academic-bottom-nav">{destinations.map(d =>
    <Link key={d.to} to={d.to} aria-current={d.matches(pathname) ? "page" : undefined}><NavIcon name={d.icon} /><span>{d.label}</span></Link>
  )}</nav>;
}

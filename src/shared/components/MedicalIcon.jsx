import { useId } from "react";
/** Original UI symbols, not diagnostic illustrations. Used only by the pilot. */
export const MEDICAL_ICON_NAMES = ["histology", "pharmacology", "pathology", "quiz", "memory", "favorites", "progress"];

function Compact({ name }) {
  switch (name) {
    case "histology": return <><path fill="var(--medical-icon-fill, #90c2b9)" d="m11 3 5 3-4 7-5-3z" /><path d="m11 3 5 3-4 7-5-3zM14 10c6 0 7 9-1 10M5 20h15M6 15h8M9 20v-3" /><path d="m9 5 5 3" /></>;
    case "pharmacology": return <><path fill="var(--medical-icon-fill, #90c2b9)" d="m5 12 7-7c5-5 12 2 7 7l-7 7z" /><path d="m5 12 7-7c5-5 12 2 7 7l-7 7c-5 5-12-2-7-7Z" /><path d="m8.5 8.5 7 7" /></>;
    case "pathology": return <><path fill="var(--medical-icon-fill, #90c2b9)" d="m7 3 10 1 5 8-5 8-10 1-5-9Z" /><path d="m7 3 10 1 5 8-5 8-10 1-5-9ZM7 3l5 9 5-8M2 12h10l5 8M12 12l10 0-5 8M7 21l5-9" /><circle cx="12" cy="12" r="2.5" fill="#fffefa" /></>;
    case "quiz": return <><rect x="4" y="4" width="16" height="18" rx="3" /><rect x="8" y="2" width="8" height="4" rx="1" fill="var(--medical-icon-fill, #90c2b9)" /><path d="m7 11 1.5 1.5L11 10M13 12h4m-10 5 1.5 1.5L11 16M13 18h4" /></>;
    case "memory": return <><rect x="3" y="3" width="13" height="16" rx="2" fill="var(--medical-icon-fill, #90c2b9)" /><rect x="8" y="6" width="13" height="16" rx="2" fill="#fffefa" /><path d="m14.5 10 3.5 4-3.5 4-3.5-4z" fill="var(--medical-icon-fill, #90c2b9)" /></>;
    case "favorites": return <><path fill="var(--medical-icon-fill, #90c2b9)" d="M6 3h12v19l-6-4-6 4z" /><path d="M6 3h12v19l-6-4-6 4ZM9 7h6" /></>;
    case "progress": return <><path d="M3 4v17h19" /><rect x="6" y="13" width="3" height="5" rx=".5" fill="var(--medical-icon-fill, #90c2b9)" /><rect x="12" y="9" width="3" height="9" rx=".5" fill="var(--medical-icon-fill, #90c2b9)" /><rect x="18" y="4" width="3" height="14" rx=".5" fill="var(--medical-icon-fill, #90c2b9)" /></>;
    default: return null;
  }
}

function Full({ name, id }) {
  const teal = `url(#${id}-teal)`;
  const paper = `url(#${id}-paper)`;
  const pink = `url(#${id}-pink)`;
  const tissue = <><circle cx="24" cy="24" r="18" fill={pink} stroke="#b5c7ce" /><path d="M24 7v34M8 24h32" stroke="#fffefa" strokeWidth="1.5" />{[[16,16],[22,19],[30,14],[34,22],[14,28],[20,34],[29,30],[32,35],[12,21]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx="1.4" ry="2.4" transform={`rotate(${i*24} ${x} ${y})`} fill="#ba468c" stroke="none" />)}</>;
  return <><ellipse cx="25" cy="43" rx="20" ry="2.2" fill="#183347" opacity=".09" stroke="none" />{(() => {
    switch (name) {
      case "histology": return <><g transform="translate(-3 5) scale(.82)">{tissue}</g><path d="M31 14c16 5 13 25-1 25h-7v-5h7c10 0 12-12 0-15Z" fill={paper} /><path d="m29 5 6 3-9 17-6-3Z" fill={paper} /><path d="m31 2 5 3-3 5-5-3Z" fill={teal} /><path d="m23 19 5 3-3 5-5-3Z" fill={teal} /><path d="M19 31h16v3H19Z" fill={teal} /><circle cx="34" cy="32" r="3" fill={teal} /><path d="M16 39h24l3 5H13Z" fill={paper} /><path d="M15 43h26" stroke="#287d94" /></>;
      case "pathology": return <><g transform="translate(9 -2) scale(.84)">{tissue}</g>{[[14,13],[8,27],[23,33]].map(([x,y],i)=><g key={i}><path d={`M${x-7} ${y}l4-7h8l4 7-4 7h-8Z`} fill={teal}/><path d={`M${x-4} ${y-4}l3 4-3 4m3-4h9`} stroke="#c7ffff" strokeWidth="1"/><circle cx={x+1} cy={y} r="2" fill="#edffff" stroke="none"/></g>)}</>;
      case "pharmacology": return <><path d="M11 37C1 36 3 26 3 26c9 1 13 4 13 10M13 33C5 26 10 18 10 18c8 4 10 9 7 17" fill="#81bd70" stroke="#448354" /><rect x="14" y="12" width="20" height="30" rx="5" fill={paper}/><path d="M14 22h20v13H14Z" fill={teal} stroke="none"/><path d="M22 25h4v3h3v4h-3v3h-4v-3h-3v-4h3Z" fill="white" stroke="none"/><rect x="16" y="5" width="16" height="8" rx="2" fill={teal}/><path d="M19 7v4m4-4v4m4-4v4" stroke="#9ee4e5" strokeWidth="1"/><g transform="rotate(38 35 34)"><rect x="29" y="23" width="12" height="22" rx="6" fill={paper}/><path d="M29 34v-5a6 6 0 0 1 12 0v5Z" fill={teal}/><path d="M29 34h12"/><path d="M32 27v5" stroke="white" opacity=".7"/></g></>;
      case "quiz": return <><rect x="8" y="7" width="28" height="36" rx="3" fill={paper}/><path d="M16 6h4a4 4 0 0 1 8 0h3v6H16Z" fill={teal}/><circle cx="24" cy="5" r="1.4" fill="#dcffff" stroke="none"/>{[18,29].map(y=><g key={y}><rect x="12" y={y} width="6" height="7" rx=".5" fill="white" stroke="#24778a"/><path d={`m13 ${y+3} 2 2 5-6`} stroke="#5baf64"/><path d={`M22 ${y+1}h9m-9 4h6`} stroke="#24778a" strokeWidth="1.2"/></g>)}<g transform="rotate(33 36 29)"><path d="M33 16h6v23l-3 4-3-4Z" fill="#ffc348" stroke="#b47f24"/><path d="M36 18v20" stroke="#ffe994"/><path d="m33 39 3 4 3-4" fill="#183347" stroke="#183347"/><path d="M33 14a3 3 0 0 1 6 0v4h-6Z" fill="#e68da9"/></g></>;
      case "memory": return <>{[[9,9,-12],[25,14,13]].map(([x,y,r],i)=><g key={i} transform={`rotate(${r} ${x+9} ${y+14})`}><rect x={x} y={y} width="19" height="27" rx="2.5" fill={paper}/><path d={`M${x+5} ${y+9}c-3-2-4 2-3 4-3 4 0 8 4 7 2 4 7 2 7-1 4-2 4-7 1-8 1-5-5-6-7-2Z`} fill={i?teal:pink} stroke={i?'#237b91':'#b34b88'} strokeWidth="1"/><path d={`M${x+7} ${y+10}v8m-4-5 4 2 4-4m-4 7 4-2`} stroke={i?'#237b91':'#b34b88'} strokeWidth=".8"/></g>)}<path d="m24 3 1 4m7-3-3 4m10-1-5 3" stroke="#edb23c" strokeWidth="2.5"/></>;
      case "favorites": return <><path d="m19 10 23 2-3 31-12-8-12 6Z" fill={paper}/><path d="M9 6h23v37l-11-8-12 8Z" fill={teal}/><path d="M12 10v28" stroke="#9ae0dd" strokeWidth="1"/><path d="m21 16 3 6 6 1-5 5 1 6-5-3-6 3 1-6-4-5 6-1Z" fill="#ffcf4f" stroke="#e9aa2e" strokeWidth="1.1"/></>;
      case "progress": return <><path d="M7 5v37h36"/><path d="m4 9 3-5 3 5" fill="#183347"/>{[[12,29,8],[22,22,15],[32,13,24]].map(([x,y,h],i)=><g key={i}><rect x={x} y={y} width="7" height={h} rx="1.2" fill={teal} stroke="#268e96"/><path d={`M${x+2} ${y+2}v${h-4}`} stroke="#a6e2d9" strokeWidth="1"/></g>)}<path d="M12 20C23 18 31 12 40 5" stroke="#3ca5a7" strokeWidth="1.8"/><path d="m34 5 7-2-2 7" fill="#3ca5a7" stroke="#3ca5a7"/></>;
      default: return null;
    }
  })()}</>;
}

export default function MedicalIcon({ name, size = 56, label, className = "" }) {
  const compact = size <= 24;
  const id = `medical-${useId().replace(/:/g, "")}`;
  return (
    <svg width={size} height={size} viewBox={compact ? "0 0 24 24" : "0 0 48 48"}
      className={`medical-icon ${className}`.trim()} xmlns="http://www.w3.org/2000/svg"
      fill="none" stroke="var(--medical-icon-stroke, #183347)" strokeWidth={compact ? 1.6 : 1.8}
      strokeLinecap="round" strokeLinejoin="round" focusable="false"
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {label && <title>{label}</title>}
      <defs>
        <linearGradient id={`${id}-teal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#80d5d8"/><stop offset=".5" stopColor="#25a6b4"/><stop offset="1" stopColor="#19708d"/></linearGradient>
        <linearGradient id={`${id}-paper`} x2=".6" y2="1"><stop stopColor="#ffffff"/><stop offset="1" stopColor="#d7e6ed"/></linearGradient>
        <linearGradient id={`${id}-pink`} x2="1" y2="1"><stop stopColor="#f8deee"/><stop offset="1" stopColor="#dfa0d0"/></linearGradient>
      </defs>
      {compact ? <Compact name={name} /> : <Full name={name} id={id} />}
    </svg>
  );
}

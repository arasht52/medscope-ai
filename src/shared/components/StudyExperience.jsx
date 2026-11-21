import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import MedicalIcon from "./MedicalIcon.jsx";
import FavoriteButton from "../../pages/Favorites/components/FavoriteButton.jsx";
import "./StudyExperience.css";

export function StudyHeader({ subject, subjectPath, category, titleFa, titleEn, favorite, children }) {
  return <>
    <header className="academic-topic__toolbar">
      <Link to={subjectPath} className="academic-back"><ArrowRight size={18} aria-hidden="true" />{subject}</Link>
      <span className="academic-small-brand" dir="ltr">MedScope</span>
      <FavoriteButton item={favorite} icon={<MedicalIcon name="favorites" size={22} />} />
    </header>
    <div className="academic-topic__heading">
      <p className="academic-eyebrow">{subject} <span aria-hidden="true">/</span> <bdi dir="auto">{category}</bdi></p>
      <h1 dir={titleFa ? "rtl" : "ltr"}>{titleFa || titleEn}</h1>
      {titleFa && titleEn && <p className="academic-topic__english" dir="ltr">{titleEn}</p>}
      {children}
    </div>
  </>;
}

export function StudyText({ text }) {
  const value = String(text);
  // Keep an entirely English phrase (including parentheses) in one bidi run.
  if (/[A-Za-z]/.test(value) && !/[\u0600-\u06ff]/.test(value)) return <bdi dir="ltr">{value}</bdi>;
  return value.split(/([A-Za-z][A-Za-z0-9]*(?:[ -][A-Za-z0-9]+)*)/g).map((part, i) =>
    /[A-Za-z]/.test(part) ? <bdi key={i} dir="ltr">{part}</bdi> : part);
}

export function StudySection({ title, value, exam = false, expanded = false, children }) {
  const lines = Array.isArray(value) ? value : typeof value === "string" && value.trim() ? [value] : [];
  if (!lines.length && !children) return null;
  const content = <>{lines.length === 1 ? <p><StudyText text={lines[0]} /></p> : <ul>{lines.map((line, i) => <li key={i}><StudyText text={line} /></li>)}</ul>}{children}</>;
  if (exam) return <section className="academic-exam"><h2><MedicalIcon name="quiz" size={22} />{title}</h2>{content}</section>;
  return <details className="academic-reading-section" open={expanded}><summary>{title}</summary>{content}</details>;
}

export function StudyQuizLink({ to, category }) {
  return <aside className="academic-study-next"><span className="academic-eyebrow">از مطالعه به بازیابی</span><h2>آموخته‌هایت را مرور کن.</h2><p>آزمون دستهٔ <bdi dir="auto">{category}</bdi>؛ شامل مباحث دیگر این دسته.</p><Link className="academic-primary" to={to}>رفتن به آزمون <ArrowLeft size={18} aria-hidden="true" /></Link></aside>;
}

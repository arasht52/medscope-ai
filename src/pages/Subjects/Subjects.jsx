import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import MedicalIcon from "../../shared/components/MedicalIcon.jsx";
import "../../shared/components/StudyExperience.css";

export default function Subjects() {
  return <main className="academic-ui academic-subject-hub" dir="rtl" lang="fa">
    <p className="academic-eyebrow">MedScope · یادگیری پزشکی</p><h1>درس‌ها</h1>
    <p className="academic-hub-intro">یک درس را برای مطالعه و مرور انتخاب کن.</p>
    {[["histology", "بافت‌شناسی", "Histology"], ["pharmacology", "داروشناسی", "Pharmacology"], ["pathology", "پاتولوژی", "Pathology"]].map(([id, fa, en]) =>
      <Link key={id} to={`/${id}`} className="academic-subject"><MedicalIcon name={id} size={56} /><span className="academic-subject__name"><strong>{fa}</strong><span dir="ltr">{en}</span></span><ChevronLeft size={18} aria-hidden="true" /></Link>)}
  </main>;
}

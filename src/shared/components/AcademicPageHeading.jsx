import MedicalIcon from "./MedicalIcon.jsx";

/** Presentation only: uses the existing approved icon and academic palette. */
export default function AcademicPageHeading({ icon, title, subtitle }) {
  return <header className="academic-page-heading">
    <MedicalIcon name={icon} size={48} />
    <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
  </header>;
}

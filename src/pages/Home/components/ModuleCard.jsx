import { Link } from "react-router-dom";

export default function ModuleCard({
  title,
  description,
  to
}) {
  return (
    <Link to={to} className="module-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}
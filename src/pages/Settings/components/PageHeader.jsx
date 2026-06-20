import "./settingsComponents.css";

export default function PageHeader({ title, subtitle }) {
  return (
    <header className="set-page-header">
      <h1 className="set-page-header__title">{title}</h1>
      {subtitle && <p className="set-page-header__subtitle">{subtitle}</p>}
    </header>
  );
}

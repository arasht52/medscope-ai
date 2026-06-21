import ModuleCard from "./components/ModuleCard.jsx";
import RecentItemCard from "./components/RecentItemCard.jsx";

export default function Home() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>MedScope AI</h1>
        <p>یادگیری Histology و Pharmacology</p>
      </div>

      <div className="module-grid">
        <ModuleCard
          title="Histology"
          description="بافت‌ها و تصاویر میکروسکوپی"
          to="/histology"
        />

        <ModuleCard
          title="Pharmacology"
          description="داروها و مرور سریع"
          to="/pharmacology"
        />

        <ModuleCard
  title="Quiz"
  description="آزمون و مرور"
  to="/quiz"
/>

<ModuleCard
  title="Pathology"
  description="آسیب‌شناسی و بیماری‌ها"
  to="/pathology"
/>

<ModuleCard
  title="Favorites"
  description="موارد ذخیره‌شده"
  to="/favorites"
/>
      </div>

      <RecentItemCard />
    </div>
  );
}
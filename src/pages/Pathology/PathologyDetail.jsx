import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pathologyData from "../../data/pathology.json";
import MeningiomaStudy from "./MeningiomaStudy.jsx";
import PathologyEmptyState from "./components/PathologyEmptyState.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import { markItemViewed } from "../../shared/lib/storage";
import { recordStudy } from "../../shared/lib/learning";
import "./Pathology.css";

const { items } = pathologyData;

export default function PathologyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = useMemo(() => items.find((it) => it.id === id), [id]);
  // "notes" = the existing جزوه layout (default). "mindmap" = the memory-friendly
  // branch view. Additive toggle — notes content is unchanged.
  const [view, setView] = useState("notes");

  // Real progress tracking: opening a detail page counts as "studied".
  useEffect(() => {
    if (item) markItemViewed("pathology", item.id);
    if (item) recordStudy("pathology", item.id, { title_fa: item.title_fa, title_en: item.title_en, subtitle: item.category });
  }, [item]);

  if (!item) {
    return (
      <div className="page academic-standard">
        <PathologyEmptyState
          icon="❓"
          title="این مورد پیدا نشد"
          description="ممکن است لینک نادرست باشد یا مورد حذف شده باشد."
        />
        <BackButton onClick={() => navigate(-1)} label="بازگشت" />
      </div>
    );
  }

  return <MeningiomaStudy key={item.id} item={item} view={view} onViewChange={setView} />;
}

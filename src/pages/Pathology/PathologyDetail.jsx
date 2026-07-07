import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pathologyData from "../../data/pathology.json";
import Card from "./components/Card.jsx";
import PathologyMindMap from "./PathologyMindMap.jsx";
import PathologyEmptyState from "./components/PathologyEmptyState.jsx";
import ImageViewer from "../../shared/components/ImageViewer.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import FavoriteButton from "../Favorites/components/FavoriteButton";
import { FAVORITE_TYPES, markItemViewed } from "../../shared/lib/storage";
import { recordStudy } from "../../shared/lib/learning";
import "./Pathology.css";

const { items } = pathologyData;

const SECTIONS = [
  { key: "etiology", label: "علل", icon: "🧬" },
  { key: "gross_features", label: "یافته‌های ماکروسکوپی", icon: "🔎" },
  { key: "microscopic_features", label: "یافته‌های میکروسکوپی", icon: "🔬" },
  { key: "clinical_features", label: "تظاهرات بالینی", icon: "🩺" },
  { key: "diagnostic_clues", label: "نکات تشخیصی", icon: "✅" },
  { key: "differential_diagnosis", label: "تشخیص افتراقی", icon: "⚖️" },
  { key: "complications", label: "عوارض", icon: "⚠️" },
  { key: "common_confusions", label: "اشتباهات رایج", icon: "🔁" },
  { key: "exam_tips", label: "نکات امتحانی", icon: "📝" },
  { key: "exam_trap", label: "تله‌ی امتحانی", icon: "🪤" },
];

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
      <div className="page">
        <PathologyEmptyState
          icon="❓"
          title="این مورد پیدا نشد"
          description="ممکن است لینک نادرست باشد یا مورد حذف شده باشد."
        />
        <BackButton onClick={() => navigate(-1)} label="بازگشت" />
      </div>
    );
  }

  return (
    <div className="page path-detail">
      <div className="page-header path-detail__header">
        <BackButton onClick={() => navigate(-1)} label="بازگشت" />
        <div className="path-detail__title-row">
          <div>
            <h1 className="path-detail__name-fa">{item.title_fa}</h1>
            <p className="path-detail__name-en en">{item.title_en}</p>
          </div>
          <FavoriteButton
            item={{
              id: item.id,
              type: FAVORITE_TYPES.PATHOLOGY,
              title_en: item.title_en,
              title_fa: item.title_fa,
              subtitle: item.category,
            }}
          />
        </div>
        <span className="path-detail__category en">{item.category}</span>
      </div>

      <div className="path-detail__tabs" role="tablist" aria-label="نمای مطالعه">
        <button
          type="button"
          role="tab"
          aria-selected={view === "notes"}
          className={`path-detail__tab ${view === "notes" ? "is-active" : ""}`}
          onClick={() => setView("notes")}
        >
          📄 جزوه
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "mindmap"}
          className={`path-detail__tab ${view === "mindmap" ? "is-active" : ""}`}
          onClick={() => setView("mindmap")}
        >
          🧠 نقشه‌ذهنی
        </button>
      </div>

      {view === "mindmap" ? (
        <PathologyMindMap item={item} />
      ) : (
        <>
      {item.definition && (
        <Card className="path-detail__section">
          <p className="path-detail__section-label">
            <span className="path-detail__section-icon" aria-hidden="true">📖</span>
            تعریف
          </p>
          <p className="path-detail__text">{item.definition}</p>
        </Card>
      )}

      <div className="path-detail__hero">
        <ImageViewer image={item.image} titleEn={item.title_en} />
      </div>

      {item.pathogenesis && (
        <Card className="path-detail__section">
          <p className="path-detail__section-label">
            <span className="path-detail__section-icon" aria-hidden="true">⚙️</span>
            پاتوژنز
          </p>
          <p className="path-detail__text">{item.pathogenesis}</p>
        </Card>
      )}

      {SECTIONS.map(({ key, label, icon }) => {
        const value = item[key];
        if (!value || value.length === 0) return null;
        return (
          <Card key={key} className="path-detail__section">
            <p className="path-detail__section-label">
              <span className="path-detail__section-icon" aria-hidden="true">{icon}</span>
              {label}
            </p>
            <ul className="path-detail__list">
              {value.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </Card>
        );
      })}

      {item.mnemonic && (
        <Card className="path-detail__section">
          <p className="path-detail__section-label">
            <span className="path-detail__section-icon" aria-hidden="true">🧠</span>
            مِنِمونیک
          </p>
          <p className="path-detail__text">{item.mnemonic}</p>
        </Card>
      )}

      {item.quick_summary && (
        <Card className="path-detail__section">
          <p className="path-detail__section-label">
            <span className="path-detail__section-icon" aria-hidden="true">📌</span>
            جمع‌بندی سریع
          </p>
          <p className="path-detail__text">{item.quick_summary}</p>
        </Card>
      )}
        </>
      )}
    </div>
  );
}

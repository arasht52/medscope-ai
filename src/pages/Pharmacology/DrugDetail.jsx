import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import pharmacologyData from "../../data/pharmacology.json";
import Card from "./components/Card.jsx";
import Disclaimer from "./components/Disclaimer.jsx";
import EmptyState from "./components/EmptyState.jsx";
import FavoriteButton from "../Favorites/components/FavoriteButton";
import { FAVORITE_TYPES } from "../../shared/lib/storage";
import { matchSuffixTip } from "./suffixTips.js";
import "./Pharmacology.css";

const { drugs } = pharmacologyData;

const SECTIONS = [
  { key: "indications", label: "موارد مصرف", icon: "✅" },
  { key: "adverse_effects", label: "عوارض جانبی", icon: "⚠️" },
  { key: "contraindications", label: "موارد منع مصرف", icon: "⛔" },
  { key: "interactions", label: "تداخلات دارویی", icon: "🔁" },
];

export default function DrugDetail() {
  const { id } = useParams();
  const drug = useMemo(() => drugs.find((d) => d.id === id), [id]);
  const suffixTip = drug ? matchSuffixTip(drug.generic_name) : null;

  if (!drug) {
    return (
      <div className="page">
        <EmptyState
          icon="❓"
          title="این دارو پیدا نشد"
          description="ممکن است لینک نادرست باشد یا دارو حذف شده باشد."
        />
        <Link className="back-link" to="/pharmacology">
          ← بازگشت به فهرست داروها
        </Link>
      </div>
    );
  }

  return (
    <div className="page drug-detail">
      <div className="page-header drug-detail__header">
        <Link className="back-link" to="/pharmacology" aria-label="بازگشت">
          ← فهرست داروها
        </Link>
        <div className="drug-detail__title-row">
          <h1 className="drug-detail__name en">{drug.generic_name}</h1>
          <FavoriteButton
            item={{
              id: drug.id,
              type: FAVORITE_TYPES.PHARMACOLOGY,
              title_en: drug.generic_name,
              title_fa: drug.generic_name,
              subtitle: drug.drug_class,
            }}
          />
        </div>
        {drug.brand_names?.length > 0 && (
          <p className="drug-detail__brands en">{drug.brand_names.join(" · ")}</p>
        )}
        <span className="drug-detail__category">{drug.category}</span>
      </div>

      <Disclaimer />

      <Card className="drug-detail__section">
        <p className="drug-detail__section-label">
          <span className="drug-detail__section-icon" aria-hidden="true">🧪</span>
          گروه دارویی
        </p>
        <p className="drug-detail__class en">{drug.drug_class}</p>
      </Card>

      {suffixTip && (
        <Card className="drug-detail__section suffix-tip-inline">
          <p className="drug-detail__section-label">
            <span className="drug-detail__section-icon" aria-hidden="true">💡</span>
            نکته پسوند
          </p>
          <p className="drug-detail__text">
            نام این دارو با پسوند <span className="en">{suffixTip.suffix}</span> تمام می‌شود؛
            این پسوند معمولاً نشانه‌ی <strong>{suffixTip.class_fa}</strong>{" "}
            (<span className="en">{suffixTip.class_en}</span>) است.
          </p>
        </Card>
      )}

      <Card className="drug-detail__section">
        <p className="drug-detail__section-label">
          <span className="drug-detail__section-icon" aria-hidden="true">⚙️</span>
          مکانیسم اثر
        </p>
        <p className="drug-detail__text">{drug.mechanism}</p>
      </Card>

      {SECTIONS.map(({ key, label, icon }) => {
        const items = drug[key];
        if (!items || items.length === 0) return null;
        return (
          <Card key={key} className="drug-detail__section">
            <p className="drug-detail__section-label">
              <span className="drug-detail__section-icon" aria-hidden="true">{icon}</span>
              {label}
            </p>
            <ul className="drug-detail__list">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>
        );
      })}

      {drug.exam_tips && (
        <Card className="drug-detail__section drug-detail__exam-tip">
          <p className="drug-detail__section-label">
            <span className="drug-detail__section-icon" aria-hidden="true">🎯</span>
            نکته امتحانی
          </p>
          <p className="drug-detail__text">{drug.exam_tips}</p>
        </Card>
      )}
    </div>
  );
}

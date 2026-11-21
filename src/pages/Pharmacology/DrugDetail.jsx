import { usesStudyLayout } from "../../shared/lib/studyLayoutScope.js";
import DisciplinePilot from "../../shared/components/DisciplinePilot.jsx";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pharmacologyData from "../../data/pharmacology.json";
import { StudyHeader, StudySection, StudyQuizLink } from "../../shared/components/StudyExperience.jsx";
import Disclaimer from "./components/Disclaimer.jsx";
import EmptyState from "./components/EmptyState.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import { markItemViewed } from "../../shared/lib/storage";
import { recordStudy } from "../../shared/lib/learning";
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
  const navigate = useNavigate();
  const drug = useMemo(() => drugs.find((d) => d.id === id), [id]);
  const suffixTip = drug ? matchSuffixTip(drug.generic_name) : null;

  // Real progress tracking: opening a detail page counts as "studied".
  useEffect(() => {
    if (drug) markItemViewed("pharmacology", drug.id);
    if (drug) recordStudy("pharmacology", drug.id, { title_fa: drug.generic_name, title_en: drug.generic_name, subtitle: drug.drug_class || drug.category });
  }, [drug]);

  if (!drug) {
    return (
      <div className="page">
        <EmptyState
          icon="❓"
          title="این دارو پیدا نشد"
          description="ممکن است لینک نادرست باشد یا دارو حذف شده باشد."
        />
        <BackButton onClick={() => navigate(-1)} label="بازگشت" />
      </div>
    );
  }

  return <DrugStudy drug={drug} suffixTip={suffixTip} />;
}

export function DrugStudy({ drug, suffixTip = matchSuffixTip(drug.generic_name) }) {
  if (usesStudyLayout("pharmacology", drug.id)) return <DisciplinePilot item={drug} discipline="pharmacology" category={drug.category} suffixTip={suffixTip} />;
  return <main className="academic-ui academic-topic academic-shared-study" dir="rtl" lang="fa">
    <StudyHeader subject="داروشناسی" subjectPath="/pharmacology" category={drug.category} titleEn={drug.generic_name}
      favorite={{ id: drug.id, type: "pharmacology", title_fa: drug.generic_name, title_en: drug.generic_name, subtitle: drug.drug_class }}>
      {drug.brand_names?.length > 0 && <p className="academic-brands" dir="ltr">{drug.brand_names.join(" · ")}</p>}
    </StudyHeader>
    <Disclaimer />
    <StudySection title="گروه دارویی" value={drug.drug_class} expanded />
    {suffixTip && <StudySection title="نکته پسوند" expanded><p>نام این دارو با پسوند <bdi dir="ltr">{suffixTip.suffix}</bdi> تمام می‌شود؛ این پسوند معمولاً نشانه‌ی <strong>{suffixTip.class_fa}</strong> (<bdi dir="ltr">{suffixTip.class_en}</bdi>) است.</p></StudySection>}
    <StudySection title="مکانیسم اثر" value={drug.mechanism} expanded />
    {SECTIONS.map(({ key, label }) => <StudySection key={key} title={label} value={drug[key]} />)}
    <StudySection title="نکته امتحانی" value={drug.exam_tips} exam />
    <StudyQuizLink to={`/quiz/pharmacology/${encodeURIComponent(drug.category)}`} category={drug.category} />
  </main>;
}

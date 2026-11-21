import { Link } from "react-router-dom";
import { StudyHeader, StudyText, StudyQuizLink } from "./StudyExperience.jsx";
import MedicalIcon from "./MedicalIcon.jsx";
import ImageViewer from "./ImageViewer.jsx";
import Disclaimer from "../../pages/Pharmacology/components/Disclaimer.jsx";
import "./DisciplinePilot.css";

const hist = [["microscopic_features","ویژگی‌های میکروسکوپی"],["locations","محل‌های آناتومیک"],["diagnostic_clues","سرنخ‌های تشخیصی"],["common_confusions","افتراق و اشتباهات رایج"],["tissue_overview","مرور بافت"],["learning_objectives","اهداف یادگیری"],["identification_strategy","راهبرد شناسایی"],["recognition_steps","شناسایی گام‌به‌گام"],["low_power_findings","بزرگ‌نمایی کم"],["high_power_findings","بزرگ‌نمایی زیاد"],["diagnostic_landmarks","نشانه‌های تشخیصی"],["structures_missed","ساختارهای از قلم افتاده"],["exam_traps","تله‌های امتحانی"],["differential_identification","افتراق شناسایی"],["clinical_relevance","اهمیت بالینی"],["mnemonics","یادیارها"],["exam_tips","نکات امتحانی"],["summary","جمع‌بندی سریع"]];
const pharm = [["drug_class","گروه دارویی"],["mechanism","مکانیسم اثر"],["indications","موارد مصرف"],["adverse_effects","عوارض جانبی"],["contraindications","موارد منع مصرف"],["interactions","تداخلات دارویی"],["exam_tips","نکات امتحانی"]];
const path = [["definition","تعریف"],["gross_features","مورفولوژی ماکروسکوپی"],["microscopic_features","ویژگی‌های میکروسکوپی"],["diagnostic_clues","سرنخ‌های تشخیصی"],["differential_diagnosis","مفاهیم افتراقی"],["common_confusions","اشتباهات رایج"],["exam_tips","نکات امتحانی"],["etiology","علل و منشأ"],["pathogenesis","پاتوژنز"],["clinical_features","تظاهرات بالینی"],["complications","عوارض"],["exam_trap","تله امتحانی"],["mnemonic","یادیار"],["quick_summary","جمع‌بندی سریع"]];
function Lines({value}) { return Array.isArray(value) ? <ul>{value.map((line,i)=><li key={i}><StudyText text={line}/></li>)}</ul> : <p><StudyText text={value}/></p>; }
export default function DisciplinePilot({item,discipline,category,children,suffixTip}) {
 const histologyPrimary = ["microscopic_features", "locations", "diagnostic_clues", "common_confusions"];
 const isDrug=discipline==="pharmacology";
 const subject={histology:"بافت‌شناسی",pharmacology:"داروشناسی",pathology:"پاتولوژی"}[discipline];
 const entries=(isDrug?pharm:discipline==="histology"?hist:path).filter(([key])=>Array.isArray(item[key])?item[key].length:typeof item[key]==="string"&&item[key].trim());
 const supplementaryStart = entries.findIndex(([key]) => !histologyPrimary.includes(key));
 return <main className={`academic-ui academic-topic discipline-pilot discipline-${discipline}`} dir="rtl" lang="fa">
 <StudyHeader subject={subject} subjectPath={`/${discipline}`} category={category} titleFa={item.title_fa} titleEn={item.title_en||item.generic_name} favorite={{id:item.id,type:discipline,title_fa:item.title_fa||item.generic_name,title_en:item.title_en||item.generic_name,subtitle:category}}>{isDrug && item.brand_names?.length > 0 && <p className="discipline-brands" dir="ltr">{item.brand_names.join(" · ")}</p>}</StudyHeader>
 <div className="discipline-identity"><MedicalIcon name={discipline} size={48}/><div><span>مطالعهٔ {subject}</span><strong>{discipline==="histology"?"از تصویر به شناسایی بافت":isDrug?"از مکانیسم به نکات کلیدی":"از مورفولوژی به افتراق"}</strong></div></div>
 {isDrug && <Disclaimer/>}
 {children}
 {!isDrug&&<section className="discipline-specimen" aria-label="تصویر آموزشی"><div className="discipline-image-label"><span>نمای آموزشی</span><span>بررسی و بزرگ‌نمایی تصویر</span></div><ImageViewer image={item.image} titleEn={item.title_en} neutralSourceLabel enlargeLabel="بزرگ‌نمایی تصویر"/></section>}
 <nav className="discipline-index" aria-label="فهرست مطالعه">{entries.filter(([key],i)=>i<5||key==="exam_tips").map(([key,label])=><a key={key} href={`#pilot-${key}`}>{label}</a>)}</nav>
 <div className="discipline-content">{entries.map(([key,label],i)=><div key={key}>
 {discipline === "histology" && i === supplementaryStart && <><Link className="discipline-quick-quiz" to={`/quiz/histology/${encodeURIComponent(category)}`}>آزمون این دسته ←</Link><header className="discipline-supplement"><span>برای مطالعهٔ بیشتر</span><h2>اطلاعات تکمیلی بافت</h2><p>مرور، راهبرد شناسایی و جزئیات بیشتر</p></header></>}
 <section id={`pilot-${key}`} className={`discipline-section discipline-field-${key} ${key.includes("exam")?"discipline-exam":""} ${key==="mechanism"?"discipline-mechanism":""}`}><div className="discipline-section-heading"><span aria-hidden="true">{String(i+1).padStart(2,"0")}</span><h2>{label}</h2></div><Lines value={item[key]}/></section>
 </div>)}</div>
 {suffixTip&&<section className="discipline-section"><h2>نکته پسوند</h2><p>نام این دارو با پسوند <bdi dir="ltr">{suffixTip.suffix}</bdi> تمام می‌شود؛ این پسوند معمولاً نشانه‌ی <strong>{suffixTip.class_fa}</strong> (<bdi dir="ltr">{suffixTip.class_en}</bdi>) است.</p></section>}
 {item.self_check?.length>0&&<section className="discipline-section"><h2>خودآزمایی</h2>{item.self_check.map((qa,i)=><details key={i}><summary>{qa.q}</summary><p>{qa.a}</p></details>)}</section>}
 <StudyQuizLink to={`/quiz/${discipline}/${encodeURIComponent(category)}`} category={category}/>
 </main>;
}

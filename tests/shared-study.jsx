import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MemoryRouter } from "react-router-dom";
import BottomNav from "../src/shared/components/BottomNav.jsx";
import Subjects from "../src/pages/Subjects/Subjects.jsx";
import Settings from "../src/pages/Settings/Settings.jsx";
import { HistologyStudy } from "../src/pages/Histology/HistologyDetail.jsx";
import { DrugStudy } from "../src/pages/Pharmacology/DrugDetail.jsx";
import PathologyStudy from "../src/pages/Pathology/MeningiomaStudy.jsx";
import histology from "../src/data/histology.json";
import pharmacology from "../src/data/pharmacology.json";
import pathology from "../src/data/pathology.json";
import histologyQuestions from "../src/pages/Quiz/data/histologyQuestions.json";
import pharmacologyQuestions from "../src/pages/Quiz/data/pharmacologyQuestions.json";
import pathologyQuestions from "../src/pages/Quiz/data/pathologyQuestions.json";

const root = createRoot(document.getElementById("root"));
const normalize = text => String(text).replace(/\s+/g, " ").trim();
function check(ok, message) { if (!ok) throw new Error(message); }
function render(element, path = "/") {
  flushSync(() => root.render(<MemoryRouter key={path} initialEntries={[path]} future={{v7_startTransition:false,v7_relativeSplatPath:true}}>{element}</MemoryRouter>));
}
function checkFields(item, fields) {
  const text = normalize(document.querySelector("main").textContent);
  for (const key of fields) {
    const lines = Array.isArray(item[key]) ? item[key] : item[key] ? [item[key]] : [];
    for (const line of lines) check(text.includes(normalize(line)), `Lost medical text: ${item.id}.${key}`);
  }
}
function assertRollout(subject, id) {
  check(document.querySelector(`.discipline-pilot.discipline-${subject}`), `New layout missing: ${subject}/${id}`);
  check(!document.querySelector("main:not(.discipline-pilot)"), `Legacy layout selected: ${subject}/${id}`);
  const sections = [...document.querySelectorAll(".discipline-section[id]")];
  check(sections.every((section, i) => section.querySelector(".discipline-section-heading > span")?.textContent === String(i + 1).padStart(2, "0")), `Section numbering inconsistent: ${id}`);
  const viewer = document.querySelector(".image-viewer");
  if (viewer?.querySelector(".image-viewer__badge--type")?.textContent === "نمودار شماتیک") {
    check(!viewer.querySelector(".image-viewer__badge--stain"), `Diagram mislabeled as stained slide: ${id}`);
  }
  for (const section of document.querySelectorAll(".discipline-section[id]")) {
    check(section.querySelector("p, li")?.textContent.trim(), `Blank section: ${id}/${section.id}`);
    check(!section.closest("details"), `Essential section hidden: ${id}/${section.id}`);
  }
}
function quizLink(bank) {
  const href = document.querySelector(".academic-study-next a")?.getAttribute("href");
  check(href, "Missing study-to-quiz link");
  const category = decodeURIComponent(href.split("/").at(-1));
  check(bank.some(q => q.category === category), `Unreachable quiz category ${category}`);
}

window.sharedStudyTest = (async () => {
  check(histology.items.length === 25 && pharmacology.drugs.length === 102 && pathology.items.length === 162, "Topic inventory changed");
  check(histologyQuestions.length + pharmacologyQuestions.length + pathologyQuestions.length === 383, "Question inventory changed");
  const activeCases = [["/", "/"], ["/subjects", "/subjects"], ["/histology/example", "/subjects"], ["/pharmacology/example", "/subjects"], ["/pathology/example", "/subjects"], ["/quiz", "/quiz"], ["/game", "/game"], ["/settings", "/settings"], ["/favorites", "/settings"], ["/progress", "/settings"]];
  for (const [path, expected] of activeCases) {
    render(<BottomNav />, path);
    const links = [...document.querySelectorAll("nav a")];
    check(links.length === 5, "Navigation must have five destinations");
    check(links.map(a => a.textContent).join("|") === "خانه|درس‌ها|آزمون|بازی|بیشتر", "Navigation labels changed");
    check(links.filter(a => a.getAttribute("aria-current") === "page").length === 1, "Ambiguous active destination");
    check(document.querySelector('[aria-current="page"]').getAttribute("href") === expected, `Wrong active destination: ${path}`);
  }
  render(<Subjects />);
  for (const subject of ["histology", "pharmacology", "pathology"]) check(document.querySelector(`a[href="/${subject}"]`), "Subject missing");
  render(<Settings />);
  for (const path of ["/favorites", "/progress", "/review", "/histology/atlas"]) check(document.querySelector(`a[href="${path}"]`), "Secondary feature missing: " + path);
  check(document.body.textContent.includes("بازنشانی رکورد بازی حافظه"), "Existing settings removed");
  for (const item of histology.items) {
    render(<HistologyStudy item={item} />);
    assertRollout("histology", item.id);
    if (!item.image?.url) check(document.querySelector(".image-viewer--placeholder"), `Missing Histology image needs neutral state: ${item.id}`);
    if (item.id === "simple-squamous-epithelium") {
      const ids=[...document.querySelectorAll(".discipline-section[id]")].slice(0,4).map(el=>el.id);
      check(ids.join("|") === "pilot-microscopic_features|pilot-locations|pilot-diagnostic_clues|pilot-common_confusions", "Essential histology order regressed");
      check(document.querySelector(".discipline-supplement"), "Supplementary group missing");
      check(document.querySelector(".discipline-quick-quiz"), "Early quiz access missing");
      check(!document.querySelector(".discipline-content details"), "Essential content hidden behind accordion");
    }
    checkFields(item, ["title_fa", "title_en", "learning_objectives", "tissue_overview", "identification_strategy", "recognition_steps", "microscopic_features", "low_power_findings", "high_power_findings", "diagnostic_landmarks", "locations", "diagnostic_clues", "structures_missed", "common_confusions", "exam_traps", "differential_identification", "clinical_relevance", "mnemonics", "exam_tips", "summary"]);
    for (const qa of item.self_check || []) { check(document.body.textContent.includes(qa.q), "Self-check question lost"); check(document.body.textContent.includes(qa.a), "Self-check answer lost"); }
    quizLink(histologyQuestions);
  }
  for (const drug of pharmacology.drugs) {
    render(<DrugStudy drug={drug} />);
    assertRollout("pharmacology", drug.id);
    if (/[A-Za-z]/.test(drug.drug_class || "") && !/[\u0600-\u06ff]/.test(drug.drug_class)) {
      const isolated = document.querySelector("#pilot-drug_class p > bdi");
      check(isolated?.getAttribute("dir") === "ltr" && isolated.textContent === drug.drug_class, `English drug class fragmented: ${drug.id}`);
    }
    for (const field of ["drug_class", "mechanism", "indications", "adverse_effects", "contraindications", "interactions", "exam_tips"]) {
      if (!drug[field] || (Array.isArray(drug[field]) && !drug[field].length)) check(!document.getElementById(`pilot-${field}`), `Empty drug field rendered: ${drug.id}.${field}`);
    }
    if (drug.id === "amoxicillin") {
      check(document.querySelectorAll(".discipline-section[id]").length === 7, "Seven drug categories must remain");
      check(document.querySelector(".academic-topic__heading .discipline-brands"), "Brands must be secondary title metadata");
    }
    checkFields(drug, ["generic_name", "drug_class", "mechanism", "indications", "adverse_effects", "contraindications", "interactions", "exam_tips"]);
    for (const brand of drug.brand_names || []) check(document.body.textContent.includes(brand), "Brand lost");
    check(document.querySelector('[role="note"]'), "Medical disclaimer removed");
    quizLink(pharmacologyQuestions);
  }
  for (const item of pathology.items) {
    render(<PathologyStudy item={item} view="notes" onViewChange={() => {}} />);
    assertRollout("pathology", item.id);
    if (!item.image?.url || item.image.url.endsWith(".svg")) check(document.querySelector(".image-viewer--placeholder"), `Pathology image safety fallback missing: ${item.id}`);
    checkFields(item, ["title_fa", "title_en", "definition", "pathogenesis", "etiology", "gross_features", "microscopic_features", "clinical_features", "diagnostic_clues", "differential_diagnosis", "complications", "common_confusions", "exam_tips", "exam_trap", "mnemonic", "quick_summary"]);
    quizLink(pathologyQuestions);
    const image = document.querySelector(".image-viewer__img");
    check(!image?.getAttribute("src").endsWith(".svg"), "Unverified Pathology SVG exposed");
  }
  flushSync(() => root.unmount());
  return `PASS: 5 destinations, secondary access, 25 Histology / 102 Pharmacology / 162 Pathology records preserve educational text and valid quiz links`;
})();

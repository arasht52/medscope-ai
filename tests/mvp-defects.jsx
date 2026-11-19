import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import QuestionCard from "../src/pages/Quiz/components/QuestionCard.jsx";
import { HistologyCategoryQuiz, HistologyCombinedQuiz } from "../src/pages/Quiz/pages/HistologyQuiz.jsx";
import { PharmacologyCategoryQuiz, PharmacologyCombinedQuiz } from "../src/pages/Quiz/pages/PharmacologyQuiz.jsx";
import HistologyImageQuiz from "../src/pages/Quiz/pages/HistologyImageQuiz.jsx";
import QuizHome from "../src/pages/Quiz/pages/QuizHome.jsx";
import { buildDeck } from "../src/pages/Game/gameDeck.js";
import { buildImageIdentificationQuiz } from "../src/shared/lib/imageQuiz.js";
import { approvedPathologyQuizImages } from "../src/shared/lib/pathologyQuizImages.js";
import pathology from "../src/data/pathology.json";
import histology from "../src/data/histology.json";

const root = createRoot(document.getElementById("root"));
const render = el => flushSync(() => root.render(el));
function check(ok, message) { if (!ok) throw new Error(message); }
function routed(path, pattern, element) {
  render(null);
  render(<MemoryRouter initialEntries={[path]}><Routes><Route path={pattern} element={element} /></Routes></MemoryRouter>);
}
window.mvpTest = (async () => {
  const questions = buildImageIdentificationQuiz(pathology.items, { count: 30, idPrefix: "test", approvedImageUrls: approvedPathologyQuizImages });
  for (const question of questions) {
    render(<QuestionCard question={{...question, topicTitleEn: "SECRET DIAGNOSIS"}} index={0} total={30} onSelect={() => {}} />);
    const img = document.querySelector(".image-viewer__img");
    check(img?.getAttribute("src") === question.image.url, "Approved image missing");
    check(img.alt === "تصویر آموزشی برای شناسایی در این سؤال", "Non-neutral alt");
    check(!document.querySelector(".question-card__topic"), "Title leaked");
    check(!document.querySelector(".image-viewer__labels"), "Labels leaked");
    check(!document.querySelector(".image-viewer__caption").textContent.includes(question.image.alt), "Caption leaked");
    const credits = [...document.querySelectorAll("a")].map(a => a.href).join("|");
    check(credits.includes(question.image.rightsCredit?.sourceUrl || question.image.attribution), "Source removed");
    render(<QuestionCard question={question} selectedOptionId={question.correctOptionId} index={0} total={30} onSelect={() => {}} />);
    check(document.querySelector(".image-viewer__caption").textContent === question.image.alt, "Caption not restored");
    check(document.querySelector(".answer-option--selected-correct"), "Correct feedback lost");
  }
  for (const [subject, Category, Combined] of [["histology", HistologyCategoryQuiz, HistologyCombinedQuiz], ["pharmacology", PharmacologyCategoryQuiz, PharmacologyCombinedQuiz]]) {
    for (const bad of ["%25", "%E0%A4%A"]) {
      routed(`/quiz/${subject}/${bad}`, `/quiz/${subject}/:category`, <Category />);
      check(document.querySelector(".quiz-play__empty"), "Malformed category crashed");
      routed(`/quiz/${subject}/custom/${bad}`, `/quiz/${subject}/custom/:cats`, <Combined />);
      check(document.querySelector(".quiz-play__empty"), "Malformed combined route crashed");
    }
    const category = subject === "histology" ? "بافت عصبی" : "Anesthetics";
    routed(`/quiz/${subject}/${encodeURIComponent(category)}`, `/quiz/${subject}/:category`, <Category />);
    check(document.querySelectorAll(".answer-option").length === 4, "Normal category failed");
  }
  routed("/quiz/histology-image", "/quiz/histology-image", <HistologyImageQuiz />);
  check(document.querySelector('[dir="rtl"] [role="status"]'), "Unavailable RTL state missing");
  check(document.body.textContent.includes("بازگشت به آزمون‌ها"), "Return action missing");
  check(!document.querySelector(".question-card"), "Unavailable quiz generated questions");
  routed("/quiz", "/quiz", <QuizHome />);
  check(!document.body.textContent.includes("Histology Image Quiz"), "Disabled entry remains");
  const eligible = histology.items.filter(it => it.image_url && it.image?.url === it.image_url && it.image.verifiedOpenLicense);
  const deck = buildDeck("histology", 100);
  check(deck.length === eligible.length * 2, "Eligible image pool mismatch");
  for (const card of deck) {
    check(card.content, "Blank card");
    check(deck.filter(c => c.pairId === card.pairId).length === 2, "Invalid pair");
    check(eligible.some(it => it.id === card.pairId), "Ineligible topic entered deck");
  }
  check(pathology.items.find(it => it.id === "pulmonary-carcinoid-tumor").exam_tips.some(t => t.includes("۲ mm²") && t.includes("و/یا")), "Carcinoid criteria regression");
  render(null);
  return "PASS";
})();

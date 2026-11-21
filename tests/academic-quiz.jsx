import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { PharmacologyCategoryQuiz } from "../src/pages/Quiz/pages/PharmacologyQuiz.jsx";
import QuizResult from "../src/pages/Quiz/pages/QuizResult.jsx";
import QuestionCard from "../src/pages/Quiz/components/QuestionCard.jsx";
import bank from "../src/pages/Quiz/data/pharmacologyQuestions.json";
import histology from "../src/data/histology.json";

const root = createRoot(document.getElementById("root"));
const questions = bank.filter(q=>q.category==="GI");
function check(ok,msg){if(!ok)throw new Error(msg);}
async function settle(){await new Promise(r=>setTimeout(r,0));}
async function click(el){check(el,"Missing control");check(!el.disabled,"Control disabled");flushSync(()=>el.click());await settle();}
function button(text){return [...document.querySelectorAll("button")].find(b=>b.textContent.trim()===text);}
function option(o){return [...document.querySelectorAll(".answer-option")].find(b=>b.querySelector(".answer-option__text_en")?.textContent===o.text_en);}
function order(){return [...document.querySelectorAll(".answer-option__text_en")].map(e=>e.textContent).join("|");}
function route(path){flushSync(()=>root.render(<MemoryRouter key={path} initialEntries={[path]}><Routes><Route path="/quiz/pharmacology/:category" element={<PharmacologyCategoryQuiz/>}/><Route path="/quiz/pharmacology/:category/result" element={<QuizResult/>}/></Routes></MemoryRouter>));}
window.academicQuizTest=(async()=>{
 route("/quiz/pharmacology/GI");await settle();
 check(document.querySelector(".academic-quiz"),"Prototype missing");
 check(document.querySelectorAll(".answer-option").length===4,"Four options required");
 check([...document.querySelectorAll(".question-card__question bdi")].some(e=>e.textContent==="H+/K+-ATPase" && e.dir==="ltr"),"Medical formula must remain in one LTR run");
 check(button("ثبت پاسخ")?.disabled,"Submission must initially be disabled");
 const initial=order();const q=questions[0],correct=q.options.find(o=>o.id===q.correctOptionId),wrong=q.options.find(o=>o.id!==q.correctOptionId);
 await click(option(wrong));check(!document.querySelector('[role="status"]'),"Premature feedback");check(!document.querySelector(".question-card__explanation"),"Explanation leaked");check(option(wrong).getAttribute("aria-pressed")==="true","Selected state missing");
 await click(option(correct));check(order()===initial,"Selection reshuffled options");
 await click(button("ثبت پاسخ"));check(document.querySelector('[role="status"]').textContent.includes("پاسخ شما صحیح است"),"Correct feedback missing");
 check(document.querySelector(".question-card__explanation").textContent.includes(q.explanation_fa),"Approved explanation lost");check([...document.querySelectorAll(".answer-option")].every(b=>b.disabled),"Submitted answers not locked");check(order()===initial,"Feedback reshuffled options");
 await click(button("سؤال بعدی"));check(button("ثبت پاسخ").disabled,"Pending selection leaked to next question");
 for(let i=1;i<questions.length;i++){
  const q=questions[i];check(document.querySelector(".question-card__question").textContent===q.question_fa,"Question order changed");const o=q.options.find(o=>i===1?o.id!==q.correctOptionId:o.id===q.correctOptionId);await click(option(o));await click(button("ثبت پاسخ"));
  if(i===1)check(document.querySelector('[role="status"]').textContent.includes("پاسخ شما نادرست است"),"Wrong feedback missing");
  await click(button(i===questions.length-1?"مشاهده نتیجه":"سؤال بعدی"));
 }
 await settle();check(document.querySelector(".academic-quiz--results"),"Results not scoped");check(document.querySelector(".score-summary__fraction").textContent.includes("3 از 4"),"Scoring changed");check(document.querySelector(".score-summary__pct").textContent==="75%","Percentage changed");check(document.querySelectorAll(".wrong-answer-item").length===1,"Wrong answer review lost");check(document.querySelector(".wrong-answer-item").textContent.includes(questions[1].explanation_fa),"Review explanation mismatch");
 await click(button("تکرار آزمون"));check(button("ثبت پاسخ").disabled,"Retake not reset");check(!document.querySelector('[role="status"]'),"Retake feedback leaked");
 route("/quiz/pharmacology/CNS");await settle();check(document.querySelector(".academic-quiz"),"CNS rollout missing");check(button("ثبت پاسخ").disabled,"CNS explicit submission missing");const first=document.querySelector(".answer-option");await click(first);check(!document.querySelector(".question-card__explanation"),"CNS feedback leaked before submit");await click(button("ثبت پاسخ"));check(document.querySelector(".question-card__explanation"),"CNS feedback missing");
 const image=histology.items[0].image;const sample={...questions[0],image,topicTitleEn:histology.items[0].title_en};
 flushSync(()=>root.render(<QuestionCard academic question={sample} index={0} total={1} onSelect={()=>{}}/>));
 check(!document.querySelector(".question-card__topic"),"Answer-bearing topic leaked");check(!document.querySelector("img"),"Answer-bearing diagram must wait until submission");check(!document.querySelector(".image-viewer__label"),"Image labels leaked");check(!document.querySelector(".image-viewer__badge--stain"),"Diagram mislabeled");
 flushSync(()=>root.unmount());return "PASS: explicit submission, stable choices, scoring, feedback, review, retry, route isolation and safe image presentation";
})();

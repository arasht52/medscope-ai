import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { PathologyCategoryQuiz } from "../src/pages/Quiz/pages/PathologyQuiz.jsx";
import PathologyImageQuiz from "../src/pages/Quiz/pages/PathologyImageQuiz.jsx";
import HistologyImageQuiz from "../src/pages/Quiz/pages/HistologyImageQuiz.jsx";
import QuizResult from "../src/pages/Quiz/pages/QuizResult.jsx";
import QuestionCard from "../src/pages/Quiz/components/QuestionCard.jsx";
import { academicQuizMeta } from "../src/pages/Quiz/components/AcademicQuiz.jsx";
import pathology from "../src/data/pathology.json";
import bank from "../src/pages/Quiz/data/pathologyQuestions.json";
const root=createRoot(document.getElementById("root"));
function check(ok,msg){if(!ok)throw new Error(msg);}
async function tick(){await new Promise(r=>setTimeout(r,0));}
async function click(e){check(e&&!e.disabled,"Invalid control");flushSync(()=>e.click());await tick();}
function button(t){return [...document.querySelectorAll("button")].find(e=>e.textContent.trim()===t);}
function render(path){flushSync(()=>root.render(<MemoryRouter key={path} initialEntries={[path]}><Routes><Route path="/quiz/pathology/:category" element={<PathologyCategoryQuiz/>}/><Route path="/quiz/pathology/:category/result" element={<QuizResult/>}/><Route path="/quiz/pathology-image" element={<PathologyImageQuiz/>}/><Route path="/quiz/pathology-image/result" element={<QuizResult/>}/><Route path="/quiz/histology-image" element={<HistologyImageQuiz/>}/></Routes></MemoryRouter>));}
function option(en){return [...document.querySelectorAll(".answer-option")].find(e=>e.querySelector(".answer-option__text_en")?.textContent===en);}
window.expansionTest=(async()=>{
 check(academicQuizMeta("/quiz/pathology/General%20Pathology/result")?.subject==="پاتولوژی","Pathology metadata missing");
 for(const path of ["/quiz/pathology/Renal","/quiz/pathology/custom/GI","/quiz/pharmacology/CNS"]) check(academicQuizMeta(path),"Rollout metadata missing");
 check(!academicQuizMeta("/quiz/pathology/%E0%A4%A"),"Malformed metadata accepted");
 const qs=bank.filter(q=>q.category==="General Pathology");render("/quiz/pathology/General%20Pathology");await tick();
 for(let i=0;i<qs.length;i++){
  const q=qs[i];check(document.querySelector(".academic-quiz"),"Standard prototype missing");check(document.querySelector(".question-card__question").textContent===q.question_fa,"Selection/order changed");
  const o=q.options.find(o=>i===1?o.id!==q.correctOptionId:o.id===q.correctOptionId);await click(option(o.text_en));check(!document.querySelector('[role="status"]'),"Feedback before submit");await click(button("ثبت پاسخ"));
  const status=document.querySelector('[role="status"]');check(document.activeElement===status,"Feedback focus lost");check(!!(document.querySelector('.question-card__options').compareDocumentPosition(status)&4),"Feedback must follow options");check(document.querySelector('.question-card__explanation').textContent.includes(q.explanation_fa),"Explanation altered");
  await click(button(i===qs.length-1?"مشاهده نتیجه":"سؤال بعدی"));
 }
 check(document.querySelector('.score-summary__fraction').textContent.includes(`${qs.length-1} از ${qs.length}`),"Standard score changed");await click(button("تکرار آزمون"));check(button("ثبت پاسخ").disabled,"Standard retry failed");
 render("/quiz/pathology/Renal");await tick();check(document.querySelector('.academic-quiz'),"Other pathology category rollout missing");
 render("/quiz/pathology-image");await tick();
 for(let i=0;i<8;i++){
  const image=document.querySelector('.image-viewer__img');check(image,"Approved image missing");check(image.getAttribute('alt')==="تصویر آموزشی برای شناسایی در این سؤال","Image alt leaks diagnosis");check(!document.querySelector('.image-viewer__label'),"Image labels leak");
  const item=pathology.items.find(x=>x.image?.url===image.getAttribute('src'));check(item,"Unapproved image entered");check(!document.querySelector('.image-viewer__caption').textContent.includes(item.title_en),"Caption leaks");
  const choice=i===1?[...document.querySelectorAll('.answer-option__text_en')].find(e=>e.textContent!==item.title_en).textContent:item.title_en;await click(option(choice));check(document.querySelector('.image-viewer__img').getAttribute('alt')!==item.image.alt,"Pending answer reveals image");await click(button("ثبت پاسخ"));check(document.querySelector('.image-viewer__caption').textContent===item.image.alt,"Educational caption not restored");await click(button(i===7?"مشاهده نتیجه":"سؤال بعدی"));
 }
 check(document.querySelector('.score-summary__fraction').textContent.includes('7 از 8'),"Image score changed");await click(button("تکرار آزمون"));check(button("ثبت پاسخ").disabled,"Image retry failed");
 render('/quiz/histology-image');await tick();check(!document.querySelector('.answer-option'),"Unavailable quiz has questions");check(document.querySelector('[role="status"]').textContent.includes('در دسترس نیست'),"Unavailable explanation missing");check(button('بازگشت به آزمون‌ها'),"Unavailable return missing");
 const item=pathology.items.find(x=>x.id==='burkitt-lymphoma');const q={...qs[0],image:item.image};
 flushSync(()=>root.render(<QuestionCard academic question={q} index={0} total={1} onSelect={()=>{}}/>));check(!document.querySelector('.image-viewer__credit').textContent.includes(item.image.rightsCredit.publication),"Publication title leaks");check(document.querySelector('.image-viewer__credit').textContent.includes('ارجاع انتشار اصلی'),"Publication source inaccessible");
 flushSync(()=>root.render(<QuestionCard academic question={q} selectedOptionId={q.correctOptionId} index={0} total={1} onSelect={()=>{}}/>));check(document.querySelector('.image-viewer__credit').textContent.includes(item.image.rightsCredit.publication),"Publication attribution not restored");
 flushSync(()=>root.unmount());return 'PASS: selected standard/image routes, full completion/retry, focus, captions, publication title, unavailable Histology and isolation';
})();

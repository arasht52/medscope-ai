import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HistologyCategoryQuiz, HistologyCombinedQuiz } from "../src/pages/Quiz/pages/HistologyQuiz.jsx";
import { PharmacologyCategoryQuiz, PharmacologyCombinedQuiz } from "../src/pages/Quiz/pages/PharmacologyQuiz.jsx";
import { PathologyCategoryQuiz, PathologyCombinedQuiz } from "../src/pages/Quiz/pages/PathologyQuiz.jsx";
import QuestionCard from "../src/pages/Quiz/components/QuestionCard.jsx";
import pathology from "../src/data/pathology.json";
import { approvedPathologyQuizImages } from "../src/shared/lib/pathologyQuizImages.js";
import QuizResult from "../src/pages/Quiz/pages/QuizResult.jsx";
import QuizPlay from "../src/pages/Quiz/pages/QuizPlay.jsx";
import h from "../src/pages/Quiz/data/histologyQuestions.json";
import ph from "../src/pages/Quiz/data/pharmacologyQuestions.json";
import pa from "../src/pages/Quiz/data/pathologyQuestions.json";
import { buildImageIdentificationQuiz } from "../src/shared/lib/imageQuiz.js";
const root=createRoot(document.getElementById("root"));
const check=(v,m)=>{if(!v)throw Error(m);};
const tick=()=>new Promise(r=>setTimeout(r,0));
async function click(e){check(e&&!e.disabled,"Missing/enabled control");flushSync(()=>e.click());await tick();}
const button=t=>[...document.querySelectorAll('button')].find(e=>e.textContent.trim()===t);
function render(subject,path,Component){flushSync(()=>root.render(<MemoryRouter key={path} initialEntries={[path]}><Routes><Route path={`/quiz/${subject}/:category`} element={<Component/>}/><Route path={`/quiz/${subject}/:category/result`} element={<QuizResult/>}/><Route path={`/quiz/${subject}/custom/:cats`} element={<Component/>}/><Route path={`/quiz/${subject}/custom/:cats/result`} element={<QuizResult/>}/></Routes></MemoryRouter>));}
window.globalQuizTest=(async()=>{
 for(const [subject,bank,Component,Combined] of [["histology",h,HistologyCategoryQuiz,HistologyCombinedQuiz],["pharmacology",ph,PharmacologyCategoryQuiz,PharmacologyCombinedQuiz],["pathology",pa,PathologyCategoryQuiz,PathologyCombinedQuiz]]){
  const categories=[...new Set(bank.map(q=>q.category))];
  for(const category of categories){render(subject,`/quiz/${subject}/${encodeURIComponent(category)}`,Component);await tick();check(document.querySelector('.academic-quiz'),`Missing category ${subject}/${category}`);check(button('ثبت پاسخ').disabled,'Selection must be explicit');if(document.querySelector('.image-viewer__badge--type')?.textContent.includes('شماتیک'))check(document.querySelector('img').getAttribute('src')==='/images/histology/peripheral-nerve.svg','Unreviewed diagram visible before submission');}
  const category=categories[0],qs=bank.filter(q=>q.category===category);render(subject,`/quiz/${subject}/${encodeURIComponent(category)}`,Component);await tick();
  for(let i=0;i<qs.length;i++){
   const q=qs[i];check(document.querySelector('.question-card__question').textContent===q.question_fa,'Question content/order changed');const options=[...document.querySelectorAll('.answer-option')];const order=options.map(x=>x.querySelector('.answer-option__text_en').textContent).join('|');const choice=q.options.find(o=>i===1?o.id!==q.correctOptionId:o.id===q.correctOptionId);
   await click(options.find(e=>e.querySelector('.answer-option__text_en').textContent===choice.text_en));check(!document.querySelector('[role=status]')&&!document.querySelector('.question-card__explanation'),'Premature feedback');await click(button('ثبت پاسخ'));
   check([...document.querySelectorAll('.answer-option')].every(e=>e.disabled),'Answers not locked');check([...document.querySelectorAll('.answer-option__text_en')].map(x=>x.textContent).join('|')===order,'Option order changed after submission');check(document.querySelector('[role=status]').textContent.includes(i===1?'نادرست':'صحیح'),'Feedback incorrect');check(document.activeElement===document.querySelector('[role=status]'),'Focus lost');check(document.querySelector('.question-card__explanation').textContent.includes(q.explanation_fa),'Explanation altered');
   await click(button(i===qs.length-1?'مشاهده نتیجه':'سؤال بعدی'));
  }
  check(document.querySelector('.score-summary__fraction').textContent.includes(`${qs.length-1} از ${qs.length}`),'Score mismatch');await click(button('تکرار آزمون'));check(button('ثبت پاسخ').disabled,'Retry not reset');
  render(subject,`/quiz/${subject}/custom/${categories.slice(0,2).map(encodeURIComponent).join('|')}`,Combined);await tick();check(document.querySelector('.academic-quiz'),'Combined rollout missing');
  for(const category of ['invalid-category','%E0%A4%A','%25']){render(subject,`/quiz/${subject}/${category}`,Component);await tick();check(document.querySelector('.quiz-play__empty'),'Invalid route not safe');}
 }
 const images=buildImageIdentificationQuiz(pathology.items,{count:30,questionText:"این یافته چیست؟",idPrefix:"qa",approvedImageUrls:approvedPathologyQuizImages});check(images.length===30,'Approved image pool changed');
 for(const q of images){
  flushSync(()=>root.render(<QuestionCard academic question={q} index={0} total={30} onSelect={()=>{}}/>));
  const img=document.querySelector('.image-viewer__img');check(img&&img.alt==='تصویر آموزشی برای شناسایی در این سؤال','Answer-bearing image alt');check(!document.querySelector('[title]'),'Tooltip can reveal answer');check(!document.querySelector('.image-viewer__label'),'Image label leaks');
  const links=[...document.querySelectorAll('.image-viewer a')];for(const a of links){check(!a.textContent.includes('.jpg')&&!a.textContent.includes('http'),'Visible URL/filename leaks');check(a.target==='_blank'&&a.rel.includes('noopener'),'Unsafe external link');}
  check(!document.querySelector('.image-viewer__credit')?.textContent.includes(q.image.rightsCredit?.publication || 'UNMATCHABLE'),'Publication title leaks');
  flushSync(()=>root.render(<QuestionCard academic question={q} selectedOptionId={q.correctOptionId} index={0} total={30} onSelect={()=>{}}/>));check(document.querySelector('.image-viewer__caption').textContent===q.image.alt,'Caption not restored');
 }
 check(buildImageIdentificationQuiz([],{approvedImageUrls:[],count:8,idPrefix:'empty',questionText:'test'}).length===0,'Empty eligible image pool not safe');
 flushSync(()=>root.render(<MemoryRouter><QuizPlay questions={[]} resultPath="/quiz/pathology-image/result" homePath="/quiz" title="test"/></MemoryRouter>));await tick();check(document.querySelector('.quiz-play__empty'),'Empty quiz missing');
 flushSync(()=>root.unmount());return 'PASS: every standard category, combined routes, three full attempts, locking, results/retry, malformed/invalid routes and empty images';
})();

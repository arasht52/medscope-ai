import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MemoryRouter, useNavigate, Routes, Route } from "react-router-dom";
import QuizRouteSafety, { isMalformedQuizPath } from "../src/pages/Quiz/components/QuizRouteSafety.jsx";
import QuestionCard from "../src/pages/Quiz/components/QuestionCard.jsx";
import { shouldShowQuizImage, supplementaryHistologyDiagrams } from "../src/pages/Quiz/components/quizImagePresentation.js";
import bank from "../src/pages/Quiz/data/histologyQuestions.json";
const root=createRoot(document.getElementById('root'));
const check=(v,m)=>{if(!v)throw Error(m);};const tick=()=>new Promise(r=>setTimeout(r,0));
function Nav(){const navigate=useNavigate();return <><button onClick={()=>navigate('/quiz/histology/%E0%A4%A')}>bad</button><button onClick={()=>navigate(-1)}>back</button><button onClick={()=>navigate(1)}>forward</button></>;}
function mount(path){flushSync(()=>root.render(<MemoryRouter key={path+Math.random()} initialEntries={[path]}><Nav/><QuizRouteSafety><Routes><Route path="/quiz/histology/:category" element={<p data-testid="route">safe route</p>}/></Routes></QuizRouteSafety></MemoryRouter>));}
window.finalSafetyTest=(async()=>{
 const affected=bank.filter(q=>q.image||q.image_url);check(affected.length===6,'Review scope changed');check(Object.keys(supplementaryHistologyDiagrams).length===6,'Reviewed IDs changed');
 for(const q of affected){
  check(!/در تصویر|تصویر زیر|نشان داده شده/.test(q.question_fa),'Stem needs a new image-dependency review');
  flushSync(()=>root.render(<QuestionCard academic question={q} index={0} total={1} onSelect={()=>{}}/>));
  check(!!document.querySelector('.image-viewer__img')===(q.id==='h-nervous-1'),'Incorrect reviewed image visibility');check(document.querySelector('.question-card__question').textContent===q.question_fa,'Stem content changed');check(document.querySelectorAll('.answer-option').length===4,'Options lost');
  flushSync(()=>root.render(<QuestionCard academic question={q} selectedOptionId={q.correctOptionId} index={0} total={1} onSelect={()=>{}}/>));check(document.querySelector('img')?.getAttribute('src')===q.image.url,'Feedback image not restored');
  const {type,...missingType}=q.image;
  for(const image of [missingType,{...q.image,verifiedOpenLicense:false},{...q.image,url:null},{...q.image,type:'placeholder'}]){check(!shouldShowQuizImage(q,image,false)&&!shouldShowQuizImage(q,image,true),'Safety bypass');flushSync(()=>root.render(<QuestionCard academic question={{...q,image}} index={0} total={1} onSelect={()=>{}}/>));check(!document.querySelector('img')&&!document.querySelector('.image-viewer--placeholder'),'Invalid educational image/placeholder exposed');}
 }
 for(const path of ['/quiz/histology/%','/quiz/pathology/%E0%A4%A','/quiz/pharmacology/%ZZ']){check(isMalformedQuizPath(path),'Bad URL accepted');mount(path);await tick();check(document.querySelector('[role=status]')?.textContent.includes('معتبر نیست'),'No safe React state');check(!document.querySelector('[data-testid=route]'),'Malformed route reached route children');}
 for(const path of ['/quiz/histology/%25','/quiz/histology/invalid-category','/quiz/pharmacology/Immunosuppressant%2FAntineoplastic','/pathology/%ZZ'])check(!isMalformedQuizPath(path),'Valid/raw unrelated URL blocked');
 mount('/quiz/histology/%25');await tick();check(document.querySelector('[data-testid=route]'),'Encoded percent blocked');flushSync(()=>document.querySelector('button').click());await tick();check(document.querySelector('[role=status]'),'Client navigation not guarded');flushSync(()=>[...document.querySelectorAll('button')].find(x=>x.textContent==='back').click());await tick();check(document.querySelector('[data-testid=route]'),'Browser back failed');flushSync(()=>[...document.querySelectorAll('button')].find(x=>x.textContent==='forward').click());await tick();check(document.querySelector('[role=status]'),'Forward safety failed');
 mount('/quiz/histology/%E0%A4%A');await tick();check(document.querySelector('[role=status]'),'Direct remount/refresh fallback failed');flushSync(()=>root.unmount());return 'PASS: all six diagram questions, no invalid-image placeholders, safe raw paths, encoded percent, direct/remount/back/forward';
})();

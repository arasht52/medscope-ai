import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MemoryRouter } from "react-router-dom";
import AppErrorBoundary from "../src/shared/components/AppErrorBoundary.jsx";
import QuizRouteSafety from "../src/pages/Quiz/components/QuizRouteSafety.jsx";
const root=createRoot(document.getElementById("root"));
const check=(v,m)=>{if(!v)throw Error(m);};
let unmounted=false;
function QuizFixture(){const [crash,setCrash]=useState(false);useEffect(()=>()=>{unmounted=true;},[]);if(crash)throw Error("CONTROLLED_TEST_INTERNAL_DETAILS");return <button onClick={()=>setCrash(true)}>controlled failure</button>;}
window.errorBoundaryTest=(async()=>{
 window.__recoveries=[];window.__reload=()=>window.__recoveries.push('reload');window.__assign=path=>window.__recoveries.push(path);
 flushSync(()=>root.render(<AppErrorBoundary><MemoryRouter><QuizFixture/></MemoryRouter></AppErrorBoundary>));
 flushSync(()=>document.querySelector('button').click());
 check(document.querySelector('main[dir=rtl]'),'RTL fallback missing');check(document.querySelector('h1').textContent.includes('مشکل'),'Fallback heading missing');check(!document.body.textContent.includes('CONTROLLED_TEST_INTERNAL_DETAILS'),'Internal error leaked');check(unmounted,'Failed quiz not unmounted');check(document.activeElement===document.querySelector('h1'),'Fallback focus missing');
 const button=t=>[...document.querySelectorAll('button')].find(b=>b.textContent===t);
 flushSync(()=>button('بارگذاری دوباره').click());check(window.__recoveries[0]==='reload','Retry must reload entire application');check(!document.querySelector('button')?.textContent.includes('controlled failure'),'Corrupted quiz resumed');
 flushSync(()=>button('بازگشت به خانه').click());check(window.__recoveries[1]==='/','Home recovery not hard navigation');
 flushSync(()=>root.render(<AppErrorBoundary><p>unsafe attempt continuation</p></AppErrorBoundary>));check(!document.body.textContent.includes('unsafe attempt continuation'),'Boundary silently resumed failed state');
 flushSync(()=>root.render(<AppErrorBoundary key="fresh"><MemoryRouter initialEntries={['/quiz/pathology/%ZZ']}><QuizRouteSafety><p>invalid child</p></QuizRouteSafety></MemoryRouter></AppErrorBoundary>));check(document.querySelector('[role=status]').textContent.includes('معتبر نیست'),'QuizRouteSafety broken');check(!document.body.textContent.includes('invalid child'),'Malformed route entered child');
 flushSync(()=>root.unmount());return 'PASS: rendering fallback, focus, no stack leak, unmount, full-page recovery, no silent continuation and QuizRouteSafety';
})();

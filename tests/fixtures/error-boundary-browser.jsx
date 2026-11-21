// Local QA entry only; never imported by the production application.
import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import AppErrorBoundary from "../../src/shared/components/AppErrorBoundary.jsx";
function Drill(){const [fail,setFail]=useState(false);if(fail)throw Error("CONTROLLED_QA_RENDER_FAILURE_NOT_FOR_PRODUCTION");return <main dir="rtl" style={{padding:24,fontFamily:"Vazirmatn, sans-serif"}}><h1>محیط آزمون کنترل‌شده</h1><p>این صفحه فقط برای بررسی بازیابی است.</p><button style={{minHeight:48,padding:12}} onClick={()=>setFail(true)}>ایجاد خطای آزمایشی</button></main>;}
createRoot(document.getElementById('root')).render(<AppErrorBoundary><Drill/></AppErrorBoundary>);

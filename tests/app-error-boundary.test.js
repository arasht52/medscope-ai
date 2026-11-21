import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM, VirtualConsole } from "jsdom";
test("application Error Boundary contains render failures and requires clean recovery",async()=>{
 const {outputFiles}=await build({entryPoints:["tests/app-error-boundary.jsx"],bundle:true,write:false,format:"iife",jsx:"automatic",loader:{".css":"empty"},define:{"process.env.NODE_ENV":'"test"',"import.meta.env.DEV":"false","window.location.reload":"window.__reload","window.location.assign":"window.__assign"}});
 const errors=[];const vc=new VirtualConsole();vc.on('error',(...args)=>errors.push(args));vc.on('jsdomError',e=>errors.push(e));
 const dom=new JSDOM('<div id="root"></div>',{url:"http://localhost/quiz/pathology-image",runScripts:"outside-only",pretendToBeVisual:true,virtualConsole:vc});
 try{dom.window.eval(outputFiles[0].text);assert.match(await dom.window.errorBoundaryTest,/^PASS:/);assert(errors.length>0,'Controlled React failure was not exercised');}finally{dom.window.close();}
});

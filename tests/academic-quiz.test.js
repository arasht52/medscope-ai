import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM } from "jsdom";
test("academic GI quiz preserves engine behavior with explicit submission and route isolation", async()=>{
 const {outputFiles}=await build({entryPoints:["tests/academic-quiz.jsx"],bundle:true,write:false,format:"iife",jsx:"automatic",loader:{".css":"empty"},define:{"process.env.NODE_ENV":'"test"'}});
 const dom=new JSDOM('<div id="root"></div>',{url:"http://localhost",runScripts:"outside-only",pretendToBeVisual:true});
 dom.window.scrollTo=()=>{};
 try{dom.window.eval(outputFiles[0].text);assert.match(await dom.window.academicQuizTest,/^PASS:/);}finally{dom.window.close();}
});

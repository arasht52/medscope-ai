import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM } from "jsdom";
test("global quiz rollout preserves categories, explicit submission and safe negative states",async()=>{
 const {outputFiles}=await build({entryPoints:["tests/quiz-global-rollout.jsx"],bundle:true,write:false,format:"iife",jsx:"automatic",loader:{".css":"empty"},define:{"process.env.NODE_ENV":'"test"'}});
 const dom=new JSDOM('<div id="root"></div>',{url:"http://localhost",runScripts:"outside-only",pretendToBeVisual:true});dom.window.scrollTo=()=>{};dom.window.scrollBy=()=>{};
 try{dom.window.eval(outputFiles[0].text);assert.match(await dom.window.globalQuizTest,/^PASS:/);}finally{dom.window.close();}
});

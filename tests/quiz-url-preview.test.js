import test from "node:test";
import assert from "node:assert/strict";
import { safeQuizUrls } from "../vite.config.js";
test("preview and dev redirect malformed quiz encodings without changing assets or valid routes", () => {
 for(const hook of ["configureServer","configurePreviewServer"]){
  let middleware;const postHook=safeQuizUrls()[hook]({middlewares:{use(fn){middleware=fn;return () => {throw Error("Connect app must not be returned as post hook");};}}});assert.equal(postHook,undefined);
  for(const url of ["/quiz/histology/%E0%A4%A","/quiz/pathology/%","/quiz/pharmacology/custom/%ZZ"]){let next=false,ended=false;const headers={};const res={setHeader(k,v){headers[k]=v;},end(){ended=true;}};middleware({url},res,()=>next=true);assert.equal(res.statusCode,302);assert.equal(headers.Location,"/quiz");assert.equal(ended,true);assert.equal(next,false);}
  for(const url of ["/quiz/pathology/%25","/quiz/pharmacology/Immunosuppressant%2FAntineoplastic","/images/pathology/%ZZ.svg","/quiz/histology-image","/quiz"]){let passed=false;middleware({url},{end(){throw Error("Unexpected redirect");}},()=>passed=true);assert.equal(passed,true);}
 }
});

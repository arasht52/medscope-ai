import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM } from "jsdom";

test("Atlas preserves all existing images and never labels schematics as H&E microscopy", async () => {
  const { outputFiles } = await build({ entryPoints: ["tests/atlas-presentation.jsx"], bundle: true, write: false, format: "iife", jsx: "automatic", loader: { ".css": "empty" }, define: { "process.env.NODE_ENV": '"test"' } });
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", runScripts: "outside-only" });
  try { dom.window.eval(outputFiles[0].text); assert.match(dom.window.verifyAtlasPresentation(), /^PASS:/); }
  finally { dom.window.close(); }
});

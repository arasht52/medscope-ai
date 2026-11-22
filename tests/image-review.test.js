import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM } from "jsdom";

test("image quiz Review uses source topic identities and safely preserves legacy records", async () => {
  const { outputFiles } = await build({ entryPoints: ["tests/image-review.jsx"], bundle: true, write: false, format: "iife", jsx: "automatic", loader: { ".css": "empty" }, define: { "process.env.NODE_ENV": '"test"' } });
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", runScripts: "outside-only" });
  try { dom.window.eval(outputFiles[0].text); assert.match(dom.window.runImageReviewTests(), /^PASS:/); }
  finally { dom.window.close(); }
});

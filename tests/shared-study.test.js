import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM } from "jsdom";

test("shared navigation and study layouts preserve all 289 topics and category quiz access", async () => {
  const { outputFiles } = await build({ entryPoints: ["tests/shared-study.jsx"], bundle: true, write: false, format: "iife", jsx: "automatic", loader: { ".css": "empty" }, define: { "process.env.NODE_ENV": '"test"' } });
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", runScripts: "outside-only" });
  try {
    dom.window.eval(outputFiles[0].text);
    assert.match(await dom.window.sharedStudyTest, /^PASS:/);
  } finally { dom.window.close(); }
});

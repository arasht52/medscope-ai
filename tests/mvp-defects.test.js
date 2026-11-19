import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM } from "jsdom";

test("MVP regressions: image disclosure, safe category routes, unavailable Histology quiz and eligible memory pairs", async () => {
  const { outputFiles } = await build({ entryPoints: ["tests/mvp-defects.jsx"], bundle: true, write: false, format: "iife", jsx: "automatic", loader: { ".css": "empty" }, define: { "process.env.NODE_ENV": '"test"' } });
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", runScripts: "outside-only" });
  try {
    dom.window.eval(outputFiles[0].text);
    assert.equal(await dom.window.mvpTest, "PASS");
  } finally { dom.window.close(); }
});

import assert from "node:assert/strict";
import test from "node:test";
import { build } from "esbuild";
import { JSDOM } from "jsdom";

test("React quiz scores all four positions and preserves feedback, review and retakes", async () => {
  const { outputFiles } = await build({
    entryPoints: ["tests/quiz-interaction.jsx"],
    bundle: true,
    write: false,
    format: "iife",
    jsx: "automatic",
    loader: { ".css": "empty" },
    define: { "process.env.NODE_ENV": '"test"' },
  });
  const dom = new JSDOM('<div id="root"></div><pre id="outcome">PENDING</pre>', {
    url: "http://localhost/",
    runScripts: "outside-only",
  });
  try {
    dom.window.eval(outputFiles[0].text);
    await dom.window.quizTest;
    const outcome = dom.window.document.querySelector("#outcome").textContent;
    assert.match(outcome, /^PASS:/, outcome);
  } finally {
    dom.window.close();
  }
});

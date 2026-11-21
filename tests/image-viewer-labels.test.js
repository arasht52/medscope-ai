import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM } from "jsdom";

test("ImageViewer distinguishes schematics from real stained microscopy without changing metadata", async () => {
  const { outputFiles } = await build({
    stdin: { loader: "jsx", resolveDir: process.cwd(), contents: `
      import React from "react";
      import { createRoot } from "react-dom/client";
      import { flushSync } from "react-dom";
      import ImageViewer from "./src/shared/components/ImageViewer.jsx";
      import histology from "./src/data/histology.json";
      import pathology from "./src/data/pathology.json";
      const root = createRoot(document.getElementById("root"));
      const diagram = histology.items.find(x => x.id === "simple-squamous-epithelium").image;
      const slide = pathology.items.find(x => x.id === "meningioma").image;
      const before = JSON.stringify([diagram, slide]);
      window.labelEvidence = {};
      for (const [name, image] of [["diagram",diagram],["slide",slide]]) {
        flushSync(() => root.render(<ImageViewer image={image}/>));
        window.labelEvidence[name] = {
          type: image.type,
          badges: document.querySelector(".image-viewer__badges").textContent,
          stain: document.querySelector(".image-viewer__badge--stain")?.textContent,
          source: document.querySelector(".image-viewer").textContent.includes(image.source),
          license: document.querySelector(".image-viewer").textContent.includes(image.license),
          image: document.querySelector("img")?.getAttribute("src"),
        };
      }
      window.labelEvidence.unchanged = before === JSON.stringify([diagram, slide]);
      flushSync(() => root.unmount());
    ` },
    bundle: true, write: false, format: "iife", jsx: "automatic", loader: { ".css": "empty" },
    define: { "process.env.NODE_ENV": '"test"' },
  });
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", runScripts: "outside-only" });
  try {
    dom.window.eval(outputFiles[0].text);
    const evidence = dom.window.labelEvidence;
    assert.equal(evidence.diagram.type, "diagram");
    assert.equal(evidence.diagram.stain, undefined);
    assert.doesNotMatch(evidence.diagram.badges, /H&E|بزرگ‌نمایی/);
    assert.match(evidence.diagram.badges, /نمودار شماتیک/);
    assert.equal(evidence.slide.type, "real_slide");
    assert.match(evidence.slide.stain, /H&E/);
    assert.match(evidence.slide.badges, /اسلاید میکروسکوپی واقعی/);
    assert.ok(evidence.diagram.image && evidence.slide.image);
    assert.ok(evidence.diagram.source && evidence.slide.source);
    assert.ok(evidence.diagram.license && evidence.slide.license);
    assert.equal(evidence.unchanged, true);
  } finally { dom.window.close(); }
});

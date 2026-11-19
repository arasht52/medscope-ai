import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { build } from "esbuild";
import { buildImageIdentificationQuiz, isApprovedQuizImage } from "../src/shared/lib/imageQuiz.js";
import { approvedPathologyQuizImages as approved } from "../src/shared/lib/pathologyQuizImages.js";

const data = JSON.parse(fs.readFileSync("src/data/pathology.json", "utf8"));
const opts = { count: 100, idPrefix: "qa", questionText: "تصویر", approvedImageUrls: approved };
const excluded = ["celiac-disease", "hodgkin-lymphoma", "hepatocellular-carcinoma", "bronchogenic-carcinoma", "papillary-thyroid-carcinoma", "iron-deficiency-anemia", "pancreatic-ductal-adenocarcinoma", "amyloidosis", "acute-leukemia-aml-all"];

test("all 30 approved image questions preserve source metadata and have displayable images", () => {
  const questions = buildImageIdentificationQuiz(data.items, opts);
  assert.equal(questions.length, 30);
  for (const q of questions) {
    assert(isApprovedQuizImage(q.image, approved));
    assert(fs.existsSync("public" + q.image.url));
    const original = data.items.find(it => it.image?.url === q.image.url);
    assert.deepEqual(q.image, original.image);
    assert.equal(q.options.length, 4);
    assert(q.options.some(o => o.id === q.correctOptionId));
  }
});

test("missing license, unsafe sources and all nine excluded JPEGs are rejected", () => {
  const original = data.items.find(it => isApprovedQuizImage(it.image, approved)).image;
  for (const image of [{ ...original, license: "" }, { ...original, attribution: "javascript:alert(1)" }, { ...original, rightsCredit: { creator: "test", sourceUrl: "data:text/html,test", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" } }]) {
    assert(!isApprovedQuizImage(image, approved));
    assert.equal(buildImageIdentificationQuiz([{ id: "invalid", image }], opts).length, 0);
  }
  for (const id of excluded) {
    const url = `/images/pathology/${id}-photo.jpg`;
    assert(!isApprovedQuizImage({ ...original, url }, approved));
    assert(!approved.includes(url));
  }
});

test("approved question image renders as an img rather than a placeholder", async () => {
  const { outputFiles } = await build({ stdin: { contents: 'import React from "react"; import {renderToStaticMarkup} from "react-dom/server"; import ImageViewer from "./src/shared/components/ImageViewer.jsx"; export default image => renderToStaticMarkup(React.createElement(ImageViewer,{image}));', resolveDir: process.cwd() }, bundle: true, write: false, platform: "node", format: "esm", jsx: "automatic", loader: { ".css": "empty" }, external: ["react", "react-dom/server"] });
  // Import through a data URL; resolve React imports to their local file URLs.
  const { pathToFileURL } = await import("node:url");
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  let code = outputFiles[0].text;
  for (const name of ["react-dom/server", "react/jsx-runtime", "react"]) code = code.replaceAll(`"${name}"`, JSON.stringify(pathToFileURL(require.resolve(name)).href));
  const render = (await import("data:text/javascript;base64," + Buffer.from(code).toString("base64"))).default;
  const question = buildImageIdentificationQuiz(data.items, opts)[0];
  assert.match(render(question.image), /class="image-viewer__img"/);
  assert(!render(question.image).includes("image-viewer--placeholder"));
  const svg = data.items.find(it => it.image?.url?.endsWith(".svg"));
  assert.match(render(svg.image), /image-viewer--placeholder/);
  assert(!render(svg.image).includes('<img'));
});

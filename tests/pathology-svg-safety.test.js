import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { build } from "esbuild";
import config from "../vite.config.js";
import { isImageUsable } from "../src/shared/lib/imageSafety.js";
import { scientificallyApprovedPathologySvgs, isPathologySvgScientificallyAllowed } from "../src/shared/lib/pathologySvgSafety.js";
import { approvedPathologyQuizImages } from "../src/shared/lib/pathologyQuizImages.js";

test("scientific gate rejects all 162 Pathology SVGs independently of license", () => {
  assert.equal(scientificallyApprovedPathologySvgs.length, 0);
  const files = fs.readdirSync("public/images/pathology").filter(f => f.endsWith(".svg"));
  assert.equal(files.length, 162);
  for (const file of files) {
    const url = `/images/pathology/${file}`;
    assert(!isImageUsable({ url, type: "diagram", verifiedOpenLicense: true }));
    assert(!isPathologySvgScientificallyAllowed(url + "?v=1"));
  }
  assert(!isPathologySvgScientificallyAllowed("https://example.org/images/pathology/brain-abscess.svg"));
  assert(isPathologySvgScientificallyAllowed("/images/histology/simple-squamous-epithelium.svg"));
  for (const url of approvedPathologyQuizImages) assert(isImageUsable({url, type: "real_slide", verifiedOpenLicense: true}));
});

test("Pathology memory deck contains only approved JPEGs and other subjects remain isolated", async () => {
  const { outputFiles } = await build({entryPoints:["src/pages/Game/gameDeck.js"],bundle:true,write:false,platform:"node",format:"esm"});
  const { buildDeck } = await import("data:text/javascript;base64," + Buffer.from(outputFiles[0].text).toString("base64"));
  const deck = buildDeck("pathology", 162);
  const images = deck.filter(c => c.kind === "image");
  assert.equal(images.length, 30);
  assert(images.every(c => approvedPathologyQuizImages.includes(c.content)));
  assert.equal(deck.length, 60);
  assert(buildDeck("histology").length > 0);
  assert(buildDeck("pharmacology").every(c => c.kind === "text"));
});

test("production public-copy filter omits all SVGs and nine JPEGs without deleting sources", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "medscope-svg-qa-"));
  try {
    const plugin = config.plugins.find(p => p.name === "filtered-public-assets");
    plugin.configResolved({command:"build", root:process.cwd(), publicDir:path.resolve("public"), build:{outDir:temp}});
    plugin.closeBundle();
    const files = fs.readdirSync(path.join(temp,"images/pathology"));
    assert.equal(files.filter(f => f.endsWith(".svg")).length, 0);
    assert.deepEqual(files.filter(f => f.endsWith(".jpg")).sort(), approvedPathologyQuizImages.map(u => u.split("/").pop()).sort());
    assert.equal(fs.readdirSync("public/images/pathology").filter(f => f.endsWith(".svg")).length,162);
  } finally { fs.rmSync(temp,{recursive:true,force:true}); }
});

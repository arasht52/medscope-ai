import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

const excludedImages = new Set([
  "images/pathology/celiac-disease-photo.jpg",
  "images/pathology/hodgkin-lymphoma-photo.jpg",
  "images/pathology/hepatocellular-carcinoma-photo.jpg",
  "images/pathology/bronchogenic-carcinoma-photo.jpg",
  "images/pathology/papillary-thyroid-carcinoma-photo.jpg",
  "images/pathology/iron-deficiency-anemia-photo.jpg",
  "images/pathology/pancreatic-ductal-adenocarcinoma-photo.jpg",
  "images/pathology/amyloidosis-photo.jpg",
  "images/pathology/acute-leukemia-aml-all-photo.jpg",
]);

function filteredPublicAssets() {
  let config;
  return {
    name: "filtered-public-assets",
    configResolved(resolved) {
      config = resolved;
    },
    closeBundle() {
      if (config.command !== "build" || !config.publicDir) return;
      const output = resolve(config.root, config.build.outDir);
      const publicRelative = relative(config.publicDir, output);
      if (!publicRelative || (!publicRelative.startsWith("..") && !isAbsolute(publicRelative))) {
        throw new Error("Build output must be outside the public asset directory");
      }
      cpSync(config.publicDir, output, {
        recursive: true,
        filter: (source) => !excludedImages.has(relative(config.publicDir, source).replaceAll("\\", "/")),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), filteredPublicAssets()],
  build: { copyPublicDir: false },
});

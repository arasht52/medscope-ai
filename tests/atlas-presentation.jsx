import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import HistologyAtlas from "../src/pages/Histology/HistologyAtlas.jsx";
import histology from "../src/data/histology.json";

window.IS_REACT_ACT_ENVIRONMENT = true;
window.verifyAtlasPresentation = () => {
  const root = createRoot(document.getElementById("root"));
  const slides = histology.items.flatMap(item => item.images.map(image => ({ item, image })));
  const check = (value, message) => { if (!value) throw Error(message); };
  try {
    act(() => root.render(<MemoryRouter><HistologyAtlas /></MemoryRouter>));
    for (const { item, image } of slides) {
      check(document.querySelector("img").getAttribute("src") === image.url, "Atlas image selection changed");
      const meta = document.querySelector(".histology-atlas__meta")?.textContent || "";
      if (item.image?.type === "diagram") {
        check(meta === "نمودار شماتیک", "Schematic label missing");
        check(!/H&E|\d+x/i.test(meta), "Schematic incorrectly described as stained microscopy");
      }
      if (item.image?.type === "real_slide") {
        check(meta === [image.stain || item.stain, image.magnification].filter(Boolean).join(" • "), "Real slide metadata lost");
      }
      act(() => document.querySelector('[aria-label="تصویر بعدی"]').click());
    }
    check(document.querySelector("img").getAttribute("src") === slides[0].image.url, "Atlas wrap navigation changed");
    return `PASS: ${slides.length} existing Atlas slides preserve image URLs and navigation with type-appropriate labels`;
  } finally { act(() => root.unmount()); }
};

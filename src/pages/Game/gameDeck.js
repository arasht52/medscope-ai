// src/pages/Game/gameDeck.js
//
// Builds the card deck for the Memory Game directly from the data files
// the rest of the app already uses (histology.json / pathology.json /
// pharmacology.json). No separate game content is authored or stored —
// this keeps the game automatically in sync as those modules grow, and
// avoids a second source of truth for medical content.

import histologyData from "../../data/histology.json";
import pathologyData from "../../data/pathology.json";
import pharmacologyData from "../../data/pharmacology.json";

export const PAIR_COUNT = 6;

export const SUBJECTS = [
  {
    id: "histology",
    label_fa: "بافت‌شناسی",
    label_en: "Histology",
    description_fa: "تصویر را با اصطلاح درست جفت کن",
    back_icon: "🔬",
  },
  {
    id: "pathology",
    label_fa: "پاتولوژی",
    label_en: "Pathology",
    description_fa: "تصویر را با اصطلاح درست جفت کن",
    back_icon: "🧬",
  },
  {
    id: "pharmacology",
    label_fa: "داروشناسی",
    label_en: "Pharmacology",
    description_fa: "نام ژنریک را با نام تجاری جفت کن",
    back_icon: "💊",
  },
];

export function getSubjectMeta(subjectId) {
  return SUBJECTS.find((s) => s.id === subjectId) || null;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(items, n) {
  return shuffle(items).slice(0, Math.min(n, items.length));
}

// Histology & Pathology: pair an item's schematic image with its Persian
// term — this is the "term + image" pairing Arash asked for.
function deckFromImageItems(items, pairCount) {
  const chosen = pickRandom(items, pairCount);
  const cards = [];
  chosen.forEach((item) => {
    cards.push({
      pairId: item.id,
      kind: "image",
      content: item.image_url,
      alt: item.title_fa,
    });
    cards.push({
      pairId: item.id,
      kind: "text",
      content: item.title_fa,
      lang: "fa",
    });
  });
  return cards;
}

// Pharmacology has no per-item image, so pairs are generic name <-> brand
// name instead — the "matching drug" pairing Arash asked for.
function deckFromPharmacology(drugs, pairCount) {
  const eligible = drugs.filter((d) => d.brand_names && d.brand_names.length > 0);
  const chosen = pickRandom(eligible, pairCount);
  const cards = [];
  chosen.forEach((drug) => {
    cards.push({
      pairId: drug.id,
      kind: "text",
      content: drug.generic_name,
      lang: "en",
      tag: "ژنریک",
    });
    cards.push({
      pairId: drug.id,
      kind: "text",
      content: drug.brand_names[0],
      lang: "en",
      tag: "تجاری",
    });
  });
  return cards;
}

export function buildDeck(subjectId, pairCount = PAIR_COUNT) {
  let cards = [];
  if (subjectId === "histology") {
    cards = deckFromImageItems(histologyData.items, pairCount);
  } else if (subjectId === "pathology") {
    cards = deckFromImageItems(pathologyData.items, pairCount);
  } else if (subjectId === "pharmacology") {
    cards = deckFromPharmacology(pharmacologyData.drugs, pairCount);
  }
  return shuffle(cards).map((card, index) => ({
    ...card,
    uid: `${card.pairId}-${card.kind}-${index}`,
  }));
}

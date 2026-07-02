// src/shared/lib/topicResolver.js
//
// Resolves a (module, itemId) pair to lightweight display metadata plus a few
// "key points" used for retrieval practice in the Review screen. Kept in one
// place so the SRS engine and Review UI agree on titles. Data is imported from
// the existing local JSON (no new source of truth).

import histologyData from "../../data/histology.json";
import pathologyData from "../../data/pathology.json";
import pharmacologyData from "../../data/pharmacology.json";

const histIndex = new Map(histologyData.items.map((it) => [it.id, it]));
const pathIndex = new Map(pathologyData.items.map((it) => [it.id, it]));
const drugIndex = new Map(pharmacologyData.drugs.map((d) => [d.id, d]));

function take(arr, n) {
  return Array.isArray(arr) ? arr.slice(0, n) : [];
}

export function resolveTopic(module, itemId) {
  if (module === "histology") {
    const it = histIndex.get(itemId);
    if (!it) return null;
    return {
      module,
      itemId,
      title_fa: it.title_fa,
      title_en: it.title_en,
      subtitle: it.category,
      href: `/histology/${itemId}`,
      keyPoints: [
        ...take(it.diagnostic_clues, 2),
        ...take(it.microscopic_features, 2),
        ...take(it.exam_tips, 1),
      ],
    };
  }
  if (module === "pathology") {
    const it = pathIndex.get(itemId);
    if (!it) return null;
    return {
      module,
      itemId,
      title_fa: it.title_fa,
      title_en: it.title_en,
      subtitle: it.category,
      href: `/pathology/${itemId}`,
      keyPoints: [
        ...take(it.diagnostic_clues, 2),
        ...take(it.microscopic_features, 1),
        ...take(it.clinical_features, 1),
        ...take(it.exam_tips, 1),
      ],
    };
  }
  if (module === "pharmacology") {
    const d = drugIndex.get(itemId);
    if (!d) return null;
    return {
      module,
      itemId,
      title_fa: d.generic_name,
      title_en: d.generic_name,
      subtitle: d.drug_class || d.category,
      href: `/pharmacology/${itemId}`,
      keyPoints: [
        ...take(d.mechanism ? [d.mechanism] : [], 1),
        ...take(d.indications, 1),
        ...take(d.adverse_effects, 1),
        ...take(d.exam_tips, 1),
      ],
    };
  }
  return null;
}

export function topicMeta(module, itemId) {
  const t = resolveTopic(module, itemId);
  if (!t) return {};
  return { title_fa: t.title_fa, title_en: t.title_en, subtitle: t.subtitle };
}

/** Total studiable items per module — used for coverage/readiness math. */
export const MODULE_TOTALS = {
  histology: histologyData.items.length,
  pathology: pathologyData.items.length,
  pharmacology: pharmacologyData.drugs.length,
};

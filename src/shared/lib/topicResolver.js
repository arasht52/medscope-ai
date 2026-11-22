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

// URLs come from the existing topic records, not ephemeral quiz positions.
// Retain all matches so a shared/ambiguous image never guesses a topic.
const imageTopics = new Map();
for (const [module, items] of [["histology", histologyData.items], ["pathology", pathologyData.items]]) {
  for (const item of items) {
    const urls = new Set([item.image?.url, item.image_url, ...(item.images || []).map(image => image.url)]);
    for (const url of urls) {
      if (typeof url !== "string" || !url) continue;
      const matches = imageTopics.get(url) || [];
      matches.push({ module, itemId: item.id });
      imageTopics.set(url, matches);
    }
  }
}

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

/** Resolve learning identity without changing a question or its answer key. */
export function resolveQuestionTopic(question) {
  if (!question || typeof question !== "object") return null;
  const explicitId = question.topicId || question.drugId;
  const modules = question.module ? [question.module] : ["histology", "pathology", "pharmacology"];
  if (explicitId) {
    const matches = modules.map(module => resolveTopic(module, explicitId)).filter(Boolean);
    return matches.length === 1 ? matches[0] : null;
  }
  const urls = [question.image?.url, question.image_url].filter(Boolean);
  if (!urls.length || new Set(urls).size !== 1) return null;
  const matches = (imageTopics.get(urls[0]) || []).filter(match => modules.includes(match.module));
  return matches.length === 1 ? resolveTopic(matches[0].module, matches[0].itemId) : null;
}

/** Old positional IDs alone cannot reconstruct a randomized image attempt. */
export function resolveReviewTopic(card) {
  if (!card || typeof card !== "object") return null;
  return resolveTopic(card.module, card.itemId) || resolveQuestionTopic(card);
}

/** Total studiable items per module — used for coverage/readiness math. */
export const MODULE_TOTALS = {
  histology: histologyData.items.length,
  pathology: pathologyData.items.length,
  pharmacology: pharmacologyData.drugs.length,
};

/**
 * imageSafety.js — single source of truth for the licensing rule.
 *
 * MedScope AI is a medical-education app. It must never present an image as
 * usable production content unless that image is verified open-license
 * (Wikimedia Commons / OpenStax / NIH-NCBI Open Access / university OER /
 * self-created original). No textbook scans, no scraped web images.
 *
 * The `image` object on Histology/Pathology items (and optionally on quiz
 * questions) follows this shape:
 *   {
 *     url, alt, type, magnification, stain, labels[],
 *     source, license, attribution, verifiedOpenLicense
 *   }
 *
 * SAFETY RULE (do not weaken): if `verifiedOpenLicense` is not exactly true,
 * or there is no url, the image is NOT usable — callers must fall back to the
 * educational placeholder instead of rendering it.
 */

export const IMAGE_TYPES = ["real_slide", "gross", "diagram", "placeholder"];

export const MAGNIFICATION_LABELS_FA = {
  low: "بزرگ‌نمایی کم",
  medium: "بزرگ‌نمایی متوسط",
  high: "بزرگ‌نمایی زیاد",
};

export const IMAGE_TYPE_LABELS_FA = {
  real_slide: "اسلاید میکروسکوپی واقعی",
  gross: "نمای ماکروسکوپی",
  diagram: "نمودار شماتیک",
  placeholder: "بدون تصویر",
};

// Exact placeholder copy required by the product spec.
export const PLACEHOLDER_TEXT_FA = "تصویر واقعی هنوز اضافه نشده است";
export const PLACEHOLDER_TEXT_EN = "Only open-license educational images are allowed";

/**
 * The one gate every image passes through before being shown as real content.
 * Returns true only when the image is present AND explicitly verified.
 * @param {object|null|undefined} image
 * @returns {boolean}
 */
export function isImageUsable(image) {
  if (!image || typeof image !== "object") return false;
  if (image.verifiedOpenLicense !== true) return false;
  if (!image.url || typeof image.url !== "string") return false;
  if (image.type === "placeholder") return false;
  return true;
}

/**
 * Normalize any legacy/loose shape into the full `image` object so components
 * can rely on every field existing. Never marks anything as verified on its
 * own — an unverified input stays unverified (and therefore not usable).
 * @param {object|null|undefined} image
 * @returns {object}
 */
export function normalizeImage(image) {
  const base = {
    url: null,
    alt: "",
    type: "placeholder",
    magnification: null,
    stain: null,
    labels: [],
    source: null,
    license: null,
    attribution: null,
    verifiedOpenLicense: false,
  };
  if (!image || typeof image !== "object") return base;
  return {
    ...base,
    ...image,
    labels: Array.isArray(image.labels) ? image.labels : [],
    verifiedOpenLicense: image.verifiedOpenLicense === true,
  };
}

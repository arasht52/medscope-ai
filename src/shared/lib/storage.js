// src/shared/lib/storage.js
//
// Consolidated localStorage layer for MedScope AI.
// Merges what previously existed as three separate, independently-built
// utilities:
//   - medscope-home-refactor/src/hooks/useProgress.js  (module progress)
//   - medscope-favorites/src/lib/favoritesStorage.js   (favorites)
//   - medscope-settings/src/lib/storage.js             (app version + reset)
//
// Key names are preserved exactly as each original module used them, so
// existing data already saved by a user is not lost or orphaned by the
// merge. Only the "settings" reset helpers were updated to also clear
// progress, since useProgress.js did not exist yet when Settings was
// originally built in isolation.

const KEYS = {
  progress: "medscope_progress", // legacy key, kept only so resetProgress() still clears any old data
  viewed: "medscope_viewed_items", // { [moduleKey]: string[] } — real progress source of truth
  favorites: "medscope:favorites", // Array<FavoriteItem>
  theme: "medscope:settings:theme",
};

const FAVORITES_CHANGE_EVENT = "medscope:favorites-changed";

export const FAVORITE_TYPES = {
  HISTOLOGY: "histology",
  PHARMACOLOGY: "pharmacology",
  PATHOLOGY: "pathology",
};

export const APP_VERSION = "0.1.0 (MVP)";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function removeKey(key) {
  localStorage.removeItem(key);
}

/* ---------------------------------------------------------------------- */
/* Progress (used by Home's study-progress bars)                          */
/* ---------------------------------------------------------------------- */

export function readProgressStore() {
  return readJSON(KEYS.progress, {});
}

export function writeProgressStore(store) {
  writeJSON(KEYS.progress, store);
}

/**
 * Real progress tracking: a student's progress in a module is the number
 * of *distinct* items they have opened (viewed), not a hand-incremented
 * counter. Storing a Set-like array of ids (deduplicated) means revisiting
 * the same item twice never inflates the count, and progress always
 * reflects actual browsing regardless of order.
 */
function readViewedStore() {
  return readJSON(KEYS.viewed, {});
}

function writeViewedStore(store) {
  writeJSON(KEYS.viewed, store);
}

export function markItemViewed(moduleKey, itemId) {
  if (!moduleKey || !itemId) return;
  const store = readViewedStore();
  const ids = store[moduleKey] || [];
  if (!ids.includes(itemId)) {
    store[moduleKey] = [...ids, itemId];
    writeViewedStore(store);
  }
}

export function getViewedCount(moduleKey) {
  const store = readViewedStore();
  return (store[moduleKey] || []).length;
}

export function resetProgress() {
  removeKey(KEYS.progress);
  removeKey(KEYS.viewed);
}

/* ---------------------------------------------------------------------- */
/* Favorites                                                              */
/* ---------------------------------------------------------------------- */

function readFavorites() {
  const parsed = readJSON(KEYS.favorites, []);
  return Array.isArray(parsed) ? parsed : [];
}

function writeFavorites(favorites) {
  writeJSON(KEYS.favorites, favorites);
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGE_EVENT));
}

function favoriteKey(id, type) {
  return `${type}:${id}`;
}

export function getFavorites() {
  return readFavorites();
}

export function isFavorite(id, type) {
  return readFavorites().some((f) => favoriteKey(f.id, f.type) === favoriteKey(id, type));
}

export function addFavorite(item) {
  const favorites = readFavorites();
  const key = favoriteKey(item.id, item.type);
  if (favorites.some((f) => favoriteKey(f.id, f.type) === key)) return favorites;
  const next = [{ ...item, addedAt: Date.now() }, ...favorites];
  writeFavorites(next);
  return next;
}

export function removeFavorite(id, type) {
  const favorites = readFavorites();
  const next = favorites.filter((f) => favoriteKey(f.id, f.type) !== favoriteKey(id, type));
  writeFavorites(next);
  return next;
}

export function toggleFavorite(item) {
  return isFavorite(item.id, item.type) ? removeFavorite(item.id, item.type) : addFavorite(item);
}

export function subscribeFavorites(callback) {
  const handler = () => callback();
  window.addEventListener(FAVORITES_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(FAVORITES_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function resetFavorites() {
  removeKey(KEYS.favorites);
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGE_EVENT));
}

/* ---------------------------------------------------------------------- */
/* Settings                                                                */
/* ---------------------------------------------------------------------- */

export function getThemePreference() {
  return readJSON(KEYS.theme, "light");
}

export function setThemePreference(value) {
  writeJSON(KEYS.theme, value);
}

export const STORAGE_KEYS = KEYS;

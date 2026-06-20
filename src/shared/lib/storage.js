const KEY = "medscope-progress";

export function loadProgress() {
  const raw = localStorage.getItem(KEY);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveProgress(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
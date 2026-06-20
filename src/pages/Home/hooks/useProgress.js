import { useState, useCallback } from "react";
import { readProgressStore, writeProgressStore } from "../../../shared/lib/storage";

/**
 * Tracks how many items a student has completed in a given module,
 * persisted to localStorage.
 *
 * Real progress *marking* is not implemented yet — no screen in the app
 * currently calls `markDone()`. This hook only reads whatever is already
 * in storage and exposes `markDone` for that future work; it must NOT
 * write anything back to storage on its own, otherwise "Reset Progress"
 * in Settings would be immediately undone the next time Home mounts
 * (the bug this fixes). `initial` is only used when no real progress
 * has ever been recorded — it intentionally defaults to 0, not a fake
 * demo value, so a reset module always and visibly shows "0 done".
 */
export function useProgress(moduleKey, total, initial = 0) {
  const [done, setDone] = useState(() => {
    const store = readProgressStore();
    return store[moduleKey] ?? initial;
  });

  const markDone = useCallback(
    (count) => {
      setDone((prev) => {
        const next = Math.min(total, Math.max(prev, count));
        const store = readProgressStore();
        store[moduleKey] = next;
        writeProgressStore(store);
        return next;
      });
    },
    [total, moduleKey]
  );

  return { done, total, markDone };
}

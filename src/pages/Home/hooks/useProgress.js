import { useState, useCallback } from "react";
import { getViewedCount, markItemViewed } from "../../../shared/lib/storage";

/**
 * Tracks how many distinct items a student has opened in a given module,
 * persisted to localStorage via the shared viewed-items store.
 *
 * `done` is read once on mount (Home re-mounts on every navigation back to
 * it via React Router, so this always reflects the latest state — no live
 * subscription needed, unlike Favorites which can update while mounted).
 *
 * `markDone(itemId)` is called by each module's Detail page when an item
 * is opened; it records that id (deduplicated, so revisits never inflate
 * the count) and updates local state if this hook instance is still
 * mounted to see it.
 */
export function useProgress(moduleKey, total) {
  const [done, setDone] = useState(() => Math.min(total, getViewedCount(moduleKey)));

  const markDone = useCallback(
    (itemId) => {
      markItemViewed(moduleKey, itemId);
      setDone(Math.min(total, getViewedCount(moduleKey)));
    },
    [total, moduleKey]
  );

  return { done, total, markDone };
}

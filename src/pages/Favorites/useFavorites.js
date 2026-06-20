// src/pages/Favorites/useFavorites.js
import { useCallback, useEffect, useState } from "react";
import {
  getFavorites,
  toggleFavorite as toggleFavoriteStorage,
  removeFavorite as removeFavoriteStorage,
  subscribeFavorites,
} from "../../shared/lib/storage";

/**
 * Shared favorites state. Any component (Favorites page, a Histology
 * detail page, a Drug detail page) can call this hook and they will all
 * stay in sync, since they all read from the same localStorage source
 * and re-render when it changes.
 *
 * (Unchanged behavior from the original module — only the underlying
 * storage import now points at the app's single consolidated storage
 * helper instead of a Favorites-only copy of the same logic.)
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => getFavorites());

  useEffect(() => {
    const unsubscribe = subscribeFavorites(() => setFavorites(getFavorites()));
    return unsubscribe;
  }, []);

  const toggleFavorite = useCallback((item) => {
    setFavorites(toggleFavoriteStorage(item));
  }, []);

  const removeFavorite = useCallback((id, type) => {
    setFavorites(removeFavoriteStorage(id, type));
  }, []);

  const isFavorite = useCallback(
    (id, type) => favorites.some((f) => f.id === id && f.type === type),
    [favorites]
  );

  return { favorites, toggleFavorite, removeFavorite, isFavorite };
}

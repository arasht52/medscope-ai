import { useMemo, useState } from "react";
import histologyData from "../../data/histology.json";

/**
 * Loads the local histology.json (MVP data source per PROJECT_MEMORY.md:
 * "Local JSON for MVP. Supabase later.") and exposes search + category
 * filtering for the Histology List page.
 */
export function useHistologyData() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(null);

  const items = histologyData.items;
  const categories = histologyData.categories;

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory = !categoryId || item.category === categoryId;
      if (!matchesCategory) return false;

      if (!normalizedQuery) return true;

      return (
        item.title_fa.toLowerCase().includes(normalizedQuery) ||
        item.title_en.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [items, query, categoryId]);

  return {
    categories,
    query,
    setQuery,
    categoryId,
    setCategoryId,
    filteredItems,
  };
}

/** Looks up a single histology item by id, for the Detail page. */
export function getHistologyItemById(id) {
  return histologyData.items.find((item) => item.id === id) || null;
}

/** Looks up a category's Farsi label by id. */
export function getCategoryLabel(categoryId) {
  const cat = histologyData.categories.find((c) => c.id === categoryId);
  return cat ? cat.label_fa : "";
}

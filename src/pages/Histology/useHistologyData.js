import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import histologyData from "../../data/histology.json";

/**
 * Loads the local histology.json (MVP data source per PROJECT_MEMORY.md:
 * "Local JSON for MVP. Supabase later.") and exposes search + category
 * filtering for the Histology List page.
 *
 * categoryId/query live in the URL (useSearchParams), not plain
 * useState, so that opening an item's detail page and then pressing
 * back restores the exact filtered category view the student came
 * from, instead of losing it on remount and falling back to the
 * unfiltered category grid (same fix applied to Pathology/Pharmacology).
 */
export function useHistologyData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("category") || null;
  const query = searchParams.get("q") || "";

  function setCategoryId(cat) {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    if (cat) next.set("category", cat);
    else next.delete("category");
    setSearchParams(next);
  }

  function setQuery(q) {
    const next = new URLSearchParams(searchParams);
    if (q) next.set("q", q);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  }

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

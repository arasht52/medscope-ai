// src/shared/components/FavoriteButton.jsx
//
// A star toggle, meant to be dropped onto Histology/Pharmacology detail
// pages later so students can favorite an item from there too.
// Per the task scope, it is NOT wired into those pages in this change —
// it's provided here, ready to import, without modifying those modules.
//
// Usage (future):
//   <FavoriteButton item={{ id, type: 'histology', title_en, title_fa, subtitle }} />

import { useFavorites } from '../useFavorites'

export default function FavoriteButton({ item, size = 22 }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(item.id, item.type)

  return (
    <button
      type="button"
      className={`ms-fav-button ${active ? 'ms-fav-button--active' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(item)
      }}
      aria-pressed={active}
      aria-label={active ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      style={{ fontSize: size }}
    >
      {active ? '★' : '☆'}
    </button>
  )
}

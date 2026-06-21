// src/pages/Favorites/FavoritesPage.jsx
import { useMemo, useState } from 'react'
import Card from '../../shared/components/Card'
import EmptyState from './components/EmptyState'
import { useFavorites } from './useFavorites'
import { FAVORITE_TYPES } from '../../shared/lib/storage'
import './FavoritesPage.css'

const FILTERS = [
  { key: 'all', label: 'همه' },
  { key: FAVORITE_TYPES.HISTOLOGY, label: 'هیستولوژی' },
  { key: FAVORITE_TYPES.PHARMACOLOGY, label: 'داروشناسی' },
  { key: FAVORITE_TYPES.PATHOLOGY, label: 'پاتولوژی' },
]

const TYPE_LABEL = {
  [FAVORITE_TYPES.HISTOLOGY]: 'هیستولوژی',
  [FAVORITE_TYPES.PHARMACOLOGY]: 'دارو',
  [FAVORITE_TYPES.PATHOLOGY]: 'پاتولوژی',
}

export default function FavoritesPage({ onOpenItem }) {
  const { favorites, removeFavorite } = useFavorites()
  const [filter, setFilter] = useState('all')

  const visible = useMemo(() => {
    if (filter === 'all') return favorites
    return favorites.filter((f) => f.type === filter)
  }, [favorites, filter])

  return (
    <div className="ms-favorites-page" dir="rtl">
      <header className="ms-favorites-page__header">
        <h1>علاقه‌مندی‌ها</h1>
        <p className="ms-favorites-page__count">{favorites.length} مورد</p>
      </header>

      <div className="ms-favorites-page__tabs" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            className={`ms-tab ${filter === f.key ? 'ms-tab--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="هنوز چیزی اضافه نکرده‌اید"
          description="روی آیکون ⭐ در صفحه‌ی هیستولوژی، داروشناسی یا پاتولوژی بزنید تا اینجا ذخیره شود."
        />
      ) : (
        <ul className="ms-favorites-page__list">
          {visible.map((item) => (
            <li key={`${item.type}:${item.id}`}>
              <Card
                className="ms-favorites-page__item"
                onClick={() => onOpenItem?.(item)}
              >
                <div className="ms-favorites-page__item-main">
                  <span
                    className={`ms-badge ms-badge--${item.type}`}
                  >
                    {TYPE_LABEL[item.type] || item.type}
                  </span>
                  <h2 className="ms-favorites-page__item-title">{item.title_fa}</h2>
                  <p className="ms-favorites-page__item-subtitle">
                    {item.title_en}
                    {item.subtitle ? ` · ${item.subtitle}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  className="ms-favorites-page__remove"
                  aria-label="حذف از علاقه‌مندی‌ها"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFavorite(item.id, item.type)
                  }}
                >
                  ✕
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

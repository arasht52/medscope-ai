import { useNavigate } from "react-router-dom";
import FavoritesPage from "./FavoritesPage";
import { FAVORITE_TYPES } from "../../shared/lib/storage";

/**
 * Thin routing glue only — FavoritesPage itself is unmodified.
 * It already accepted an onOpenItem(item) callback designed for exactly
 * this; navigation just wasn't wired to a router yet since the module
 * was built and tested standalone.
 */
export default function FavoritesRoute() {
  const navigate = useNavigate();

  function handleOpenItem(item) {
    if (item.type === FAVORITE_TYPES.HISTOLOGY) {
      navigate(`/histology/${item.id}`);
    } else if (item.type === FAVORITE_TYPES.PHARMACOLOGY) {
      navigate(`/pharmacology/${item.id}`);
    } else if (item.type === FAVORITE_TYPES.PATHOLOGY) {
      navigate(`/pathology/${item.id}`);
    }
  }

  return <FavoritesPage onOpenItem={handleOpenItem} />;
}

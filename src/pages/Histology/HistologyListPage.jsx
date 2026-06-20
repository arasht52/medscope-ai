import { useNavigate } from "react-router-dom";
import HistologyList from "./HistologyList";

/**
 * Thin routing glue only — HistologyList itself is unmodified.
 * The Histology module shipped as a self-contained component using
 * onSelectItem/onBack callbacks (its own README/comments note the real
 * app should wire it "via whatever router/navigation the app shell
 * uses"). This wrapper is that wiring.
 */
export default function HistologyListPage() {
  const navigate = useNavigate();
  return <HistologyList onSelectItem={(id) => navigate(`/histology/${id}`)} />;
}

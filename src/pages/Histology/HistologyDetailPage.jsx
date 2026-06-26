import { useNavigate, useParams } from "react-router-dom";
import HistologyDetail from "./HistologyDetail";

/** Thin routing glue only — HistologyDetail itself is unmodified. */
export default function HistologyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <HistologyDetail itemId={id} onBack={() => navigate(-1)} />;
}

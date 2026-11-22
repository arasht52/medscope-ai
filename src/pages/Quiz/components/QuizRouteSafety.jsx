import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader.jsx";
import Button from "../../../shared/components/Button.jsx";

export function isMalformedQuizPath(pathname) {
  if (!/^\/quiz(?:\/|$)/.test(pathname)) return false;
  try { decodeURI(pathname); return false; } catch { return true; }
}

// Validate the raw location once, before Routes attempts to decode parameters.
// A valid encoded percent (%25) stays valid; never decode useParams() again.
export default function QuizRouteSafety({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (!isMalformedQuizPath(pathname)) return children;
  return <main className="quiz-play academic-standard" dir="rtl" lang="fa">
    <PageHeader title="آزمون" onBack={() => navigate("/quiz")} />
    <p role="status">نشانی آزمون معتبر نیست. لطفاً آزمون را از فهرست انتخاب کنید.</p>
    <Button onClick={() => navigate("/quiz")}>بازگشت به آزمون‌ها</Button>
  </main>;
}

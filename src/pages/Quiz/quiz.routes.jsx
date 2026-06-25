import QuizHome from "./pages/QuizHome";
import HistologyQuiz from "./pages/HistologyQuiz";
import PharmacologyQuiz, { PharmacologyCategoryQuiz } from "./pages/PharmacologyQuiz";
import PathologyQuiz, { PathologyCategoryQuiz } from "./pages/PathologyQuiz";
import HistologyImageQuiz from "./pages/HistologyImageQuiz";
import PathologyImageQuiz from "./pages/PathologyImageQuiz";
import QuizResult from "./pages/QuizResult";

/**
 * quizRoutes
 * Self-contained route list for the Quiz module.
 * Integration: spread this array into the app's existing <Routes> /
 * router config. Does not modify Home, Histology, or Pharmacology routes.
 *
 * Pharmacology and Pathology are now both category-based: /quiz/pharmacology
 * and /quiz/pathology show a per-system picker (CNS, GI, Endocrine, ...)
 * instead of one combined exam, per the project's quiz-structure rule.
 * Each question carries a `category` field matching the subject's own
 * data categories, so the picker stays in sync automatically.
 *
 * Note: an earlier text-based "/quiz/pathology" (PathologyQuiz.jsx +
 * pathologyQuestions.json) was attempted but never had real content —
 * it shipped as an empty stub and was removed for MVP stability per the
 * debugging report. This is a fresh implementation with a real question
 * bank. /quiz/pathology-image (image-first, self-contained, generates
 * its own questions from pathology.json) is unaffected and stays active.
 *
 * Example (react-router-dom v6):
 *   import { quizRoutes } from "./modules/quiz";
 *   <Routes>
 *     ...existing routes...
 *     {quizRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}
 *   </Routes>
 */
const quizRoutes = [
  { path: "/quiz", element: <QuizHome /> },
  { path: "/quiz/histology", element: <HistologyQuiz /> },
  { path: "/quiz/histology/result", element: <QuizResult /> },
  { path: "/quiz/pharmacology", element: <PharmacologyQuiz /> },
  { path: "/quiz/pharmacology/:category", element: <PharmacologyCategoryQuiz /> },
  { path: "/quiz/pharmacology/:category/result", element: <QuizResult /> },
  { path: "/quiz/pathology", element: <PathologyQuiz /> },
  { path: "/quiz/pathology/:category", element: <PathologyCategoryQuiz /> },
  { path: "/quiz/pathology/:category/result", element: <QuizResult /> },
  { path: "/quiz/histology-image", element: <HistologyImageQuiz /> },
  { path: "/quiz/histology-image/result", element: <QuizResult /> },
  { path: "/quiz/pathology-image", element: <PathologyImageQuiz /> },
  { path: "/quiz/pathology-image/result", element: <QuizResult /> },
];

export default quizRoutes;

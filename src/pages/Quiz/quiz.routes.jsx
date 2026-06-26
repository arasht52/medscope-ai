import QuizHome from "./pages/QuizHome";
import HistologyQuiz, { HistologyCategoryQuiz, HistologyCombinedQuiz } from "./pages/HistologyQuiz";
import PharmacologyQuiz, { PharmacologyCategoryQuiz, PharmacologyCombinedQuiz } from "./pages/PharmacologyQuiz";
import PathologyQuiz, { PathologyCategoryQuiz, PathologyCombinedQuiz } from "./pages/PathologyQuiz";
import HistologyImageQuiz from "./pages/HistologyImageQuiz";
import PathologyImageQuiz from "./pages/PathologyImageQuiz";
import QuizResult from "./pages/QuizResult";

/**
 * quizRoutes
 * Self-contained route list for the Quiz module.
 * Integration: spread this array into the app's existing <Routes> /
 * router config. Does not modify Home, Histology, or Pharmacology routes.
 *
 * Histology, Pharmacology, and Pathology are all category-based:
 * /quiz/<subject> shows a per-system picker (CNS, GI, Endocrine, ...)
 * instead of one combined exam, per the project's quiz-structure rule.
 * Each question carries a `category` field matching the subject's own
 * data categories, so the picker stays in sync automatically.
 *
 * Each subject also supports a custom combined quiz: selecting several
 * categories on the picker (checkboxes) and tapping "شروع آزمون ترکیبی"
 * navigates to /quiz/<subject>/custom/:cats, where :cats is a "|"-joined,
 * URL-encoded list of the chosen category names — mixing questions from
 * just those categories into one quiz, per the project's custom
 * topic-selection quiz requirement.
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
  { path: "/quiz/histology/custom/:cats", element: <HistologyCombinedQuiz /> },
  { path: "/quiz/histology/custom/:cats/result", element: <QuizResult /> },
  { path: "/quiz/histology/:category", element: <HistologyCategoryQuiz /> },
  { path: "/quiz/histology/:category/result", element: <QuizResult /> },

  { path: "/quiz/pharmacology", element: <PharmacologyQuiz /> },
  { path: "/quiz/pharmacology/custom/:cats", element: <PharmacologyCombinedQuiz /> },
  { path: "/quiz/pharmacology/custom/:cats/result", element: <QuizResult /> },
  { path: "/quiz/pharmacology/:category", element: <PharmacologyCategoryQuiz /> },
  { path: "/quiz/pharmacology/:category/result", element: <QuizResult /> },

  { path: "/quiz/pathology", element: <PathologyQuiz /> },
  { path: "/quiz/pathology/custom/:cats", element: <PathologyCombinedQuiz /> },
  { path: "/quiz/pathology/custom/:cats/result", element: <QuizResult /> },
  { path: "/quiz/pathology/:category", element: <PathologyCategoryQuiz /> },
  { path: "/quiz/pathology/:category/result", element: <QuizResult /> },

  { path: "/quiz/histology-image", element: <HistologyImageQuiz /> },
  { path: "/quiz/histology-image/result", element: <QuizResult /> },
  { path: "/quiz/pathology-image", element: <PathologyImageQuiz /> },
  { path: "/quiz/pathology-image/result", element: <QuizResult /> },
];

export default quizRoutes;

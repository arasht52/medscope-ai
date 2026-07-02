import { lazy } from "react";

/**
 * quizRoutes — self-contained route list for the Quiz module.
 * Components are lazy-loaded (Phase 7) so the quiz code + question banks are
 * fetched only when a quiz route is visited, keeping them out of the initial
 * bundle. They render under the app-level <Suspense> boundary in App.jsx.
 */
const QuizHome = lazy(() => import("./pages/QuizHome"));
const HistologyQuiz = lazy(() => import("./pages/HistologyQuiz"));
const HistologyCategoryQuiz = lazy(() =>
  import("./pages/HistologyQuiz").then((m) => ({ default: m.HistologyCategoryQuiz }))
);
const HistologyCombinedQuiz = lazy(() =>
  import("./pages/HistologyQuiz").then((m) => ({ default: m.HistologyCombinedQuiz }))
);
const PharmacologyQuiz = lazy(() => import("./pages/PharmacologyQuiz"));
const PharmacologyCategoryQuiz = lazy(() =>
  import("./pages/PharmacologyQuiz").then((m) => ({ default: m.PharmacologyCategoryQuiz }))
);
const PharmacologyCombinedQuiz = lazy(() =>
  import("./pages/PharmacologyQuiz").then((m) => ({ default: m.PharmacologyCombinedQuiz }))
);
const PathologyQuiz = lazy(() => import("./pages/PathologyQuiz"));
const PathologyCategoryQuiz = lazy(() =>
  import("./pages/PathologyQuiz").then((m) => ({ default: m.PathologyCategoryQuiz }))
);
const PathologyCombinedQuiz = lazy(() =>
  import("./pages/PathologyQuiz").then((m) => ({ default: m.PathologyCombinedQuiz }))
);
const HistologyImageQuiz = lazy(() => import("./pages/HistologyImageQuiz"));
const PathologyImageQuiz = lazy(() => import("./pages/PathologyImageQuiz"));
const QuizResult = lazy(() => import("./pages/QuizResult"));

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

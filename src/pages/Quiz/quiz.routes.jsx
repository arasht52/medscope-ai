import QuizHome from "./pages/QuizHome";
import HistologyQuiz from "./pages/HistologyQuiz";
import PharmacologyQuiz from "./pages/PharmacologyQuiz";
import QuizResult from "./pages/QuizResult";

/**
 * quizRoutes
 * Self-contained route list for the Quiz module.
 * Integration: spread this array into the app's existing <Routes> /
 * router config. Does not modify Home, Histology, or Pharmacology routes.
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
  { path: "/quiz/pharmacology/result", element: <QuizResult /> },
];

export default quizRoutes;

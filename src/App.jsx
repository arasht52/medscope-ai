import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import BottomNav from "./shared/components/BottomNav.jsx";
import RouteFallback from "./shared/components/RouteFallback.jsx";

// Home stays eager so the landing screen paints instantly. Everything else is
// code-split so the initial bundle no longer carries every module + its JSON
// (Phase 7). Each import() becomes its own lazily-loaded chunk.
import Home from "./pages/Home/Home.jsx";

const HistologyListPage = lazy(() => import("./pages/Histology/HistologyListPage.jsx"));
const HistologyDetailPage = lazy(() => import("./pages/Histology/HistologyDetailPage.jsx"));
const HistologyAtlas = lazy(() => import("./pages/Histology/HistologyAtlas.jsx"));

const DrugList = lazy(() => import("./pages/Pharmacology/DrugList.jsx"));
const DrugDetail = lazy(() => import("./pages/Pharmacology/DrugDetail.jsx"));

const PathologyList = lazy(() => import("./pages/Pathology/PathologyList.jsx"));
const PathologyDetail = lazy(() => import("./pages/Pathology/PathologyDetail.jsx"));
const PathologyCluster = lazy(() => import("./pages/Pathology/PathologyCluster.jsx"));

const FavoritesRoute = lazy(() => import("./pages/Favorites/FavoritesRoute.jsx"));
const Settings = lazy(() => import("./pages/Settings/Settings.jsx"));
const ReviewPage = lazy(() => import("./pages/Review/ReviewPage.jsx"));
const ProgressPage = lazy(() => import("./pages/Progress/ProgressPage.jsx"));

import { quizRoutes } from "./pages/Quiz/index.js";
import { gameRoutes } from "./pages/Game/index.js";

// The Quiz module's gameplay screens ship their own fixed action footer
// (Next/See-result button) that already reserves the exact screen region
// the BottomNav would occupy. Showing both at once means the footer's
// background visually covers the nav, so the nav is hidden only on these
// routes — every other route keeps it. /review is full-screen focus too.
const ROUTES_WITHOUT_BOTTOM_NAV = [
  "/histology/atlas",
  "/quiz/histology",
  "/quiz/pharmacology",
  "/quiz/pathology",
  "/quiz/histology-image",
  "/quiz/pathology-image",
  "/review",
];

function AppShell() {
  const { pathname } = useLocation();
  const hideNav = ROUTES_WITHOUT_BOTTOM_NAV.includes(pathname);

  return (
    <div className="app-shell">
      <div className="app-shell__content">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/histology" element={<HistologyListPage />} />
            <Route path="/histology/atlas" element={<HistologyAtlas />} />
            <Route path="/histology/:id" element={<HistologyDetailPage />} />

            <Route path="/pharmacology" element={<DrugList />} />
            <Route path="/pharmacology/:id" element={<DrugDetail />} />

            <Route path="/pathology" element={<PathologyList />} />
            <Route path="/pathology/cluster/:clusterId" element={<PathologyCluster />} />
            <Route path="/pathology/:id" element={<PathologyDetail />} />

            {quizRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}

            {gameRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}

            <Route path="/review" element={<ReviewPage />} />
            <Route path="/progress" element={<ProgressPage />} />

            <Route path="/favorites" element={<FavoritesRoute />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>

      {!hideNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return <AppShell />;
}

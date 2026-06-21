import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import BottomNav from "./shared/components/BottomNav.jsx";

import Home from "./pages/Home/Home.jsx";

import HistologyListPage from "./pages/Histology/HistologyListPage.jsx";
import HistologyDetailPage from "./pages/Histology/HistologyDetailPage.jsx";
import HistologyAtlas from "./pages/Histology/HistologyAtlas.jsx";

import DrugList from "./pages/Pharmacology/DrugList.jsx";
import DrugDetail from "./pages/Pharmacology/DrugDetail.jsx";

import PathologyList from "./pages/Pathology/PathologyList.jsx";
import PathologyDetail from "./pages/Pathology/PathologyDetail.jsx";

import { quizRoutes } from "./pages/Quiz/index.js";

import FavoritesRoute from "./pages/Favorites/FavoritesRoute.jsx";

import Settings from "./pages/Settings/Settings.jsx";

// The Quiz module's gameplay screens ship their own fixed action footer
// (Next/See-result button) that already reserves the exact screen region
// the BottomNav would occupy. Showing both at once means the footer's
// background visually covers the nav, so the nav is hidden only on these
// two routes — every other route (including the Quiz home and result
// pages) keeps it.
const ROUTES_WITHOUT_BOTTOM_NAV = [
  "/histology/atlas",
  "/quiz/histology",
  "/quiz/pharmacology",
  "/quiz/pathology",
  "/quiz/histology-image",
  "/quiz/pathology-image",
];

function AppShell() {
  const { pathname } = useLocation();
  const hideNav = ROUTES_WITHOUT_BOTTOM_NAV.includes(pathname);

  return (
    <div className="app-shell">
      <div className="app-shell__content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/histology" element={<HistologyListPage />} />
          <Route path="/histology/atlas" element={<HistologyAtlas />} />
          <Route path="/histology/:id" element={<HistologyDetailPage />} />

          <Route path="/pharmacology" element={<DrugList />} />
          <Route path="/pharmacology/:id" element={<DrugDetail />} />

          <Route path="/pathology" element={<PathologyList />} />
          <Route path="/pathology/:id" element={<PathologyDetail />} />

          {quizRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}

          <Route path="/favorites" element={<FavoritesRoute />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!hideNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return <AppShell />;
}

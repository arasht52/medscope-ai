import { lazy } from "react";

/**
 * gameRoutes — lazy-loaded (Phase 7) so the memory-game code loads only when
 * a /game route is visited. Renders under the app-level <Suspense>.
 */
const GameHome = lazy(() => import("./GameHome"));
const MemoryGamePlay = lazy(() => import("./MemoryGamePlay"));

const gameRoutes = [
  { path: "/game", element: <GameHome /> },
  { path: "/game/:subject", element: <MemoryGamePlay /> },
];

export default gameRoutes;

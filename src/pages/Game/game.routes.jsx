import GameHome from "./GameHome";
import MemoryGamePlay from "./MemoryGamePlay";

/**
 * gameRoutes
 * Self-contained route list for the Memory Game module, mirroring the
 * Quiz module's pattern (see Quiz/quiz.routes.jsx). Spread this into the
 * app's existing <Routes>; it doesn't touch any other module's routes.
 */
const gameRoutes = [
  { path: "/game", element: <GameHome /> },
  { path: "/game/:subject", element: <MemoryGamePlay /> },
];

export default gameRoutes;

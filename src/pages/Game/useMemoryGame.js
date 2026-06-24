// src/pages/Game/useMemoryGame.js
//
// Self-contained game state: deck, flip handling, move counting, a
// running timer, and best-score persistence. Mirrors the rest of the
// app's pattern of one hook per module (useQuiz.js, useFavorites.js,
// useHistologyData.js).

import { useCallback, useEffect, useState } from "react";
import { buildDeck } from "./gameDeck";
import { getGameBest, saveGameBest } from "../../shared/lib/storage";

const MISMATCH_DELAY_MS = 700;
const MATCH_DELAY_MS = 350;

export default function useMemoryGame(subjectId) {
  const [deck, setDeck] = useState(() => buildDeck(subjectId));
  const [flipped, setFlipped] = useState([]); // uids currently face-up, unresolved
  const [matched, setMatched] = useState(new Set()); // uids permanently face-up
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [checking, setChecking] = useState(false);
  const [best, setBest] = useState(() => getGameBest(subjectId));

  const totalPairs = deck.length / 2;
  const won = deck.length > 0 && matched.size === deck.length;

  // Timer — stops the moment the board is fully matched.
  useEffect(() => {
    if (won) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [won, deck]);

  // Resolve a pair once two cards are face-up.
  useEffect(() => {
    if (flipped.length !== 2) return;
    setChecking(true);
    const [a, b] = flipped;
    const cardA = deck.find((c) => c.uid === a);
    const cardB = deck.find((c) => c.uid === b);
    const isMatch = Boolean(cardA && cardB && cardA.pairId === cardB.pairId);

    setMoves((m) => m + 1);

    const timeout = setTimeout(
      () => {
        if (isMatch) {
          setMatched((prev) => {
            const next = new Set(prev);
            next.add(a);
            next.add(b);
            return next;
          });
        }
        setFlipped([]);
        setChecking(false);
      },
      isMatch ? MATCH_DELAY_MS : MISMATCH_DELAY_MS
    );
    return () => clearTimeout(timeout);
  }, [flipped, deck]);

  // On win, persist a new best (fewest moves, then fastest time) if earned.
  useEffect(() => {
    if (!won) return;
    const prevBest = getGameBest(subjectId);
    const isNewBest =
      !prevBest ||
      moves < prevBest.moves ||
      (moves === prevBest.moves && seconds < prevBest.seconds);
    if (isNewBest) {
      saveGameBest(subjectId, { moves, seconds });
      setBest({ moves, seconds });
    }
    // Intentionally only re-runs when the game is actually won.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const flipCard = useCallback(
    (uid) => {
      if (checking) return;
      if (flipped.includes(uid) || matched.has(uid)) return;
      if (flipped.length >= 2) return;
      setFlipped((prev) => [...prev, uid]);
    },
    [checking, flipped, matched]
  );

  const restart = useCallback(() => {
    setDeck(buildDeck(subjectId));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setSeconds(0);
    setChecking(false);
  }, [subjectId]);

  return {
    deck,
    flipped,
    matched,
    moves,
    seconds,
    won,
    totalPairs,
    best,
    flipCard,
    restart,
  };
}

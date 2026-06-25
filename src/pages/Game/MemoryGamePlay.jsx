import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../shared/components/PageHeader";
import Button from "../../shared/components/Button";
import ImageWithFallback from "../../shared/components/ImageWithFallback";
import useMemoryGame from "./useMemoryGame";
import { getSubjectMeta } from "./gameDeck";
import "./MemoryGamePlay.css";

export default function MemoryGamePlay() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const meta = getSubjectMeta(subject);

  // Unknown subject in the URL (typed by hand, stale link, etc.) — bounce
  // back to the subject picker instead of rendering a broken board.
  useEffect(() => {
    if (!meta) navigate("/game", { replace: true });
  }, [meta, navigate]);

  if (!meta) return null;

  // Keyed by subject so switching subjects always starts a fresh board
  // instead of reusing state built for the previous subject.
  return <MemoryGameBoard key={subject} subjectId={subject} meta={meta} navigate={navigate} />;
}

function MemoryGameBoard({ subjectId, meta, navigate }) {
  const { deck, flipped, matched, moves, seconds, won, totalPairs, best, flipCard, restart } =
    useMemoryGame(subjectId);

  return (
    <div className="page game-play">
      <PageHeader title={`بازی حافظه — ${meta.label_fa}`} onBack={() => navigate("/game")} />

      <p className="game-play__hint">{meta.description_fa}</p>

      <div className="game-play__stats">
        <span>حرکت: {moves}</span>
        <span>زمان: {formatTime(seconds)}</span>
        <span>
          جفت: {matched.size / 2} از {totalPairs}
        </span>
      </div>

      <div className="game-play__grid" role="list" aria-label="کارت‌های بازی حافظه">
        {deck.map((card) => {
          const isFlipped = flipped.includes(card.uid) || matched.has(card.uid);
          const isMatched = matched.has(card.uid);
          return (
            <button
              key={card.uid}
              type="button"
              role="listitem"
              className={`game-card ${isFlipped ? "game-card--flipped" : ""} ${
                isMatched ? "game-card--matched" : ""
              }`}
              onClick={() => flipCard(card.uid)}
              disabled={isMatched}
              aria-pressed={isFlipped}
              aria-label={isFlipped ? (card.alt || card.content) : "کارت رو نشده"}
            >
              <div className="game-card__inner">
                <div className="game-card__face game-card__face--back" aria-hidden="true">
                  {meta.back_icon || "؟"}
                </div>
                <div className="game-card__face game-card__face--front">
                  {card.kind === "image" ? (
                    <ImageWithFallback
                      src={card.content}
                      alt={card.alt}
                      className="game-card__image"
                    />
                  ) : (
                    <span className={`game-card__text ${card.lang === "en" ? "ltr-term" : ""}`}>
                      {card.content}
                    </span>
                  )}
                  {card.tag && <span className="game-card__tag">{card.tag}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {won && (
        <div className="game-win-overlay">
          <div className="game-win-modal" role="dialog" aria-modal="true" aria-labelledby="game-win-title">
            <h3 id="game-win-title">🎉 آفرین!</h3>
            <p>
              با {moves} حرکت و {formatTime(seconds)} زمان، همه‌ی جفت‌ها را پیدا کردی.
            </p>
            {best && (
              <p className="game-win-modal__best">
                {best.moves === moves && best.seconds === seconds
                  ? "این رکورد جدید توست! 🏆"
                  : `بهترین رکورد: ${best.moves} حرکت · ${formatTime(best.seconds)}`}
              </p>
            )}
            <div className="game-win-modal__actions">
              <Button variant="secondary" onClick={() => navigate("/game")}>
                بازگشت
              </Button>
              <Button variant="primary" onClick={restart}>
                بازی دوباره
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

import { useNavigate } from "react-router-dom";
import PageHeader from "../../shared/components/PageHeader";
import Card from "../../shared/components/Card";
import { SUBJECTS } from "./gameDeck";
import { getGameBest } from "../../shared/lib/storage";
import "./GameHome.css";

/**
 * GameHome
 * Entry point of the Memory Game module. Student picks which subject's
 * cards to play with — content is pulled live from that subject's own
 * data file (see gameDeck.js), so there's no separate game dataset to
 * keep in sync.
 */
export default function GameHome() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <PageHeader title="بازی حافظه" />
      <p className="game-home__intro">
        کارت‌ها را برگردان و جفت‌های درست را پیدا کن — یک راه سریع و سرگرم‌کننده برای مرور نکته‌های درسی.
      </p>
      <div className="game-home__list">
        {SUBJECTS.map((s) => {
          const best = getGameBest(s.id);
          return (
            <Card
              key={s.id}
              as="button"
              className="game-home__item"
              onClick={() => navigate(`/game/${s.id}`)}
            >
              <div className="game-home__title">{s.label_fa}</div>
              <div className="game-home__subtitle ltr-term">{s.label_en}</div>
              <div className="game-home__desc">{s.description_fa}</div>
              {best && (
                <div className="game-home__best">
                  🏆 بهترین رکورد: {best.moves} حرکت · {formatTime(best.seconds)}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

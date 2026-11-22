import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../shared/components/PageHeader";
import Button from "../../shared/components/Button";
import MedicalIcon from "../../shared/components/MedicalIcon.jsx";
import { getDueQueue, reviewCard, GRADE_LABELS_FA } from "../../shared/lib/learning";
import { resolveReviewTopic } from "../../shared/lib/topicResolver";
import "./ReviewPage.css";

const GRADE_ORDER = ["again", "hard", "good", "easy"];
const MODULE_LABEL = { histology: "بافت‌شناسی", pathology: "پاتولوژی", pharmacology: "داروشناسی" };

/**
 * ReviewPage — the daily spaced-repetition queue.
 *
 * Each due card is a retrieval-practice prompt: recall the topic first, then
 * reveal the key points and rate your confidence. The rating feeds the SM-2
 * scheduler (see learning.js), so what comes back tomorrow depends on how well
 * you actually recalled — not on page visits.
 */
export default function ReviewPage() {
  const navigate = useNavigate();
  // Snapshot the queue once per session so rescheduled cards don't reappear
  // mid-session; a fresh snapshot is taken on remount.
  const [queue] = useState(() => getDueQueue());
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);

  const card = queue[pos] || null;
  const topic = useMemo(
    () => resolveReviewTopic(card),
    [card]
  );

  function grade(g) {
    if (!card || !topic) return;
    reviewCard(card.module, card.itemId, g);
    setDone((d) => d + 1);
    setRevealed(false);
    setPos((p) => p + 1);
  }

  const finished = pos >= queue.length;

  return (
    <div className="review-page academic-standard">
      <PageHeader title="مرور امروز" onBack={() => navigate("/")} />

      {queue.length === 0 && (
        <div className="review-empty">
          <MedicalIcon name="quiz" size={48} />
          <h2>مروری برای امروز نداری</h2>
          <p>وقتی تاپیک‌ها را مطالعه کنی یا آزمون بدهی، این‌جا به‌صورت خودکار وارد صف مرور فاصله‌دار می‌شوند.</p>
          <Button onClick={() => navigate("/histology")} fullWidth>شروع مطالعه</Button>
        </div>
      )}

      {queue.length > 0 && finished && (
        <div className="review-empty">
          <MedicalIcon name="progress" size={48} />
          <h2>{toFa(done)} کارت مرور شد</h2>
          <p>{done < queue.length
            ? "مرورهای قابل شناسایی این نوبت پایان یافتند. رکوردهای قدیمیِ ناشناخته بدون تغییر حفظ شده‌اند."
            : "مرور امروزت کامل شد. فردا کارت‌های تازه بر اساس عملکردت برمی‌گردند."}</p>
          <Button onClick={() => navigate("/progress")} fullWidth>دیدن پیشرفت</Button>
          <Button variant="ghost" onClick={() => navigate("/")} fullWidth>خانه</Button>
        </div>
      )}

      {card && !finished && (
        <div className="review-card">
          <div className="review-card__progress">
            کارت {toFa(pos + 1)} از {toFa(queue.length)}
            <span className="review-card__module">{MODULE_LABEL[card.module] || "مرور آموزشی"}</span>
          </div>

          <div className="review-card__prompt">
            <p className="review-card__hint">{topic ? "به یاد بیاور:" : "مرور ذخیره‌شده"}</p>
            <h2 className="review-card__title">{topic ? topic.title_fa : "موضوع این مرور در دسترس نیست"}</h2>
            {topic?.title_en && <p className="review-card__title-en ltr-term" dir="ltr">{topic.title_en}</p>}
            {topic?.subtitle && <span className="review-card__subtitle">{topic.subtitle}</span>}
          </div>

          {!topic && <>
            <p className="review-card__answer-empty" role="status">موضوع این رکورد قدیمی قابل شناسایی نیست. رکورد شما حفظ شده است؛ می‌توانید درس‌ها را باز کنید یا به مرور بعدی بروید.</p>
            <Button onClick={() => navigate("/subjects")} fullWidth>رفتن به درس‌ها</Button>
            <Button variant="ghost" onClick={() => { setRevealed(false); setPos(p => p + 1); }} fullWidth>مرور بعدی</Button>
          </>}

          {topic && !revealed && (
            <Button onClick={() => setRevealed(true)} fullWidth>نمایش پاسخ</Button>
          )}

          {topic && revealed && (
            <>
              <div className="review-card__answer">
                <p className="review-card__answer-label">نکات کلیدی</p>
                {topic && topic.keyPoints.length > 0 ? (
                  <ul>
                    {topic.keyPoints.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="review-card__answer-empty">برای این تاپیک نکته‌ی خلاصه‌ای ثبت نشده — تاپیک کامل را باز کن.</p>
                )}
                {topic && (
                  <button
                    type="button"
                    className="review-card__open"
                    onClick={() => navigate(topic.href)}
                  >
                    باز کردن تاپیک کامل ↗
                  </button>
                )}
              </div>

              <p className="review-card__grade-label">چقدر خوب به یاد آوردی؟</p>
              <div className="review-card__grades">
                {GRADE_ORDER.map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`review-grade review-grade--${g}`}
                    onClick={() => grade(g)}
                  >
                    {GRADE_LABELS_FA[g]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function toFa(n) {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

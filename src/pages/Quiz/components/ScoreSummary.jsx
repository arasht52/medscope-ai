import Card from "../../../shared/components/Card";
import "./ScoreSummary.css";

/**
 * ScoreSummary
 * Shows score, percentage, and a short message based on performance.
 */
export default function ScoreSummary({ score, total }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  let message = "نتیجه ثبت شد.";
  if (pct === 100) message = "عالی بود! همه پاسخ‌ها درست بودند.";
  else if (pct >= 70) message = "خوب بود! با کمی مرور به نمره کامل می‌رسید.";
  else if (pct >= 40) message = "قابل قبول. مرور دوباره مبحث پیشنهاد می‌شود.";
  else message = "نیاز به مرور بیشتر این مبحث دارید.";

  return (
    <Card className="score-summary">
      <div className="score-summary__circle">
        <span className="score-summary__pct">{pct}%</span>
      </div>
      <div className="score-summary__details">
        <div className="score-summary__fraction">
          {score} از {total} پاسخ صحیح
        </div>
        <div className="score-summary__message">{message}</div>
      </div>
    </Card>
  );
}

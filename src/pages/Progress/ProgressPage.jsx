import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../shared/components/PageHeader";
import Button from "../../shared/components/Button";
import { getViewedCount } from "../../shared/lib/storage";
import {
  getStudyStreak,
  getAccuracy,
  getRetention,
  getMatureCount,
  getTopicStats,
  getDailyCounts,
  getDueCount,
  getExamReadiness,
  getCards,
} from "../../shared/lib/learning";
import { resolveTopic, MODULE_TOTALS } from "../../shared/lib/topicResolver";
import "./ProgressPage.css";

const MODULES = [
  { key: "histology", label: "بافت‌شناسی" },
  { key: "pathology", label: "پاتولوژی" },
  { key: "pharmacology", label: "داروشناسی" },
];

export default function ProgressPage() {
  const navigate = useNavigate();

  const data = useMemo(() => {
    const coverage = MODULES.map((m) => {
      const total = MODULE_TOTALS[m.key] || 0;
      const viewed = Math.min(getViewedCount(m.key), total);
      return { ...m, total, viewed, pct: total ? Math.round((viewed / total) * 100) : 0 };
    });
    const totalItems = coverage.reduce((a, c) => a + c.total, 0);
    const totalViewed = coverage.reduce((a, c) => a + c.viewed, 0);
    const coveragePct = totalItems ? (totalViewed / totalItems) * 100 : 0;

    return {
      coverage,
      streak: getStudyStreak(),
      due: getDueCount(),
      accuracy: getAccuracy(),
      retention: getRetention(),
      mature: getMatureCount(),
      cards: Object.keys(getCards()).length,
      daily: getDailyCounts(7),
      topics: getTopicStats(),
      readiness: getExamReadiness({ coveragePct }),
    };
  }, []);

  const maxDaily = Math.max(1, ...data.daily.map((d) => d.count));
  const hasData = data.cards > 0 || data.accuracy;

  return (
    <div className="progress-page">
      <PageHeader title="پیشرفت و تحلیل یادگیری" onBack={() => navigate("/")} />

      {!hasData && (
        <div className="progress-empty">
          <p>هنوز داده‌ای برای تحلیل نداریم. با مطالعه‌ی تاپیک‌ها و آزمون‌دادن، این داشبورد پر می‌شود.</p>
          <Button onClick={() => navigate("/quiz")} fullWidth>شروع یک آزمون</Button>
        </div>
      )}

      {hasData && (
        <div className="progress-content">
          {/* Exam readiness */}
          <section className="progress-readiness">
            <div className="progress-readiness__gauge" style={gauge(data.readiness.score)}>
              <div className="progress-readiness__inner">
                <span className="progress-readiness__num">{toFa(data.readiness.score)}٪</span>
                <span className="progress-readiness__label">آمادگی تخمینی</span>
              </div>
            </div>
            <p className="progress-readiness__note">
              ترکیبی از پوشش، دقت، ماندگاری و مرورهاست. صرفاً یک سیگنال آموزشی است، نه تضمین نتیجه.
            </p>
          </section>

          {/* Key stats */}
          <section className="progress-stats">
            <Stat icon="🔥" label="روزهای پیاپی" value={`${toFa(data.streak)} روز`} />
            <Stat icon="🗂️" label="مرور امروز" value={toFa(data.due)} accent={data.due > 0} onClick={() => navigate("/review")} />
            <Stat icon="🎯" label="دقت کلی" value={data.accuracy ? `${toFa(data.accuracy.pct)}٪` : "—"} />
            <Stat icon="🧠" label="ماندگاری" value={data.retention != null ? `${toFa(data.retention)}٪` : "—"} />
            <Stat icon="🌱" label="کارت پایدار" value={toFa(data.mature)} />
            <Stat icon="📚" label="کارت فعال" value={toFa(data.cards)} />
          </section>

          {/* 7-day activity */}
          <section className="progress-block">
            <h3>فعالیت هفت روز گذشته</h3>
            <div className="progress-bars">
              {data.daily.map((d) => (
                <div key={d.stamp} className="progress-bars__col">
                  <div className="progress-bars__bar-wrap">
                    <div
                      className="progress-bars__bar"
                      style={{ height: `${(d.count / maxDaily) * 100}%` }}
                      title={`${d.count}`}
                    />
                  </div>
                  <span className="progress-bars__label">{d.label}</span>
                  <span className="progress-bars__count">{toFa(d.count)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Coverage per module */}
          <section className="progress-block">
            <h3>پوشش محتوا</h3>
            {data.coverage.map((c) => (
              <div key={c.key} className="progress-cov">
                <div className="progress-cov__head">
                  <span>{c.label}</span>
                  <span className="progress-cov__num">{toFa(c.viewed)}/{toFa(c.total)}</span>
                </div>
                <div className="progress-cov__track">
                  <div className="progress-cov__fill" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </section>

          {/* Weak topics */}
          {data.topics.weak.length > 0 && (
            <section className="progress-block">
              <h3>ضعیف‌ترین تاپیک‌ها</h3>
              <TopicList rows={data.topics.weak.slice(0, 6)} tone="weak" navigate={navigate} />
            </section>
          )}

          {/* Strong topics */}
          {data.topics.strong.length > 0 && (
            <section className="progress-block">
              <h3>قوی‌ترین تاپیک‌ها</h3>
              <TopicList rows={data.topics.strong.slice(0, 6)} tone="strong" navigate={navigate} />
            </section>
          )}

          <div className="progress-actions">
            <Button onClick={() => navigate("/review")} fullWidth>رفتن به مرور امروز ({toFa(data.due)})</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value, accent, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag className={`progress-stat ${accent ? "is-accent" : ""} ${onClick ? "is-button" : ""}`} onClick={onClick}>
      <span className="progress-stat__icon" aria-hidden="true">{icon}</span>
      <span className="progress-stat__value">{value}</span>
      <span className="progress-stat__label">{label}</span>
    </Tag>
  );
}

function TopicList({ rows, tone, navigate }) {
  return (
    <ul className="progress-topics">
      {rows.map((r) => {
        const t = resolveTopic(r.module, r.itemId);
        return (
          <li key={`${r.module}:${r.itemId}`}>
            <button
              type="button"
              className="progress-topics__row"
              onClick={() => t && navigate(t.href)}
            >
              <span className="progress-topics__name">{t ? t.title_fa : r.itemId}</span>
              <span className={`progress-topics__pct progress-topics__pct--${tone}`}>
                {toFa(r.pct)}٪ ({toFa(r.correct)}/{toFa(r.total)})
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function gauge(score) {
  const color =
    score >= 75 ? "var(--color-correct, #2e9e5b)" : score >= 50 ? "#e08a1e" : "var(--color-wrong, #d64545)";
  return { background: `conic-gradient(${color} ${score * 3.6}deg, var(--color-border, #e6e9ee) 0deg)` };
}

function toFa(n) {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

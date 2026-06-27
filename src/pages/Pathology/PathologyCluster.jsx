import { useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import pathologyData from "../../data/pathology.json";
import Card from "./components/Card.jsx";
import PathologyEmptyState from "./components/PathologyEmptyState.jsx";
import BackButton from "../../shared/components/BackButton.jsx";
import "./Pathology.css";
import "./PathologyCluster.css";

const { items, clusters = [] } = pathologyData;

/**
 * PathologyCluster
 * The "Diagnostic Cluster" hub page — per the architecture Arash
 * approved (separate Category / Cluster / Disease levels). A cluster
 * page contains ONLY comparison tools (overview, disease cards, a
 * one-feature-at-a-time Quick Compare, a Decision Path memory aid with
 * a mandatory disclaimer, and Exam Traps). It never repeats full
 * disease descriptions — those stay on each disease's own detail page
 * (PathologyDetail), reached via the disease cards below.
 */
export default function PathologyCluster() {
  const { clusterId } = useParams();
  const navigate = useNavigate();
  const cluster = useMemo(() => clusters.find((c) => c.id === clusterId), [clusterId]);
  const diseases = useMemo(
    () => (cluster ? cluster.disease_ids.map((id) => items.find((it) => it.id === id)).filter(Boolean) : []),
    [cluster]
  );

  const [featureIndex, setFeatureIndex] = useState(0);

  if (!cluster) {
    return (
      <div className="page">
        <PathologyEmptyState
          icon="❓"
          title="این مجموعه پیدا نشد"
          description="ممکن است لینک نادرست باشد."
        />
        <BackButton onClick={() => navigate(-1)} label="بازگشت" />
      </div>
    );
  }

  const features = cluster.compare_features || [];
  const currentFeature = features[featureIndex];

  return (
    <div className="page path-detail path-cluster">
      <div className="page-header path-detail__header">
        <BackButton onClick={() => navigate(-1)} label="بازگشت" />
        <div className="path-detail__title-row">
          <div>
            <h1 className="path-detail__name-fa">{cluster.title_fa}</h1>
            <p className="path-detail__name-en en">{cluster.title_en}</p>
          </div>
        </div>
        <span className="path-detail__category en">{cluster.category} · مجموعه‌ی مقایسه‌ای</span>
      </div>

      {cluster.overview_fa && (
        <Card className="path-detail__section">
          <p className="path-detail__section-label">
            <span className="path-detail__section-icon" aria-hidden="true">💡</span>
            چرا این‌ها قاطی می‌شوند؟
          </p>
          <p className="path-detail__text">{cluster.overview_fa}</p>
        </Card>
      )}

      <Card className="path-detail__section">
        <p className="path-detail__section-label">
          <span className="path-detail__section-icon" aria-hidden="true">📋</span>
          بیماری‌های این مجموعه
        </p>
        <ul className="path-cluster__disease-list">
          {diseases.map((d) => (
            <li key={d.id}>
              <Link to={`/pathology/${d.id}`} className="path-cluster__disease-link">
                <span className="path-cluster__disease-name-fa">{d.title_fa}</span>
                <span className="path-cluster__disease-name-en en">{d.title_en}</span>
                <span className="path-cluster__chevron" aria-hidden="true">‹</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      {features.length > 0 && (
        <Card className="path-detail__section">
          <p className="path-detail__section-label">
            <span className="path-detail__section-icon" aria-hidden="true">🔍</span>
            مقایسه‌ی سریع
          </p>
          <div className="path-cluster__compare">
            <div className="path-cluster__compare-nav">
              <button
                type="button"
                className="path-cluster__compare-arrow"
                onClick={() => setFeatureIndex((i) => Math.max(0, i - 1))}
                disabled={featureIndex === 0}
                aria-label="ویژگی قبلی"
              >
                ›
              </button>
              <span className="path-cluster__compare-title">{currentFeature.feature_fa}</span>
              <button
                type="button"
                className="path-cluster__compare-arrow"
                onClick={() => setFeatureIndex((i) => Math.min(features.length - 1, i + 1))}
                disabled={featureIndex === features.length - 1}
                aria-label="ویژگی بعدی"
              >
                ‹
              </button>
            </div>
            <ul className="path-cluster__compare-rows">
              {currentFeature.entries.map((entry) => {
                const disease = items.find((it) => it.id === entry.disease_id);
                return (
                  <li key={entry.disease_id} className="path-cluster__compare-row">
                    <span className="path-cluster__compare-disease en">
                      {disease ? disease.title_en : entry.disease_id}
                    </span>
                    <span className="path-cluster__compare-value">{entry.value_fa}</span>
                  </li>
                );
              })}
            </ul>
            <div className="path-cluster__compare-dots" aria-hidden="true">
              {features.map((f, i) => (
                <span
                  key={f.feature_key}
                  className={`path-cluster__dot${i === featureIndex ? " path-cluster__dot--active" : ""}`}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {cluster.decision_path?.steps?.length > 0 && (
        <Card className="path-detail__section">
          <p className="path-detail__section-label">
            <span className="path-detail__section-icon" aria-hidden="true">🧭</span>
            مسیر کمک‌حافظه
          </p>
          <p className="path-cluster__disclaimer">{cluster.decision_path.disclaimer_fa}</p>
          <ol className="path-cluster__decision-steps">
            {cluster.decision_path.steps.map((step, i) => (
              <li key={i} className="path-cluster__decision-step">
                <span className="path-cluster__decision-prompt">{step.prompt_fa}</span>
                <span className="path-cluster__decision-arrow" aria-hidden="true">↓</span>
                {step.disease_id ? (
                  <Link to={`/pathology/${step.disease_id}`} className="path-cluster__decision-result">
                    {step.result_fa}
                  </Link>
                ) : (
                  <span className="path-cluster__decision-result">{step.result_fa}</span>
                )}
              </li>
            ))}
          </ol>
        </Card>
      )}

      {cluster.exam_traps?.length > 0 && (
        <Card className="path-detail__section">
          <p className="path-detail__section-label">
            <span className="path-detail__section-icon" aria-hidden="true">📝</span>
            تله‌های امتحانی
          </p>
          <ul className="path-cluster__traps">
            {cluster.exam_traps.map((trap, i) => (
              <li key={i} className="path-cluster__trap">
                <p className="path-cluster__trap-title">{trap.title_fa}</p>
                <p className="path-detail__text">{trap.description_fa}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

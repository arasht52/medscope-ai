export default function ProgressCard({
  title,
  value,
  total
}) {
  const percent = Math.round((value / total) * 100);

  return (
    <div className="progress-card">
      <div className="progress-header">
        <h3>{title}</h3>
        <span>{percent}%</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p>
        {value} / {total}
      </p>
    </div>
  );
}
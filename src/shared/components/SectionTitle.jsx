export default function SectionTitle({
  title,
  action
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>

      {action && (
        <button className="section-action">
          {action}
        </button>
      )}
    </div>
  );
}
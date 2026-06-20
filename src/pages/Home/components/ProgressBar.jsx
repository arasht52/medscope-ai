const BAR_COLOR = {
  histology: "bg-histology",
  pharm: "bg-pharm",
  quiz: "bg-quiz",
  fav: "bg-fav",
};

export default function ProgressBar({ value, total, variant }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="w-full h-2 rounded-full overflow-hidden bg-border">
      {/* width is computed at runtime, so it stays inline; color is a Tailwind token */}
      <div className={`h-full rounded-full ${BAR_COLOR[variant]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

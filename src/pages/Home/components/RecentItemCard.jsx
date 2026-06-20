import CardNotch from "./CardNotch.jsx";

const TYPE_TO_VARIANT = {
  histology: "histology",
  pharmacology: "pharm",
};

const TAG_CLASSES = {
  histology: "bg-histologySoft text-histology",
  pharm: "bg-pharmSoft text-pharm",
};

export default function RecentItemCard({ item }) {
  const variant = TYPE_TO_VARIANT[item.type];
  return (
    <button
      className="relative flex-shrink-0 text-right rounded-xl p-3 w-40 focus:outline-none transition-transform active:scale-95 bg-surface border border-border"
    >
      <CardNotch variant={variant} />
      <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full mb-2 ${TAG_CLASSES[variant]}`}>
        {item.category}
      </span>
      <div className="text-sm font-semibold leading-tight text-ink">{item.title_fa}</div>
      <div className="text-xs text-muted">{item.title_en}</div>
    </button>
  );
}

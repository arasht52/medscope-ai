import "./Section.css";

/**
 * Labeled content block used on detail pages (microscopic features,
 * locations, diagnostic clues, etc.). Generic enough for Pharmacology
 * detail pages later (mechanism, adverse effects, ...).
 *
 * props:
 *  - title: string
 *  - items: string[] (rendered as a bullet list)
 *  - tone: "neutral" | "warning"  (warning = amber accent, e.g. cautions)
 */
export default function Section({ title, items, tone = "neutral" }) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`section section--${tone}`}>
      <h2 className="section__title">{title}</h2>
      <ul className="section__list">
        {items.map((item, i) => (
          <li key={i} className="section__item">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

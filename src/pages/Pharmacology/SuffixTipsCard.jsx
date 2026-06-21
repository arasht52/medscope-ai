import Card from "./components/Card.jsx";
import { SUFFIX_TIPS } from "./suffixTips.js";
import "./Pharmacology.css";

/**
 * General suffix-pattern reference, per student feedback. Collapsed by
 * default (native <details>, no extra JS/state needed) so it doesn't
 * compete with the category grid for attention.
 */
export default function SuffixTipsCard() {
  return (
    <Card className="suffix-tips">
      <details>
        <summary className="suffix-tips__summary">
          نکات یادگیری پسوند داروها 💡
        </summary>
        <ul className="suffix-tips__list">
          {SUFFIX_TIPS.map((tip) => (
            <li key={tip.suffix} className="suffix-tips__item">
              <div className="suffix-tips__main">
                <span className="suffix-tips__suffix en">{tip.suffix}</span>
                <span className="suffix-tips__class">{tip.class_fa}</span>
              </div>
              <span className="suffix-tips__example en">{tip.example_en}</span>
            </li>
          ))}
        </ul>
      </details>
    </Card>
  );
}

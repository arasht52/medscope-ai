import "./AnswerOption.css";

/**
 * AnswerOption
 * Renders one selectable choice. After the user answers, shows
 * correct (green) / wrong (red) state instead of accepting more input.
 *
 * The correct/wrong state was previously communicated by color alone;
 * a visually-hidden text label now carries the same information for
 * screen readers (sr-only utility class, defined once in src/index.css).
 */
const STATE_SR_TEXT = {
  "selected-correct": " (پاسخ صحیح — انتخاب شما)",
  "selected-wrong": " (پاسخ نادرست — انتخاب شما)",
  "correct-unselected": " (پاسخ صحیح)",
};

export default function AnswerOption({ option, state, onSelect, disabled }) {
  // state: "idle" | "selected-correct" | "selected-wrong" | "correct-unselected" | "muted"
  const srText = STATE_SR_TEXT[state];

  return (
    <button
      type="button"
      className={`answer-option answer-option--${state}`}
      onClick={() => onSelect(option.id)}
      disabled={disabled}
    >
      <span className="answer-option__text_fa">{option.text_fa}</span>
      {option.text_en && (
        <span className="answer-option__text_en ltr-term">{option.text_en}</span>
      )}
      {srText && <span className="sr-only">{srText}</span>}
    </button>
  );
}

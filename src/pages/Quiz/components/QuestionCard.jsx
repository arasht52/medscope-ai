import Card from "../../../shared/components/Card";
import ImageWithFallback from "../../../shared/components/ImageWithFallback";
import AnswerOption from "./AnswerOption";
import "./QuestionCard.css";

/**
 * QuestionCard
 * Shows one question with its options. Reuses the shared Card component.
 *
 * If the question includes an `image_url` (currently only Histology
 * questions do), it's rendered above the question text via the same
 * placeholder-fallback component Histology's Detail page uses, so a
 * missing/not-yet-shot image degrades gracefully instead of breaking
 * the quiz.
 *
 * @param {object} question - current question object
 * @param {string|undefined} selectedOptionId - option chosen by the user (if any)
 * @param {function} onSelect - callback(optionId)
 * @param {number} index - zero-based question index
 * @param {number} total - total question count
 */
export default function QuestionCard({ question, selectedOptionId, onSelect, index, total }) {
  const hasAnswered = selectedOptionId !== undefined;

  function getState(option) {
    if (!hasAnswered) return "idle";
    const isCorrect = option.id === question.correctOptionId;
    const isSelected = option.id === selectedOptionId;
    if (isSelected && isCorrect) return "selected-correct";
    if (isSelected && !isCorrect) return "selected-wrong";
    if (!isSelected && isCorrect) return "correct-unselected";
    return "muted";
  }

  return (
    <Card className="question-card">
      <div className="question-card__meta">
        سوال {index + 1} از {total}
      </div>
      {(question.topicTitleEn || question.drugTitleEn) && (
        <div className="question-card__topic ltr-term">
          {question.topicTitleEn || question.drugTitleEn}
        </div>
      )}

      {question.image_url && (
        <div className="question-card__image-wrap">
          <ImageWithFallback
            className="question-card__image"
            src={question.image_url}
            alt={question.topicTitleEn || question.drugTitleEn || ""}
          />
          {question.image_caption && (
            <p className="question-card__image-caption">{question.image_caption}</p>
          )}
        </div>
      )}

      <h2 className="question-card__question">{question.question_fa}</h2>

      <div className="question-card__options">
        {question.options.map((option) => (
          <AnswerOption
            key={option.id}
            option={option}
            state={getState(option)}
            onSelect={onSelect}
            disabled={hasAnswered}
          />
        ))}
      </div>

      {hasAnswered && (
        <div className="question-card__explanation">
          <strong>توضیح: </strong>
          {question.explanation_fa}
        </div>
      )}
    </Card>
  );
}

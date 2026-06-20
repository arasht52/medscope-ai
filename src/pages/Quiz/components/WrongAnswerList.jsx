import Card from "../../../shared/components/Card";
import "./WrongAnswerList.css";

/**
 * WrongAnswerList
 * Lets the student review every question they missed: their answer,
 * the correct answer, and the explanation.
 */
export default function WrongAnswerList({ wrongAnswers }) {
  if (wrongAnswers.length === 0) {
    return (
      <Card className="wrong-answers wrong-answers--empty">
        🎉 هیچ پاسخ اشتباهی ثبت نشد.
      </Card>
    );
  }

  return (
    <div className="wrong-answers">
      <h3 className="wrong-answers__title">مرور پاسخ‌های اشتباه</h3>
      {wrongAnswers.map(({ question, selectedOptionId }) => {
        const selected = question.options.find((o) => o.id === selectedOptionId);
        const correct = question.options.find((o) => o.id === question.correctOptionId);
        return (
          <Card key={question.id} className="wrong-answer-item">
            <div className="wrong-answer-item__question">{question.question_fa}</div>
            <div className="wrong-answer-item__row wrong-answer-item__row--wrong">
              پاسخ شما: {selected?.text_fa}
            </div>
            <div className="wrong-answer-item__row wrong-answer-item__row--correct">
              پاسخ صحیح: {correct?.text_fa}
            </div>
            <div className="wrong-answer-item__explanation">{question.explanation_fa}</div>
          </Card>
        );
      })}
    </div>
  );
}

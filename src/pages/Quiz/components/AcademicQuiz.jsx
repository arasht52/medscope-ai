import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MedicalIcon from "../../../shared/components/MedicalIcon.jsx";
import { StudyText } from "../../../shared/components/StudyExperience.jsx";
import ProgressBar from "../../../shared/components/ProgressBar.jsx";
import QuestionCard from "./QuestionCard.jsx";
import ScoreSummary from "./ScoreSummary.jsx";
import WrongAnswerList from "./WrongAnswerList.jsx";
import "./AcademicQuiz.css";

export const ACADEMIC_QUIZ_PATH = "/quiz/pharmacology/GI";
export function academicQuizMeta(path) {
  let clean;
  try { clean = decodeURI(path).replace(/\/result$/, ""); } catch { return null; }
  if (clean === "/quiz/pathology-image") return { subject: "پاتولوژی", category: "شناسایی تصویر", title: "آزمون تصویری پاتولوژی" };
  const match = clean.match(/^\/quiz\/(histology|pharmacology|pathology)\/(?:custom\/)?(.+)$/);
  if (!match) return null;
  const subject = { histology: "بافت‌شناسی", pharmacology: "داروشناسی", pathology: "پاتولوژی" }[match[1]];
  return { subject, category: match[2].split("|").join(" · "), title: `آزمون ${subject}` };
}
function QuizHeading({ title, onBack, meta = academicQuizMeta(ACADEMIC_QUIZ_PATH) }) {
  return <header className="academic-quiz__header"><button type="button" onClick={onBack} aria-label="بازگشت به آزمون‌ها">→</button><div><p>{meta.subject} <span aria-hidden="true">/</span> <bdi dir="auto">{meta.category}</bdi></p><h1>{title}</h1></div><MedicalIcon name="quiz" size={40}/></header>;
}
export function AcademicQuizQuestion({ quiz, homePath, meta = academicQuizMeta(ACADEMIC_QUIZ_PATH) }) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(undefined);
  const feedback = useRef(null);
  const footer = useRef(null);
  useLayoutEffect(() => {
    if (!quiz.hasAnswered || !feedback.current) return;
    const rect = feedback.current.getBoundingClientRect();
    const limit = footer.current?.getBoundingClientRect().top || window.innerHeight;
    if (rect.height > 0) {
      const delta = rect.height > limit - 24 || rect.top < 12 ? rect.top - 12 : rect.bottom > limit - 12 ? rect.bottom - limit + 12 : 0;
      if (delta) window.scrollBy({ top: delta, behavior: "instant" });
    }
    feedback.current.focus({ preventScroll: true });
  }, [quiz.hasAnswered]);
  const correct = quiz.currentQuestion.options.find(o => o.id === quiz.currentQuestion.correctOptionId);
  const isCorrect = quiz.selectedOptionId === quiz.currentQuestion.correctOptionId;
  return <main className="academic-ui academic-quiz" dir="rtl" lang="fa">
    <QuizHeading title={meta.title} meta={meta} onBack={() => navigate(homePath)}/>
    <section className="academic-quiz__progress" aria-label="پیشرفت آزمون"><div><span>سؤال {quiz.currentIndex + 1} از {quiz.total}</span><span>{quiz.hasAnswered ? "پاسخ ثبت شد" : "یک گزینه انتخاب کن"}</span></div><ProgressBar value={quiz.currentIndex + (quiz.hasAnswered ? 1 : 0)} max={quiz.total}/></section>
    <QuestionCard question={quiz.currentQuestion} index={quiz.currentIndex} total={quiz.total} selectedOptionId={quiz.selectedOptionId} pendingOptionId={pending} academic onSelect={setPending} feedback={quiz.hasAnswered && <section className={`academic-quiz__feedback ${isCorrect ? "is-correct" : "is-wrong"}`} ref={feedback} tabIndex={-1} role="status" aria-live="polite"><h2>{isCorrect ? "✓ پاسخ شما صحیح است" : "× پاسخ شما نادرست است"}</h2><p>پاسخ صحیح: <StudyText text={correct.text_fa}/>{correct.text_en && <> — <bdi dir="ltr">{correct.text_en}</bdi></>}</p></section>}/>
    <footer ref={footer} className="academic-quiz__footer">{quiz.hasAnswered ? <button type="button" className="academic-primary" onClick={quiz.goNext}>{quiz.isLast ? "مشاهده نتیجه" : "سؤال بعدی"}</button> : <><p>انتخاب گزینه تا زدن «ثبت پاسخ» نهایی نمی‌شود.</p><button type="button" className="academic-primary" disabled={pending === undefined} onClick={() => { if (pending !== undefined) quiz.selectAnswer(pending); }}>ثبت پاسخ</button></>}</footer>
  </main>;
}
export function AcademicQuizResults({ state, onBack, onRetry, meta }) {
  return <main className="academic-ui academic-quiz academic-quiz--results" dir="rtl" lang="fa">
    <QuizHeading title="نتیجهٔ آزمون" onBack={onBack} meta={meta}/>
    <section className="academic-quiz__result-intro"><span>مرور این تلاش</span><h2>نتیجه و بازخورد یادگیری</h2></section>
    <ScoreSummary score={state.score} total={state.total}/>
    <p className="academic-quiz__incorrect-count">پاسخ نادرست: {state.wrongAnswers.length}</p>
    {state.wrongAnswers.length ? <WrongAnswerList wrongAnswers={state.wrongAnswers}/> : <p className="academic-quiz__all-correct">پاسخ نادرستی برای مرور وجود ندارد.</p>}
    <footer className="academic-quiz__footer"><button type="button" className="academic-primary" onClick={onRetry}>تکرار آزمون</button><button type="button" className="academic-quiz__secondary" onClick={onBack}>بازگشت به فهرست آزمون‌ها</button></footer>
  </main>;
}

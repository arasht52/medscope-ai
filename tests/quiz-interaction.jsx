import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import QuizPlay from "../src/pages/Quiz/pages/QuizPlay.jsx";
import QuizResult from "../src/pages/Quiz/pages/QuizResult.jsx";
import ScoreSummary from "../src/pages/Quiz/components/ScoreSummary.jsx";
import useQuiz from "../src/pages/Quiz/hooks/useQuiz.js";
import bank from "../src/pages/Quiz/data/pathologyQuestions.json";

const root = createRoot(document.querySelector("#root"));
const outcome = document.querySelector("#outcome");
const questions = bank.filter((q) => q.options[0].id === q.correctOptionId).slice(0, 2);
const render = (element) => flushSync(() => root.render(element));
const click = (element) => flushSync(() => element.click());
const buttons = () => [...document.querySelectorAll(".answer-option")];
const order = () => buttons().map((button) => button.querySelector(".answer-option__text_fa").textContent).join("|");
const next = () => click(document.querySelector(".quiz-play__footer button"));
function check(condition, message) {
  if (!condition) throw new Error(message);
}
function choose(index) {
  click(buttons()[index]);
}
function flow() {
  return (
    <MemoryRouter initialEntries={["/quiz/test"]} future={{ v7_startTransition: false, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/quiz/test" element={<QuizPlay title="آزمون" questions={questions} resultPath="/quiz/test/result" homePath="/quiz" />} />
        <Route path="/quiz/test/result" element={<QuizResult />} />
      </Routes>
    </MemoryRouter>
  );
}

let state;
function Probe({ rows }) {
  state = useQuiz(rows);
  return null;
}

const originalRandom = Math.random;
async function run() {
  try {
    const perfectMessage = "عالی بود! همه پاسخ‌ها درست بودند.";
    for (const [score, percent] of [[293, "100%"], [292, "99%"], [0, "0%"]]) {
      render(<ScoreSummary score={score} total={293} />);
      const summary = document.querySelector(".score-summary");
      check(summary.querySelector(".score-summary__fraction").textContent.trim() ===
        `${score} از 293 پاسخ صحیح`, "Incorrect fraction for " + score);
      check(summary.querySelector(".score-summary__pct").textContent === percent,
        "Incorrect percentage for " + score);
      check(summary.textContent.includes(perfectMessage) === (score === 293),
        "Incorrect perfect-score feedback for " + score);
    }
    for (let position = 0; position < 4; position++) {
      render(null);
      // The first three random draws shuffle question one. Move its first
      // option to the target slot, keeping other swaps on the current slot.
      const draws = [3, 2, 1].map((slot) => (slot === position ? 0 : slot + 0.5) / (slot + 1));
      Math.random = () => draws.shift() ?? 0.99;
      render(flow());
      const initial = order();
      const expected = questions[0].options.find((o) => o.id === questions[0].correctOptionId);
      check(buttons()[position].textContent.includes(expected.text_fa), "Expected correct position " + position);
      render(flow());
      check(order() === initial, "Rerender changed order");
      choose(position);
      check(order() === initial, "Answer changed order");
      check(buttons()[position].classList.contains("answer-option--selected-correct"), "Correct feedback missing");
      check(document.querySelector(".question-card__explanation").textContent.includes(questions[0].explanation_fa), "Incorrect feedback explanation");
      next();
      const secondOrder = order();
      const wrong = questions[1].options.find((o) => o.id !== questions[1].correctOptionId);
      const correct = questions[1].options.find((o) => o.id === questions[1].correctOptionId);
      choose(buttons().findIndex((button) => button.textContent.includes(wrong.text_fa)));
      check(order() === secondOrder, "Wrong answer changed order");
      next();
      await new Promise((resolve) => setTimeout(resolve, 0));
      const review = document.querySelector(".wrong-answer-item");
      check(document.querySelector(".score-summary__pct")?.textContent === "50%", "Incorrect score");
      check(review?.textContent.includes(questions[1].question_fa), "Wrong question in review");
      check(review.querySelector(".wrong-answer-item__row--wrong").textContent.includes(wrong.text_fa), "Wrong selected option in review");
      check(review.querySelector(".wrong-answer-item__row--correct").textContent.includes(correct.text_fa), "Wrong key in review");
      check(review.querySelector(".wrong-answer-item__explanation").textContent.includes(questions[1].explanation_fa), "Wrong review explanation");
      Math.random = () => position === 0 ? 0 : 0.99;
      click([...document.querySelectorAll(".quiz-result button")].find((b) => b.textContent.includes("تکرار آزمون")));
      await new Promise((resolve) => setTimeout(resolve, 0));
      check(buttons().length === 4 && buttons().every((b) => !b.disabled), "Retake failed to reset answers");
      check(order() !== initial, "Retake did not initialize a fresh order");
    }
    render(null);
    let drawCount = 0;
    Math.random = () => { drawCount++; return 0; };
    render(<Probe rows={questions} />);
    const first = state.currentQuestion;
    const draws = drawCount;
    flushSync(() => state.selectAnswer(first.correctOptionId));
    flushSync(() => state.goNext());
    const second = state.currentQuestion;
    render(<Probe rows={[...questions]} />);
    check(state.currentQuestion === second && drawCount === draws, "Navigation or new input array reshuffled");
    Math.random = () => 0.99;
    flushSync(() => state.restart());
    check(state.currentIndex === 0 && state.score === 0 && !state.hasAnswered, "Hook restart did not reset attempt");
    check(state.currentQuestion.options[0].id !== first.options[0].id, "Hook restart did not shuffle");
    outcome.textContent = "PASS: four scored positions, feedback, rerender, navigation, review, and restart";
  } catch (error) {
    outcome.textContent = "FAIL: " + error.stack;
  } finally {
    Math.random = originalRandom;
  }


}
window.quizTest = run();

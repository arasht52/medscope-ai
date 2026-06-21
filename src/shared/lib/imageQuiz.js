// src/shared/lib/imageQuiz.js
//
// Generates "image first, identify the tissue/condition" multiple-choice
// questions on the fly from any dataset shaped like
// { id, title_fa, title_en, images: [{ url, caption, magnification }] }.
//
// Reuses the existing QuizPlay/useQuiz/QuestionCard engine unchanged —
// the output here is just a plain question array in the exact shape
// that engine already expects, so nothing about the quiz *mechanics*
// is new, only how the question bank is built.
//
// Important: unlike the text-based quizzes, the generated questions
// deliberately do NOT set topicTitleEn/drugTitleEn, since QuestionCard
// renders that as a small badge above the question — showing the
// tissue's English name before the student answers would give the
// answer away.

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const OPTION_LETTERS = ["a", "b", "c", "d"];

/**
 * @param {Array} items - dataset items (histology.json's items or
 *   pathology.json's items), each with images: [{url, caption, magnification}]
 * @param {object} opts
 * @param {number} opts.count - how many questions to generate (capped to
 *   the number of eligible items)
 * @param {string} opts.questionText - the fixed prompt, e.g.
 *   "این بافت کدام است؟"
 * @param {string} opts.idPrefix - prefix for generated question ids
 */
export function buildImageIdentificationQuiz(items, { count = 10, questionText, idPrefix }) {
  const eligible = items.filter((it) => it.images && it.images.length > 0);
  const chosen = shuffle(eligible).slice(0, Math.min(count, eligible.length));

  return chosen.map((correctItem, qIndex) => {
    const image = correctItem.images[Math.floor(Math.random() * correctItem.images.length)];

    const distractorPool = eligible.filter((it) => it.id !== correctItem.id);
    const distractors = shuffle(distractorPool).slice(0, 3);
    const choiceItems = shuffle([correctItem, ...distractors]);

    const options = choiceItems.map((it, i) => ({
      id: OPTION_LETTERS[i],
      text_fa: it.title_fa,
      text_en: it.title_en,
    }));
    const correctOptionId = options[choiceItems.findIndex((it) => it.id === correctItem.id)].id;

    const metaLine = [correctItem.stain, image.magnification].filter(Boolean).join(" • ");

    return {
      id: `${idPrefix}-${qIndex + 1}`,
      question_fa: questionText,
      image_url: image.url,
      image_caption: metaLine,
      options,
      correctOptionId,
      explanation_fa: `پاسخ صحیح: ${correctItem.title_fa} (${correctItem.title_en})`,
    };
  });
}

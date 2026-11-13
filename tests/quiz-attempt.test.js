import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import createQuizAttempt from "../src/pages/Quiz/hooks/createQuizAttempt.js";

const bank = JSON.parse(readFileSync(new URL("../src/pages/Quiz/data/pathologyQuestions.json", import.meta.url)));
const question = bank[0];

test("all questions preserve option objects, IDs, and exactly one correct key", () => {
  const original = structuredClone(bank);
  const attempt = createQuizAttempt(bank);
  attempt.forEach((item, i) => {
    const source = bank[i];
    assert.notEqual(item.options, source.options);
    assert.equal(item.correctOptionId, source.correctOptionId);
    assert.equal(item.options.length, source.options.length);
    for (const option of source.options) {
      assert.equal(item.options.filter((candidate) => candidate === option).length, 1);
    }
    assert.equal(item.options.filter((option) => option.id === item.correctOptionId).length, 1);
  });
  assert.deepEqual(bank, original);
});

test("Fisher–Yates maps the 24 equally likely choice sequences to 24 unique orders", () => {
  const orders = new Set();
  for (let a = 0; a < 4; a++) {
    for (let b = 0; b < 3; b++) {
      for (let c = 0; c < 2; c++) {
        const draws = [(a + 0.5) / 4, (b + 0.5) / 3, (c + 0.5) / 2];
        const [item] = createQuizAttempt([question], () => draws.shift());
        assert.equal(draws.length, 0);
        orders.add(item.options.map((option) => option.id).join(","));
      }
    }
  }
  assert.equal(orders.size, 24);
});

test("independent shuffles spread the correct option across the four positions", () => {
  const counts = [0, 0, 0, 0];
  let seed = 123456789;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  }
  for (let i = 0; i < 10000; i++) {
    const [item] = createQuizAttempt([question], random);
    counts[item.options.findIndex((option) => option.id === item.correctOptionId)]++;
  }
  for (const count of counts) assert.ok(count >= 2000 && count <= 3000, counts.join(", "));
});

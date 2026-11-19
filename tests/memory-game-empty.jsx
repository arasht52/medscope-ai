import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { MemoryGameBoard } from "../src/pages/Game/MemoryGamePlay.jsx";
import { buildDeck, getSubjectMeta } from "../src/pages/Game/gameDeck.js";

const root = createRoot(document.getElementById("root"));
const allCards = buildDeck("pathology", 162);
const pairIds = [...new Set(allCards.map(c => c.pairId))];
const decks = Object.fromEntries([0, 1, 3].map(n => [n, allCards.filter(c => pairIds.slice(0,n).includes(c.pairId))]));
const message = "در حال حاضر تصویر تأییدشده‌ای برای این بازی موجود نیست.";
let destination = null;
function Fixture() {
  const [count, setCount] = useState(0);
  return <><div dir="rtl">{[0,1,3].map(n => <button key={n} onClick={() => setCount(n)}>pool {n}</button>)}</div>
    <MemoryGameBoard subjectId="pathology" meta={getSubjectMeta("pathology")} availableDeck={decks[count]} navigate={path => { destination=path; }} /></>;
}
const render = element => act(() => root.render(element));
const click = button => act(() => button.click());
window.IS_REACT_ACT_ENVIRONMENT = true;
window.mountMemoryGameFixture = () => render(<Fixture />);
window.runMemoryGameEmptyTests = () => {
  const interval = window.setInterval, clear = window.clearInterval;
  const timeout = window.setTimeout, clearTimeoutOriginal = window.clearTimeout;
  const active = new Map(), pending = new Map(); let serial=0;
  window.setInterval = fn => {const id=++serial; active.set(id,fn);return id;};
  window.clearInterval = id => active.delete(id);
  window.setTimeout = fn => {const id=++serial; pending.set(id,fn);return id;};
  window.clearTimeout = id => pending.delete(id);
  const check=(ok,msg)=>{if(!ok)throw Error(msg);};
  const board=count=><MemoryGameBoard subjectId="pathology" meta={getSubjectMeta("pathology")} availableDeck={decks[count]} navigate={path=>{destination=path;}} />;
  try {
    render(board(0));
    check(active.size===0,"zero pool started a timer");
    check(document.body.textContent.includes(message),"missing exact Persian empty state");
    check(document.querySelector('[role="status"]').closest('[dir="rtl"]'),"missing RTL");
    check(document.querySelectorAll('.game-card').length===0,"zero pool generated cards");
    click([...document.querySelectorAll('button')].find(b=>b.textContent==='بازگشت به بازی‌ها'));
    check(destination==='/game',"return navigation failed");
    for(const count of [1,3]) {
      render(board(count));
      check(active.size===1,"nonempty pool should have one timer");
      const cards=[...document.querySelectorAll('.game-card')];
      check(cards.length===count*2,"invalid pair count");
      check([...document.querySelectorAll('.game-card img')].every(i=>i.getAttribute('src')?.endsWith('-photo.jpg')),"blank image card");
      act(()=>[...active.values()].forEach(fn=>fn()));
      check(document.querySelector('.game-play__stats').textContent.includes('0:01'),"timer did not tick");
      click(cards[0]);click(cards[1]);
      check(pending.size===1,"pair resolution not scheduled");
      render(board(0));
      check(active.size===0,"timer not cleaned when pool became empty");
      check(pending.size===0,"pending pair resolution not cleaned");
      check(document.querySelectorAll('.game-card').length===0,"stale cards after pool became empty");
      check(document.body.textContent.includes(message),"empty state missing after transition");
    }
    render(null);
    check(active.size===0,"timer survives unmount");
    return "PASS: zero/one/three pools, navigation, RTL, timer start/cleanup, pending-pair cleanup, no blank cards";
  } finally {window.setInterval=interval;window.clearInterval=clear;window.setTimeout=timeout;window.clearTimeout=clearTimeoutOriginal;}
};
window.mountMemoryGameFixture();

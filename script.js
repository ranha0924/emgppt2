/* ═══ VOCABULARY DATA ═══ */
const WORDS = [
  { word: "risky", meaning: "위험한", syn: "dangerous, hazardous", ant: "safe, secure" },
  { word: "trustworthy", meaning: "신뢰할만한", syn: "reliable, dependable", ant: "unreliable, untrustworthy" },
  { word: "trust", meaning: "신뢰 (n.)", syn: "confidence, faith", ant: "distrust, suspicion" },
  { word: "evidence", meaning: "증거", syn: "proof, indication", ant: "disproof, conjecture" },
  { word: "evolutionary", meaning: "진화의", syn: "developmental, adaptive", ant: "regressive, static" },
  { word: "evolution", meaning: "진화 (n.)", syn: "development, progression", ant: "regression, devolution" },
  { word: "prospect", meaning: "전망, 가능성", syn: "outlook, possibility", ant: "hopelessness, impossibility" },
  { word: "sensible", meaning: "분별있는, 합리적인", syn: "reasonable, rational", ant: "foolish, irrational" },
  { word: "subtle", meaning: "미묘한", syn: "delicate, faint", ant: "obvious, blatant" },
  { word: "in demand", meaning: "수요가 많은", syn: "popular, sought-after", ant: "unwanted, unpopular" },
  { word: "more often than not", meaning: "대개, 보통", syn: "usually, typically", ant: "rarely, seldom" },
];

/* ═══ RENDER VOCAB LIST ═══ */
const vocabList = document.getElementById("vocab-list");
WORDS.forEach((w, i) => {
  const idx = String(i + 1).padStart(2, "0");
  const div = document.createElement("div");
  div.className = `vocab-item reveal stagger-${i + 1}`;
  div.innerHTML = `
    <div class="vocab-item__row1">
      <span class="vocab-item__idx">${idx}</span>
      <span class="vocab-item__word">${w.word}</span>
      <span class="vocab-item__meaning">${w.meaning}</span>
    </div>
    <div class="vocab-item__row2">
      <span><span class="vocab-item__syn-label">syn</span><span class="vocab-item__syn-val">${w.syn}</span></span>
      <span><span class="vocab-item__ant-label">ant</span><span class="vocab-item__ant-val">${w.ant}</span></span>
    </div>
  `;
  vocabList.appendChild(div);
});

/* ═══ ANSWER BLANKS ═══ */
(function () {
  const blanks = document.querySelectorAll(".answer__blank");
  const hint = document.querySelector(".answer__hint");
  let revealedCount = 0;

  function typeIn(el, text) {
    el.textContent = "";
    el.classList.add("revealed");
    let i = 0;
    const cursor = document.createElement("span");
    cursor.className = "answer__cursor";
    cursor.textContent = "|";
    el.appendChild(cursor);
    const interval = setInterval(() => {
      cursor.before(text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => cursor.remove(), 400);
      }
    }, 60);
  }

  blanks.forEach((blank) => {
    blank.addEventListener("click", () => {
      if (blank.classList.contains("revealed")) return;
      typeIn(blank, blank.dataset.answer);
      revealedCount++;
      if (revealedCount >= blanks.length) {
        if (hint) hint.classList.add("hidden");
      }
    });
  });
})();

/* ═══ KEY SENTENCE DECOMPOSE ═══ */
(function () {
  const text = document.getElementById("sent-text");
  if (!text) return;

  text.addEventListener("click", () => {
    text.classList.toggle("highlighted");
  });
  text.style.cursor = "pointer";
})();

/* ═══ FLOW STEPS ═══ */
(function () {
  const steps = document.querySelectorAll(".flow__step");
  const btn = document.getElementById("flow-next-btn");
  const gist = document.getElementById("flow-gist");
  if (!steps.length || !btn) return;

  let current = 0;

  // Show first step immediately when section scrolls into view
  function showFirst() {
    if (current === 0) {
      steps[0].classList.add("active");
      current = 1;
    }
  }

  const flowObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          showFirst();
          flowObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  flowObs.observe(document.getElementById("flow-timeline"));

  btn.addEventListener("click", () => {
    if (current >= steps.length) return;
    steps[current].classList.add("active");
    current++;

    if (current >= steps.length) {
      btn.classList.add("done");
      // Show gist after all steps
      setTimeout(() => {
        if (gist) gist.classList.add("visible");
      }, 400);
    }
  });
})();

/* ═══ SCROLL REVEAL OBSERVER ═══ */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

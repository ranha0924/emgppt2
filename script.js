/* ═══ VOCABULARY DATA ═══ */
const WORDS = [
  { word: "risky", meaning: "위험한", syn: "dangerous, hazardous", ant: "safe, secure" },
  { word: "trustworthy", meaning: "신뢰할만한", syn: "reliable, dependable", ant: "unreliable, untrustworthy" },
  { word: "trust", meaning: "신뢰 (n.)", syn: "confidence, faith", ant: "distrust, suspicion" },
  { word: "evidence", meaning: "증거", syn: "proof, indication", ant: "disproof, conjecture" },
  { word: "evolutionary", meaning: "진화의", syn: "adaptive, progressive", ant: "regressive, static" },
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
        const trans = document.getElementById("answer-translation");
        if (trans) setTimeout(() => trans.classList.add("visible"), 500);
      }
    });
  });
})();

/* ═══ KEY SENTENCE DECOMPOSE ═══ */
(function () {
  document.querySelectorAll("#sent-text").forEach((text) => {
    text.addEventListener("click", () => {
      text.classList.toggle("highlighted");
    });
    text.style.cursor = "pointer";
  });
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

/* ═══ BACKGROUND — Milgram Sky-Looking Stage ═══ */
(function () {
  const stage = document.getElementById("bg-people");
  const btn = document.getElementById("bg-next-btn");
  const btnLabel = document.getElementById("bg-next-label");
  const countEl = document.getElementById("bg-count");
  const valStop = document.getElementById("bg-val-stop");
  const valGaze = document.getElementById("bg-val-gaze");
  const fillStop = document.getElementById("bg-fill-stop");
  const fillGaze = document.getElementById("bg-fill-gaze");
  const detailStop = document.getElementById("bg-detail-stop");
  const detailGaze = document.getElementById("bg-detail-gaze");
  const conclusion = document.getElementById("bg-conclusion");
  if (!stage || !btn) return;

  // Stages — Milgram (1969) actual data points
  // count = number of "stimulus" people looking up
  // stop  = % of passersby who STOPPED to look up
  // gaze  = % of passersby who at least GLANCED up
  const STAGES = [
    { count: 1,  stop: 4,  gaze: 42, label: "다음 — 5명으로" },
    { count: 5,  stop: 16, gaze: 80, label: "다음 — 15명으로" },
    { count: 15, stop: 40, gaze: 86, label: "결과 보기" },
  ];

  // SVG silhouette of a person (looking up = head tilted up)
  function personSVG(lookingUp) {
    if (lookingUp) {
      // Head tilted slightly back, body upright
      return `
        <svg class="bg__person bg__person--up" viewBox="0 0 22 50" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="7" r="5"/>
          <line x1="11" y1="12" x2="11" y2="32" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="11" y1="18" x2="4"  y2="24" stroke-width="2" stroke-linecap="round"/>
          <line x1="11" y1="18" x2="18" y2="24" stroke-width="2" stroke-linecap="round"/>
          <line x1="11" y1="32" x2="6"  y2="46" stroke-width="2" stroke-linecap="round"/>
          <line x1="11" y1="32" x2="16" y2="46" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
    }
    // Regular passerby
    return `
      <svg class="bg__person" viewBox="0 0 22 50" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="9" r="4.5"/>
        <line x1="11" y1="13" x2="11" y2="32" stroke-width="2" stroke-linecap="round"/>
        <line x1="11" y1="20" x2="5"  y2="28" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="11" y1="20" x2="17" y2="28" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="11" y1="32" x2="6"  y2="46" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="11" y1="32" x2="16" y2="46" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
  }

  // Render the people: stimuli (lookers) interspersed with regular passersby
  function renderStage(stimuliCount) {
    stage.innerHTML = "";
    // Total figures on screen — passersby fill the scene
    const totalPassersby = Math.max(0, 14 - stimuliCount);
    const totalFigures = stimuliCount + totalPassersby;

    // Position lookers spread across the row
    const positions = new Set();
    if (stimuliCount > 0) {
      const step = totalFigures / stimuliCount;
      for (let i = 0; i < stimuliCount; i++) {
        positions.add(Math.floor(i * step + step / 2));
      }
    }

    for (let i = 0; i < totalFigures; i++) {
      const wrapper = document.createElement("span");
      wrapper.style.animationDelay = (i * 40) + "ms";
      wrapper.innerHTML = positions.has(i) ? personSVG(true) : personSVG(false);
      const svg = wrapper.firstElementChild;
      svg.style.animationDelay = (i * 40) + "ms";
      stage.appendChild(svg);
    }
  }

  // Animate a number from current to target
  function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  let stageIdx = -1;
  let prevStop = 0;
  let prevGaze = 0;

  btn.addEventListener("click", () => {
    stageIdx++;
    if (stageIdx >= STAGES.length) {
      // Show conclusion
      btn.classList.add("done");
      setTimeout(() => conclusion && conclusion.classList.add("visible"), 300);
      return;
    }

    const s = STAGES[stageIdx];
    renderStage(s.count);
    countEl.textContent = s.count;
    fillStop.style.width = s.stop + "%";
    fillGaze.style.width = s.gaze + "%";
    animateNumber(valStop, prevStop, s.stop, 1100);
    animateNumber(valGaze, prevGaze, s.gaze, 1100);
    if (detailStop) detailStop.textContent = "→ 행인 100명 중 " + s.stop + "명이 멈춰서 따라봄";
    if (detailGaze) detailGaze.textContent = "→ 행인 100명 중 " + s.gaze + "명이 고개를 들어 따라봄";
    prevStop = s.stop;
    prevGaze = s.gaze;

    // Update button label for next click
    btnLabel.textContent = s.label;
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

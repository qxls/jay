const notes = [
  "你不需要在今天解决所有问题。",
  "没有进展的一天，也可能是在积蓄下一次突破。",
  "先照顾好研究者，才有力气照顾研究。",
  "休息不是偏离轨道，而是科研过程的一部分。",
];

let seconds = 60;
let running = false;
let timer = null;
let noteIndex = 0;

const counter = document.querySelector("#counter");
const breathText = document.querySelector("#breath-text");
const breathVisual = document.querySelector("#breath-visual");
const toggle = document.querySelector("#toggle-breath");

function renderTimer() {
  counter.textContent = seconds;
  breathVisual.classList.toggle("is-running", running);
  breathText.textContent = !running ? (seconds === 0 ? "做得很好" : "准备好了吗") : (seconds % 10 < 5 ? "慢慢吸气" : "缓缓呼气");
  toggle.textContent = running ? "暂停一下" : (seconds > 0 && seconds < 60 ? "继续呼吸" : "开始呼吸");
}

function tick() {
  clearInterval(timer);
  if (!running) return;
  timer = setInterval(() => {
    seconds -= 1;
    if (seconds <= 0) { seconds = 0; running = false; clearInterval(timer); }
    renderTimer();
  }, 1000);
}

function startBreak(duration) {
  seconds = duration;
  running = true;
  renderTimer();
  tick();
  document.querySelector("#breathing").scrollIntoView({ behavior: "smooth", block: "center" });
}

document.querySelectorAll("[data-seconds]").forEach((button) => button.addEventListener("click", () => startBreak(Number(button.dataset.seconds))));
toggle.addEventListener("click", () => {
  if (seconds === 0) seconds = 60;
  running = !running;
  renderTimer();
  tick();
});

function nextNote() {
  noteIndex = (noteIndex + 1) % notes.length;
  document.querySelector("#note").textContent = notes[noteIndex];
}
document.querySelector("#nav-note").addEventListener("click", nextNote);
document.querySelector("#next-note").addEventListener("click", nextNote);
renderTimer();


const movementPlans = {
  shoulders: {
    title: "肩颈松开",
    steps: [
      [10, "吸气耸肩，呼气时慢慢放下"],
      [10, "右耳轻轻靠向右肩，不要耸肩"],
      [10, "左耳轻轻靠向左肩，保持呼吸"],
      [10, "下巴微收，让后颈自然拉长"],
      [10, "肩膀向后缓慢绕圈，回到放松"],
    ],
  },
  wrists: {
    title: "手腕舒展",
    steps: [
      [10, "双手轻轻握拳，再慢慢张开"],
      [10, "手臂向前，掌心向外轻推"],
      [10, "手腕缓慢向外画小圆圈"],
      [10, "甩甩双手，让手指自然放松"],
    ],
  },
  eyes: {
    title: "眼睛远眺",
    steps: [
      [10, "闭上眼睛，不用用力，放松眉心"],
      [15, "看向窗外或房间里最远的地方"],
      [10, "缓慢眨眼，让眼睛自然湿润"],
      [5, "深呼吸一次，再轻轻回到屏幕"],
    ],
  },
};

let movementTimer = null;
let movementState = "idle";
let activeMovement = null;
let activeStep = 0;
let movementSeconds = 0;

const movementGuide = document.querySelector("#movement-guide");
const guideCount = document.querySelector("#guide-count");
const guideInstruction = document.querySelector("#guide-instruction");
const guideStep = document.querySelector("#guide-step");
const guideControl = document.querySelector("#guide-control");

function renderMovement() {
  const plan = activeMovement ? movementPlans[activeMovement] : null;
  document.querySelectorAll("[data-movement]").forEach((button) => button.classList.toggle("is-selected", button.dataset.movement === activeMovement));
  movementGuide.classList.toggle("is-active", movementState === "running");
  movementGuide.dataset.demo = activeMovement || "idle";
  movementGuide.dataset.step = String(activeStep);
  if (!plan) return;
  if (movementState === "done") {
    guideCount.textContent = "✓";
    guideInstruction.textContent = "做得很好，感受一下身体现在的状态。";
    guideStep.textContent = `${plan.title}已完成`;
    guideControl.textContent = "再做一次";
  } else {
    guideCount.textContent = movementSeconds;
    guideInstruction.textContent = plan.steps[activeStep][1];
    guideStep.textContent = `${plan.title} · 第 ${activeStep + 1} / ${plan.steps.length} 步`;
    guideControl.textContent = movementState === "running" ? "暂停" : "继续";
  }
  guideControl.hidden = false;
}

function runMovementTimer() {
  clearInterval(movementTimer);
  movementState = "running";
  movementTimer = setInterval(() => {
    movementSeconds -= 1;
    if (movementSeconds <= 0) {
      activeStep += 1;
      if (activeStep >= movementPlans[activeMovement].steps.length) {
        clearInterval(movementTimer);
        movementTimer = null;
        movementState = "done";
      } else {
        movementSeconds = movementPlans[activeMovement].steps[activeStep][0];
      }
    }
    renderMovement();
  }, 1000);
  renderMovement();
}

function startMovement(key) {
  activeMovement = key;
  activeStep = 0;
  movementSeconds = movementPlans[key].steps[0][0];
  runMovementTimer();
  movementGuide.scrollIntoView({ behavior: "smooth", block: "center" });
}

document.querySelectorAll("[data-movement]").forEach((button) => button.addEventListener("click", () => startMovement(button.dataset.movement)));
guideControl.addEventListener("click", () => {
  if (movementState === "running") {
    clearInterval(movementTimer);
    movementTimer = null;
    movementState = "paused";
    renderMovement();
  } else if (movementState === "paused") {
    runMovementTimer();
  } else if (activeMovement) {
    startMovement(activeMovement);
  }
});

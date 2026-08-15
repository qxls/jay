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


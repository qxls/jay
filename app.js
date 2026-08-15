const notes = [
  "�㲻��Ҫ�ڽ������������⡣",
  "û�н�չ��һ�죬Ҳ�������ڻ�����һ��ͻ�ơ�",
  "���չ˺��о��ߣ����������չ��о���",
  "��Ϣ����ƫ���������ǿ��й��̵�һ���֡�",
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
  breathText.textContent = !running ? (seconds === 0 ? "���úܺ�" : "׼��������") : (seconds % 10 < 5 ? "��������" : "��������");
  toggle.textContent = running ? "��ͣһ��" : (seconds > 0 && seconds < 60 ? "��������" : "��ʼ����");
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


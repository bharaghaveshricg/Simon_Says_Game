 let gameSeq    = [];
let userSeq    = [];
let level      = 0;
let started    = false;
let strictMode = false;           // false = relaxed mode
const btns     = ["pink","blue","mint","yellow"];

const h2         = document.querySelector("h2");
const allBtns    = document.querySelectorAll(".btn");
const modeToggle = document.getElementById("modeToggle");
const playAgain  = document.getElementById("playAgain");
const highScoreD = document.getElementById("highScore");

const sounds = {
  pink:   new Audio("sounds/pink.mp3"),
  blue:   new Audio("sounds/blue.mp3"),
  mint:   new Audio("sounds/mint.mp3"),
  yellow: new Audio("sounds/yellow.mp3")
};

document.addEventListener("keypress", startGame);
allBtns.forEach(btn => {
  btn.addEventListener("click",  handleUserClick);
  btn.addEventListener("touchstart", handleUserClick);
});
modeToggle.addEventListener("click", () => {
  strictMode = !strictMode;
  modeToggle.innerText = `Mode: ${strictMode ? "Strict" : "Relaxed"}`;
});
playAgain.addEventListener("click", reset);

function startGame() {
  if (!started) {
    started = true;
    levelUp();
  }
}

function levelUp() {
  userSeq = [];
  level++;
  h2.innerText = `Level ${level}`;
  playAgain.classList.add("hidden");
  document.body.style.backgroundColor = "white";

  const nextColor = btns[Math.floor(Math.random() * btns.length)];
  gameSeq.push(nextColor);

  playSequence();
}

function flash(btnEl) {
  const clr = btnEl.id;
  const snd = sounds[clr];
  snd.currentTime = 0;
  snd.play().catch(err => console.warn("Audio play failed:", err));

  btnEl.classList.add("flash");
  setTimeout(() => btnEl.classList.remove("flash"), 250);
}

function playSequence() {
  let delay = 0;
  gameSeq.forEach((clr) => {
    setTimeout(() => {
      flash(document.getElementById(clr));
    }, delay);
    delay += Math.max(300, 700 - level * 10);
  });
}

function handleUserClick(e) {
  if (!started) return;

  const btn = e.currentTarget;
  const clr = btn.id;

  console.log("User clicked:", clr);

  const snd = sounds[clr];
  snd.currentTime = 0;
  snd.play().catch(err => console.warn("Audio play failed:", err));

  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 250);

  userSeq.push(clr);
  checkAnswer(userSeq.length - 1);
}

function checkAnswer(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 1000);
    }
  } else {
    endGame();
  }
}

function endGame() {
  h2.innerHTML = `Game Over! Score: <b>${level}</b>`;
  document.body.style.backgroundColor = "red";
  saveHighScore(level);
  playAgain.classList.remove("hidden");

  if (!strictMode) {
    setTimeout(() => {
      h2.innerText = `Try Level ${level} Again`;
      document.body.style.backgroundColor = "white";
      userSeq = [];
      playSequence();
    }, 1000);
  } else {
    started = false;
  }
}

function saveHighScore(score) {
  const best = +localStorage.getItem("simonHigh") || 0;
  if (score > best) {
    localStorage.setItem("simonHigh", score);
  }
  highScoreD.innerText = `High Score: ${Math.max(score, best)}`;
}

function reset() {
  gameSeq    = [];
  userSeq    = [];
  level      = 0;
  started    = false;
  h2.innerText = "Press any key to start the Game";
  playAgain.classList.add("hidden");
  document.body.style.backgroundColor = "white";
}

(function init() {
  const best = +localStorage.getItem("simonHigh") || 0;
  highScoreD.innerText = `High Score: ${best}`;
})();

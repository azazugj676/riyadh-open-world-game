/*
    Simple Snake game (no external libraries)
    Contains: Arrow keys or WASD */

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start');

const COLS = 20;
const ROWS = 20;
const CELL = canvas.width / COLS; // assumes square canvas

let snake = [];
let dir = {x: 1, y: 0};
let nextDir = {x: 1, y: 0};
let food = null;
let score = 0;
let running = false;
let gameInterval = null;
const STEP_MS = 120; // game speed (ms per tick)

function init() {
 snake = [{x: Math.floor(COLS/2), y: Math.floor(ROWS/2)}];
 dir = {x: 1, y: 0};
 nextDir = {x: 1, y: 0};
 spawnFood();
 score = 0;
 updateScore();
 running = true;
 if (gameInterval) clearInterval(gameInterval);
 gameInterval = setInterval(tick, STEP_MS);
}

function spawnFood() {
 let x = Math.floor(Math.random() * COLS);
 let y = Math.floor(Math.random() * ROWS);
 if ((snake.some(p => p.x === x && p.y === y))) {
  food = {x, y};
  return;
 }
}

function tick() {
 // apply direction
 dir = nextDir;
 const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

 // check collisions with walls
 if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
  gameOver();
  return;
 }

 // check collisions with self
 if (snake.some(p => p.x === head.x && p.y === head.y)) {
  gameOver();
  return;
 }

 snake.unshift(head);

 // eat food
 if (food && head.x === food.x && head.y === food.y) {
  score += 1;
  updateScore();
  spawnFood();
 } else {
  snake.pop();
 }

 draw();
}

function updateScore() {
 scoreEl.textContent = String(score);
}

function gameOver() {
 running = false;
 if (gameInterval) clearInterval(gameInterval);
 // draw final state with overlay
 ctx.fillStyle = 'rgba(0,0,0,0.5)';
 ctx.fillRect(0, 0, canvas.width, canvas.height);
 ctx.fillStyle = '#fff';
 ctx.font = '22px sans-serif';
 ctx.textAlign = 'center';
 ctx.fillText(score, canvas.width/2, canvas.height/2 - 10);
 ctx.font = '14px sans-serif';
 ctx.fillText('Press Enter to restart', canvas.width/2, canvas.height/2 + 14);
}

function draw() {
 // clear
 ctx.fillStyle = '#071023';
 ctx.fillRect(0, 0, canvas.width, canvas.height);

 // draw food
 if (food) {
  ctx.fillStyle = '#ff4dc4';
  drawCell(food.x, food.y);
 }

 // draw snake
 for (let i = 0; i < snake.length; i++) {
  const p = snake[i];
  ctx.fillStyle = i === 0 ? '#007bff' : '#0099ff';
  drawCell(p.x, p.y);
 }

 // draw grid (optional subtext)
 ctx.strokeStyle = 'rgba(255,255,255,0.02)';
 ctx.lineWidth = 1;
 for (let x = 0; x <= COLS; x++) {
  ctx.beginPath();
  ctx.moveTo(x * CELL, 0);
  ctx.lineTo(x * CELL, canvas.height);
  ctx.stroke();
 }
 for (let y = 0; y <= ROWS; y++) {
  ctx.beginPath();
  ctx.moveTo(0, y * CELL);
  ctx.lineTo(canvas.width, y * CELL);
  ctx.stroke();
 }
}

function drawCell(x, y) {
 ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
}

// input handling
window.addEventListener('keydown', (e) => {
 const key = e.key;
 let nd = null;
 if (key === 'ArrowUp' || key === 'w' || key === 'W') nd = {x:0, y:-1};
 else if (key === 'ArrowDown' || key === 's' || key === 'S') nd = {x:0, y:1};
 else if (key === 'ArrowLeft' || key === 'a' || key === 'A') nd = {x:-1, y:0};
 else if (key === 'ArrowRight' || key === 'd' || key === 'D') nd = {x:1, y:0};

 if (nd) {
  // prevent reversing direction
  if (snake.length > 1 && nd.x === -dir.x && nd.y === -dir.y) return;
  nextDir = nd;
 }
});

startBtn.addEventListener('click', () => {
 init();
});

// initial start
init();

/* =========================================================
   DATA
   Edit these arrays to add, remove, or change content.
   Everything on the page is generated from them.
   ========================================================= */

// Status keys: "play" = playable, "dev" = in development, "proto" = prototype
// art: "img" = drawing (uses src), "emoji" = cycling emoji, "bob" = Bob AI network logo
// link: put "" if there is nothing to link yet
const PROJECTS = [
  { title:"Fried Rice at Eddie's", label:"Scratch to HTML", status:"play",
    desc:"My own 4-game franchise. Watch the cameras, keep an eye on Eddy, Cheddy, Weddy and Endo, and survive the night.",
    link:"https://fallgamedev.github.io/frae", linkText:"Play it",
    art:"img", src:"images/eddie.png", bg:["#c7362f","#5c1f1a"] },

  { title:"The Clicker Game!", label:"HTML / JS + Supabase", status:"play",
    desc:"A clicker with accounts, leaderboards, live chat, a weekly limited shop, bouncing DVD logos, and mod support.",
    link:"https://fallgamedev.github.io/clicker", linkText:"Play it",
    art:"emoji", bg:["#2bd1c4","#127a74"] },

  { title:"Bob AI", label:"HTML / JS + Supabase", status:"dev",
    desc:"A no-download AI helper that answers from the PDFs and links you give it. Sign in and start asking.",
    link:"https://fallgamedev.github.io/bob-ai", linkText:"Try it",
    art:"bob", bg:["#4b5a6b","#1f2833"] },
];

// Faces the Clicker Game thumbnail cycles through (one every 2 seconds)
const CLICKER_FACES = ["😀","😎","🤑","😂","🤯","🥳","😤","🤩","😴","🤓","😈","🫠"];

// Toolbox "inventory" items
const TOOLS = [
  { name:"HTML / CSS / JS", ico:"</>", tip:"Main weapon. Most of my games live in one HTML file you can play anywhere." },
  { name:"GameMaker", ico:"GM", tip:"GameMaker Studio 2. GML, platformer physics, and a lot of sprite wrangling." },
  { name:"Roblox Studio", ico:"[R]", tip:"Where the Eddie's games got a 3D life." },
  { name:"Supabase", ico:"DB", tip:"Logins, leaderboards, and chat for my web games." },
  { name:"AI APIs", ico:"*AI*", tip:"Hooked up Anthropic and OpenAI APIs in a few projects." },
];

// Words for the scrolling ticker strip
const TICKER = ["GAMEMAKER","ROBLOX","HTML / CSS / JS","SUPABASE","AI APIS","BONELAB","SINGLE FILE GAMES"];

// Lines the hero "types" out, one after another
const TYPED_LINES = [
  "I make <b>browser games</b>.",
  "I remake games to learn <b>how they work</b>.",
  "I record myself <b>raging</b> at games.",
  "I ship. <b>Eventually.</b>",
];

/* =========================================================
   PIXEL ART
   An 8x8 grid used for the logo and the falling leaves.
   Letters pick a color from the palette (a, b). A dot means empty.
   ========================================================= */
const PIXEL_ICONS = {
  leaf:  ["....aa..","...aaaa.","..aaaaaa",".aaabaaa","aaabaaa.",".abaaa..","b.aa....","........"],
};

// Draws one pixel icon onto a canvas at 1 pixel per cell (CSS scales it up crisply)
function drawPixel(canvas, rows, pal){
  canvas.width = 8; canvas.height = 8;
  const ctx = canvas.getContext("2d");
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      ctx.fillStyle = pal[ch];
      ctx.fillRect(x, y, 1, 1);
    });
  });
}

/* =========================================================
   BUILD THE PAGE
   ========================================================= */

// Hero title: split into letters so each can animate in
(function buildTitle(){
  const el = document.getElementById("title");
  const word = "FallGameDev";
  [...word].forEach((ch, i) => {
    const s = document.createElement("span");
    s.textContent = ch;
    if (i < 4) s.className = "fall";              // "Fall" gets the amber color
    s.style.animationDelay = (0.15 + i * 0.07) + "s";
    s.setAttribute("aria-hidden", "true");
    el.appendChild(s);
  });
})();

// Ticker: content is doubled so the loop looks seamless
document.getElementById("ticker").innerHTML =
  [...TICKER, ...TICKER].map(t => `<span>${t}</span>`).join("");

// Game cards
const STATUS_TEXT = { play:"PLAYABLE", dev:"IN DEV", proto:"PROTOTYPE" };
const gridEl = document.getElementById("grid");
PROJECTS.forEach(p => {
  const card = document.createElement("article");
  card.className = "card reveal";
  card.innerHTML = `
    <div class="thumb" style="background:linear-gradient(135deg, ${p.bg[0]}, ${p.bg[1]})">
      <span class="status ${p.status}">${STATUS_TEXT[p.status]}</span>
      ${makeArt(p)}
    </div>
    <div class="card-body">
      <span class="engine">${p.label}</span>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      ${p.link
        ? `<a class="card-link" href="${p.link}" target="_blank" rel="noopener">${p.linkText} &#8594;</a>`
        : `<span class="card-link off">${p.linkText}</span>`}
    </div>`;
  addTilt(card);
  gridEl.appendChild(card);
});

// Builds the thumbnail art for a project based on its "art" type
function makeArt(p){
  if (p.art === "img")   return `<img class="art-img" src="${p.src}" alt="${p.title} character">`;
  if (p.art === "emoji") return `<span class="art-emoji" data-emoji>${CLICKER_FACES[0]}</span>`;
  if (p.art === "bob")   return bobLogo();
  return "";
}

// Bob AI logo: a "B" in the middle of a small neural network (circles joined by lines)
function bobLogo(){
  // Each layer is one column of nodes: [x position, list of y positions]
  const layers = [
    [14, [20, 50, 80]],
    [42, [10, 36, 64, 90]],
    [118,[10, 36, 64, 90]],
    [146,[20, 50, 80]],
  ];
  let lines = "", dots = "", n = 0;
  // Connect every node to every node in the next layer (skipping the gap where the B sits)
  [[0,1],[2,3]].forEach(([a,b]) => {
    layers[a][1].forEach(y1 => layers[b][1].forEach(y2 => {
      lines += `<line x1="${layers[a][0]}" y1="${y1}" x2="${layers[b][0]}" y2="${y2}"/>`;
    }));
  });
  // Lines from the inner layers into the B
  [1,2].forEach(i => layers[i][1].forEach(y => {
    lines += `<line x1="${layers[i][0]}" y1="${y}" x2="80" y2="50"/>`;
  }));
  layers.forEach(([x, ys]) => ys.forEach(y => {
    dots += `<circle cx="${x}" cy="${y}" r="5" style="animation-delay:${(n++ * 0.2).toFixed(1)}s"/>`;
  }));
  return `<svg class="art-bob" viewBox="0 0 160 100" aria-label="Bob AI logo">
    ${lines}<circle cx="80" cy="50" r="30" style="fill:#1f2833;animation:none"/>${dots}
    <text x="80" y="52">B</text></svg>`;
}

// Swap the Clicker Game face every 2 seconds (with a little pop)
setInterval(() => {
  document.querySelectorAll("[data-emoji]").forEach(el => {
    const i = (CLICKER_FACES.indexOf(el.textContent) + 1) % CLICKER_FACES.length;
    el.textContent = CLICKER_FACES[i];
    el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
  });
}, 2000);

// Gentle 3D tilt that follows the mouse on desktop
function addTilt(card){
  if (matchMedia("(hover: none)").matches) return; // skip on touch screens
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => card.style.transform = "");
}

// Inventory slots
const invEl = document.getElementById("inventory");
TOOLS.forEach(t => {
  const s = document.createElement("div");
  s.className = "slot";
  s.innerHTML = `<span class="ico">${t.ico.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</span>
    <strong>${t.name}</strong>
    <span class="tip">${t.tip}</span>`;
  invEl.appendChild(s);
});
document.getElementById("engineCount").textContent = TOOLS.length;

// Logo leaf
drawPixel(document.getElementById("logoLeaf"), PIXEL_ICONS.leaf, { a:"#ffb347", b:"#7a3a1a" });

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================================================
   TYPEWRITER in the hero
   ========================================================= */
(function typewriter(){
  const out = document.getElementById("typed");
  let line = 0, chars = 0, deleting = false;

  // Turns "a <b>bold</b> word" into plain text length we can count
  const plain = html => html.replace(/<[^>]+>/g, "");

  // Builds the partial HTML for the first n visible characters
  function partial(html, n){
    let res = "", count = 0, i = 0;
    while (i < html.length && count < n){
      if (html[i] === "<"){ const end = html.indexOf(">", i); res += html.slice(i, end + 1); i = end + 1; continue; }
      res += html[i]; count++; i++;
    }
    if (res.includes("<b>") && !res.includes("</b>")) res += "</b>"; // close tag if cut mid-bold
    return res;
  }

  function tick(){
    const full = TYPED_LINES[line];
    const len = plain(full).length;
    chars += deleting ? -1 : 1;
    out.innerHTML = partial(full, chars);

    let wait = deleting ? 28 : 55;
    if (!deleting && chars === len){ deleting = true; wait = 1800; }      // pause at end
    else if (deleting && chars === 0){ deleting = false; line = (line + 1) % TYPED_LINES.length; wait = 400; }
    setTimeout(tick, wait);
  }
  setTimeout(tick, 1100); // start after the title lands
})();

/* =========================================================
   SCROLL REVEAL: fade sections in as they appear
   ========================================================= */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* =========================================================
   FALLING LEAVES + CLICK-TO-COLLECT MINI GAME
   ========================================================= */
const cvs = document.getElementById("leaves");
const ctx = cvs.getContext("2d");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const LEAF_COLORS = [["#ffb347","#8a3e12"],["#e2572b","#6b200f"],["#c7362f","#5a1410"],["#ffd166","#8a6012"]];
let W, H, DPR, leaves = [], bits = [], storm = 0;

// Score is saved in this browser so it sticks between visits
let score = 0;
try { score = parseInt(localStorage.getItem("fgd_leaves") || "0", 10) || 0; } catch(e){}

function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = cvs.width = innerWidth * DPR;
  H = cvs.height = innerHeight * DPR;
  ctx.imageSmoothingEnabled = false;
}

// Makes one leaf. "top" = start above the screen instead of anywhere
function makeLeaf(top){
  const [color, dark] = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
  const px = (Math.random() < 0.3 ? 4 : 3) * DPR;  // size of one "pixel" in the leaf
  return {
    x: Math.random() * W,
    y: top ? -40 * DPR : Math.random() * H,
    vy: (0.4 + Math.random() * 0.8) * DPR * (reduceMotion ? 0.4 : 1),
    swing: 0.6 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
    px, color, dark,
  };
}

function targetCount(){ return Math.round(Math.min(38, innerWidth / 34)) + storm; }

// Pixel leaf drawn from the same 8x8 art as the logo
function drawLeaf(l){
  const art = PIXEL_ICONS.leaf;
  const flip = Math.sin(l.phase) > 0 ? 1 : -1;   // flip sideways as it sways
  for (let y = 0; y < 8; y++){
    for (let x = 0; x < 8; x++){
      const ch = art[y][x];
      if (ch === ".") continue;
      ctx.fillStyle = ch === "a" ? l.color : l.dark;
      const dx = flip === 1 ? x : 7 - x;
      ctx.fillRect(Math.round(l.x + (dx - 4) * l.px), Math.round(l.y + (y - 4) * l.px), l.px, l.px);
    }
  }
}

function loop(){
  ctx.clearRect(0, 0, W, H);

  // Keep the right number of leaves on screen
  while (leaves.length < targetCount()) leaves.push(makeLeaf(true));

  for (let i = leaves.length - 1; i >= 0; i--){
    const l = leaves[i];
    l.phase += 0.02;
    l.y += l.vy;
    l.x += Math.sin(l.phase) * l.swing * DPR * 0.6;
    ctx.globalAlpha = 0.85;
    drawLeaf(l);
    // Off the bottom: remove it (or recycle if we still need leaves)
    if (l.y > H + 40 * DPR){
      if (leaves.length > targetCount()) leaves.splice(i, 1);
      else leaves[i] = makeLeaf(true);
    }
  }

  // Pop particles from collected leaves
  ctx.globalAlpha = 1;
  for (let i = bits.length - 1; i >= 0; i--){
    const b = bits[i];
    b.x += b.vx; b.y += b.vy; b.vy += 0.25 * DPR; b.life--;
    ctx.globalAlpha = Math.max(b.life / 40, 0);
    ctx.fillStyle = b.c;
    ctx.fillRect(b.x, b.y, b.s, b.s);
    if (b.life <= 0) bits.splice(i, 1);
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(loop);
}

// Clicking empty space tries to grab a leaf near the pointer
window.addEventListener("pointerdown", e => {
  if (e.target.closest("a, button, .card, .slot, .what, .statcard")) return; // don't steal real clicks
  const mx = e.clientX * DPR, my = e.clientY * DPR;
  let best = -1, bestD = 34 * DPR;
  leaves.forEach((l, i) => {
    const d = Math.hypot(l.x - mx, l.y - my);
    if (d < bestD){ bestD = d; best = i; }
  });
  if (best === -1) return;

  const l = leaves[best];
  for (let k = 0; k < 14; k++){
    bits.push({ x:l.x, y:l.y, vx:(Math.random()-0.5)*8*DPR, vy:(Math.random()-1)*6*DPR,
                s:l.px, c: k % 2 ? l.color : l.dark, life:40 });
  }
  leaves[best] = makeLeaf(true);
  addScore();
});

function addScore(){
  score++;
  try { localStorage.setItem("fgd_leaves", score); } catch(e){}
  updateScore(true);
}

function updateScore(bump){
  const el = document.getElementById("leafCount");
  el.innerHTML = "&#127810; " + score;
  document.getElementById("leafStat").textContent = score;
  if (bump){ el.classList.add("bump"); setTimeout(() => el.classList.remove("bump"), 150); }
}

/* =========================================================
   KONAMI CODE: up up down down left right left right B A
   Triggers a leaf storm for a few seconds
   ========================================================= */
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let kIndex = 0;
window.addEventListener("keydown", e => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  kIndex = key === KONAMI[kIndex] ? kIndex + 1 : (key === KONAMI[0] ? 1 : 0);
  if (kIndex === KONAMI.length){
    kIndex = 0;
    storm = 140;
    setTimeout(() => storm = 0, 7000);
  }
});

// Start everything
resize();
window.addEventListener("resize", resize);
updateScore(false);
requestAnimationFrame(loop);

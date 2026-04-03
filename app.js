/* ============================================================
   Our Little Corner — app.js
   ============================================================ */

// ── BUILD FENCE POSTS ──────────────────────────────────────
const fenceEl = document.getElementById('fenceEl');
const fenceHeights = [44, 38, 50, 42, 48, 40, 46];
for (let i = 0; i < 80; i++) {
  const post = document.createElement('div');
  post.className = 'fp';
  post.style.height = fenceHeights[i % fenceHeights.length] + 'px';
  fenceEl.appendChild(post);
}

// ── BUILD TRAILER AWNING FRINGE ───────────────────────────
const fringeRow = document.getElementById('fringeRow');
for (let i = 0; i < 30; i++) {
  const fringe = document.createElement('div');
  fringe.className = 't-fringe';
  fringeRow.appendChild(fringe);
}

// ── GENERATE STARS ────────────────────────────────────────
const starsLayer = document.getElementById('starsL');
for (let i = 0; i < 90; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.cssText = [
    `left:${Math.random() * 100}%`,
    `top:${Math.random() * 80}%`,
    `width:${1 + Math.random() * 2.2}px`,
    `height:${1 + Math.random() * 2.2}px`,
    `--dur:${1.8 + Math.random() * 3}s`,
    `animation-delay:${Math.random() * 5}s`
  ].join(';');
  starsLayer.appendChild(star);
}

// ── GENERATE RAIN DROPS ───────────────────────────────────
const rainLayer = document.getElementById('rainL');
for (let i = 0; i < 90; i++) {
  const drop = document.createElement('div');
  drop.className = 'raindrop';
  drop.style.cssText = [
    `left:${Math.random() * 100}%`,
    `animation-duration:${0.55 + Math.random() * 0.55}s`,
    `animation-delay:${Math.random() * 1.8}s`
  ].join(';');
  rainLayer.appendChild(drop);
}

// ── TIME OF DAY (Edmonton MDT = UTC-6) ────────────────────
function getEdmontonHour() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc - 6 * 3600000).getHours();
}

function applyTimeOfDay(hour) {
  const sky   = document.getElementById('skyL');
  const sun   = document.getElementById('sunEl');
  const moon  = document.getElementById('moonEl');
  const stars = document.getElementById('starsL');

  if (hour >= 5 && hour < 9) {
    sky.style.background = 'linear-gradient(180deg,#F4A840 0%,#FFC870 35%,#FFE0A8 70%,#e8d8b8 100%)';
    sun.style.opacity = '0.65'; moon.style.opacity = '0'; stars.style.opacity = '0';
  } else if (hour >= 9 && hour < 17) {
    sky.style.background = 'linear-gradient(180deg,#87CEEB 0%,#b0daf5 45%,#d4c9a8 100%)';
    sun.style.opacity = '1'; moon.style.opacity = '0'; stars.style.opacity = '0';
  } else if (hour >= 17 && hour < 20) {
    sky.style.background = 'linear-gradient(180deg,#E8602A 0%,#F4904A 25%,#FFA856 50%,#d4a880 100%)';
    sun.style.opacity = '0.4'; moon.style.opacity = '0.2'; stars.style.opacity = '0.1';
  } else if (hour >= 20 && hour < 22) {
    sky.style.background = 'linear-gradient(180deg,#2a3548 0%,#4a4a6a 45%,#665a80 100%)';
    sun.style.opacity = '0'; moon.style.opacity = '0.8'; stars.style.opacity = '0.6';
  } else {
    sky.style.background = 'linear-gradient(180deg,#0d1020 0%,#1a1a3e 50%,#28204a 100%)';
    sun.style.opacity = '0'; moon.style.opacity = '1'; stars.style.opacity = '1';
    document.querySelectorAll('.bulb-g').forEach(b => b.style.filter = 'brightness(1.6)');
  }
}

// ── LIVE WEATHER via Open-Meteo (free, no API key) ────────
async function fetchWeather() {
  const badge = document.getElementById('wxBadge');
  applyTimeOfDay(getEdmontonHour());

  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=53.5461&longitude=-113.4938' +
      '&current=temperature_2m,weathercode,precipitation' +
      '&temperature_unit=celsius&timezone=America/Edmonton'
    );
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weathercode;
    const isRaining = data.current.precipitation > 0;

    const weatherIcons = {
      0:'☀️',1:'🌤',2:'⛅',3:'☁️',45:'🌫',48:'🌫',
      51:'🌦',53:'🌦',55:'🌧',61:'🌧',63:'🌧',65:'🌧',
      71:'❄️',73:'❄️',75:'❄️',80:'🌦',81:'🌦',82:'🌧',95:'⛈',96:'⛈'
    };
    const weatherDesc = {
      0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',
      45:'Foggy',51:'Light drizzle',61:'Light rain',63:'Rain',
      71:'Light snow',73:'Snow',75:'Heavy snow',80:'Showers',95:'Thunderstorm'
    };

    badge.textContent =
      `📍 Edmonton · ${temp}°C · ${weatherIcons[code] || '🌡'} ${weatherDesc[code] || ''}`;

    if (isRaining || [51,53,55,61,63,65,80,81,82].includes(code)) {
      document.getElementById('rainL').style.opacity = '1';
      document.getElementById('skyL').style.background =
        'linear-gradient(180deg,#606878 0%,#787f90 50%,#909aa8 100%)';
      document.getElementById('sunEl').style.opacity = '0';
    }
    if ([71,73,75].includes(code)) {
      badge.textContent += ' (cozy inside! 🏠)';
    }
  } catch (err) {
    badge.textContent = `📍 Edmonton, AB · ${getEdmontonHour()}:00`;
  }
}

fetchWeather();

// ── NAVIGATION ────────────────────────────────────────────
function showWorld(world) {
  document.getElementById('landing').style.display = 'none';
  document.querySelectorAll('.world-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('floatCat').classList.add('show');
  const id = world === 'her' ? 'her-world' : world === 'his' ? 'his-world' : 'our-world';
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
  document.getElementById('landing').style.display = 'flex';
  document.querySelectorAll('.world-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('floatCat').classList.remove('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── GOODREADS CSV IMPORT ──────────────────────────────────
// Export from: Goodreads → My Books → Import/Export → Export Library
function loadCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split('\n');
    const shelf = document.getElementById('shelf');
    shelf.innerHTML = '';
    const colors = ['#8a5e7a','#5e7a8a','#7a8a5e','#8a7a5e','#7a5e8a',
                    '#5e8a7a','#8a6e5e','#6e8a5e','#8a5e5e','#6e5e8a','#7a6a8a','#6a8a7a'];
    const heights = [86,93,100,108,116,90,103,112,92,118,86,98];
    let count = 0;
    for (let i = 1; i < lines.length && count < 50; i++) {
      const cols = lines[i].split(',');
      const title = cols[1] ? cols[1].replace(/"/g,'').trim() : '';
      if (!title) continue;
      const spine = document.createElement('div');
      spine.className = 'spine';
      spine.style.background = colors[count % colors.length];
      spine.style.height = heights[count % heights.length] + 'px';
      spine.textContent = title.length > 22 ? title.substring(0,22) + '…' : title;
      spine.title = title;
      shelf.appendChild(spine);
      count++;
    }
    if (!count) {
      shelf.innerHTML = '<p style="font-family:DM Mono,monospace;font-size:0.7rem;color:#888;padding:18px">No books found — try exporting from Goodreads → My Books → Export</p>';
    }
  };
  reader.readAsText(file);
}

// ── CAT CLICK INTERACTIONS ────────────────────────────────
const catQuips = [
  'purrr 🐾', '*slow blink* 😌', 'meow! feed me 🐟',
  '*knocks mug off table*', 'NOT moving. 😤', 'sitting here now.',
  'chirp? 🐦', '*brings dead bug as gift*', 'it is 3am. play with me.'
];

function setupCatClick(elementId, catName) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.addEventListener('click', () => {
    const tag = el.querySelector('.cat-name-tag');
    const original = tag.textContent;
    tag.textContent = `${catName}: ${catQuips[Math.floor(Math.random() * catQuips.length)]}`;
    tag.style.opacity = '1';
    setTimeout(() => { tag.textContent = original; tag.style.opacity = ''; }, 2400);
  });
}

setupCatClick('george', 'George');
setupCatClick('jerry', 'Jerry');

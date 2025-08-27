/* =========================
   PreMatch – Single File App
   ========================= */

/* ---------- DATA MOCK ---------- */

const sports = [
  { id: 'calcio', name: 'Calcio', img: 'images/calcio.jpg' },
  { id: 'futsal', name: 'Futsal', img: 'images/futsal.jpg' },
  { id: 'basket', name: 'Basket', img: 'images/basket.jpg' },
  { id: 'volley', name: 'Volley', img: 'images/volley.jpg' },
  { id: 'rugby', name: 'Rugby', img: 'images/rugby.jpg' },
  { id: 'pallanuoto', name: 'Pallanuoto', img: 'images/pallanuoto.jpg' }
];

const genders = [
  { id: 'M', name: 'Maschile' },
  { id: 'F', name: 'Femminile' }
];

const regions = ['Lazio', 'Lombardia', 'Sicilia', 'Piemonte', 'Veneto', 'Emilia-Romagna'];

const championshipsByRegion = {
  'Lazio': ['Eccellenza', 'Promozione', 'Juniores'],
  'Lombardia': ['Eccellenza', 'Promozione'],
  'Sicilia': ['Eccellenza'],
  'Piemonte': ['Eccellenza'],
  'Veneto': ['Eccellenza'],
  'Emilia-Romagna': ['Eccellenza']
};

// mini database società (per demo)
const clubs = [
  {
    id: 'asd-roma-nord',
    name: 'ASD Roma Nord',
    level: 'Eccellenza',
    gender: 'Femminile',
    region: 'Lazio',
    logo: 'images/logo-club-1.png', // metti un tuo file se vuoi, altrimenti resta il cerchio scuro
    upcoming: [
      { team: 'Prima Squadra', date: '2025-08-31 14:07', city: 'Roma', venue: 'Stadio Olimpico' },
      { team: 'Juniores', date: '2025-09-01 18:30', city: 'Roma', venue: 'Campo Test' },
    ],
    gallery: [
      'images/gal-1.jpg',
      'images/gal-2.jpg'
    ]
  },
  {
    id: 'virtus-marino',
    name: 'Virtus Marino',
    level: 'Eccellenza',
    gender: 'Femminile',
    region: 'Lazio',
    logo: 'images/logo-club-2.png',
    upcoming: [
      { team: 'Prima Squadra', date: '2025-09-10 20:45', city: 'Marino', venue: 'Comunale' }
    ],
    gallery: []
  }
];

// codici allenatore validi -> mappano a una “partita”
const coachCodes = {
  'ROMA123': {
    clubId: 'asd-roma-nord',
    match: { team: 'Prima Squadra', date: '2025-08-31 14:07', opponent: 'Virtus Marino', venue: 'Stadio Olimpico' }
  },
  'MARINO99': {
    clubId: 'virtus-marino',
    match: { team: 'Prima Squadra', date: '2025-09-10 20:45', opponent: 'ASD Roma Nord', venue: 'Comunale' }
  }
};

/* ---------- STATE ---------- */

const state = {
  sport: null,
  gender: null,
  region: null,
  championship: null,
  club: null
};

/* ---------- HELPERS ---------- */

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function clearApp() {
  $('#app').innerHTML = '';
}

function delayPress(el, next) {
  // feedback di “pressione” + piccolo delay prima di navigare
  el.classList.add('pressed');
  setTimeout(() => {
    el.classList.remove('pressed');
    next();
  }, 160); // ~1/6 di secondo, si vede ma non rallenta
}

function backButton(onClickText = 'Indietro', handler = null) {
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = onClickText;
  btn.addEventListener('click', () => history.back());
  if (handler) btn.addEventListener('click', handler);
  return btn;
}

function sectionTitle(title, subtitle = '') {
  const wrap = document.createElement('div');
  const h1 = document.createElement('h1');
  h1.textContent = title;
  const p = document.createElement('p');
  p.textContent = subtitle;
  wrap.append(h1, p);
  return wrap;
}

function makePill(text, onClick) {
  const b = document.createElement('button');
  b.className = 'btn pill';
  b.textContent = text;
  b.addEventListener('click', function () {
    delayPress(b, onClick);
  });
  return b;
}

function ensureNavbar() {
  const nav = $('.navbar');
  if (nav.dataset.enhanced === '1') return;

  // Logo sempre visibile
  const left = nav.querySelector('.navbar-left');
  if (left && !left.querySelector('img.logo')) {
    const img = document.createElement('img');
    img.src = 'logo-light.png';
    img.alt = 'PreMatch';
    img.className = 'logo';
    left.prepend(img);
  }

  // Pulsante Allenatore -> modale codice
  const coachBtn = document.getElementById('btn-coach');
  if (coachBtn) {
    coachBtn.onclick = openCoachModal;
  }

  // Login/Registrazione: solo feedback
  const login = document.getElementById('btn-login');
  const reg = document.getElementById('btn-register');
  [login, reg].forEach(b => {
    if (!b) return;
    b.onclick = () => {
      b.classList.add('pressed');
      setTimeout(() => b.classList.remove('pressed'), 160);
      toast('Funzione in arrivo ✔️');
    };
  });

  nav.dataset.enhanced = '1';
}

function toast(msg) {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.position = 'fixed';
    t.style.bottom = '20px';
    t.style.left = '50%';
    t.style.transform = 'translateX(-50%)';
    t.style.background = '#222';
    t.style.border = '1px solid #333';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '10px';
    t.style.zIndex = '9999';
    t.style.color = '#fff';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 1500);
}

/* ---------- RENDERERS ---------- */

function renderHome() {
  history.pushState({ view: 'home' }, '');
  ensureNavbar();
  clearApp();

  const app = $('#app');
  app.appendChild(sectionTitle('Scegli lo sport', 'Seleziona per iniziare'));

  const grid = document.createElement('div');
  grid.className = 'grid';
  sports.forEach(s => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = s.img;
    img.alt = s.name;
    const h3 = document.createElement('h3');
    h3.textContent = s.name;
    card.append(img, h3);
    card.addEventListener('click', function () {
      delayPress(card, () => {
        state.sport = s;
        renderGender();
      });
    });
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function renderGender() {
  history.pushState({ view: 'gender' }, '');
  clearApp();
  const app = $('#app');
  app.appendChild(sectionTitle('Seleziona il genere', ''));

  const row = document.createElement('div');
  genders.forEach(g => {
    row.appendChild(makePill(g.name, () => {
      state.gender = g.name;
      renderRegions();
    }));
  });
  app.appendChild(row);
  app.appendChild(backButton());
}

function renderRegions() {
  history.pushState({ view: 'regions' }, '');
  clearApp();
  const app = $('#app');
  app.appendChild(sectionTitle('Scegli la regione', ''));

  const box = document.createElement('div');
  regions.forEach(r => {
    box.appendChild(makePill(r, () => {
      state.region = r;
      renderChampionships();
    }));
  });
  app.appendChild(box);
  app.appendChild(backButton());
}

function renderChampionships() {
  history.pushState({ view: 'champs' }, '');
  clearApp();
  const app = $('#app');
  app.appendChild(sectionTitle('Scegli il campionato', ''));

  const list = championshipsByRegion[state.region] || ['Eccellenza'];
  const box = document.createElement('div');
  list.forEach(c => {
    box.appendChild(makePill(c, () => {
      state.championship = c;
      renderClubs();
    }));
  });
  app.appendChild(box);
  app.appendChild(backButton());
}

function renderClubs() {
  history.pushState({ view: 'clubs' }, '');
  clearApp();

  const app = $('#app');
  app.appendChild(
    sectionTitle(
      'Scegli la società',
      `${state.sport?.name} • ${state.gender} • ${state.region} • ${state.championship}`
    )
  );

  const grid = document.createElement('div');
  grid.className = 'grid';

  const filtered = clubs.filter(
    c =>
      c.region === state.region &&
      c.level === state.championship &&
      c.gender === state.gender
  );

  (filtered.length ? filtered : clubs).forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';
    const holder = document.createElement('div');
    holder.style.width = '100%';
    holder.style.height = '140px';
    holder.style.display = 'flex';
    holder.style.alignItems = 'center';
    holder.style.justifyContent = 'center';
    holder.style.background = '#141414';
    // logo (se non esiste, mostro placeholder “PM”)
    if (c.logo) {
      const img = document.createElement('img');
      img.src = c.logo;
      img.alt = c.name;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      holder.appendChild(img);
    } else {
      const span = document.createElement('span');
      span.textContent = 'PM';
      span.style.color = '#00ff84';
      span.style.fontSize = '48px';
      span.style.fontWeight = 'bold';
      holder.appendChild(span);
    }
    const h3 = document.createElement('h3');
    h3.textContent = c.name;
    card.append(holder, h3);
    card.addEventListener('click', () => {
      delayPress(card, () => {
        state.club = c;
        renderClubDetail();
      });
    });
    grid.appendChild(card);
  });

  app.appendChild(grid);
  app.appendChild(backButton());
}

function renderClubDetail() {
  history.pushState({ view: 'club' }, '');
  clearApp();
  const app = $('#app');

  const club = state.club;
  if (!club) return renderClubs();

  // intestazione
  const head = document.createElement('div');
  head.appendChild(
    sectionTitle(
      club.name,
      `${club.level} • ${club.gender} • ${club.region}`
    )
  );
  app.appendChild(head);

  // area due cerchi (logo + prematch)
  const circles = document.createElement('div');
  circles.style.display = 'flex';
  circles.style.gap = '28px';
  circles.style.alignItems = 'center';
  circles.style.margin = '18px 0 8px';

  // cerchio logo (stesso diametro del bottone)
  const logoCircle = document.createElement('div');
  logoCircle.style.width = '120px';
  logoCircle.style.height = '120px';
  logoCircle.style.borderRadius = '50%';
  logoCircle.style.background = '#141414';
  logoCircle.style.border = '2px solid #222';
  logoCircle.style.display = 'flex';
  logoCircle.style.alignItems = 'center';
  logoCircle.style.justifyContent = 'center';
  if (club.logo) {
    const img = document.createElement('img');
    img.src = club.logo;
    img.alt = club.name;
    img.style.width = '78%';
    img.style.height = '78%';
    img.style.objectFit = 'contain';
    logoCircle.appendChild(img);
  } else {
    const span = document.createElement('span');
    span.textContent = 'PM';
    span.style.color = '#00ff84';
    span.style.fontSize = '42px';
    span.style.fontWeight = 'bold';
    logoCircle.appendChild(span);
  }

  // bottone circolare prematch
  const pmWrap = document.createElement('div');
  const pmBtn = document.createElement('button');
  pmBtn.className = 'circle-btn';
  pmBtn.textContent = 'Crea PreMatch';
  pmBtn.style.flexShrink = '0';
  pmBtn.onclick = openPrematchModal;
  pmWrap.appendChild(pmBtn);

  circles.append(logoCircle, pmWrap);
  app.appendChild(circles);

  // Accordion semplice: Info, Gallery, Match
  app.appendChild(makeAccordion('Informazioni', renderClubInfo(club)));
  app.appendChild(makeAccordion('Galleria foto', renderGallery(club)));
  app.appendChild(makeAccordion('Match in programma', renderMatches(club)));

  // pulsanti fondo
  const bottom = document.createElement('div');
  bottom.style.display = 'flex';
  bottom.style.gap = '12px';
  bottom.style.marginTop = '16px';
  const coach = document.createElement('button');
  coach.className = 'btn';
  coach.textContent = 'Allenatore';
  coach.onclick = openCoachModal;
  const back = backButton();
  bottom.append(coach, back);
  app.appendChild(bottom);
}

function makeAccordion(title, contentNode) {
  const wrap = document.createElement('div');
  wrap.style.margin = '12px 0';
  const header = document.createElement('button');
  header.className = 'btn block';
  header.textContent = title;
  const body = document.createElement('div');
  body.style.display = 'none';
  body.style.padding = '12px 10px';
  body.style.border = '1px solid #222';
  body.style.borderTop = 'none';
  body.appendChild(contentNode);
  header.addEventListener('click', () => {
    const open = body.style.display === 'block';
    body.style.display = open ? 'none' : 'block';
  });
  wrap.append(header, body);
  return wrap;
}

function renderClubInfo(club) {
  const n = document.createElement('div');
  n.innerHTML = `
    <div style="color:#bbb">
      <div><strong>Categoria:</strong> ${club.level}</div>
      <div><strong>Regione:</strong> ${club.region}</div>
      <div><strong>Genere:</strong> ${club.gender}</div>
    </div>`;
  return n;
}

function renderGallery(club) {
  const n = document.createElement('div');
  if (!club.gallery || club.gallery.length === 0) {
    n.innerHTML = `<div style="color:#777">Nessuna foto caricata.</div>`;
    return n;
  }
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
  grid.style.gap = '8px';
  club.gallery.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'foto';
    img.style.width = '100%';
    img.style.height = '80px';
    img.style.objectFit = 'cover';
    grid.appendChild(img);
  });
  n.appendChild(grid);
  return n;
}

function renderMatches(club) {
  const n = document.createElement('div');
  if (!club.upcoming || club.upcoming.length === 0) {
    n.innerHTML = `<div style="color:#777">Nessun match programmato.</div>`;
    return n;
  }
  club.upcoming.forEach(m => {
    const row = document.createElement('div');
    row.style.padding = '8px 0';
    row.style.borderBottom = '1px dashed #222';
    row.innerHTML = `
      <div><strong>${m.team}</strong> — <span style="color:#bbb">${m.date}</span></div>
      <div style="color:#bbb">${m.city} — ${m.venue}</div>
    `;
    n.appendChild(row);
  });
  return n;
}

/* ---------- MODALS ---------- */

function openPrematchModal() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,.6)';
  overlay.style.zIndex = '2000';
  overlay.addEventListener('click', e => {
    if (e.target === overlay) document.body.removeChild(overlay);
  });

  const m = document.createElement('div');
  m.style.background = '#151515';
  m.style.border = '1px solid #222';
  m.style.width = '92%';
  m.style.maxWidth = '520px';
  m.style.margin = '10vh auto';
  m.style.borderRadius = '14px';
  m.style.padding = '16px';

  m.innerHTML = `
    <h2 style="margin-bottom:12px">Crea PreMatch</h2>

    <div style="margin-bottom:10px;color:#bbb">Scegli colore maglia (ospite)</div>
    <div id="pm-colors" style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap"></div>

    <label style="display:block;margin:10px 0 6px;color:#bbb">Data & ora</label>
    <input id="pm-datetime" type="datetime-local" style="width:100%;padding:10px;border-radius:8px;border:1px solid #333;background:#111;color:#fff">

    <label style="display:block;margin:12px 0 6px;color:#bbb">Luogo (indirizzo)</label>
    <input id="pm-place" placeholder="Via dello Sport 1, Città" style="width:100%;padding:10px;border-radius:8px;border:1px solid #333;background:#111;color:#fff">

    <label style="display:block;margin:12px 0 6px;color:#bbb">Messaggio per l’avversario (opzionale)</label>
    <textarea id="pm-message" rows="3" placeholder="Es. Buonasera, proponiamo amichevole..."
      style="width:100%;padding:10px;border-radius:8px;border:1px solid #333;background:#111;color:#fff;resize:vertical"></textarea>

    <label style="display:flex;gap:8px;align-items:center;margin:12px 0">
      <input id="pm-friendly" type="checkbox">
      <span>Richiedi amichevole</span>
    </label>

    <div style="display:flex;gap:10px;margin-top:10px;justify-content:flex-end">
      <button id="pm-cancel" class="btn">Annulla</button>
      <button id="pm-ok" class="btn btn-primary">Conferma</button>
    </div>
  `;

  // palette colori
  const colors = ['#ffffff','#111111','#ffcc00','#ff5e57','#58a6ff','#22c55e','#f59e0b','#a855f7'];
  const palette = m.querySelector('#pm-colors');
  let chosenColor = colors[0];
  colors.forEach(c => {
    const sw = document.createElement('button');
    sw.style.width = '34px';
    sw.style.height = '34px';
    sw.style.borderRadius = '8px';
    sw.style.border = '2px solid #333';
    sw.style.background = c;
    sw.style.outline = (c === chosenColor) ? '2px solid #00ff84' : 'none';
    sw.addEventListener('click', () => {
      chosenColor = c;
      [...palette.children].forEach(ch => ch.style.outline = 'none');
      sw.style.outline = '2px solid #00ff84';
    });
    palette.appendChild(sw);
  });

  m.querySelector('#pm-cancel').onclick = () => document.body.removeChild(overlay);
  m.querySelector('#pm-ok').onclick = () => {
    const dt = m.querySelector('#pm-datetime').value;
    const place = m.querySelector('#pm-place').value.trim();
    const msg = m.querySelector('#pm-message').value.trim();
    const friendly = m.querySelector('#pm-friendly').checked;

    if (!dt || !place) {
      toast('Compila data/ora e luogo.');
      return;
    }

    document.body.removeChild(overlay);
    toast('PreMatch creato ✔️');

    // semplice riepilogo sotto gli "Match in programma"
    const box = $$('#app > div')[3]; // il primo accordion (dipende dalla struttura, qui è stabile)
    if (box) {
      const add = document.createElement('div');
      add.style.marginTop = '10px';
      add.style.paddingTop = '10px';
      add.style.borderTop = '1px dashed #222';
      add.innerHTML = `
        <div style="color:#00ff84"><strong>PreMatch confermato</strong>${friendly ? ' • Amichevole' : ''}</div>
        <div style="color:#bbb">${dt} — ${place}</div>
        ${msg ? `<div style="color:#aaa">Messaggio: “${msg}”</div>` : ''}
      `;
      // infilo nel pannello "Match in programma"
      const panels = $$('#app > div');
      const lastAcc = panels[panels.length - 3]; // il terzo accordion è "Match in programma"
      const body = lastAcc?.querySelector('div + div');
      if (body) body.appendChild(add);
    }
  };

  overlay.appendChild(m);
  document.body.appendChild(overlay);
}

function openCoachModal() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,.6)';
  overlay.style.zIndex = '2000';

  const m = document.createElement('div');
  m.style.background = '#151515';
  m.style.border = '1px solid #222';
  m.style.width = '92%';
  m.style.maxWidth = '420px';
  m.style.margin = '15vh auto';
  m.style.borderRadius = '14px';
  m.style.padding = '16px';
  m.innerHTML = `
    <h2 style="margin-bottom:10px">Area Allenatore</h2>
    <label style="display:block;margin:6px 0;color:#bbb">Inserisci codice convocazione</label>
    <input id="coach-code" placeholder="Es. ROMA123" style="width:100%;padding:10px;border-radius:8px;border:1px solid #333;background:#111;color:#fff">
    <div style="display:flex;gap:10px;margin-top:12px;justify-content:flex-end">
      <button id="coach-cancel" class="btn">Annulla</button>
      <button id="coach-go" class="btn btn-primary">Accedi</button>
    </div>
  `;

  m.querySelector('#coach-cancel').onclick = () => document.body.removeChild(overlay);
  m.querySelector('#coach-go').onclick = () => {
    const code = m.querySelector('#coach-code').value.trim().toUpperCase();
    const data = coachCodes[code];
    if (!data) {
      toast('Codice non valido');
      return;
    }
    document.body.removeChild(overlay);
    renderCoachView(data);
  };

  overlay.appendChild(m);
  document.body.appendChild(overlay);
}

function renderCoachView(data) {
  history.pushState({ view: 'coach' }, '');
  clearApp();
  ensureNavbar();

  const app = $('#app');
  const club = clubs.find(c => c.id === data.clubId);

  app.appendChild(sectionTitle('Convocazione', `${club?.name || ''} — ${data.match.team}`));

  const card = document.createElement('div');
  card.style.border = '1px solid #222';
  card.style.borderRadius = '12px';
  card.style.padding = '12px';
  card.style.background = '#141414';
  card.innerHTML = `
    <div style="margin-bottom:6px"><strong>Gara:</strong> ${data.match.team} vs ${data.match.opponent}</div>
    <div style="margin-bottom:6px;color:#bbb"><strong>Quando:</strong> ${data.match.date}</div>
    <div style="color:#bbb"><strong>Campo:</strong> ${data.match.venue}</div>
  `;
  app.appendChild(card);

  // lista giocatori demo
  const players = ['Rossi', 'Bianchi', 'Verdi', 'Neri', 'Gialli', 'Azzurri', 'Blu', 'Marroni', 'Rosa', 'Viola', 'Arancio', 'Celesti', 'Grigi', 'Zafferi', 'Corallo'];
  const list = document.createElement('div');
  list.style.margin = '12px 0';
  list.style.display = 'grid';
  list.style.gridTemplateColumns = 'repeat(2, 1fr)';
  list.style.gap = '8px';

  players.forEach(p => {
    const row = document.createElement('label');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';
    row.style.padding = '8px';
    row.style.border = '1px solid #222';
    row.style.borderRadius = '10px';
    row.style.background = '#151515';
    row.innerHTML = `<input type="checkbox" checked> <span>${p}</span>`;
    list.appendChild(row);
  });
  app.appendChild(list);

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '10px';
  const back = backButton();
  const printBtn = document.createElement('button');
  printBtn.className = 'btn btn-primary';
  printBtn.textContent = 'Stampa PDF';
  printBtn.onclick = () => window.print();
  actions.append(printBtn, back);
  app.appendChild(actions);
}

/* ---------- INIT ---------- */

window.addEventListener('popstate', (e) => {
  const v = e.state?.view;
  switch (v) {
    case 'home': renderHome(); break;
    case 'gender': renderGender(); break;
    case 'regions': renderRegions(); break;
    case 'champs': renderChampionships(); break;
    case 'clubs': renderClubs(); break;
    case 'club': renderClubDetail(); break;
    case 'coach': /* non ricostruibile senza codice */ renderHome(); break;
    default: renderHome();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  ensureNavbar();
  renderHome();
});

/* ---------- MICRO STILI RUNTIME (per “pressed”) ---------- */
const styleRuntime = document.createElement('style');
styleRuntime.textContent = `
  .btn {
    background:#222; color:#fff; border:none; padding:10px 14px; border-radius:10px; cursor:pointer;
    transition: transform .12s, background .15s; }
  .btn:hover { background:#2a2a2a; }
  .btn.btn-primary { background:#00ff84; color:#111; font-weight:700; }
  .btn.btn-primary:hover { background:#00d173; }
  .btn.block { width:100%; text-align:left; border:1px solid #222; background:#181818; }
  .btn.pill { border-radius:999px; padding:10px 16px; margin:6px; }
  .pressed { transform: scale(.98); }
`;
document.head.appendChild(styleRuntime);

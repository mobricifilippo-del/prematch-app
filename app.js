/* ====== DATI DEMO (puoi estendere) ====== */
const SPORTS = [
  { id:"calcio",       name:"Calcio",       img:"images/calcio.jpg" },
  { id:"futsal",       name:"Futsal",       img:"images/futsal.jpg" },
  { id:"basket",       name:"Basket",       img:"images/basket.jpg" },
  { id:"rugby",        name:"Rugby",        img:"images/rugby.jpg" },
  { id:"volley",       name:"Volley",       img:"images/volley.jpg" },
  { id:"beachvolley",  name:"Beach Volley", img:"images/beachvolley.jpg" },
  { id:"pallanuoto",   name:"Pallanuoto",   img:"images/pallanuoto.jpg" }
];

const REGIONS = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna",
  "Friuli-Venezia Giulia","Lazio","Liguria","Lombardia","Marche",
  "Molise","Piemonte","Puglia","Sardegna","Sicilia","Toscana",
  "Trentino-Alto Adige","Umbria","Valle d'Aosta","Veneto"
];

const LEAGUES = {
  calcio: [
    "Serie A Maschile","Serie A Femminile","Eccellenza Maschile","Eccellenza Femminile"
  ],
  futsal: ["Serie A","Serie B"],
  basket: ["Serie A","Serie B"],
  rugby: ["Top10","Serie A"],
  volley: ["Superlega","A2"],
  beachvolley: ["Nazionale","Regionale"],
  pallanuoto: ["Serie A1","Serie A2"]
};

// demo società e sponsor
const SOCIETIES = [
  { id:1, name:"AS Roma",   sport:"calcio", region:"Lazio", leagues:["Serie A Femminile","Serie A Maschile"] },
  { id:2, name:"SS Lazio",  sport:"calcio", region:"Lazio", leagues:["Serie A Maschile"] },
  { id:3, name:"Dinamo Sassari", sport:"basket", region:"Sardegna", leagues:["Serie A"] },
];

const SPONSORS = {
  1:["Qatar Airways","DigitalBiscione"],
  2:["Caffè Roma","ItalPower"],
  3:["SardEnergy"]
};

const MATCHES = {
  1:[{ title:"Prima Squadra vs —", date:"31/08/2025 14:07", place:"Roma - Stadio Olimpico" }],
  2:[{ title:"Lazio vs —", date:"02/09/2025 20:45", place:"Roma - Olimpico" }],
  3:[{ title:"Dinamo vs —", date:"05/09/2025 18:00", place:"Sassari" }]
};

/* ====== STATO DI NAVIGAZIONE ====== */
const state = {
  sport:null, region:null, gender:null, league:null, club:null,
  history:[]
};

/* ====== AVVIO ====== */
document.addEventListener('DOMContentLoaded', () => {
  try {
    renderSports();
  } catch(e) {
    console.error(e);
    showFallbackMessage("Errore durante il caricamento. Riprova.");
  }
});

/* ====== RENDER HOME (SPORT) ====== */
function renderSports() {
  const grid = document.getElementById('sportsGrid');
  if(!grid){ showFallbackMessage('Manca il contenitore #sportsGrid in index.html'); return; }

  grid.innerHTML = SPORTS.map(s => `
    <article class="sport-card" data-sport="${s.id}">
      <div class="img-wrap">
        <img loading="lazy" src="${s.img}" alt="${s.name}">
      </div>
      <h3>${s.name}</h3>
    </article>
  `).join('');

  grid.querySelectorAll('.sport-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const id = card.getAttribute('data-sport');
      onSportSelected(id);
    });
  });
}

function showFallbackMessage(msg){
  const tgt = document.getElementById('sportsGrid') || document.querySelector('main');
  if(!tgt) return;
  tgt.innerHTML = `<div class="panel">${msg}</div>`;
}

/* ====== NAVIGAZIONE SCHERMATE ====== */
function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if(el){ el.classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }
}
function go(toId){
  state.history.push(document.querySelector('.screen.active')?.id || 'home');
  show(toId);
}
function goBack(){
  const prev = state.history.pop() || 'home';
  show(prev);
}

/* ====== FLOW ====== */
function onSportSelected(sportId){
  state.sport = sportId;
  state.region = state.gender = state.league = state.club = null;

  // regioni
  const list = document.getElementById('regionList');
  document.getElementById('metaSport').textContent = SPORTS.find(s=>s.id===sportId)?.name || '';
  list.innerHTML = REGIONS.map(r => `<button class="chip" onclick="selectRegion('${r}')">${r}</button>`).join('');
  go('screen-regioni');
}

function selectRegion(region){
  state.region = region;
  // genere
  go('screen-genere');
}

function selectGender(g){
  state.gender = g;

  // campionati per sport
  const leagues = LEAGUES[state.sport] || [];
  const wrap = document.getElementById('leagueList');
  wrap.innerHTML = leagues
    .filter(l => !l.toLowerCase().includes('femminile') || state.gender==='Femminile' ? true
                : !l.toLowerCase().includes('femminile'))
    .map(l => `<button class="chip" onclick="selectLeague('${l.replace(/'/g,"\\'")}')">${l}</button>`).join('');

  go('screen-campionati');
}

function selectLeague(league){
  state.league = league;

  // elenco società compatibili
  const list = document.getElementById('clubList');
  const clubs = SOCIETIES.filter(c =>
    c.sport===state.sport &&
    c.region===state.region &&
    c.leagues.includes(league)
  );

  if(clubs.length===0){
    list.innerHTML = `<div class="panel">Nessuna società trovata per <b>${league}</b> in <b>${state.region}</b>.</div>`;
  } else {
    list.innerHTML = clubs.map(c => `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
          <div><b>${c.name}</b><div class="meta">${state.region} • ${league}</div></div>
          <button class="btn-primary" onclick="openClub(${c.id})">Apri</button>
        </div>
      </div>
    `).join('');
  }
  go('screen-societa');
}

function openClub(id){
  const club = SOCIETIES.find(c=>c.id===id);
  if(!club){ return; }
  state.club = id;

  document.getElementById('clubName').textContent = club.name;
  document.getElementById('clubSport').textContent = SPORTS.find(s=>s.id===club.sport)?.name || '';
  document.getElementById('clubRegion').textContent = club.region;
  document.getElementById('clubGender').textContent = state.gender;

  // partite
  const matches = MATCHES[id] || [];
  document.getElementById('matchList').innerHTML =
    matches.length ? matches.map(m => `
      <div class="card"><b>${m.title}</b><br>${m.date} — ${m.place}</div>
    `).join('')
    : `<div class="card">Nessuna partita programmata.</div>`;

  // sponsor
  const sps = SPONSORS[id] || [];
  document.getElementById('sponsorList').innerHTML =
    sps.length ? sps.map(s=>`<span class="badge">${s}</span>`).join('') :
    `<span class="badge" style="background:#40261f;border-color:#7b1d10;color:#ffd5cd">Nessuno</span>`;

  go('screen-club');
}

/* ====== MODALE PREMATCH ====== */
const KIT_PALETTE = [
  "#ffffff","#000000","#c1121f","#1d4ed8","#22c55e","#f59e0b",
  "#9333ea","#52525b","#2563eb","#be185d","#16a34a","#ca8a04"
];

let selectedColor = null;

function openPrematch(){
  // genera i colori cliccabili
  const box = document.getElementById('kitColors');
  box.innerHTML = KIT_PALETTE.map((c,i)=>`
    <button class="swatch" style="background:${c}" data-color="${c}" aria-label="${c}"></button>
  `).join('');

  box.querySelectorAll('.swatch').forEach(sw=>{
    sw.addEventListener('click', ()=>{
      box.querySelectorAll('.swatch').forEach(x=>x.classList.remove('selected'));
      sw.classList.add('selected');
      selectedColor = sw.getAttribute('data-color');
    });
  });

  document.getElementById('noteInput').value = '';
  document.getElementById('prematchModal').classList.add('show');
}

function closePrematch(){
  document.getElementById('prematchModal').classList.remove('show');
  selectedColor = null;
}

function sendPrematch(){
  // demo: mostro un alert con riepilogo
  const club = SOCIETIES.find(c=>c.id===state.club);
  const note = document.getElementById('noteInput').value.trim();
  const colorTxt = selectedColor || "(non selezionato)";
  alert(
`Richiesta PreMatch inviata!

Società: ${club?.name || '-'}
Sport: ${SPORTS.find(s=>s.id===state.sport)?.name} • ${state.gender}
Regione: ${state.region}
Campionato: ${state.league}
Maglia: ${colorTxt}
Note: ${note || '(nessuna)'}`
  );

  // qui in futuro: chiamata a Supabase / API
  closePrematch();
}

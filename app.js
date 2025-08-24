/* ======== DATI DEMO OFFLINE ======== */

/* Sport */
const SPORTS = [
  { id:"calcio",       name:"Calcio",       img:"images/calcio.jpg" },
  { id:"futsal",       name:"Futsal",       img:"images/futsal.jpg" },
  { id:"basket",       name:"Basket",       img:"images/basket.jpg" },
  { id:"rugby",        name:"Rugby",        img:"images/rugby.jpg" },
  { id:"volley",       name:"Volley",       img:"images/volley.jpg" },
  { id:"beachvolley",  name:"Beach Volley", img:"images/beachvolley.jpg" },
  { id:"pallanuoto",   name:"Pallanuoto",   img:"images/pallanuoto.jpg" }
];

/* Regioni */
const REGIONS = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna",
  "Friuli-Venezia Giulia","Lazio","Liguria","Lombardia","Marche",
  "Molise","Piemonte","Puglia","Sardegna","Sicilia",
  "Toscana","Trentino-Alto Adige","Umbria","Valle d'Aosta","Veneto"
];

/* Campionati per sport (demo) */
const LEAGUES = {
  calcio: ["Serie A","Serie B"],
  futsal: ["Serie A Futsal"],
  basket: ["Serie A","Serie A2"],
  rugby: ["Top10"],
  volley: ["Superlega","A2"],
  beachvolley: ["Pro Tour"],
  pallanuoto: ["Serie A1"]
};

/* Società demo */
const DEMO_CLUBS = {
  "calcio|Lazio|Femminile|Serie A": [
    {
      name: "AS Roma",
      matches: [{ team:"Prima Squadra vs —", date:"31/08/2025 14:07", venue:"Roma - Stadio Olimpico" }],
      sponsors: ["Qatar Airways","DigitalBiscione"]
    },
    {
      name: "SS Lazio Women",
      matches: [{ team:"Prima Squadra vs —", date:"07/09/2025 20:45", venue:"Roma - Formello" }],
      sponsors: []
    }
  ]
};
function clubsFor(sport, region, gender, league){
  const key = `${sport}|${region}|${gender}|${league}`;
  if (DEMO_CLUBS[key]) return DEMO_CLUBS[key];
  return [
    { name: `${capitalize(sport)} ${region} ${gender} 1`,
      matches:[{team:"Prima Squadra vs —", date:"12/09/2025 18:00", venue:region}],
      sponsors:[] },
    { name: `${capitalize(sport)} ${region} ${gender} 2`,
      matches:[{team:"Under 18 vs —", date:"19/09/2025 15:30", venue:region}],
      sponsors:[] }
  ];
}

/* ======== STATO ======== */
const state = { sport:null, sportName:null, region:null, gender:null, league:null, club:null };

/* ======== UTILS ======== */
function $(s){ return document.querySelector(s); }
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
}
function goBackTo(id){ show(id); }
function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

/* ======== RENDER HOME (SPORT) ======== */
function renderSports(){
  const wrap = $("#sportsGrid");
  wrap.innerHTML = SPORTS.map(sp=>`
    <article class="sport-card" role="button" onclick="pickSport('${sp.id}','${sp.name}')">
      <img class="sport-card__img" src="${sp.img}" alt="${sp.name}" />
      <div class="sport-card__label">${sp.name}</div>
    </article>
  `).join("");
}

/* STEP: SPORT → REGIONE */
window.pickSport = function(id,name){
  state.sport=id; state.sportName=name;
  $("#ctx-sport").textContent = name;

  const sel = $("#regionSelect");
  sel.innerHTML = `<option value="">Seleziona una regione…</option>` +
    REGIONS.map(r => `<option value="${r}">${r}</option>`).join("");

  show("step-region");
};

/* onChange Regione → GENERE */
window.onRegionChange = function(value){
  if(!value) return;
  state.region = value;
  $("#ctx-sport-g").textContent = state.sportName;
  $("#ctx-region-g").textContent = state.region;
  show("step-gender");
};

/* GENERE (chip) → CAMPIONATO */
window.pickGender = function(gender){
  state.gender = gender;

  $("#ctx-sport-l").textContent   = state.sportName;
  $("#ctx-region-l").textContent  = state.region;
  $("#ctx-gender-l").textContent  = gender;

  const leagues = LEAGUES[state.sport] || [];
  const sel = $("#leagueSelect");
  sel.innerHTML = `<option value="">Seleziona un campionato…</option>` +
    leagues.map(l => `<option value="${l}">${l}</option>`).join("");

  show("step-league");
};

/* onChange Campionato → SOCIETÀ */
window.onLeagueChange = function(value){
  if(!value) return;
  state.league = value;

  $("#ctx-sport-c").textContent   = state.sportName;
  $("#ctx-region-c").textContent  = state.region;
  $("#ctx-gender-c").textContent  = state.gender;
  $("#ctx-league-c").textContent  = state.league;

  const clubs = clubsFor(state.sport, state.region, state.gender, state.league);
  $("#clubsWrap").innerHTML = clubs.map(c =>
    `<div class="item"><button onclick="openClub('${encodeURIComponent(c.name)}')">${c.name}</button></div>`
  ).join("");

  show("step-clubs");
};

/* DETTAGLIO SOCIETÀ */
window.openClub = function(encodedName){
  const name = decodeURIComponent(encodedName);
  state.club = name;

  $("#clubName").textContent = name;
  $("#ctx-sport-d").textContent  = state.sportName;
  $("#ctx-region-d").textContent = state.region;
  $("#ctx-gender-d").textContent = state.gender;
  $("#ctx-league-d").textContent = state.league;

  const data = clubsFor(state.sport, state.region, state.gender, state.league)
               .find(c=>c.name===name);

  // Partite
  const m = $("#matchesBox");
  if (data && data.matches && data.matches.length){
    m.innerHTML = data.matches.map(x =>
      `<div class="match"><div class="t">${x.team}</div><div class="d">${x.date} — ${x.venue}</div></div>`
    ).join("");
  } else m.innerHTML = `<div class="match">Nessuna partita programmata</div>`;

  // Sponsor
  const s = $("#sponsorsBox");
  if (data && data.sponsors && data.sponsors.length){
    s.innerHTML = data.sponsors.map(sp =>
      `<span class="chip chip--green" style="margin-right:8px">${sp}</span>`
    ).join("");
  } else s.innerHTML = `<span class="chip chip--green">Nessuno sponsor</span>`;

  show("club-detail");
};

/* BOOTSTRAP */
renderSports();

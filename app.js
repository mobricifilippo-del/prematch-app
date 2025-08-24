/* ========= DATI DEMO (offline) ========= */

/* Sport con immagini (usa i tuoi file in /images) */
const SPORTS = [
  { id:"calcio",       name:"Calcio",       img:"images/calcio.jpg" },
  { id:"futsal",       name:"Futsal",       img:"images/futsal.jpg" },
  { id:"basket",       name:"Basket",       img:"images/basket.jpg" },
  { id:"rugby",        name:"Rugby",        img:"images/rugby.jpg" },
  { id:"volley",       name:"Volley",       img:"images/volley.jpg" },
  { id:"beachvolley",  name:"Beach Volley", img:"images/beachvolley.jpg" },
  { id:"pallanuoto",   name:"Pallanuoto",   img:"images/pallanuoto.jpg" },
];

/* Tutte le regioni italiane */
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

/* Società demo, indicizzate per chiave combinata */
const DEMO_CLUBS = {
  // Esempio completo con sponsor e partita
  "calcio|Lazio|Femminile|Serie A": [
    {
      name: "AS Roma",
      matches: [
        { team:"Prima Squadra vs —", date:"31/08/2025 14:07", venue:"Roma - Stadio Olimpico" }
      ],
      sponsors: ["Qatar Airways","DigitalBiscione"]
    },
    {
      name: "SS Lazio Women",
      matches: [
        { team:"Prima Squadra vs —", date:"07/09/2025 20:45", venue:"Roma - Formello" }
      ],
      sponsors: []
    }
  ]
};

/* Per tutte le altre combinazioni generiamo 2 società “finte” */
function clubsFor(sport, region, gender, league){
  const key = `${sport}|${region}|${gender}|${league}`;
  if (DEMO_CLUBS[key]) return DEMO_CLUBS[key];
  return [
    {
      name: `${capitalize(sport)} ${region} ${gender} 1`,
      matches: [{ team:"Prima Squadra vs —", date:"12/09/2025 18:00", venue:`${region}` }],
      sponsors: []
    },
    {
      name: `${capitalize(sport)} ${region} ${gender} 2`,
      matches: [{ team:"Under 18 vs —", date:"19/09/2025 15:30", venue:`${region}` }],
      sponsors: []
    }
  ];
}

/* ========= STATO ========= */
const state = {
  sport:null,    // id
  sportName:null,
  region:null,
  gender:null,
  league:null,
  club:null
};

/* ========= UTILS ========= */
function $(sel){ return document.querySelector(sel); }
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
}
function goBackTo(id){ show(id); }
function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

/* ========= RENDER: HOME (SPORT) ========= */
function renderSports(){
  const wrap = $("#sportsGrid");
  wrap.innerHTML = SPORTS.map(sp=>`
    <article class="sport-card" role="button" onclick="pickSport('${sp.id}','${sp.name}')">
      <img class="sport-card__img" src="${sp.img}" alt="${sp.name}" />
      <div class="sport-card__label">${sp.name}</div>
    </article>
  `).join("");
}

/* STEP: sport scelto -> regioni */
function pickSport(id,name){
  state.sport=id; state.sportName=name;
  $("#ctx-sport").textContent = name;
  // popola chip regioni
  const r = $("#regionsWrap");
  r.innerHTML = REGIONS.map(reg =>
    `<button class="chip chip--green" onclick="pickRegion('${reg}')">${reg}</button>`
  ).join("");
  show("step-region");
}

/* STEP: regione -> genere */
function pickRegion(region){
  state.region = region;
  $("#ctx-sport-g").textContent = state.sportName;
  $("#ctx-region-g").textContent = region;
  show("step-gender");
}

/* STEP: genere -> campionato */
function pickGender(gender){
  state.gender = gender;
  $("#ctx-sport-l").textContent   = state.sportName;
  $("#ctx-region-l").textContent  = state.region;
  $("#ctx-gender-l").textContent  = gender;

  const leagues = LEAGUES[state.sport] || [];
  const w = $("#leaguesWrap");
  w.innerHTML = leagues.map(l =>
    `<button class="chip chip--green" onclick="pickLeague('${l}')">${l}</button>`
  ).join("");
  show("step-league");
}

/* STEP: campionato -> società */
function pickLeague(league){
  state.league = league;

  $("#ctx-sport-c").textContent   = state.sportName;
  $("#ctx-region-c").textContent  = state.region;
  $("#ctx-gender-c").textContent  = state.gender;
  $("#ctx-league-c").textContent  = league;

  const clubs = clubsFor(state.sport, state.region, state.gender, league);
  const wrap = $("#clubsWrap");
  wrap.innerHTML = clubs.map(c =>
    `<div class="item"><button onclick="openClub('${encodeURIComponent(c.name)}')">${c.name}</button></div>`
  ).join("");
  show("step-clubs");
}

/* DETTAGLIO SOCIETÀ */
function openClub(encodedName){
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
  } else {
    m.innerHTML = `<div class="match">Nessuna partita programmata</div>`;
  }

  // Sponsor
  const s = $("#sponsorsBox");
  if (data && data.sponsors && data.sponsors.length){
    s.innerHTML = data.sponsors.map(sp =>
      `<span class="chip chip--green" style="margin-right:8px">${sp}</span>`
    ).join("");
  } else {
    s.innerHTML = `<span class="chip chip--green">Nessuno sponsor</span>`;
  }

  show("club-detail");
}

/* bootstrap */
renderSports();

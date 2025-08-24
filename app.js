/* ------------------------------
   STATO DELL’APP
------------------------------ */
const state = {
  sport: null,
  regione: null,
  genere: null,
  club: null,
  history: [] // per il tasto Indietro
};

/* ------------------------------
   DATI STATICI (placeholder)
------------------------------ */
const SPORTS = [
  { key: "Calcio", img: "images/calcio.jpg" },
  { key: "Futsal", img: "images/futsal.jpg" },
  { key: "Basket", img: "images/basket.jpg" },
  { key: "Rugby", img: "images/rugby.jpg" },
  { key: "Volley", img: "images/volley.jpg" },
  { key: "Beach Volley", img: "images/beachvolley.jpg" },
  { key: "Pallanuoto", img: "images/pallanuoto.jpg" }
];

const REGIONI = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli-Venezia Giulia",
  "Lazio","Liguria","Lombardia","Marche","Molise","Piemonte","Puglia","Sardegna",
  "Sicilia","Toscana","Trentino-Alto Adige","Umbria","Veneto"
];

// Club finti (li cambieremo con Supabase). Chiave = `${sport}|${regione}|${genere}`
const CLUBS = {
  "Calcio|Lazio|Maschile": ["AS Roma", "SS Lazio"],
  "Calcio|Lazio|Femminile": ["AS Roma Women", "SS Lazio Women"],
  "Pallanuoto|Lazio|Maschile": ["Roma Waterpolo", "Lazio Nuoto"],
  "Pallanuoto|Lazio|Femminile": ["Roma WP Fem", "Lazio WP Fem"]
};

// Partite e Sponsor finti
const MATCHES = {
  "AS Roma": [
    { vs: "Torino", data: "2025-09-01 20:45", stadio: "Olimpico" },
    { vs: "Milan",  data: "2025-09-08 18:00", stadio: "San Siro" }
  ],
  "SS Lazio": [
    { vs: "Inter", data: "2025-09-02 20:45", stadio: "Olimpico" }
  ]
};
const SPONSOR = {
  "AS Roma": ["AcquaBlu", "PastaRoma"],
  "SS Lazio": ["FlyLazio", "SkyBlue"]
};

/* ------------------------------
   UTILS DI NAVIGAZIONE
------------------------------ */
function show(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
function goTo(id){
  state.history.push(id);
  show(id);
}
function back(){
  state.history.pop();             // current
  const prev = state.history.pop(); // previous
  if(prev){ goTo(prev); } else { goTo("home"); }
}

/* ------------------------------
   POPOLAMENTO HOME (SPORT)
------------------------------ */
const sportsGrid = document.getElementById("sportsGrid");
function renderSports(){
  sportsGrid.innerHTML = "";
  SPORTS.forEach(s => {
    const card = document.createElement("article");
    card.className = "sport-card";
    card.innerHTML = `
      <img src="${s.img}" alt="${s.key}">
      <div class="label">${s.key}</div>
    `;
    card.addEventListener("click", () => selectSport(s.key));
    sportsGrid.appendChild(card);
  });
}
renderSports();

/* ------------------------------
   REGIONI
------------------------------ */
const regioniGrid = document.getElementById("regioniGrid");
function renderRegioni(){
  // path
  document.getElementById("pathSport").textContent = state.sport;

  regioniGrid.innerHTML = "";
  REGIONI.forEach(r => {
    const btn = document.createElement("button");
    btn.className = "pill";
    btn.textContent = r;
    btn.addEventListener("click", () => selectRegione(r));
    regioniGrid.appendChild(btn);
  });
}

/* ------------------------------
   CLUBS
------------------------------ */
const clubsGrid = document.getElementById("clubsGrid");
function renderClubs(){
  document.getElementById("pathSport3").textContent   = state.sport;
  document.getElementById("pathRegione2").textContent = state.regione;
  document.getElementById("pathGenere").textContent   = state.genere;

  const key = `${state.sport}|${state.regione}|${state.genere}`;
  const list = CLUBS[key] || ["Società Demo 1", "Società Demo 2"];
  clubsGrid.innerHTML = "";
  list.forEach(name => {
    const row = document.createElement("div");
    row.className = "club-card";
    row.innerHTML = `
      <div class="club-name">${name}</div>
      <button class="pill">Apri</button>
    `;
    row.querySelector("button").addEventListener("click", () => openClub(name));
    clubsGrid.appendChild(row);
  });
}

/* ------------------------------
   DETTAGLIO CLUB
------------------------------ */
function renderClubDetail(){
  document.getElementById("clubTitle").textContent = state.club;
  document.getElementById("pathSport4").textContent   = state.sport;
  document.getElementById("pathRegione3").textContent = state.regione;
  document.getElementById("pathGenere2").textContent  = state.genere;

  const matches = MATCHES[state.club] || [
    { vs:"Avversario Demo", data:"2025-09-15 21:00", stadio:"Campo Comunale" }
  ];
  const mWrap = document.getElementById("matchesList");
  mWrap.innerHTML = "";
  matches.forEach(m => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div><b>${state.club}</b> vs <b>${m.vs}</b></div>
      <div>${m.data} — ${m.stadio}</div>
    `;
    mWrap.appendChild(row);
  });

  const sponsor = SPONSOR[state.club] || ["Sponsor Demo"];
  const sWrap = document.getElementById("sponsorList");
  sWrap.innerHTML = "";
  sponsor.forEach(s => {
    const b = document.createElement("span");
    b.className = "badge";
    b.textContent = s;
    sWrap.appendChild(b);
  });
}

/* ------------------------------
   HANDLERS DI FLUSSO
------------------------------ */
function selectSport(sport){
  state.sport = sport; state.regione = null; state.genere = null; state.club = null;
  renderRegioni();
  goTo("regioni");
}
function selectRegione(reg){
  state.regione = reg; state.genere = null; state.club = null;
  // aggiorna path nel panel genere
  document.getElementById("pathSport2").textContent = state.sport;
  document.getElementById("pathRegione").textContent = state.regione;
  goTo("genere");
}

// click su pill “Maschile/Femminile”
document.querySelectorAll('#genere .pill').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.genere = btn.dataset.genere;
    renderClubs();
    goTo('clubs');
  });
});

function openClub(name){
  state.club = name;
  renderClubDetail();
  goTo("clubDetail");
}

/* ------------------------------
   TASTI INDIETRO
------------------------------ */
document.getElementById("backFromRegioni").addEventListener("click", back);
document.getElementById("backFromGenere").addEventListener("click", back);
document.getElementById("backFromClubs").addEventListener("click", back);
document.getElementById("backFromDetail").addEventListener("click", back);

/* Avvio: segna la home nello stack per il back */
state.history = ["home"];

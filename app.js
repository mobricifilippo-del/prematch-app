/* ========= DATI DEMO OFFLINE ========= */

/* Sport */
const SPORTS = [
  { id: "calcio", name: "Calcio", img: "images/calcio.jpg" },
  { id: "futsal", name: "Futsal", img: "images/futsal.jpg" },
  { id: "basket", name: "Basket", img: "images/basket.jpg" },
  { id: "rugby", name: "Rugby", img: "images/rugby.jpg" },
  { id: "volley", name: "Volley", img: "images/volley.jpg" },
  { id: "beachvolley", name: "Beach Volley", img: "images/beachvolley.jpg" },
  { id: "pallanuoto", name: "Pallanuoto", img: "images/pallanuoto.jpg" }
];

/* Regioni */
const REGIONS = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna",
  "Friuli-Venezia Giulia","Lazio","Liguria","Lombardia","Marche",
  "Molise","Piemonte","Puglia","Sardegna","Sicilia",
  "Toscana","Trentino-Alto Adige","Umbria","Valle d'Aosta","Veneto"
];

/* Campionati per sport */
const LEAGUES = {
  calcio: [
    "Serie A Maschile",
    "Serie A Femminile",
    "Eccellenza Maschile",
    "Eccellenza Femminile"
  ],
  basket: ["Serie A Maschile", "Serie A Femminile"],
  volley: ["Serie A1 Maschile", "Serie A1 Femminile"],
  rugby: ["Top10 Maschile", "Serie A Femminile"],
  futsal: ["Serie A Maschile", "Serie A Femminile"],
  beachvolley: ["Campionato Nazionale"],
  pallanuoto: ["Serie A1 Maschile", "Serie A1 Femminile"]
};

/* Società demo */
const CLUBS = {
  "Calcio": {
    "Lazio": ["AS Roma", "SS Lazio"],
    "Lombardia": ["Inter", "Milan"],
    "Campania": ["Napoli"]
  },
  "Futsal": {
    "Lazio": ["Futsal Roma"]
  },
  "Basket": {
    "Lombardia": ["Olimpia Milano"],
    "Emilia-Romagna": ["Virtus Bologna"]
  },
  "Volley": {
    "Piemonte": ["Cuneo Volley"],
    "Lazio": ["Volley Roma"]
  },
  "Rugby": {
    "Veneto": ["Benetton Treviso"],
    "Lazio": ["Rugby Roma"]
  },
  "Beach Volley": {
    "Sardegna": ["Beach Club Cagliari"]
  },
  "Pallanuoto": {
    "Liguria": ["Pro Recco"],
    "Lazio": ["Roma Nuoto"]
  }
};

/* ========= STATO ========= */
let selectedSport = null;
let selectedRegion = null;
let selectedLeague = null;
let selectedClub = null;

/* ========= FUNZIONI ========= */
function qs(id){ return document.getElementById(id); }

/* Carica sport in home */
function loadSports() {
  const container = qs("sports-container");
  container.innerHTML = "";
  SPORTS.forEach(sport => {
    const card = document.createElement("div");
    card.className = "sport-card";
    card.innerHTML = `
      <img src="${sport.img}" alt="${sport.name}">
      <p>${sport.name}</p>
    `;
    card.addEventListener("click", () => selectSport(sport.name, sport.id));
    container.appendChild(card);
  });
}

/* Selezione sport */
function selectSport(name, id) {
  selectedSport = name; // es: "Calcio"
  qs("sports-section").classList.add("hidden");
  qs("regions-section").classList.remove("hidden");
  qs("selected-sport").textContent = name;

  const container = qs("regions-container");
  container.innerHTML = "";
  REGIONS.forEach(region => {
    const btn = document.createElement("button");
    btn.textContent = region;
    btn.onclick = () => selectRegion(region);
    container.appendChild(btn);
  });
}

/* Selezione regione */
function selectRegion(region) {
  selectedRegion = region;
  qs("regions-section").classList.add("hidden");
  qs("leagues-section").classList.remove("hidden");
  qs("selected-region").textContent = region;

  const container = qs("leagues-container");
  container.innerHTML = "";
  const key = selectedSport.toLowerCase(); // "calcio"
  (LEAGUES[key] || []).forEach(league => {
    const btn = document.createElement("button");
    btn.textContent = league;
    btn.onclick = () => selectLeague(league);
    container.appendChild(btn);
  });
}

/* Selezione campionato */
function selectLeague(league) {
  selectedLeague = league;
  qs("leagues-section").classList.add("hidden");
  qs("clubs-section").classList.remove("hidden");
  qs("selected-league").textContent = league;

  const container = qs("clubs-container");
  container.innerHTML = "";
  const clubs = (CLUBS[selectedSport] && CLUBS[selectedSport][selectedRegion]) || [];
  clubs.forEach(club => {
    const btn = document.createElement("button");
    btn.textContent = club;
    btn.onclick = () => selectClub(club);
    container.appendChild(btn);
  });
}

/* Selezione società */
function selectClub(club) {
  selectedClub = club;
  qs("clubs-section").classList.add("hidden");
  qs("club-page").classList.remove("hidden");
  qs("club-name").textContent = club;
  qs("club-info").textContent =
    `Sport: ${selectedSport} • Regione: ${selectedRegion} • Campionato: ${selectedLeague}`;
  qs("create-prematch-btn").classList.remove("hidden");
}

/* Torna indietro a una sezione */
function goBack(sectionId) {
  document.querySelectorAll("main section").forEach(s => s.classList.add("hidden"));
  qs(sectionId).classList.remove("hidden");
}

/* CTA prematch */
function createPrematch(){
  alert(`PreMatch creato per ${selectedClub} (${selectedLeague})`);
}

/* Avvio sicuro */
document.addEventListener("DOMContentLoaded", loadSports);

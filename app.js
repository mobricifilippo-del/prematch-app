// ====== DATI DEMO (client-only, nessun Supabase qui) ======
const REGIONI = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli-Venezia Giulia",
  "Lazio","Liguria","Lombardia","Marche","Molise","Piemonte","Puglia","Sardegna",
  "Sicilia","Toscana","Trentino-Alto Adige","Umbria","Valle d'Aosta","Veneto"
];

const DEMO_CLUBS = [
  { id:"roma", sport:"Calcio", regione:"Lazio", genere:"Femminile", nome:"AS Roma" }
];

const DEMO_MATCHES = [
  { clubId:"roma", data:"2025-08-31 14:07", titolo:"Prima Squadra vs —", luogo:"Roma - Stadio Olimpico" }
];

const DEMO_SPONSOR = [
  // Se vuoto, mostro "Nessuno sponsor registrato"
  // { clubId:"roma", nome:"Bar Rossi", livello:"Gold" }
];

// ====== STATO ======
const state = {
  sport: null,
  regione: null,
  genere: null,
  club: null
};

// ====== UTILI ======
const $ = s => document.querySelector(s);
const show = id => {
  document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" });
};

// ====== HOME: click sugli sport (griglia statica in HTML) ======
function bindSportCards() {
  document.querySelectorAll(".sport-card").forEach(btn => {
    btn.addEventListener("click", () => {
      state.sport = btn.dataset.sport;
      $("#chosenSport").textContent = state.sport;
      renderRegioni();
      show("#regioni");
    });
  });
}

// ====== REGIONI ======
function renderRegioni() {
  const box = $("#regionButtons");
  box.innerHTML = "";
  REGIONI.forEach(r => {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = r;
    b.addEventListener("click", () => {
      state.regione = r;
      show("#genere");
    });
    box.appendChild(b);
  });
}

// ====== GENERE ======
function bindGenere() {
  document.querySelectorAll("#genere .chip").forEach(b => {
    b.addEventListener("click", () => {
      state.genere = b.dataset.gen;
      renderClubs();
      show("#societa");
    });
  });
}

// ====== SOCIETÀ ======
function renderClubs() {
  const list = $("#clubsList");
  list.innerHTML = "";
  const clubs = DEMO_CLUBS.filter(c =>
    c.sport === state.sport &&
    c.regione === state.regione &&
    c.genere === state.genere
  );
  if (clubs.length === 0) {
    list.innerHTML = `<div class="empty">Nessuna società trovata.</div>`;
    return;
  }
  clubs.forEach(c => {
    const row = document.createElement("button");
    row.className = "row";
    row.textContent = c.nome;
    row.addEventListener("click", () => openClub(c));
    list.appendChild(row);
  });
}

function openClub(c) {
  state.club = c;
  $("#clubTitle").textContent = c.nome;
  $("#metaSport").textContent = state.sport;
  $("#metaRegione").textContent = state.regione;
  $("#metaGenere").textContent = state.genere;

  // Partite
  const matches = DEMO_MATCHES.filter(m => m.clubId === c.id);
  const mbox = $("#matchesBox");
  mbox.innerHTML = matches.length
    ? matches.map(m => `<div class="row">${m.titolo}<br><small>${m.data} — ${m.luogo}</small></div>`).join("")
    : `<div class="empty">Nessuna partita in programma.</div>`;

  // Sponsor (niente "Errore": se vuoto, messaggio pulito)
  const sponsors = DEMO_SPONSOR.filter(s => s.clubId === c.id);
  const sbox = $("#sponsorBox");
  sbox.innerHTML = sponsors.length
    ? sponsors.map(s => `<span class="pill">${s.nome}</span>`).join(" ")
    : `<div class="empty">Nessuno sponsor registrato.</div>`;

  show("#dettaglio");
}

// ====== BACK buttons ======
function bindBack() {
  document.querySelectorAll(".back").forEach(b => {
    b.addEventListener("click", () => {
      const target = b.dataset.back || "#home";
      show(target);
    });
  });
}

// ====== INIT ======
bindSportCards();
bindGenere();
bindBack();

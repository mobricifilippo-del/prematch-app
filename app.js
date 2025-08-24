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

/* Campionati per sport (aggiornato) */
const LEAGUES = {
  calcio: [
    "Serie A Maschile",
    "Serie A Femminile",
    "Eccellenza Maschile",
    "Eccellenza Femminile",
    "Promozione",
    "Under 19",
    "Under 17",
    "Under 15",
    "Scuola Calcio"
  ],
  futsal: ["Eccellenza Futsal", "Serie A Futsal"],
  basket: ["Serie A", "Serie A2", "U17 Ecc"],
  rugby: ["Top10", "Serie A"],
  volley: ["Superlega", "A2", "U18"],
  beachvolley: ["Pro Tour"],
  pallanuoto: ["Serie A1", "Serie A2"]
};

/* Società demo (chiave: sport|regione|genere|campionato) */
const DEMO_CLUBS = {
  "calcio|Lazio|Femminile|Eccellenza Femminile": [
    {
      name: "AS Roma",
      matches: [{ team:"Prima Squadra vs —", date:"31/08/2025 14:07", venue:"Roma - Stadio Olimpico", status:"confirm" }],
      sponsors: ["Qatar Airways","DigitalBiscione"]
    },
    {
      name: "SS Lazio Women",
      matches: [{ team:"Prima Squadra vs —", date:"07/09/2025 20:45", venue:"Roma - Formello", status:"pending" }],
      sponsors: []
    }
  ]
};
function clubsFor(sport, region, gender, league){
  const key = `${sport}|${region}|${gender}|${league}`;
  if (DEMO_CLUBS[key]) return DEMO_CLUBS[key];
  // default demo
  return [
    { name: `${capitalize(sport)} ${region} ${gender} 1`,
      matches:[{team:"Prima Squadra vs —", date:"12/09/2025 18:00", venue:region, status:"pending"}],
      sponsors:[] },
    { name: `${capitalize(sport)} ${region} ${gender} 2`,
      matches:[{team:"Under 18 vs —", date:"19/09/2025 15:30", venue:region, status:""}],
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
  ).join("");
}

/* SPORT → REGIONE */
window.pickSport = function(id,name){
  state.sport=id; state.sportName=name;
  $("#ctx-sport").textContent = name;

  const sel = $("#regionSelect");
  sel.innerHTML = `<option value="">Seleziona una regione…</option>` +
    REGIONS.map(r => `<option value="${r}">${r}</option>`).join("");

  show("step-region");
};

/* Regione → GENERE */
window.onRegionChange = function(value){
  if(!value) return;
  state.region = value;
  $("#ctx-sport-g").textContent = state.sportName;
  $("#ctx-region-g").textContent = state.region;
  show("step-gender");
};

/* Genere → CAMPIONATO */
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

/* Campionato → SOCIETÀ */
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
    m.innerHTML = data.matches.map(x => {
      const badge = x.status==="confirm" ? `<span class="badge" style="background:#22c55e;color:#05210f;border-color:#0a2213">PreMatch confermato</span>` :
                     x.status==="pending" ? `<span class="badge">PreMatch in attesa</span>` : "";
      return `<div class="match">
        <div class="t" style="display:flex;gap:8px;align-items:center">
          <strong>${x.team}</strong> ${badge}
        </div>
        <div class="d">${x.date} — ${x.venue}</div>
      </div>`;
    }).join("");
  } else m.innerHTML = `<div class="match">Nessuna partita programmata</div>`;

  // Sponsor
  const s = $("#sponsorsBox");
  if (data && data.sponsors && data.sponsors.length){
    s.innerHTML = data.sponsors.map(sp =>
      `<span class="chip chip--green" style="margin-right:8px">${sp}</span>`
    ).join("");
  } else s.innerHTML = `<span class="chip chip--green">Nessuno sponsor</span>`;

  // Stato prematch (reset)
  $("#prematchStatus").hidden = true;
  $("#pmMsg").hidden = true;
  $("#pmDate").value = "";
  $("#pmTime").value = "";
  $("#pmKit").value = "";
  $("#pmNote").value = "";

  show("club-detail");
};

/* ======== CREA PREMATCH (DEMO) ======== */
window.resetPreMatch = function(){
  $("#pmMsg").hidden = true;
  $("#pmDate").value = "";
  $("#pmTime").value = "";
  $("#pmKit").value = "";
  $("#pmNote").value = "";
};

window.submitPreMatch = function(){
  const date = $("#pmDate").value;
  const time = $("#pmTime").value;
  const kit  = $("#pmKit").value;

  if(!date || !time || !kit){
    const msg = $("#pmMsg");
    msg.hidden = false;
    msg.textContent = "Compila data, ora e colore divisa.";
    return;
  }

  // Demo: imposta stato "in attesa"
  const st = $("#prematchStatus");
  st.hidden = false;
  st.textContent = "PreMatch in attesa";

  const msg = $("#pmMsg");
  msg.hidden = false;
  msg.textContent = `Richiesta inviata: ${state.club} — ${date} ${time} — Divisa: ${kit}.`;

  // Aggiungi riga in alto nella lista
  const m = $("#matchesBox");
  const extra = document.createElement("div");
  extra.className = "match";
  extra.innerHTML = `
    <div class="t" style="display:flex;gap:8px;align-items:center">
      <strong>Nuovo PreMatch</strong> <span class="badge">PreMatch in attesa</span>
    </div>
    <div class="d">${date} ${time} — Da concordare</div>
  `;
  m.prepend(extra);
};

/* BOOTSTRAP */
renderSports();

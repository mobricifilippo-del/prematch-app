// Stato dell’app
const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
};

// Dati di esempio (puoi sostituirli poi con i reali / API)
const REGIONI = ["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"];
const CAMPIONATI_BY_SPORT = {
  calcio: ["Eccellenza","Promozione","Juniores"],
  futsal: ["A1","A2","B"],
  basket: ["Serie A","Serie B","Under 19"],
  volley: ["Serie B1","Serie B2","Serie C"],
  rugby: ["Top10","Serie A","Under 18"],
  pallanuoto: ["A1","A2","B"]
};

// Un piccolo DB demo
const SOCIETA = [
  // calcio
  { nome:"ASD Roma Nord", sport:"calcio", genere:"f", regione:"Lazio", campionato:"Eccellenza", sigla:"RN" },
  { nome:"Virtus Marino", sport:"calcio", genere:"f", regione:"Lazio", campionato:"Eccellenza", sigla:"VM" },
  { nome:"Torino FC Women", sport:"calcio", genere:"f", regione:"Piemonte", campionato:"Eccellenza", sigla:"TO" },
  // basket
  { nome:"Basket Milano", sport:"basket", genere:"m", regione:"Lombardia", campionato:"Serie B", sigla:"BM" },
  { nome:"Stella Azzurra", sport:"basket", genere:"m", regione:"Lazio", campionato:"Serie B", sigla:"SA" },
  // volley
  { nome:"Volley Siracusa", sport:"volley", genere:"f", regione:"Sicilia", campionato:"Serie C", sigla:"VS" },
];

// ---------- UTIL ----------
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function show(sectionId){
  $$(".page").forEach(p => p.classList.add("hidden"));
  $(`#${sectionId}`).classList.remove("hidden");
  $(`#${sectionId}`).classList.add("active");
}

// ---------- INIZIO ----------
window.addEventListener("DOMContentLoaded", () => {
  // Header → torna alla home
  $("#brandLink").addEventListener("click", (e)=>{ e.preventDefault(); resetToHome(); });

  // HOME: click sugli sport
  $("#sportGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".card-sport");
    if(!card) return;

    // attiva highlight
    $$("#sportGrid .card-sport").forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    state.sport = card.dataset.sport;
    state.genere = state.regione = state.campionato = null;

    // prepara chips regione/campionato
    renderRegioni();
    renderCampionati();

    show("filtri");
  });

  // FILTRI: back
  $("#backToHome").addEventListener("click", () => resetToHome());

  // GENERE
  $("#genereChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if(!chip) return;
    // attiva selezione esclusiva
    $$("#genereChips .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    state.genere = chip.dataset.genere;
    maybeListSocieta();
  });

  // REGIONE
  $("#regioneChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if(!chip) return;
    $$("#regioneChips .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    state.regione = chip.dataset.regione;
    maybeListSocieta();
  });

  // CAMPIONATO
  $("#campionatoChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if(!chip) return;
    $$("#campionatoChips .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    state.campionato = chip.dataset.campionato;
    maybeListSocieta();
  });

  // LISTA: back
  $("#backToFiltri").addEventListener("click", () => show("filtri"));
  // DETTAGLIO: back
  $("#backToList").addEventListener("click", () => show("societa-list"));
});

// ---------- RENDER ----------
function renderRegioni(){
  const box = $("#regioneChips");
  box.innerHTML = REGIONI.map(r =>
    `<button class="chip" data-regione="${r}">${r}</button>`
  ).join("");
}
function renderCampionati(){
  const box = $("#campionatoChips");
  const arr = CAMPIONATI_BY_SPORT[state.sport] || [];
  box.innerHTML = arr.map(c =>
    `<button class="chip" data-campionato="${c}">${c}</button>`
  ).join("");
}

function maybeListSocieta(){
  if(!state.genere || !state.regione || !state.campionato) return;

  // Filtra e ordina A→Z
  const list = SOCIETA
    .filter(s =>
      s.sport===state.sport &&
      s.genere===state.genere &&
      s.regione===state.regione &&
      s.campionato===state.campionato
    )
    .sort((a,b) => a.nome.localeCompare(b.nome,'it'));

  // Crumbs
  const sportName = state.sport.charAt(0).toUpperCase()+state.sport.slice(1);
  const gen = state.genere==='m'?'Maschile':'Femminile';
  $("#crumbs").textContent = `${sportName} • ${gen} • ${state.regione} • ${state.campionato}`;

  // Cards
  const wrap = $("#cardsSocieta");
  if(list.length===0){
    wrap.innerHTML = `<div class="card"><div class="left"><div class="badge">—</div><div><div class="title">Nessuna società trovata</div><div class="meta">Modifica filtri</div></div></div></div>`;
  }else{
    wrap.innerHTML = list.map(s => `
      <button class="card" data-soc="${s.nome}">
        <div class="left">
          <div class="badge">${(s.sigla||s.nome.slice(0,2)).toUpperCase()}</div>
          <div>
            <div class="title">${s.nome}</div>
            <div class="meta">${s.campionato} • ${s.genere==='m'?'Maschile':'Femminile'} • ${s.regione}</div>
          </div>
        </div>
        <span class="meta">PM</span>
      </button>
    `).join("");
  }

  // Click card società → dettaglio
  wrap.onclick = (e)=>{
    const card = e.target.closest(".card");
    if(!card) return;
    const nome = card.dataset.soc;
    const s = SOCIETA.find(x => x.nome===nome);
    if(!s) return;
    renderSocietaDetail(s);
    show("societa-detail");
  };

  show("societa-list");
}

function renderSocietaDetail(s){
  $("#socName").textContent = s.nome;
  $("#socMeta").textContent = `${s.campionato} • ${s.genere==='m'?'Maschile':'Femminile'} • ${s.regione}`;
  $("#socAvatar").textContent = (s.sigla || s.nome.slice(0,2)).toUpperCase();
}

function resetToHome(){
  // pulizia stato + UI
  state.sport = state.genere = state.regione = state.campionato = null;
  $$("#sportGrid .card-sport").forEach(c => c.classList.remove("active"));
  $$("#genereChips .chip, #regioneChips .chip, #campionatoChips .chip").forEach(c => c.classList.remove("active"));
  show("home");
}

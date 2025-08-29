/* =========================
   DATI DI ESEMPIO (sostituisci poi col tuo JSON)
   ========================= */
const DATA = {
  sport: ["calcio","futsal","basket","volley","rugby","pallanuoto"],
  regioni: ["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"],
  campionati: {
    calcio: ["Eccellenza","Promozione","Juniores"],
    futsal: ["A1","A2","B"],
    basket: ["C Gold","C Silver"],
    volley: ["Serie B1","Serie B2"],
    rugby: ["Serie A","Serie B"],
    pallanuoto: ["Serie A1","Serie A2"]
  },
  // Società d’esempio
  clubs: [
    { id:"roma-nord",  nome:"ASD Roma Nord",  sport:"calcio",  genere:"femminile", regione:"Lazio", campionato:"Eccellenza",  sigla:"RN" },
    { id:"virtus-marino", nome:"Virtus Marino", sport:"calcio",  genere:"femminile", regione:"Lazio", campionato:"Eccellenza",  sigla:"VM" },
    { id:"pisa-futsal", nome:"Pisa Futsal", sport:"futsal", genere:"maschile", regione:"Toscana", campionato:"A2", sigla:"PF" }
  ]
};

/* =========================
   STATO
   ========================= */
const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
  clubs: DATA.clubs
};

/* =========================
   UTILI DOM
   ========================= */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const secHome = $("#home");
const secFiltri = $("#filtri");
const secList = $("#societa-list");
const secDetail = $("#societa-detail");

const regionScroller = $("#regionScroller");
const champScroller  = $("#champScroller");
const selectionBreadcrumb = $("#selectionBreadcrumb");
const listTitle = $("#listTitle");
const cardsSocieta = $("#cardsSocieta");

const brandHome = $("#brandHome");
const btnBackHome = $("#btnBackHome");
const btnBackFiltri = $("#btnBackFiltri");
const btnBackLista = $("#btnBackLista");

/* =========================
   NAVIGAZIONE SEZIONI
   ========================= */
function showOnly(id){
  [secHome,secFiltri,secList,secDetail].forEach(s => s.classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function resetFiltri(){
  state.genere = null;
  state.regione = null;
  state.campionato = null;
  selectionBreadcrumb.textContent = "";
  // pulisci active
  $$(".chip.active").forEach(c=>c.classList.remove("active"));
  champScroller.innerHTML = "";
}

/* =========================
   HOME → click sport
   ========================= */
function setupSportClicks(){
  $$("#sportGrid .card-sport").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      // evidenza
      $$("#sportGrid .card-sport").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");

      state.sport = btn.dataset.sport;
      resetFiltri();

      // genera regioni
      regionScroller.innerHTML = DATA.regioni.map(r =>
        `<button class="chip" data-regione="${r}">${r}</button>`
      ).join("");

      // genera campionati per sport scelto
      const arr = DATA.campionati[state.sport] || [];
      champScroller.innerHTML = arr.map(c =>
        `<button class="chip" data-campionato="${c}">${c}</button>`
      ).join("");

      showOnly("#filtri");
      updateBreadcrumb();
    });
  });
}

/* =========================
   FILTRI → selezioni
   ========================= */
function updateBreadcrumb(){
  const parts = [];
  if(state.sport) parts.push(cap(state.sport));
  if(state.genere) parts.push(cap(state.genere));
  if(state.regione) parts.push(state.regione);
  if(state.campionato) parts.push(state.campionato);
  selectionBreadcrumb.textContent = parts.join(" • ");
}

function cap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function setupFiltriDelegation(){
  document.addEventListener("click", e=>{
    // genere
    const g = e.target.closest("[data-genere]");
    if(g){
      e.preventDefault();
      $("[data-genere='maschile']").classList.remove("active");
      $("[data-genere='femminile']").classList.remove("active");
      g.classList.add("active");
      state.genere = g.dataset.genere;
      updateBreadcrumb();
      return;
    }

    // regione
    const r = e.target.closest("[data-regione]");
    if(r){
      e.preventDefault();
      regionScroller.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
      r.classList.add("active");
      state.regione = r.dataset.regione;
      updateBreadcrumb();
      return;
    }

    // campionato
    const c = e.target.closest("[data-campionato]");
    if(c){
      e.preventDefault();
      champScroller.querySelectorAll(".chip").forEach(k=>k.classList.remove("active"));
      c.classList.add("active");
      state.campionato = c.dataset.campionato;
      updateBreadcrumb();

      // quando ho i 3 filtri → lista società
      if(state.genere && state.regione && state.campionato){
        renderListaSocieta();
        showOnly("#societa-list");
      }
      return;
    }
  });
}

/* =========================
   LISTA SOCIETÀ
   ========================= */
function renderListaSocieta(){
  const titolo = `${cap(state.sport)} • ${cap(state.genere)} • ${state.regione} • ${state.campionato}`;
  listTitle.textContent = titolo;

  let filtered = state.clubs.filter(c =>
    c.sport === state.sport &&
    c.genere === state.genere &&
    c.regione === state.regione &&
    c.campionato === state.campionato
  );

  // ordine alfabetico
  filtered.sort((a,b)=> a.nome.localeCompare(b.nome, 'it'));

  if(filtered.length === 0){
    cardsSocieta.innerHTML = `<p class="subtitle">Nessuna società trovata.</p>`;
    return;
  }

  cardsSocieta.innerHTML = filtered.map(c => `
    <button class="card-club" data-club="${c.id}">
      <div class="badge">${c.sigla ?? "PM"}</div>
      <div>
        <div class="club-name">${c.nome}</div>
        <div class="club-line">${c.campionato} • ${c.genere} • ${c.regione}</div>
      </div>
      <div class="pm-round">PM</div>
    </button>
  `).join("");
}

/* click su card società → dettaglio */
cardsSocieta?.addEventListener("click", e=>{
  const card = e.target.closest("[data-club]");
  if(!card) return;
  const id = card.dataset.club;
  const club = state.clubs.find(c => c.id === id);
  if(!club) return;

  $("#clubInitials").textContent = club.sigla ?? "PM";
  $("#clubName").textContent = club.nome;
  $("#clubMeta").textContent = `${club.campionato} • ${club.genere} • ${club.regione}`;

  showOnly("#societa-detail");
});

/* =========================
   BACK + HEADER
   ========================= */
brandHome.addEventListener("click", (e)=>{ e.preventDefault(); showOnly("#home"); });

btnBackHome.addEventListener("click", ()=>{ showOnly("#home"); });
btnBackFiltri.addEventListener("click", ()=>{ showOnly("#filtri"); });
btnBackLista.addEventListener("click", ()=>{ showOnly("#societa-list"); });

/* =========================
   INIZIO
   ========================= */
function init(){
  setupSportClicks();
  setupFiltriDelegation();
  showOnly("#home");
}
document.addEventListener("DOMContentLoaded", init);

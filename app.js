/* ==========================
   Stato di navigazione
========================== */
const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
  history: ["view-sport"]
};

/* Piccolo DB demo per le società */
const DB = [
  {
    sport: "calcio",
    genere: "femminile",
    regione: "Lazio",
    campionato: "Eccellenza",
    societa: [
      {
        nome: "ASD Roma Nord",
        meta: "Eccellenza • Femminile • Lazio",
        logo: "images/logo-roma-nord.png" // se assente usa cerchio neutro
      },
      {
        nome: "Virtus Marino",
        meta: "Eccellenza • Femminile • Lazio",
        logo: "images/logo-virtus-marino.png"
      }
    ]
  }
];

/* --------------------------
   Utilità di navigazione
-------------------------- */
const views = ["view-sport", "view-genere", "view-societa"];

function show(id) {
  views.forEach(v => {
    const el = document.getElementById(v);
    if (!el) return;
    el.classList.toggle("active", v === id);
  });
  const last = state.history[state.history.length - 1];
  if (last !== id) state.history.push(id);
}

function goBack() {
  // non togliere la prima voce
  if (state.history.length > 1) state.history.pop();
  const prev = state.history[state.history.length - 1] || "view-sport";
  show(prev);
}

/* --------------------------
   Inizializzazione HOME
-------------------------- */
function initSportCards() {
  document.querySelectorAll(".card-sport").forEach(card => {
    card.addEventListener("click", () => {
      // accensione rapida
      document.querySelectorAll(".card-sport").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      // set stato + vai a Genere
      state.sport = card.dataset.sport;
      state.genere = state.regione = state.campionato = null;

      // reset selezioni nella view-genere
      document.querySelectorAll("#genere-options .btn-option").forEach(b => b.classList.remove("selected"));
      document.getElementById("regioni-block").open = false;
      document.getElementById("campionati-block").open = false;
      document.querySelectorAll("#regioni-options .btn-option, #campionati-options .btn-option")
        .forEach(b => b.classList.remove("selected"));

      setTimeout(() => show("view-genere"), 120);
    }, { passive: true });
  });
}

/* --------------------------
   Scelte Genere/Regione/Campionato
-------------------------- */
function initFilters() {
  // Genere
  document.querySelectorAll("#genere-options .btn-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#genere-options .btn-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.genere = btn.dataset.genere;

      // apri RegionI
      const reg = document.getElementById("regioni-block");
      reg.open = true;
      reg.scrollIntoView({ behavior: "smooth", block: "center" });
    }, { passive: true });
  });

  // Regione
  document.querySelectorAll("#regioni-options .btn-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#regioni-options .btn-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.regione = btn.dataset.regione;

      // apri Campionati
      const camp = document.getElementById("campionati-block");
      camp.open = true;
      camp.scrollIntoView({ behavior: "smooth", block: "center" });
    }, { passive: true });
  });

  // Campionato -> genera elenco società e vai alla pagina società
  document.querySelectorAll("#campionati-options .btn-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#campionati-options .btn-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.campionato = btn.dataset.campionato;

      renderSocieta();
      show("view-societa");
    }, { passive: true });
  });
}

/* --------------------------
   Render elenco società
-------------------------- */
function renderSocieta() {
  const box = document.getElementById("lista-societa");
  box.innerHTML = "";

  // semplice filtro dal mini DB
  const match = DB.find(
    r =>
      r.sport === state.sport &&
      r.genere === state.genere &&
      r.regione === state.regione &&
      r.campionato === state.campionato
  );

  const list = match?.societa ?? [];

  if (!list.length) {
    const empty = document.createElement("p");
    empty.textContent = "Nessuna società disponibile per questi filtri.";
    box.appendChild(empty);
    return;
  }

  list.forEach(s => {
    const card = document.createElement("div");
    card.className = "societa-card";

    const left = document.createElement("div");
    left.className = "societa-left";

    const logo = document.createElement("div");
    logo.className = "logo-circle";
    if (s.logo) logo.style.backgroundImage = `url('${s.logo}')`;

    const txt = document.createElement("div");
    txt.className = "societa-txt";
    txt.innerHTML = `<div class="name">${s.nome}</div><div class="meta">${s.meta}</div>`;

    left.appendChild(logo);
    left.appendChild(txt);

    const right = document.createElement("div");
    right.style.textAlign = "center";
    const pm = document.createElement("div");
    pm.className = "badge-pm";
    pm.textContent = "PM";
    const link = document.createElement("a");
    link.href = "#";
    link.className = "badge-link";
    link.textContent = "PreMatch";

    right.appendChild(pm);
    right.appendChild(link);

    card.appendChild(left);
    card.appendChild(right);

    box.appendChild(card);
  });
}

/* --------------------------
   Avvio
-------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initSportCards();
  initFilters();
  show("view-sport"); // assicura che parta dalla home
});

/* esponi back sul global per i bottoni inline */
window.goBack = goBack;

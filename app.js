// app.js

// Stato dell'app
const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
  societa: null
};

// Navigazione
function goTo(viewId, params = {}) {
  // Nascondi tutte le view
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));

  // Mostra la view richiesta
  const view = document.getElementById(viewId);
  if (view) view.classList.remove("hidden");

  // Inizializza la view
  switch (viewId) {
    case "view-home":
      break;
    case "view-filtri":
      initFiltriView(params);
      break;
    case "view-societa-list":
      renderSocietaList(view.querySelector(".societa-container"), getSocietaFiltrate(params));
      break;
    case "view-societa":
      renderSocieta(view, state.societa);
      break;
  }
}

// ========== INIT FILTRI ==========
function initFiltriView(params) {
  state.sport = params?.sport || state.sport;

  // step iniziale: si vede solo GENERE
  document.getElementById("box-genere")?.classList.remove("hidden");
  document.getElementById("box-regione")?.classList.add("hidden");
  document.getElementById("box-campionato")?.classList.add("hidden");

  highlightSelections();
}

// Evidenzia pulsanti selezionati
function highlightSelections() {
  document.querySelectorAll("[data-genere]").forEach(b => {
    b.classList.toggle("selected", b.dataset.genere === state.genere);
  });
  document.querySelectorAll("[data-regione]").forEach(b => {
    b.classList.toggle("selected", b.dataset.regione === state.regione);
  });
  document.querySelectorAll("[data-campionato]").forEach(b => {
    b.classList.toggle("selected", b.dataset.campionato === state.campionato);
  });
}

// ========== CLICK HANDLER ==========
document.addEventListener("click", (e) => {
  // SPORT (home)
  const s = e.target.closest("[data-sport]");
  if (s) {
    e.preventDefault();
    state.sport = s.dataset.sport;
    highlightSelections();
    goTo("view-filtri", { sport: state.sport });
    return;
  }

  // GENERE
  const g = e.target.closest("[data-genere]");
  if (g) {
    e.preventDefault();
    state.genere = g.dataset.genere;
    highlightSelections();

    // mostra REGIONE, nascondi CAMPIONATO
    document.getElementById("box-regione")?.classList.remove("hidden");
    document.getElementById("box-campionato")?.classList.add("hidden");
    return;
  }

  // REGIONE
  const r = e.target.closest("[data-regione]");
  if (r) {
    e.preventDefault();
    state.regione = r.dataset.regione;
    highlightSelections();

    // mostra CAMPIONATO
    document.getElementById("box-campionato")?.classList.remove("hidden");
    return;
  }

  // CAMPIONATO → CAMBIO PAGINA
  const c = e.target.closest("[data-campionato]");
  if (c) {
    e.preventDefault();
    state.campionato = c.dataset.campionato;
    highlightSelections();

    goTo("view-societa-list", {
      sport: state.sport,
      genere: state.genere,
      regione: state.regione,
      campionato: state.campionato
    });
    return;
  }

  // SOCIETA (card)
  const soc = e.target.closest("[data-societa-id]");
  if (soc) {
    e.preventDefault();
    const id = soc.dataset.societaId;
    const tutte = getSocietaFiltrate({
      sport: state.sport,
      genere: state.genere,
      regione: state.regione,
      campionato: state.campionato
    });
    state.societa = tutte.find(s => s.id == id);
    goTo("view-societa");
    return;
  }

  // INDIETRO
  if (e.target.closest(".btn-back")) {
    e.preventDefault();
    history.back();
    return;
  }
});

// ========== RENDER LISTA SOCIETA ==========
function renderSocietaList(container, societaArray) {
  // Ordina A-Z
  const sorted = [...societaArray].sort((a, b) =>
    a.nome.localeCompare(b.nome, "it", { sensitivity: "base" })
  );

  container.innerHTML = sorted.map(s => `
    <a class="card-societa" data-societa-id="${s.id}" href="#">
      <div class="logo-cerchio">${s.sigla || "PM"}</div>
      <div class="testi">
        <h3>${s.nome}</h3>
        <p>${s.campionato} • ${s.genere} • ${s.regione}</p>
      </div>
      <div class="badge-pm">PM</div>
    </a>
  `).join("");
}

// ========== RENDER PAGINA SOCIETA ==========
function renderSocieta(view, societa) {
  if (!societa) return;

  view.querySelector("h2").textContent = societa.nome;
  view.querySelector("p").textContent =
    `${societa.campionato} • ${societa.genere} • ${societa.regione}`;
}

// ========== DATI DI TEST (puoi spostarli in /data) ==========
function getSocietaFiltrate({ sport, genere, regione, campionato }) {
  // esempio statico
  const tutte = [
    { id: 1, nome: "ASD Roma Nord", sigla: "RN", sport: "calcio", genere: "femminile", regione: "Lazio", campionato: "Eccellenza" },
    { id: 2, nome: "Virtus Marino", sigla: "VM", sport: "calcio", genere: "femminile", regione: "Lazio", campionato: "Eccellenza" }
  ];

  return tutte.filter(s =>
    (!sport || s.sport === sport) &&
    (!genere || s.genere === genere) &&
    (!regione || s.regione === regione) &&
    (!campionato || s.campionato === campionato)
  );
}

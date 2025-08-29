const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
  societaSelezionata: null
};

// Mock data
const regioni = ["Lazio", "Lombardia", "Sicilia", "Piemonte", "Veneto", "Emilia-Romagna"];
const campionati = ["Eccellenza", "Promozione", "Juniores"];
const societa = [
  { nome: "ASD Roma Nord", sport: "calcio", genere: "femminile", regione: "Lazio", campionato: "Eccellenza", sigla: "RN" },
  { nome: "Virtus Marino", sport: "calcio", genere: "femminile", regione: "Lazio", campionato: "Eccellenza", sigla: "VM" }
];

// Navigazione
function goTo(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');

  if (viewId === "view-societa-list") {
    renderSocietaList();
  }
  if (viewId === "view-societa-detail") {
    renderSocietaDetail();
  }
}

// Render liste
function renderFiltri() {
  const regDiv = document.getElementById("regioni");
  regDiv.innerHTML = regioni.map(r => `<button data-regione="${r}">${r}</button>`).join("");

  const campDiv = document.getElementById("campionati");
  campDiv.innerHTML = campionati.map(c => `<button data-campionato="${c}">${c}</button>`).join("");
}

function renderSocietaList() {
  const cont = document.querySelector(".societa-container");
  const titolo = document.getElementById("titolo-elenco");
  titolo.textContent = `${state.sport} • ${state.genere} • ${state.regione} • ${state.campionato}`;

  const lista = societa.filter(s =>
    s.sport === state.sport &&
    s.genere === state.genere &&
    s.regione === state.regione &&
    s.campionato === state.campionato
  );

  cont.innerHTML = lista.map(s => `
    <div class="societa-card" data-societa="${s.nome}">
      <div class="societa-logo">${s.sigla}</div>
      <div>
        <a href="#" data-societa="${s.nome}">${s.nome}</a><br>
        <small>${s.campionato} • ${s.genere} • ${s.regione}</small>
      </div>
    </div>
  `).join("");
}

function renderSocietaDetail() {
  const s = state.societaSelezionata;
  const detail = document.getElementById("societa-detail");
  detail.innerHTML = `
    <div class="societa-card">
      <div class="societa-logo">${s.sigla}</div>
      <div>
        <h2>${s.nome}</h2>
        <p>${s.campionato} • ${s.genere} • ${s.regione}</p>
      </div>
    </div>
    <div class="choices">
      <button>Informazioni</button>
      <button>Galleria foto</button>
      <button>Match in programma</button>
    </div>
  `;
}

// Eventi
document.addEventListener("DOMContentLoaded", () => {
  // Sport
  document.querySelectorAll(".card-sport").forEach(c => {
    c.addEventListener("click", () => {
      state.sport = c.dataset.sport;
      renderFiltri();
      goTo("view-filtri");
    });
  });

  // Generi
  document.getElementById("genere").addEventListener("click", e => {
    if (e.target.dataset.genere) {
      state.genere = e.target.dataset.genere;
      document.querySelectorAll("#genere button").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
    }
  });

  // Regioni
  document.getElementById("regioni").addEventListener("click", e => {
    if (e.target.dataset.regione) {
      state.regione = e.target.dataset.regione;
      document.querySelectorAll("#regioni button").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
    }
  });

  // Campionati
  document.getElementById("campionati").addEventListener("click", e => {
    if (e.target.dataset.campionato) {
      state.campionato = e.target.dataset.campionato;
      document.querySelectorAll("#campionati button").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      goTo("view-societa-list");
    }
  });

  // Elenco società → dettaglio
  document.querySelector(".societa-container").addEventListener("click", e => {
    const nome = e.target.dataset.societa;
    if (nome) {
      state.societaSelezionata = societa.find(s => s.nome === nome);
      goTo("view-societa-detail");
    }
  });

  // Pulsanti indietro
  document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      goTo(btn.dataset.go);
    });
  });
});

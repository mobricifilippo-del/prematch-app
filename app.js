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
function renderSocietaDetail() {
  const s = state.societaSelezionata;
  const detail = document.getElementById("societa-detail");

  // Fallback se per qualche motivo non c'è (es. reload)
  if (!s) {
    detail.innerHTML = `<p>Seleziona una società dall’elenco.</p>`;
    return;
  }

  detail.innerHTML = `
    <div class="club-hero">
      <div class="club-left">
        <div class="societa-logo-lg" aria-hidden="true">${(s.sigla || s.nome.slice(0,2)).toUpperCase()}</div>
        <div class="club-title">
          <h1>${s.nome}</h1>
          <div class="meta-chips">
            <span class="chip">${s.campionato}</span>
            <span class="chip">${s.genere}</span>
            <span class="chip">${s.regione}</span>
          </div>
        </div>
      </div>
      <div class="pm-badge">PM</div>
    </div>

    <div class="action-row">
      <button class="pill-btn">Informazioni</button>
      <button class="pill-btn">Galleria foto</button>
      <button class="pill-btn">Match in programma</button>
    </div>
  `;
}
// NAVIGAZIONE
function goTo(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');

  if (viewId === "view-societa-list") renderSocietaList();
  if (viewId === "view-societa-detail") renderSocietaDetail();
}

// RENDER
function renderFiltri() {
  // regioni
  const regDiv = document.getElementById("regioni");
  regDiv.innerHTML = regioni.map(r => `<button data-regione="${r}">${r}</button>`).join("");

  // campionati
  const campDiv = document.getElementById("campionati");
  campDiv.innerHTML = campionati.map(c => `<button data-campionato="${c}">${c}</button>`).join("");

  // mantieni eventuali selezioni già fatte
  syncSelectionsUI();
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


  `;
}

/* --------- UTILITY: sincronizza stato -> UI --------- */
function syncSelectionsUI() {
  // Genere
  document.querySelectorAll("#genere button").forEach(b => {
    b.classList.toggle('active', b.dataset.genere === state.genere);
  });
  // Regione
  document.querySelectorAll("#regioni button").forEach(b => {
    b.classList.toggle('active', b.dataset.regione === state.regione);
  });
  // Campionato
  document.querySelectorAll("#campionati button").forEach(b => {
    b.classList.toggle('active', b.dataset.campionato === state.campionato);
  });
  // Sport
  document.querySelectorAll(".card-sport").forEach(c => {
    c.classList.toggle('active', c.dataset.sport === state.sport);
  });
}

/* ----------------- EVENTI ----------------- */
document.addEventListener("DOMContentLoaded", () => {
  // SPORT: selezione + highlight
  document.querySelectorAll(".card-sport").forEach(c => {
    c.addEventListener("click", () => {
      state.sport = c.dataset.sport;

      // accensione card selezionata
      document.querySelectorAll(".card-sport").forEach(x => x.classList.remove("active"));
      c.classList.add("active");

      renderFiltri();
      goTo("view-filtri");
    });
  });

  // GENERE
  document.getElementById("genere").addEventListener("click", e => {
    if (e.target.dataset.genere) {
      state.genere = e.target.dataset.genere;
      document.querySelectorAll("#genere button").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
    }
  });

  // REGIONI
  document.getElementById("regioni").addEventListener("click", e => {
    if (e.target.dataset.regione) {
      state.regione = e.target.dataset.regione;
      document.querySelectorAll("#regioni button").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
    }
  });

  // CAMPIONATI (dopo click accende e va all’elenco)
  document.getElementById("campionati").addEventListener("click", e => {
    if (e.target.dataset.campionato) {
      state.campionato = e.target.dataset.campionato;
      document.querySelectorAll("#campionati button").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      goTo("view-societa-list");
    }
  });

  // ELENCO → DETTAGLIO
  document.querySelector(".societa-container").addEventListener("click", e => {
    const nome = e.target.dataset.societa;
    if (nome) {
      state.societaSelezionata = societa.find(s => s.nome === nome);
      goTo("view-societa-detail");
    }
  });

  // INDIETRO
  document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      goTo(btn.dataset.go);
      // quando torniamo indietro manteniamo l’accensione coerente
      syncSelectionsUI();
    });
  });
});

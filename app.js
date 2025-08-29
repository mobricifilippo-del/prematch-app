const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
  societaSelezionata: null
};

// MOCK DATABASE
const dbSocieta = [
  { nome: "ASD Roma Nord", sigla: "RN", sport: "calcio", genere: "Femminile", regione: "Lazio", campionato: "Eccellenza" },
  { nome: "Virtus Marino", sigla: "VM", sport: "calcio", genere: "Femminile", regione: "Lazio", campionato: "Eccellenza" },
  { nome: "Milano Basket", sigla: "MB", sport: "basket", genere: "Maschile", regione: "Lombardia", campionato: "Serie A" }
];

function goTo(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  document.getElementById(viewId).classList.remove("hidden");

  switch (viewId) {
    case "view-societa-list": {
      const cont = document.querySelector("#view-societa-list .societa-container");
      const titolo = document.getElementById("titolo-elenco");
      if (titolo) {
        const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
        titolo.textContent = `${cap(state.sport)} • ${cap(state.genere)} • ${state.regione} • ${state.campionato}`;
      }
      renderSocietaList(cont, getSocietaFiltrate({
        sport: state.sport,
        genere: state.genere,
        regione: state.regione,
        campionato: state.campionato
      }));
      window.scrollTo(0,0);
      break;
    }
    case "view-societa-detail": {
      const cont = document.getElementById("societa-detail");
      renderSocietaDetail(cont, state.societaSelezionata);
      window.scrollTo(0,0);
      break;
    }
  }
}

function getSocietaFiltrate({ sport, genere, regione, campionato }) {
  return dbSocieta.filter(s =>
    (!sport || s.sport === sport) &&
    (!genere || s.genere === genere) &&
    (!regione || s.regione === regione) &&
    (!campionato || s.campionato === campionato)
  ).sort((a, b) => a.nome.localeCompare(b.nome));
}

function renderSocietaList(container, lista) {
  container.innerHTML = "";
  if (lista.length === 0) {
    container.innerHTML = "<p>Nessuna società trovata.</p>";
    return;
  }
  lista.forEach(s => {
    const card = document.createElement("div");
    card.className = "societa-card";
    card.innerHTML = `
      <div class="logo-cerchio">${s.sigla}</div>
      <div class="societa-info">
        <h3><a href="#" class="societa-link">${s.nome}</a></h3>
        <p>${s.campionato} • ${s.genere} • ${s.regione}</p>
      </div>
      <div class="badge-pm">PM</div>
    `;
    card.querySelector(".societa-link").addEventListener("click", e => {
      e.preventDefault();
      state.societaSelezionata = s;
      goTo("view-societa-detail");
    });
    container.appendChild(card);
  });
}

function renderSocietaDetail(container, s) {
  if (!s) return;
  container.innerHTML = `
    <div class="societa-card">
      <div class="logo-cerchio">${s.sigla}</div>
      <div class="societa-info">
        <h2>${s.nome}</h2>
        <p>${s.campionato} • ${s.genere} • ${s.regione}</p>
      </div>
      <div class="badge-pm">PM</div>
    </div>
    <div class="chips">
      <button class="chip">Informazioni</button>
      <button class="chip">Galleria foto</button>
      <button class="chip">Match in programma</button>
    </div>
  `;
}

// EVENTI
document.addEventListener("click", e => {
  // Sport
  const sportCard = e.target.closest(".card-sport");
  if (sportCard) {
    state.sport = sportCard.dataset.sport;
    goTo("view-filtri");
  }

  // Genere
  const g = e.target.closest("[data-genere]");
  if (g) {
    state.genere = g.dataset.genere;
  }

  // Regione
  const r = e.target.closest("[data-regione]");
  if (r) {
    state.regione = r.dataset.regione;
  }

  // Campionato
  const c = e.target.closest("[data-campionato]");
  if (c) {
    state.campionato = c.dataset.campionato;
    goTo("view-societa-list");
  }

  // Back
  if (e.target.classList.contains("btn-back")) {
    history.back();
  }
});

// GESTIONE BACK NATIVE
window.addEventListener("popstate", () => {
  // per semplicità torno sempre a home
  goTo("view-home");
});

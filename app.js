(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Stato dell'app
  const state = {
    sport: null,
    genere: null,
    regione: null,
    campionato: null,
    societa: [] // popolata quando si entra in lista
  };

  // Dati demo per la lista (basta per vedere il flusso)
  const DB = {
    calcio: {
      "Lazio": {
        "Eccellenza": [
          { id: "roma-nord", nome: "ASD Roma Nord", sigla: "RN" },
          { id: "virtus-marino", nome: "Virtus Marino", sigla: "VM" }
        ],
        "Promozione": [{ id: "ostia-2000", nome: "Ostia 2000", sigla: "OS" }],
        "Juniores": [{ id: "torpignattara", nome: "Torpignattara", sigla: "TP" }]
      }
    },
    basket: {},
    futsal: {},
    volley: {},
    rugby: {},
    pallanuoto: {}
  };

  /* --------- helpers --------- */
  function showSection(id) {
    $$("#app .section").forEach(s => s.classList.add("hidden"));
    $("#" + id).classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function setActive(containerSel, item) {
    $$(containerSel + " .active").forEach(x => x.classList.remove("active"));
    if (item) item.classList.add("active");
  }

  function breadcrumb() {
    const parts = [state.sport, state.genere, state.regione, state.campionato]
      .filter(Boolean)
      .map(x => capitalize(x));
    $("#breadcrumb").textContent = parts.join(" • ");
  }

  function capitalize(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* --------- rendering --------- */
  function renderSocietaList() {
    const box = $("#elencoSocieta");
    box.innerHTML = "";

    const sport = state.sport;
    const reg = state.regione;
    const camp = state.campionato;

    const arr =
      DB[sport] &&
      DB[sport][reg] &&
      DB[sport][reg][camp]
        ? DB[sport][reg][camp].slice().sort((a, b) => a.nome.localeCompare(b.nome))
        : [];

    state.societa = arr;

    if (!arr.length) {
      box.innerHTML = `<div class="soc-sub">Nessuna società trovata.</div>`;
      return;
    }

    arr.forEach(s => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "soc-card";
      card.setAttribute("data-societa-id", s.id);
      card.innerHTML = `
        <div class="badge">${s.sigla || s.nome.substring(0,2).toUpperCase()}</div>
        <div class="soc-info">
          <p class="soc-title">${s.nome}</p>
          <p class="soc-sub">${state.campionato} • ${state.genere} • ${state.regione}</p>
        </div>
      `;
      box.appendChild(card);
    });
  }

  function renderSocietaDetail(id) {
    const s = state.societa.find(x => x.id === id);
    const box = $("#schedaSocieta");
    if (!s) {
      box.innerHTML = `<p>Società non trovata.</p>`;
      return;
    }
    box.innerHTML = `
      <div class="profile-head">
        <div class="profile-badge">${s.sigla || s.nome.substring(0,2).toUpperCase()}</div>
        <div>
          <h2 class="profile-title">${s.nome}</h2>
          <p class="profile-meta">${state.campionato} • ${state.genere} • ${state.regione}</p>
        </div>
      </div>
    `;
  }

  /* --------- eventi --------- */
  document.addEventListener("click", (e) => {
    // 1) SPORT
    const sportCard = e.target.closest(".card-sport");
    if (sportCard) {
      e.preventDefault();
      state.sport = sportCard.dataset.sport;
      setActive("#sportGrid", sportCard);
      showSection("filtri");
      return;
    }

    // 2) GENERE
    const g = e.target.closest("[data-genere]");
    if (g) {
      e.preventDefault();
      state.genere = g.dataset.genere;
      setActive("#filtri", g);
      return;
    }

    // 3) REGIONE
    const r = e.target.closest("[data-regione]");
    if (r) {
      e.preventDefault();
      state.regione = r.dataset.regione;
      setActive("#regioni", r);
      return;
    }

    // 4) CAMPIONATO → vai a lista se tutto selezionato
    const c = e.target.closest("[data-campionato]");
    if (c) {
      e.preventDefault();
      state.campionato = c.dataset.campionato;
      setActive("#campionati", c);

      if (state.sport && state.genere && state.regione && state.campionato) {
        breadcrumb();
        renderSocietaList();
        showSection("societa-list");
      }
      return;
    }

    // 5) BACK
    const back = e.target.closest("[data-back]");
    if (back) {
      e.preventDefault();
      showSection(back.dataset.back);
      return;
    }

    // 6) SOCIETÀ -> dettaglio
    const soc = e.target.closest("[data-societa-id]");
    if (soc) {
      e.preventDefault();
      const id = soc.dataset.societaId;
      renderSocietaDetail(id);
      showSection("societa-detail");
      return;
    }
  });

  /* --------- bootstrap --------- */
  // Mostra home all'avvio
  showSection("home");
})();

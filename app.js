/* ===========================
   PreMatch – app.js (completo)
   =========================== */
(() => {
  // Stato minimale di navigazione
  const state = {
    sport: null,
    genere: null,
    regione: null,
    campionato: null,
  };

  // Dati demo
  const REGIONI = ["Lazio", "Lombardia", "Piemonte", "Veneto", "Sicilia", "Emilia-Romagna"];
  const CAMPIONATI = ["Eccellenza", "Promozione", "Prima Categoria"];

  // Società demo indicizzate per (regione -> campionato -> elenco)
  const SOCIETA = {
    "Lazio": {
      "Eccellenza": [
        { id: "roma-nord", nome: "ASD Roma Nord" },
        { id: "virtus-marino", nome: "Virtus Marino" },
      ],
      "Promozione": [
        { id: "aurora-tivoli", nome: "Aurora Tivoli" }
      ]
    },
    "Lombardia": {
      "Eccellenza": [{ id: "polis-milano", nome: "Polis Milano" }]
    }
  };

  // Contenitore principale (riuso la stessa section)
  const view = document.getElementById("view-sport");

  /* ---------- Helpers UI ---------- */

  const h = (html) => html.trim();

  const chip = (label, opts = {}) =>
    `<button class="chip${opts.variant === "ghost" ? " ghost" : ""}" data-val="${opts.value ?? label}">${label}</button>`;

  const header = (titolo, sottotitolo = "") => `
    <h2>${titolo}</h2>
    ${sottotitolo ? `<p>${sottotitolo}</p>` : ""}
  `;

  const chipsRow = (items, getLabel = (x) => x, dataKey = "val") => `
    <div class="chips">
      ${items.map(x => `<button class="chip" data-${dataKey}="${x}">${getLabel(x)}</button>`).join("")}
    </div>
  `;

  const backRow = (on = true) =>
    on ? `<div class="footer-row"><button class="chip ghost" id="btn-back">Indietro</button></div>` : "";

  const attachBack = (handler) => {
    const b = document.getElementById("btn-back");
    if (b) b.addEventListener("click", handler, { passive: true });
  };

  /* ---------- Render step ---------- */

  function renderSportView() {
    // NON rigenero la griglia: è già nell’HTML. Devo solo riattaccare gli handler.
    view.querySelectorAll(".card-sport").forEach(card => {
      card.addEventListener("click", () => {
        // luce/contorno
        card.classList.add("selected");
        const chosen = card.dataset.sport;
        state.sport = chosen;
        // piccolo delay per far vedere l’effetto
        setTimeout(() => renderGenereView(), 140);
      }, { passive: true });
    });
  }

  function renderGenereView() {
    view.innerHTML = h(`
      ${header("Seleziona il genere")}
      <div class="chips">
        ${chip("Maschile", { value: "Maschile" })}
        ${chip("Femminile", { value: "Femminile" })}
      </div>
      ${backRow(true)}
    `);

    view.querySelectorAll(".chip").forEach(btn => {
      if (btn.id === "btn-back") return;
      btn.addEventListener("click", () => {
        state.genere = btn.dataset.val;
        renderRegioneView();
      }, { passive: true });
    });

    attachBack(() => {
      // Torno alla home sport ricostruendo la griglia originale dall’HTML di index
      location.reload(); // soluzione semplice: ricarico la pagina e riparto dalla home
    });
  }

  function renderRegioneView() {
    // Scelta compatta (a chips). Al tocco vado subito ai campionati
    view.innerHTML = h(`
      ${header("Seleziona la regione")}
      ${chipsRow(REGIONI)}
      ${backRow(true)}
    `);

    view.querySelectorAll(".chip").forEach(btn => {
      if (btn.id === "btn-back") return;
      btn.addEventListener("click", () => {
        state.regione = btn.getAttribute("data-val");
        renderCampionatoView();
      }, { passive: true });
    });

    attachBack(() => renderGenereView());
  }

  function renderCampionatoView() {
    view.innerHTML = h(`
      ${header("Seleziona il campionato")}
      ${chipsRow(CAMPIONATI)}
      ${backRow(true)}
    `);

    view.querySelectorAll(".chip").forEach(btn => {
      if (btn.id === "btn-back") return;
      btn.addEventListener("click", () => {
        state.campionato = btn.getAttribute("data-val");
        renderSocietaView();
      }, { passive: true });
    });

    attachBack(() => renderRegioneView());
  }

  function renderSocietaView() {
    const { regione, campionato } = state;
    const elenco = (SOCIETA[regione] && SOCIETA[regione][campionato]) || [];

    view.innerHTML = h(`
      ${header("Scegli la società", `${campionato} • ${state.genere} • ${regione}`)}
      <div class="list">
        ${elenco.length
          ? elenco.map(s => `
              <div class="list-item" data-id="${s.id}">
                <div class="avatar">${s.nome.split(" ").map(w => w[0]).join("").slice(0,2)}</div>
                <div class="title">${s.nome}</div>
                <div class="subtitle">Società • ${regione}</div>
              </div>
            `).join("")
          : `<div class="empty">Nessuna società trovata per questa combinazione.</div>`
        }
      </div>
      ${backRow(true)}
    `);

    // (Facoltativo) click su società — qui potresti aprire la pagina società
    view.querySelectorAll(".list-item").forEach(li => {
      li.addEventListener("click", () => {
        // Placeholder: al momento mostro solo un messaggio; qui poi collegheremo la pagina società
        const nome = li.querySelector(".title").textContent;
        alert(`Apro la pagina società:\n${nome}`);
      }, { passive: true });
    });

    attachBack(() => renderCampionatoView());
  }

  /* ---------- Bootstrap ---------- */

  // 1) se siamo nella home (griglia già presente), attacco gli handler
  if (view) {
    renderSportView();
  }
})();

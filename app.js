/* ===========================
   PreMatch — app.js (COMPLETO)
   =========================== */

(() => {
  // ---- Stato dell'app (scelte dell'utente)
  const state = {
    sport: null,
    genere: null,
    regione: null,
    campionato: null,
  };

  // ---- Dati demo (società) – usa ciò che già avevi
  const SOCIETA = [
    {
      id: "roma-nord",
      nome: "ASD Roma Nord",
      sport: "calcio",
      genere: "femminile",
      regione: "Lazio",
      campionato: "Eccellenza",
    },
    {
      id: "virtus-marino",
      nome: "Virtus Marino",
      sport: "calcio",
      genere: "femminile",
      regione: "Lazio",
      campionato: "Eccellenza",
    },
  ];

  // ---- Utility
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const show = (id) => {
    // Mostra la view richiesta e nasconde le altre (SPA semplice)
    $$(".view").forEach(v => v.classList.add("hidden"));
    const target = typeof id === "string" ? $(`#${id}`) : id;
    if (target) target.classList.remove("hidden");
    // aggiornamento breadcrumb / sottotitolo se presente
    renderScelteCorrenti();
  };

  const setSelected = (nodeList, value, attr="data-value") => {
    nodeList.forEach(el => {
      if (el.getAttribute(attr) === value) el.classList.add("selected");
      else el.classList.remove("selected");
    });
  };

  // ---- Rendering chip con scelte correnti (se esiste #scelteCorrenti)
  function renderScelteCorrenti() {
    const box = $("#scelteCorrenti");
    if (!box) return;
    const parts = [];
    if (state.sport) parts.push(cap(state.sport));
    if (state.genere) parts.push(cap(state.genere));
    if (state.regione) parts.push(state.regione);
    if (state.campionato) parts.push(state.campionato);
    box.textContent = parts.join(" • ");
    box.style.display = parts.length ? "block" : "none";
  }

  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  // ---- STEP 1: Home → scelta sport
  function bindSportCards() {
    const cards = $$(".card-sport");
    if (!cards.length) return;

    // Delegato: safe anche se in futuro ricarichi le card
    const container = cards[0].parentElement;
    container.addEventListener("click", (e) => {
      const card = e.target.closest(".card-sport");
      if (!card) return;

      const sport = (card.dataset.sport || "").toLowerCase();
      if (!sport) return;

      // Effetto “accensione”
      cards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      // Salva stato e vai alla pagina filtri
      state.sport = sport;
      state.genere = null;
      state.regione = null;
      state.campionato = null;

      // piccola pausa per far vedere l'accensione
      setTimeout(() => show("view-filtri"), 120);
    }, { passive: true });
  }

  // ---- STEP 2: Filtri (genere → regione → campionato)
  function bindFiltri() {
    // GENERE
    const genereBtns = $$(".btn-genere");
    genereBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        state.genere = (btn.dataset.genere || "").toLowerCase();
        setSelected(genereBtns, btn.dataset.genere, "data-genere");

        // apre la sezione Regione
        const det = $("#det-regione");
        if (det) det.open = true;
        renderScelteCorrenti();
      }, { passive: true });
    });

    // REGIONE
    const regioneBtns = $$(".btn-regione");
    regioneBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        state.regione = btn.dataset.regione;
        setSelected(regioneBtns, btn.dataset.regione, "data-regione");

        // reset campionato e apri la sezione Campionato
        state.campionato = null;
        const det = $("#det-campionato");
        if (det) det.open = true;
        renderScelteCorrenti();
      }, { passive: true });
    });

    // CAMPIONATO
    const campBtns = $$(".btn-campionato");
    campBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        state.campionato = btn.dataset.campionato;
        setSelected(campBtns, btn.dataset.campionato, "data-campionato");
        renderScelteCorrenti();

        // Se tutto scelto → mostra lista società
        goSocietaList();
      }, { passive: true });
    });

    // Pulsante indietro nella pagina filtri (se presente)
    const back = $("#back-filtri");
    if (back) {
      back.addEventListener("click", () => {
        show("view-home");
      }, { passive: true });
    }
  }

  // ---- STEP 3: Lista società
  function goSocietaList() {
    // filtro semplice sui dati
    const list = SOCIETA.filter(s =>
      (!state.sport || s.sport === state.sport) &&
      (!state.genere || s.genere === state.genere) &&
      (!state.regione || s.regione === state.regione) &&
      (!state.campionato || s.campionato === state.campionato)
    );

    const ul = $("#societaList");
    if (ul) {
      ul.innerHTML = "";
      if (!list.length) {
        ul.innerHTML = `<li class="empty">Nessuna società trovata.</li>`;
      } else {
        list.forEach(s => {
          const li = document.createElement("li");
          li.className = "soc-card";
          li.setAttribute("data-id", s.id);
          li.innerHTML = `
            <div class="soc-card__left">
              <div class="soc-logo ph"></div>
              <div class="soc-card__text">
                <div class="soc-name">${s.nome}</div>
                <div class="soc-meta">${s.campionato} • ${cap(s.genere)} • ${s.regione}</div>
              </div>
            </div>
            <button class="btn btn-ghost action-pm" aria-label="PreMatch" data-id="${s.id}">
              <span class="pm-pill">PM</span>
              <span class="pm-text">PreMatch</span>
            </button>
          `;
          ul.appendChild(li);
        });
      }

      // click sulla riga o sul bottone “PreMatch”
      ul.addEventListener("click", (e) => {
        const row = e.target.closest(".soc-card");
        const btn = e.target.closest(".action-pm");
        if (btn) {
          const id = btn.dataset.id;
          openSocieta(id);
          return;
        }
        if (row) {
          const id = row.dataset.id;
          openSocieta(id);
        }
      }, { once: true, passive: true }); // once: rebind a ogni render
    }

    show("view-societa-list");
  }

  // ---- Dettaglio società (solo demo – apre pagina se esiste)
  function openSocieta(id) {
    const s = SOCIETA.find(x => x.id === id);
    const box = $("#societaDettaglio");
    if (!box || !s) return;

    box.innerHTML = `
      <div class="soc-header">
        <div class="soc-logo lg ph"></div>
        <div>
          <h2 class="soc-title">${s.nome}</h2>
          <div class="soc-meta">${s.campionato} • ${cap(s.genere)} • ${s.regione}</div>
        </div>
      </div>
      <div class="soc-actions">
        <button class="btn">Informazioni</button>
        <button class="btn">Galleria foto</button>
        <button class="btn">Match in programma</button>
      </div>
    `;

    const back = $("#back-societa");
    if (back) {
      back.onclick = () => show("view-societa-list");
    }

    show("view-societa");
  }

  // ---- Navbar logo click (se presente) → torna alla home
  function bindLogoHome() {
    const logo = $("#logoHome, .brand-home");
    // supporta sia id che classe (prende il primo che trova)
    const el = $("#logoHome") || $(".brand-home");
    if (el) el.addEventListener("click", () => show("view-home"), { passive: true });
  }

  // ---- Inizializzazione
  document.addEventListener("DOMContentLoaded", () => {
    bindLogoHome();
    bindSportCards();
    bindFiltri();

    // Mostra la home all'avvio
    show("view-home");
  });
})();

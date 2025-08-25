// ===== Demo data per il flusso (offline, niente backend) =====
const DATA = {
  sports: [
    { key: "calcio",     name: "Calcio",     img: "./images/calcio.jpg" },
    { key: "futsal",     name: "Futsal",     img: "./images/futsal.jpg" },
    { key: "basket",     name: "Basket",     img: "./images/basket.jpg" },
    { key: "volley",     name: "Volley",     img: "./images/volley.jpg" },
    { key: "rugby",      name: "Rugby",      img: "./images/rugby.jpg" },
    { key: "pallanuoto", name: "Pallanuoto", img: "./images/pallanuoto.jpg" },
  ],
  regions: [
    "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna",
    "Friuli-Venezia Giulia","Lazio","Liguria","Lombardia","Marche",
    "Molise","Piemonte","Puglia","Sardegna","Sicilia",
    "Toscana","Trentino-Alto Adige","Umbria","Valle d'Aosta","Veneto"
  ],
  leaguesByRegion: {
    Lazio: ["Serie A", "Eccellenza", "Promozione", "Scuola Calcio"],
    Lombardia: ["Serie C Silver", "Serie D", "Giovanili"],
    Sicilia: ["Serie C", "Promozione"],
    Piemonte: ["Eccellenza"],
    Veneto: ["Serie B Interregionale"],
    "Emilia-Romagna": ["Promozione"]
  },
  clubsByLeague: {
    "Serie A": ["AS Roma", "SSD Milano"],
    Eccellenza: ["ASD Roma Nord", "Sporting Tuscolano"],
    Promozione: ["Virtus Marino", "Borghesiana FC"],
    "Scuola Calcio": ["Accademia Junior"],
    "Serie C Silver": ["Brixia Basket", "Gorla Team"],
    "Serie D": ["Lario Basket"],
    "Giovanili": ["Bergamo U17"],
    "Serie C": ["Siracusa Calcio"],
    "Serie B Interregionale": ["Treviso Volley"]
  },
  matchesMock: [
    { home: "Prima Squadra", away: "—", when: "31/08/2025 14:07", where: "Roma — Stadio Olimpico" },
    { home: "Juniores",      away: "—", when: "01/09/2025 18:30", where: "Roma — Campo Test" }
  ]
};

// ===== Stato semplice =====
const state = { sport:null, region:null, league:null, club:null };

// ===== App root =====
const app = document.getElementById("app");

// ===== Helper =====
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k === "onclick") el.addEventListener("click", v);
    else if (k === "onerror") el.onerror = v;
    else el.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return el;
}
function clearMain(){ app.innerHTML = ""; }
function sectionTitle(title, subtitle){
  return h("div", {class:"container"}, [
    h("div", {class:"h1"}, title),
    h("div", {class:"sub"}, subtitle || "")
  ]);
}

// ===== Pagine =====
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare il percorso"));

  const grid = h("div", {class:"container grid"});
  DATA.sports.forEach(s => {
    const card = h("div", {
      class:"card",
      onclick: () => { state.sport = s.key; state.region = state.league = state.club = null; pageRegions(); }
    }, [
      h("img", {src:s.img, alt:s.name, onerror:function(){this.style.display="none";}}),
      h("div", {class:"title"}, s.name)
    ]);
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione",""));

  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  DATA.regions.forEach(r => {
    const chip = h("div", {
      class:"chip"+(state.region===r ? " active":""),
      onclick: () => {
        state.region = r;
        [...chips.children].forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        btnNext.disabled = false;
      }
    }, r);
    chips.appendChild(chip);
  });

  const btnBack = h("button", {class:"btn", onclick: () => pageSports()}, "Indietro");
  const btnNext = h("button", {class:"btn primary", disabled:true, onclick: () => pageLeagues()}, "Avanti");
  const actions = h("div", {class:"actions"}, [btnBack, btnNext]);

  box.appendChild(chips);
  box.appendChild(actions);
  app.appendChild(box);
}

function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il campionato", state.region || ""));

  const leagues = DATA.leaguesByRegion[state.region] || [];
  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  leagues.forEach(l => {
    const chip = h("div", {
      class:"chip"+(state.league===l ? " active":""),
      onclick: () => {
        state.league = l;
        [...chips.children].forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
        btnNext.disabled = false;
      }
    }, l);
    chips.appendChild(chip);
  });

  const btnBack = h("button", {class:"btn", onclick: () => pageRegions()}, "Indietro");
  const btnNext = h("button", {class:"btn primary", disabled:true, onclick: () => pageClubs()}, "Avanti");
  const actions = h("div", {class:"actions"}, [btnBack, btnNext]);

  box.appendChild(chips);
  box.appendChild(actions);
  app.appendChild(box);
}

function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la società", state.league || ""));

  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  clubs.forEach(c => {
    const chip = h("div", {
      class:"chip"+(state.club===c ? " active":""),
      onclick: () => {
        state.club = c;
        [...chips.children].forEach(x=>x.classList.remove("active"));
        chip.classList.add("active");
        btnNext.disabled = false;
      }
    }, c);
    chips.appendChild(chip);
  });

  const btnBack = h("button", {class:"btn", onclick: () => pageLeagues()}, "Indietro");
  const btnNext = h("button", {class:"btn primary", disabled:true, onclick: () => pageMatches()}, "Avanti");
  const actions = h("div", {class:"actions"}, [btnBack, btnNext]);

  box.appendChild(chips);
  box.appendChild(actions);
  app.appendChild(box);
}

function pageMatches(){
  clearMain();
  app.appendChild(sectionTitle(
    "Prossime partite",
    `${state.club} — ${state.league} — ${state.region}`
  ));

  const box = h("div", {class:"container panel"});
  DATA.matchesMock.forEach(m => {
    box.appendChild(
      h("div", {class:"row"}, [
        h("div", {class:"team"}, `${m.home} vs ${m.away}`),
        h("div", {class:"meta"}, `${m.when} — ${m.where}`)
      ])
    );
  });

  // Pulsante demo "Crea PreMatch" (placeholder)
  const createBtn = h("button", {
    class:"btn primary",
    onclick: () => alert("Demo: qui si aprirà il flusso Crea PreMatch con scelta colori e PDF.")
  }, "Crea PreMatch");

  const btnBack = h("button", {class:"btn", onclick: () => pageClubs()}, "Indietro");
  const btnHome = h("button", {class:"btn", onclick: () => pageSports()}, "Nuovo percorso");
  const actions = h("div", {class:"actions"}, [createBtn, btnBack, btnHome]);

  app.appendChild(box);
  app.appendChild(h("div", {class:"container"}, actions));
}

// Avvio
pageSports();

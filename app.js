// ======= DATI MOCK (bastano per test del flusso) =======
const DATA = {
  sports: [
    { key: "calcio",     name: "Calcio",     img: "./images/calcio.jpg" },
    { key: "futsal",     name: "Futsal",     img: "./images/futsal.jpg" },
    { key: "basket",     name: "Basket",     img: "./images/basket.jpg" },
    { key: "volley",     name: "Volley",     img: "./images/volley.jpg" },
    { key: "rugby",      name: "Rugby",      img: "./images/rugby.jpg" },
    { key: "pallanuoto", name: "Pallanuoto", img: "./images/pallanuoto.jpg" },
  ],

  regions: ["Lazio", "Lombardia", "Sicilia", "Piemonte", "Veneto", "Emilia-Romagna"],

  // Agonistica per Calcio (esempio, maschile/femminile)
  leaguesAgonistica: {
    calcio: {
      maschile:      ["Serie D", "Eccellenza", "Promozione", "Prima Categoria"],
      femminile:     ["Serie A", "Serie B", "Eccellenza Femminile"],
      entrambi:      ["Serie D", "Eccellenza", "Promozione", "Prima Categoria", "Serie A", "Serie B", "Eccellenza Femminile"]
    },
    futsal: {
      maschile:  ["Serie B", "C1", "C2"],
      femminile: ["A2 Femminile", "C Femminile"],
      entrambi:  ["Serie B", "C1", "C2", "A2 Femminile", "C Femminile"]
    },
    basket: {
      maschile:  ["Serie C", "Promozione"],
      femminile: ["Serie B Femminile", "Serie C Femminile"],
      entrambi:  ["Serie C", "Promozione", "Serie B Femminile", "Serie C Femminile"]
    },
    volley: {
      maschile:  ["Serie C", "Serie D"],
      femminile: ["Serie B2", "Serie C"],
      entrambi:  ["Serie C", "Serie D", "Serie B2"]
    },
    rugby: {
      maschile:  ["Serie B", "Serie C"],
      femminile: ["Serie A Femminile"],
      entrambi:  ["Serie B", "Serie C", "Serie A Femminile"]
    },
    pallanuoto: {
      maschile:  ["Serie B", "Serie C"],
      femminile: ["A2 Femminile"],
      entrambi:  ["Serie B", "Serie C", "A2 Femminile"]
    }
  },

  // Scuola Calcio (esempio) — solo per sport = calcio
  scuolaCalcio: ["Primi Calci", "Pulcini", "Esordienti", "Giovanissimi"],

  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino", "Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Serie D": ["Latina Calcio", "Cassino"],
    "Serie A": ["Roma Women", "Juventus Women"],
    "Serie B": ["Lazio Women", "Ternana Women"],
    "Eccellenza Femminile": ["Trastevere Femminile", "Grifone Gialloverde"],
    "Primi Calci": ["Baby Soccer Roma", "Calcio Academy"],
    "Pulcini": ["ASD Talenti", "Sporting Kids"],
    "Esordienti": ["Roma Est Calcio", "Blue Team"],
    "Giovanissimi": ["San Paolo Ostiense", "Eur Sporting"],
    // altri esempi per altri sport
    "Serie C": ["Brixia Basket", "Treviso Volley"],
    "Promozione Basket": ["Lario Basket"],
    "Serie B Interregionale": ["Treviso Volley"],
    "C1": ["Futsal Roma", "Futsal Latina"],
    "C2": ["Tivoli Futsal", "Ardea Five"],
    "A2 Femminile": ["Futsal Elite", "Città di Velletri"],
    "C Femminile": ["Sporting Woman", "Lady Five"]
  },

  matchesMock: [
    { home: "Prima Squadra", away: "—", when: "31/08/2025 14:07", where: "Roma – Stadio Olimpico" },
    { home: "Juniores",      away: "—", when: "01/09/2025 18:30", where: "Roma – Campo Test" },
  ],
};

// ======= STATO SEMPLICE =======
const state = {
  sport: null,
  gender: null,      // "maschile" | "femminile" | "entrambi"
  region: null,
  compType: null,    // "agonistica" | "scuola"
  league: null,
  club: null
};

const app = document.getElementById("app");

// ======= HELPERS =======
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k === "onclick") el.addEventListener("click", v);
    else if (k === "onerror") el.onerror = v;
    else el.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    if (typeof c === "string") el.appendChild(document.createTextNode(c));
    else el.appendChild(c);
  });
  return el;
}
function clearMain(){ app.innerHTML = ""; }
function sectionTitle(title, subtitle){
  return h("div", {class:"container"}, [
    h("div", {class:"h1"}, title),
    h("div", {class:"sub"}, subtitle || ""),
  ]);
}

// ======= PAGINE =======
function pageSports(){
  Object.assign(state, { sport:null, gender:null, region:null, compType:null, league:null, club:null });
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare il percorso"));

  const grid = h("div", {class:"container grid"});
  DATA.sports.forEach(s => {
    const card = h("div", {class:"card", onclick: () => { state.sport = s.key; pageGender(); }}, [
      h("img", {src: s.img, alt: s.name, onerror: function(){ this.style.display="none"; }}),
      h("div", {class:"title"}, s.name),
    ]);
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il genere","Maschile, Femminile oppure Entrambi"));

  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});

  ["Maschile", "Femminile", "Entrambi"].forEach(g => {
    const key = g.toLowerCase();
    const chip = h("div", {
      class: "chip" + (state.gender===key ? " active": ""),
      onclick: () => {
        state.gender = key;
        [...chips.children].forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
      },
    }, g);
    chips.appendChild(chip);
  });

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageSports()}, "Indietro"),
    h("button", {class:"btn primary", onclick: () => pageRegions(), disabled:true}, "Avanti"),
  ]);

  box.appendChild(chips);
  box.appendChild(actions);
  app.appendChild(box);

  box.addEventListener("click", () => {
    box.querySelector(".btn.primary").disabled = !state.gender;
  }, {capture:true});
}

function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione",""));

  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});

  DATA.regions.forEach(r => {
    const chip = h("div", {
      class: "chip" + (state.region===r ? " active": ""),
      onclick: () => {
        state.region = r;
        [...chips.children].forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
      },
    }, r);
    chips.appendChild(chip);
  });

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageGender()}, "Indietro"),
    h("button", {class:"btn primary", onclick: () => pageCompType(), disabled:true}, "Avanti"),
  ]);

  box.appendChild(chips);
  box.appendChild(actions);
  app.appendChild(box);

  box.addEventListener("click", () => {
    box.querySelector(".btn.primary").disabled = !state.region;
  }, {capture:true});
}

function pageCompType(){
  clearMain();
  app.appendChild(sectionTitle("Tipo competizione", "Agonistica oppure Scuola Calcio"));

  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});

  const opts = (state.sport === "calcio")
    ? ["Agonistica", "Scuola Calcio"]
    : ["Agonistica"]; // per altri sport di solito niente “Scuola”

  opts.forEach(t => {
    const key = (t === "Agonistica") ? "agonistica" : "scuola";
    const chip = h("div", {
      class: "chip" + (state.compType===key ? " active": ""),
      onclick: () => {
        state.compType = key;
        [...chips.children].forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
      },
    }, t);
    chips.appendChild(chip);
  });

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageRegions()}, "Indietro"),
    h("button", {class:"btn primary", onclick: () => pageLeagues(), disabled:true}, "Avanti"),
  ]);

  box.appendChild(chips);
  box.appendChild(actions);
  app.appendChild(box);

  box.addEventListener("click", () => {
    box.querySelector(".btn.primary").disabled = !state.compType;
  }, {capture:true});
}

function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il campionato",
    `${capitalize(state.sport)} • ${capitalize(state.gender)} • ${state.region} • ${state.compType === 'agonistica' ? 'Agonistica' : 'Scuola Calcio'}`));

  let leagues = [];
  if (state.compType === "scuola" && state.sport === "calcio") {
    leagues = DATA.scuolaCalcio;
  } else {
    const perSport = DATA.leaguesAgonistica[state.sport] || {};
    leagues = perSport[state.gender] || perSport["entrambi"] || [];
  }

  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  leagues.forEach(l => {
    const chip = h("div", {
      class:"chip" + (state.league===l ? " active": ""),
      onclick: () => {
        state.league = l;
        [...chips.children].forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
      }
    }, l);
    chips.appendChild(chip);
  });

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageCompType()}, "Indietro"),
    h("button", {class:"btn primary", onclick: () => pageClubs(), disabled:true}, "Avanti"),
  ]);

  box.appendChild(chips);
  box.appendChild(actions);
  app.appendChild(box);

  box.addEventListener("click", () => {
    box.querySelector(".btn.primary").disabled = !state.league;
  }, {capture:true});
}

function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la società", state.league || ""));

  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  clubs.forEach(c => {
    const chip = h("div", {
      class:"chip" + (state.club===c ? " active": ""),
      onclick: () => {
        state.club = c;
        [...chips.children].forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
      }
    }, c);
    chips.appendChild(chip);
  });

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageLeagues()}, "Indietro"),
    h("button", {class:"btn primary", onclick: () => pageClubPage(), disabled:true}, "Apri pagina società"),
  ]);

  box.appendChild(chips);
  box.appendChild(actions);
  app.appendChild(box);

  box.addEventListener("click", () => {
    box.querySelector(".btn.primary").disabled = !state.club;
  }, {capture:true});
}

function pageClubPage(){
  clearMain();
  const title = `${state.club} — ${state.league} — ${state.region}`;
  app.appendChild(sectionTitle(title, `${capitalize(state.sport)} • ${capitalize(state.gender)} • ${state.compType==='agonistica'?'Agonistica':'Scuola Calcio'}`));

  const box = h("div", {class:"container panel"});

  // Dati sintetici società (mock)
  box.appendChild(h("div", {class:"row"}, [
    h("div", {class:"team"}, "Logo società"),
    h("div", {class:"meta"}, "caricabile dalla società")
  ]));
  box.appendChild(h("div", {class:"row"}, [
    h("div", {class:"team"}, "Contatti ufficiali"),
    h("div", {class:"meta"}, "email / telefono / referente")
  ]));
  box.appendChild(h("div", {class:"row"}, [
    h("div", {class:"team"}, "Impianto"),
    h("div", {class:"meta"}, "Indirizzo + mappa")
  ]));
  box.appendChild(h("div", {class:"row"}, [
    h("div", {class:"team"}, "Sponsor"),
    h("div", {class:"meta"}, "Hotel / Ristoranti / Trasporti")
  ]));

  // Prossime partite
  box.appendChild(h("div", {class:"group-title"}, "Prossime partite"));
  DATA.matchesMock.forEach(m => {
    box.appendChild(
      h("div", {class:"row"}, [
        h("div", {class:"team"}, `${m.home} vs ${m.away}`),
        h("div", {class:"meta"}, `${m.when} — ${m.where}`)
      ])
    );
  });

  // CTA Crea PreMatch (bottone verde con logo)
  const cta = h("button", {class:"cta-prematch", onclick: () => pageCreatePrematch()}, [
    h("img", {src:"./images/logo-light.png", alt:"PM", onerror:function(){this.style.display='none'}}),
    "Crea PreMatch"
  ]);

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageClubs()}, "Indietro"),
  ]);

  app.appendChild(box);
  app.appendChild(h("div", {class:"container"}, [cta, actions]));
}

function pageCreatePrematch(){
  clearMain();
  app.appendChild(sectionTitle("Crea PreMatch", `${state.club} — ${state.league} — ${state.region}`));

  const box = h("div", {class:"container panel"});

  // Scelta colori (semplificata con chip colore)
  box.appendChild(h("div", {class:"group-title"}, "Colori maglia (clicca per selezionare)"));
  const colors = ["#ffffff","#000000","#41d27b","#1e90ff","#ff5722","#ffd600","#8e44ad"];
  const rowColors = h("div", {class:"chips"});
  colors.forEach(col => {
    const chip = h("div", {class:"chip", style:`border-color:${col}; color:${col}`}, "●");
    chip.addEventListener("click", ()=> {
      [...rowColors.children].forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      chip.style.borderColor = col;
    });
    rowColors.appendChild(chip);
  });
  box.appendChild(rowColors);

  // Riepilogo
  box.appendChild(h("div", {class:"group-title"}, "Riepilogo"));
  box.appendChild(h("div", {class:"row"}, [
    h("div", {class:"team"}, "Società avversaria"),
    h("div", {class:"meta"}, state.club)
  ]));

  // Azioni
  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageClubPage()}, "Indietro"),
    h("button", {class:"btn primary", onclick: () => pagePrematchCreated()}, "Invia richiesta")
  ]);

  app.appendChild(box);
  app.appendChild(h("div", {class:"container"}, actions));
}

function pagePrematchCreated(){
  clearMain();
  app.appendChild(sectionTitle("Richiesta inviata ✅", "La società riceverà la conferma nell’app"));
  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageSports()}, "Nuovo percorso"),
  ]);
  app.appendChild(h("div", {class:"container"}, actions));
}

// Utils
function capitalize(s){ return (s||"").charAt(0).toUpperCase() + (s||"").slice(1); }

// Avvio
pageSports();

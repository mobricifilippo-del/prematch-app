/* ========== DATI DEMO (estendibili) ========== */
const DATA = {
  sports: [
    { key: "calcio",     name: "Calcio",     img: "./images/calcio.jpg" },
    { key: "futsal",     name: "Futsal",     img: "./images/futsal.jpg" },
    { key: "basket",     name: "Basket",     img: "./images/basket.jpg" },
    { key: "volley",     name: "Volley",     img: "./images/volley.jpg" },
    { key: "rugby",      name: "Rugby",      img: "./images/rugby.jpg" },
    { key: "pallanuoto", name: "Pallanuoto", img: "./images/pallanuoto.jpg" },
  ],
  genders: ["Maschile", "Femminile"],
  regions: [
    "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli-Venezia Giulia",
    "Lazio","Liguria","Lombardia","Marche","Molise","Piemonte","Puglia","Sardegna",
    "Sicilia","Toscana","Trentino-Alto Adige","Umbria","Valle d'Aosta","Veneto"
  ],
  // Campionati per sport e genere (includiamo Scuola Calcio)
  leaguesBySportGender: {
    calcio: {
      Maschile: [
        "Serie A", "Serie B", "Serie C", "Serie D", "Eccellenza", "Promozione",
        "Prima Categoria", "Seconda Categoria", "Terza Categoria", "Scuola Calcio"
      ],
      Femminile: [
        "Serie A Femminile", "Serie B Femminile", "Serie C Femminile",
        "Eccellenza Femminile", "Promozione Femminile", "Scuola Calcio"
      ]
    },
    futsal: {
      Maschile: ["Serie A", "Serie A2", "Serie B", "C1", "C2", "Scuola Calcio"],
      Femminile: ["Serie A", "Serie A2", "Serie B", "C", "Scuola Calcio"]
    },
    basket: {
      Maschile: ["Serie A", "Serie A2", "Serie B", "Serie C", "Promozione", "Under", "Minibasket"],
      Femminile: ["Serie A1", "Serie A2", "Serie B", "Serie C", "Under", "Minibasket"]
    },
    volley: {
      Maschile: ["SuperLega", "A2", "A3", "B", "C", "D", "Giovanili"],
      Femminile: ["A1", "A2", "B1", "B2", "C", "D", "Giovanili"]
    },
    rugby: {
      Maschile: ["Top10", "Serie A", "Serie B", "Serie C", "U18", "U16", "Mini Rugby"],
      Femminile: ["Serie A", "Serie A2", "U18", "U16", "Mini Rugby"]
    },
    pallanuoto: {
      Maschile: ["Serie A1", "Serie A2", "Serie B", "Serie C", "Under", "Propaganda"],
      Femminile: ["Serie A1", "Serie A2", "Serie B", "Under", "Propaganda"]
    }
  },
  // Mock società per campionato (dimostrativo)
  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino", "Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia", "Tor Tre Teste"],
    "Serie A Femminile": ["AS Roma Femminile", "SSD Milano Women"],
    "Scuola Calcio": ["Academy 2008", "Junior United"],
    "Serie A": ["Top Team", "City United"],
    "Serie B": ["North Club", "South Club"]
  },
  matchesMock: [
    { home: "Prima Squadra", away: "—", when: "31/08/2025 14:07", where: "Roma – Stadio Olimpico" },
    { home: "Juniores",      away: "—", when: "01/09/2025 18:30", where: "Roma – Campo Test" },
  ],
};

/* ========== STATO ========== */
const state = { sport:null, gender:null, region:null, league:null, club:null };

/* ========== ROOT ========== */
const app = document.getElementById("app");

/* ========== HELPERS ========== */
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k === "onclick") el.addEventListener("click", v);
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
function titleBlock(t, s){ return h("div",{class:"container"},[h("div",{class:"h1"},t), h("div",{class:"sub"},s||"")]); }
function backButton(fn){ return h("div",{class:"container actions"}, h("button",{class:"btn", onclick: fn},"← Indietro")); }

/* ========== PAGINE ========== */
function pageSports(){
  clearMain();
  app.appendChild(titleBlock("Scegli lo sport","Seleziona per iniziare il percorso"));

  const grid = h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    const card = h("div",{class:"card", onclick:()=>{
      // highlight
      [...grid.children].forEach(c=>c.classList.remove("selected"));
      card.classList.add("selected");
      // set stato e prosegui subito
      state.sport = s.key; state.gender=null; state.region=null; state.league=null; state.club=null;
      setTimeout(pageGender,120);
    }},[
      h("img",{src:s.img,alt:s.name}),
      h("div",{class:"title"},s.name),
    ]);
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(titleBlock("Seleziona il genere", pretty(state.sport)));

  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    const chip = h("div",{class:"chip"+(state.gender===g?" active":""), onclick:()=>{
      setActive(chips, chip);
      state.gender=g;
      setTimeout(pageRegions,100);
    }}, g);
    chips.appendChild(chip);
  });
  box.appendChild(chips);
  app.appendChild(box);
  app.appendChild(backButton(pageSports));
}

function pageRegions(){
  clearMain();
  app.appendChild(titleBlock("Scegli la regione", `${pretty(state.sport)} • ${state.gender}`));

  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});
  DATA.regions.forEach(r=>{
    const chip = h("div",{class:"chip"+(state.region===r?" active":""), onclick:()=>{
      setActive(chips, chip);
      state.region=r;
      setTimeout(pageLeagues,100);
    }}, r);
    chips.appendChild(chip);
  });
  box.appendChild(chips);
  app.appendChild(box);
  app.appendChild(backButton(pageGender));
}

function pageLeagues(){
  clearMain();
  app.appendChild(titleBlock("Scegli il campionato", `${state.gender} • ${state.region}`));

  const map = DATA.leaguesBySportGender[state.sport] || {};
  const leagues = map[state.gender] || [];
  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});
  leagues.forEach(l=>{
    const chip = h("div",{class:"chip"+(state.league===l?" active":""), onclick:()=>{
      setActive(chips, chip);
      state.league=l;
      setTimeout(pageClubs,100);
    }}, l);
    chips.appendChild(chip);
  });
  box.appendChild(chips);
  app.appendChild(box);
  app.appendChild(backButton(pageRegions));
}

function pageClubs(){
  clearMain();
  app.appendChild(titleBlock("Scegli la società", `${state.league} • ${state.region}`));

  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});
  clubs.forEach(c=>{
    const chip = h("div",{class:"chip"+(state.club===c?" active":""), onclick:()=>{
      setActive(chips, chip);
      state.club=c;
      setTimeout(pageClubDetail,120);
    }}, c);
    chips.appendChild(chip);
  });
  box.appendChild(chips);
  app.appendChild(box);
  app.appendChild(backButton(pageLeagues));
}

function pageClubDetail(){
  clearMain();
  app.appendChild(titleBlock(state.club, `${pretty(state.sport)} • ${state.gender} • ${state.league} • ${state.region}`));

  // Prossime partite
  const box = h("div",{class:"container panel"});
  DATA.matchesMock.forEach(m=>{
    box.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, `${m.home} vs ${m.away}`),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  app.appendChild(box);

  // CTA Crea PreMatch con logo
  const ctaWrap = h("div",{class:"container actions"},
    h("button",{class:"prematch-cta", onclick:()=>{
      alert(`Richiesta PreMatch inviata a ${state.club} (${state.league})`);
      // qui in futuro: apertura modale, scelta colori, data/ora, ecc.
    }},[
      h("img",{src:"./images/logo-icon.png", alt:"PM"}),
      "Crea PreMatch"
    ])
  );
  app.appendChild(ctaWrap);

  app.appendChild(backButton(pageClubs));
}

/* ========== UTILI ========== */
function setActive(container, el){
  [...container.children].forEach(c=>c.classList.remove("active"));
  el.classList.add("active");
}
function pretty(s){ return (s||"").charAt(0).toUpperCase()+ (s||"").slice(1); }

/* Avvio */
pageSports();

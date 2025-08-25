/* ======== DATI DEMO ========= */

// Sport
const SPORTS = [
  { key:"calcio",     name:"Calcio",     img:"./images/calcio.jpg" },
  { key:"futsal",     name:"Futsal",     img:"./images/futsal.jpg" },
  { key:"basket",     name:"Basket",     img:"./images/basket.jpg" },
  { key:"volley",     name:"Volley",     img:"./images/volley.jpg" },
  { key:"beachvolley",name:"Beach Volley", img:"./images/beachvolley.jpg" },
  { key:"rugby",      name:"Rugby",      img:"./images/rugby.jpg" },
];

// 20 regioni
const REGIONS = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli-Venezia Giulia",
  "Lazio","Liguria","Lombardia","Marche","Molise","Piemonte","Puglia","Sardegna",
  "Sicilia","Toscana","Trentino-Alto Adige","Umbria","Valle d'Aosta","Veneto"
];

// Campionati per sport/genere (demo)
const LEAGUES = {
  calcio: {
    maschile: [
      "Serie A","Serie B","Serie C","Serie D",
      "Eccellenza","Promozione","Prima Categoria","Seconda Categoria","Terza Categoria",
      "Juniores U19","Allievi U17","Giovanissimi U15",
      "Esordienti","Pulcini","Primi Calci","Piccoli Amici","Scuola Calcio"
    ],
    femminile: [
      "Serie A Femminile","Serie B Femminile","Serie C Femminile","Eccellenza Femminile",
      "Juniores Femminile","Under 17 Femminile","Under 15 Femminile","Scuola Calcio Femminile"
    ],
  },
  futsal: {
    maschile: ["Serie A","Serie A2","Serie B","Under 19","Under 17"],
    femminile: ["Serie A Femminile","Serie A2 Femminile","Under 17 Femminile"]
  },
  basket: {
    maschile:["Serie A","Serie A2","Serie B","Serie C","Under 19","Under 17","Under 15"],
    femminile:["Serie A1 F","Serie A2 F","Serie B F","Under 17 F","Under 15 F"]
  },
  volley: {
    maschile:["SuperLega","A2","A3","Serie B","C","D","Giovanili"],
    femminile:["A1 F","A2 F","A3 F","B1 F","B2 F","C F","D F","Giovanili F"]
  },
  beachvolley: {
    maschile:["Elite","Open","Junior"],
    femminile:["Elite F","Open F","Junior F"]
  },
  rugby: {
    maschile:["Top10","Serie A","Serie B","Serie C","U19","U17","U15"],
    femminile:["Serie A F","Serie A2 F","U17 F","U15 F"]
  }
};

// Società fittizie per regione (demo)
const CLUBS_BY_REGION = {
  "Lazio": ["ASD Roma Nord","Sporting Tuscolano","Ostia Mare","Futsal Roma"],
  "Lombardia": ["SSD Milano","Inter Club Demo","Brixia Basket","Lario Team"],
  "Piemonte": ["Torino Volley","Cuneo Calcio","Novara Rugby","Alessandria"],
  "Veneto": ["Treviso Volley","Padova Calcio","Verona Futsal","Vicenza"],
  "Sicilia": ["Siracusa Calcio","Catania Futsal","Palermo Rugby","Trapani"],
  "Emilia-Romagna": ["Bologna Basket","Parma Calcio","Rimini Volley","Modena"]
};

// Partite demo
const MATCHES = [
  { home:"Prima Squadra", away:"—", when:"31/08/2025 14:07", where:"Roma — Stadio Olimpico" },
  { home:"Juniores",      away:"—", when:"01/09/2025 18:30", where:"Roma — Campo Test" },
];

/* ======== STATO ========= */
const state = { sport:null, gender:null, region:null, league:null, club:null };

/* ======== UTILS ========= */
const app = document.getElementById("app");

function h(tag, attrs={}, children=[]) {
  const el = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k==="class") el.className = v;
    else if (k==="onclick") el.addEventListener("click", v);
    else el.setAttribute(k,v);
  }
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if (c==null) return;
    el.appendChild(typeof c==="string" ? document.createTextNode(c) : c);
  });
  return el;
}
const clear = ()=> app.innerHTML="";
const title = (t,s)=> h("div",{class:"container"},[
  h("div",{class:"h1"},t),
  h("div",{class:"sub"},s||"")
]);

/* ======== PAGINE ========= */

// 1) SPORT
function pageSports(){
  clear();
  app.appendChild(title("Scegli lo sport","Seleziona per iniziare il percorso"));

  const grid = h("div",{class:"container grid sports"});
  SPORTS.forEach(s=>{
    const card = h("div",{class:"card", onclick:()=>{
      state.sport = s.key;
      pageGender();
    }},[
      h("img",{src:s.img,alt:s.name}),
      h("div",{class:"title"},s.name)
    ]);
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

// 2) GENERE (auto-avanza al click)
function pageGender(){
  clear();
  app.appendChild(title("Scegli il genere",""));

  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});

  ["Maschile","Femminile"].forEach(label=>{
    const key = label.toLowerCase();
    const chip = h("div",{class:"chip", onclick:()=>{
      state.gender = key;
      // passa subito alle regioni
      pageRegions();
    }}, label);
    chips.appendChild(chip);
  });

  box.appendChild(chips);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageSports()},"Indietro")
  ]));
  app.appendChild(box);
}

// 3) REGIONI (auto-avanza)
function pageRegions(){
  clear();
  app.appendChild(title("Scegli la regione",""));

  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});
  REGIONS.forEach(r=>{
    const chip = h("div",{class:"chip",onclick:()=>{
      state.region = r;
      pageLeagues();
    }}, r);
    chips.appendChild(chip);
  });

  box.appendChild(chips);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageGender()},"Indietro")
  ]));
  app.appendChild(box);
}

// 4) CAMPIONATI (auto-avanza)
function pageLeagues(){
  clear();
  const sport = state.sport;
  const gender = state.gender;
  const leagues = (LEAGUES[sport] && LEAGUES[sport][gender]) ? LEAGUES[sport][gender] : [];

  app.appendChild(title("Scegli il campionato", `${capital(sport)} • ${capital(gender)} • ${state.region}`));

  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});
  leagues.forEach(l=>{
    const chip = h("div",{class:"chip",onclick:()=>{
      state.league = l;
      pageClubs();
    }}, l);
    chips.appendChild(chip);
  });

  box.appendChild(chips);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageRegions()},"Indietro")
  ]));
  app.appendChild(box);
}

// 5) SOCIETÀ (auto-avanza al dettaglio)
function pageClubs(){
  clear();
  app.appendChild(title("Scegli la società", `${state.league} • ${state.region}`));

  const clubs = CLUBS_BY_REGION[state.region] || ["Società Dimostrativa"];
  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});
  clubs.forEach(c=>{
    const chip = h("div",{class:"chip",onclick:()=>{
      state.club = c;
      pageClubDetail();
    }}, c);
    chips.appendChild(chip);
  });

  box.appendChild(chips);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageLeagues()},"Indietro")
  ]));
  app.appendChild(box);
}

// 6) DETTAGLIO SOCIETÀ
function pageClubDetail(){
  clear();

  app.appendChild(title(state.club, `${state.league} • ${capital(state.gender)} • ${state.region}`));

  // Logo centrale società
  const hero = h("div",{class:"container club-hero"},[
    h("div",{class:"club-logo"},[
      h("img",{src:"./images/logo-icon.png",alt:"Logo società"})
    ])
  ]);
  app.appendChild(hero);

  // Pannelli info
  const info = h("div",{class:"container panel"},[
    h("div",{class:"row"},[
      h("div",{class:"team"},"Contatti ufficiali"),
    ]),
    h("div",{class:"sub"},"Email: info@societa.demo • Tel: +39 000 000 0000"),
    h("div",{class:"row"},[ h("div",{class:"team"},"Impianto") ]),
    h("div",{class:"sub"},"Stadio/Impianto — Indirizzo completo"),
    h("div",{class:"row"},[ h("div",{class:"team"},"Sponsor collegati") ]),
    h("div",{class:"sub"},"Hotel Demo, Ristorante Demo (solo esempio)"),
  ]);
  app.appendChild(info);

  // Partite
  const matchesPanel = h("div",{class:"container panel"});
  matchesPanel.appendChild(h("div",{class:"h1"},"Prossime partite"));
  MATCHES.forEach(m=>{
    matchesPanel.appendChild(
      h("div",{class:"row"},[
        h("div",{class:"team"},`${m.home} vs ${m.away}`),
        h("div",{class:"meta"},`${m.when} — ${m.where}`)
      ])
    );
  });
  app.appendChild(matchesPanel);

  // Azioni: indietro + Crea PreMatch con logo
  const actions = h("div",{class:"container actions"},[
    h("button",{class:"btn",onclick:()=>pageClubs()},"Indietro"),
    h("button",{class:"btn primary",onclick:()=>openPrematchModal()},[
      h("img",{class:"btn-icon",src:"./images/logo-icon.png",alt:""}),"Crea PreMatch"
    ])
  ]);
  app.appendChild(actions);
}

/* ======== MODAL CREAZIONE PREMATCH (demo colori) ========= */
function openPrematchModal(){
  const backdrop = h("div",{class:"modal-backdrop"});
  const modal = h("div",{class:"modal"});

  const palette = ["#d32f2f","#1976d2","#2e7d32","#f9a825","#6a1b9a","#000000","#ffffff"];
  let home = palette[0], away = palette[1];

  const swH = h("div",{class:"swatches"});
  const swA = h("div",{class:"swatches"});
  palette.forEach(col=>{
    const s1 = h("div",{class:"swatch"+(col===home?" active":""),style:`background:${col}`,onclick:()=>{
      home = col; [...swH.children].forEach(c=>c.classList.remove("active")); s1.classList.add("active");
    }});
    const s2 = h("div",{class:"swatch"+(col===away?" active":""),style:`background:${col}`,onclick:()=>{
      away = col; [...swA.children].forEach(c=>c.classList.remove("active")); s2.classList.add("active");
    }});
    swH.appendChild(s1); swA.appendChild(s2);
  });

  modal.appendChild(h("div",{class:"h1"},"Crea PreMatch"));
  modal.appendChild(h("div",{class:"sub"},"Scegli colori maglie (Casa / Trasferta)"));
  modal.appendChild(h("div",{},["Casa"]));
  modal.appendChild(swH);
  modal.appendChild(h("div",{},["Trasferta"]));
  modal.appendChild(swA);

  modal.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>document.body.removeChild(backdrop)},"Annulla"),
    h("button",{class:"btn primary",onclick:()=>{
      document.body.removeChild(backdrop);
      alert("PreMatch inviato! (demo)\nCasa: "+home+" • Trasferta: "+away);
    }},"Invia richiesta")
  ]));

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}

/* ======== HELPERS ========= */
function capital(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : ""; }

/* start */
pageSports();

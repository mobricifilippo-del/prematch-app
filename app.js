// ===== Dati demo (puoi allargare quando vuoi) =====
const DATA = {
  sports: [
    { key: "calcio",     name: "Calcio",     img: "./images/calcio.jpg" },
    { key: "futsal",     name: "Futsal",     img: "./images/futsal.jpg" },
    { key: "basket",     name: "Basket",     img: "./images/basket.jpg" },
    { key: "volley",     name: "Volley",     img: "./images/volley.jpg" },
    { key: "rugby",      name: "Rugby",      img: "./images/rugby.jpg" },
    { key: "pallanuoto", name: "Pallanuoto", img: "./images/pallanuoto.jpg" },
  ],
  genders: ["Maschile","Femminile"],
  regions: ["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"],
  leaguesBy: {
    calcio: {
      Maschile: {
        Lazio: ["Serie D","Eccellenza","Promozione","Prima Categoria","Scuola Calcio"],
        Lombardia: ["Serie D","Eccellenza","Promozione"],
      },
      Femminile: {
        Lazio: ["Serie C","Eccellenza","Scuola Calcio"],
        Lombardia: ["Serie B","Serie C","Scuola Calcio"],
      }
    },
    volley: {
      Maschile: { Lazio:["Serie B Interregionale"], Lombardia:["Serie C"] },
      Femminile: { Lazio:["Serie C"], Lombardia:["Serie D"] }
    },
    basket: {
      Maschile: { Lombardia:["Serie C Silver","Serie D"] },
      Femminile: { Lazio:["Serie B"], Lombardia:["Serie C"] }
    },
    futsal: {
      Maschile: { Lazio:["C1","C2"] },
      Femminile: { Lazio:["C"], Lombardia:["C"] }
    },
    rugby: {
      Maschile: { Lazio:["Serie B"], Lombardia:["Serie C"] },
      Femminile: { Lazio:["Serie A"], Lombardia:["Serie A"] }
    },
    pallanuoto: {
      Maschile: { Lazio:["Serie B"] },
      Femminile: { Lazio:["Serie A2"] }
    }
  },
  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord","Sporting Tuscolano"],
    "Promozione": ["Virtus Marino","Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Serie C": ["SSD Milano"],
    "Serie B Interregionale": ["Treviso Volley"],
    "Serie C Silver": ["Brixia Basket","Gorla Team"],
    "Serie D": ["Lario Basket"],
    "Scuola Calcio": ["Academy Roma U12"],
    "C1": ["Futsal Roma"],
    "C2": ["Futsal Ostia"],
    "Serie B": ["Volley Milano"],
    "Serie A": ["Rugby Lazio"],
    "Serie A2": ["PallaNuoto Roma"],
  },

  // profili società demo con 3 divise (solo maglia, scenario A)
  clubsProfiles: {
    "ASD Roma Nord": {
      logo: "./images/logo-light.png",
      kits: { casa:"#e53935", trasferta:"#111111", terza:"#1e88e5" },
      contacts: { email:"info@societa.demo", tel:"+39 000 000 0000" },
      venue: { name:"Stadio/Impianto", address:"Indirizzo completo" },
      sponsors: ["Hotel Demo","Ristorante Demo"],
    },
    "SSD Milano": {
      logo: "./images/logo-light.png",
      kits: { casa:"#0d47a1", trasferta:"#ffffff", terza:"#43a047" },
      contacts: { email:"contatti@ssd.demo", tel:"+39 000 000 0001" },
      venue: { name:"Centro Sportivo Milano", address:"Via Esempio 1" },
      sponsors: ["Transfer Milano","Pizzeria Duomo"],
    }
  },

  matchesMock: [
    { home: "Prima Squadra", away: "—", when: "31/08/2025 14:07", where: "Roma – Stadio Olimpico" },
    { home: "Juniores",      away: "—", when: "01/09/2025 18:30", where: "Roma – Campo Test" },
  ],

  // tavolo colori disponibili per la maglia ospite
  colorPalette: ["#e53935","#1e88e5","#43a047","#f5a623","#6a1b9a","#111111","#ffffff"]
};

// ===== Stato =====
const state = { sport:null, gender:null, region:null, league:null, club:null };

// ===== Helper =====
const app = document.getElementById("app");
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==="class") el.className=v;
    else if(k==="onclick") el.addEventListener("click", v);
    else el.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c==null) return;
    if(typeof c==="string") el.appendChild(document.createTextNode(c));
    else el.appendChild(c);
  });
  return el;
}
function clearMain(){ app.innerHTML=""; }
function title(t, s=""){ return h("div",{class:"container"},[
  h("div",{class:"h1"},t),
  h("div",{class:"sub"},s)
]);}
function chipList(items, current, onPick){
  const wrap = h("div",{class:"chips"});
  items.forEach(x=>{
    const c = h("div",{class:"chip"+(current===x?" active":""), onclick:()=>{
      [...wrap.children].forEach(n=>n.classList.remove("active"));
      c.classList.add("active"); onPick(x);
    }},x);
    wrap.appendChild(c);
  });
  return wrap;
}
function swatch(color){ return h("span",{class:"swatch", style:`background:${color}`}); }
function kitRow(titleText, colorsArr){
  return h("div",{class:"kit"},[
    h("h4",{},titleText),
    h("div",{class:"sw"},colorsArr.map(c=>h("span",{class:"sw",style:`background:${c}`})))
  ]);
}

// ===== Pagine =====
pageSports();

function pageSports(){
  clearMain();
  app.appendChild(title("Scegli lo sport","Seleziona per iniziare"));
  const grid = h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    grid.appendChild(
      h("div",{class:"card", onclick:()=>{ state.sport=s.key; pageGender(); }},[
        h("img",{src:s.img,alt:s.name}),
        h("div",{class:"title"},s.name)
      ])
    );
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(title("Seleziona il genere",""));
  const box = h("div",{class:"container panel"});
  box.appendChild(chipList(DATA.genders, state.gender, (g)=>{ state.gender=g; pageRegions(); }));
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageSports()},"Indietro")
  ]));
  app.appendChild(box);
}

function pageRegions(){
  clearMain();
  app.appendChild(title("Scegli la regione",""));
  const box = h("div",{class:"container panel"});
  const regions = DATA.regions.filter(r=>{
    const map = (((DATA.leaguesBy||{})[state.sport]||{})[state.gender]||{});
    return !!map[r];
  });
  box.appendChild(chipList(regions, state.region, (r)=>{ state.region=r; pageLeagues(); }));
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageGender()},"Indietro")
  ]));
  app.appendChild(box);
}

function pageLeagues(){
  clearMain();
  app.appendChild(title("Scegli il campionato", `${state.gender} • ${state.region}`));
  const map = (((DATA.leaguesBy||{})[state.sport]||{})[state.gender]||{});
  const leagues = map[state.region] || [];
  const box = h("div",{class:"container panel"});
  box.appendChild(chipList(leagues, state.league, (l)=>{ state.league=l; pageClubs(); }));
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageRegions()},"Indietro")
  ]));
  app.appendChild(box);
}

function pageClubs(){
  clearMain();
  app.appendChild(title("Scegli la società", `${state.league} • ${state.region}`));
  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  const box = h("div",{class:"container panel"});
  box.appendChild(chipList(clubs, state.club, (c)=>{ state.club=c; pageCompany(); }));
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageLeagues()},"Indietro")
  ]));
  app.appendChild(box);
}

function pageCompany(){
  clearMain();

  const prof = DATA.clubsProfiles[state.club] || {
    logo:"./images/logo-light.png",
    kits:{casa:"#e53935", trasferta:"#111111", terza:"#1e88e5"},
    contacts:{email:"info@societa.demo", tel:"+39 000 000 0000"},
    venue:{name:"Impianto", address:"Indirizzo completo"},
    sponsors:["Sponsor Demo"]
  };

  const head = h("div",{class:"container company-head"},[
    h("div",{class:"company-logo"}, [
      h("img",{src:prof.logo, alt:"Logo società"})
    ]),
    h("div",{class:"h1"}, state.club),
    h("div",{class:"sub"}, `${state.league} • ${state.gender} • ${state.region}`)
  ]);

  const info = h("div",{class:"container panel"},[
    h("div",{class:"section-title-strong"},"Contatti ufficiali"),
    h("div",{}, `Email: ${prof.contacts.email} • Tel: ${prof.contacts.tel}`),
    h("div",{style:"height:10px"}),
    h("div",{class:"section-title-strong"},"Impianto"),
    h("div",{}, `${prof.venue.name} — ${prof.venue.address}`),
    h("div",{style:"height:10px"}),
    h("div",{class:"section-title-strong"},"Divise ufficiali"),
    h("div",{class:"kits"},[
      kitRow("Casa",       [prof.kits.casa]),
      kitRow("Trasferta",  [prof.kits.trasferta]),
      kitRow("Terza",      [prof.kits.terza]),
    ]),
    h("div",{style:"height:10px"}),
    h("div",{class:"section-title-strong"},"Sponsor collegati"),
    h("div",{}, prof.sponsors.join(", "))
  ]);

  const matches = h("div",{class:"container panel"},[
    h("div",{class:"section-title-strong"},"Prossime partite"),
    ...DATA.matchesMock.map(m=>h("div",{class:"row"},[
      h("div",{class:"team"}, `${m.home} vs ${m.away}`),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ])),
    h("div",{class:"actions"},[
      h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro"),
      h("button",{class:"btn btn-logo", onclick:()=>openPrematch(prof)},"Crea PreMatch")
    ])
  ]);

  app.appendChild(head);
  app.appendChild(info);
  app.appendChild(matches);
}

// ===== Modal PreMatch (Scenario A) =====
function openPrematch(profile){
  const modal = h("div",{class:"modal"});
  const card = h("div",{class:"modal-card"});
  const title = h("div",{class:"modal-title"},"Crea PreMatch");
  const descr = h("div",{}, "Seleziona il colore della TUA maglia (ospite).");

  const pal = h("div",{class:"pal"});
  let chosen = null;
  DATA.colorPalette.forEach(col=>{
    const d = h("div",{class:"dot", style:`background:${col}`, onclick:()=>{
      [...pal.children].forEach(n=>n.classList.remove("active"));
      d.classList.add("active");
      chosen = col;
      // avviso se simile al colore di casa della squadra ospitante
      warn.textContent = (sameColor(col, profile.kits.casa))
        ? "Attenzione: il colore è simile alla maglia di CASA dell’avversario."
        : "";
    }});
    pal.appendChild(d);
  });

  const warn = h("div",{class:"warn"},"");

  const actions = h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>document.body.removeChild(modal)},"Annulla"),
    h("button",{class:"btn primary", onclick:()=>{
      if(!chosen) return;
      // mock conferma + PDF
      alert(`Richiesta inviata a ${state.club}.\nColore maglia ospite: ${chosen}`);
      document.body.removeChild(modal);
    }},"Invia richiesta")
  ]);

  card.appendChild(title);
  card.appendChild(descr);
  card.appendChild(pal);
  card.appendChild(warn);
  card.appendChild(actions);
  modal.appendChild(card);
  document.body.appendChild(modal);
}

function sameColor(c1, c2){
  const norm = c => c.toLowerCase().replace(/\s+/g,'');
  return norm(c1) === norm(c2);
}

/* ===== DATI MOCK per demo ===== */
const DATA = {
  sports: [
    { key:"calcio",     name:"Calcio",     img:"./images/calcio.jpg" },
    { key:"futsal",     name:"Futsal",     img:"./images/futsal.jpg" },
    { key:"basket",     name:"Basket",     img:"./images/basket.jpg" },
    { key:"volley",     name:"Volley",     img:"./images/volley.jpg" },
    { key:"rugby",      name:"Rugby",      img:"./images/rugby.jpg" },
    { key:"pallanuoto", name:"Pallanuoto", img:"./images/pallanuoto.jpg" },
  ],
  genders: ["Maschile","Femminile"],
  regions: ["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"],
  leaguesBySport: {
    calcio: ["Serie A","Serie B","Eccellenza","Promozione","Prima Categoria","Scuola Calcio"],
    futsal: ["A1","A2","B","C1","C2","Giovanili"],
    basket: ["Serie A","A2","B","C Gold","C Silver","Giovanili"],
    volley: ["SuperLega","A2","B","C","Giovanili"],
    rugby: ["Top10","Serie A","Serie B","Giovanili"],
    pallanuoto: ["A1","A2","B","Giovanili"]
  },
  clubsByLeague: {
    "Serie A": ["Roma Club","Milano United","Napoli Sporting"],
    "Eccellenza": ["ASD Roma Nord","Sporting Tuscolano","Virtus Ostia"],
    "Promozione": ["Virtus Marino","Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Scuola Calcio": ["Academy Talenti","Junior Elite"],
    "A1": ["Futsal Elite","Sala Five"],
    "A2": ["Sala Tigers"],
    "B": ["Città Basket","Treviso Volley","Lario Basket"],
    "C1": ["Roma Futsal C1"],
    "C2": ["Lazio Futsal C2"],
    "Giovanili": ["Under Team 17","Under Team 15"]
  },
  matchesMock: [
    { home:"Prima Squadra", away:"—", when:"31/08/2025 14:07", where:"Roma — Stadio Olimpico" },
    { home:"Juniores", away:"—", when:"01/09/2025 18:30", where:"Roma — Campo Test" }
  ],
  kitColors: ["#ffffff","#000000","#ffdd00","#e01e37","#1e90ff","#41d27b","#ff7f50","#8a2be2"]
};

/* ===== STATO SEMPLICE ===== */
const state = { sport:null, gender:null, region:null, league:null, club:null };

/* ===== UTILITY DOM ===== */
const app   = document.getElementById("app");
const modal = document.getElementById("modal");

function h(tag, attrs={}, children=[]){
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==="class") el.className=v;
    else if(k==="onclick") el.addEventListener("click", v);
    else el.setAttribute(k, v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c==null) return;
    if(typeof c==="string") el.appendChild(document.createTextNode(c));
    else el.appendChild(c);
  });
  return el;
}
function clear(){ app.innerHTML=""; }
function title(t,sub){ return h("div",{class:"container"},[
  h("div",{class:"h1"},t), sub? h("div",{class:"sub"},sub): null
]);}

/* ===== PAGINE ===== */
function pageSports(){
  clear();
  app.appendChild(title("Scegli lo sport","Seleziona per iniziare"));

  const grid = h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    const card = h("div",{class:"card", onclick:()=>{
      state.sport = s.key;
      pageGender();
    }},[
      h("img",{src:s.img, alt:s.name}),
      h("div",{class:"title"}, s.name)
    ]);
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function makeChips(list, activeValue, onPick){
  const wrap = h("div",{class:"chips"});
  list.forEach(v=>{
    const chip = h("div",{class:`chip${activeValue===v?" active":""}`, onclick:()=>{
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      onPick(v);
    }}, v);
    wrap.appendChild(chip);
  });
  return wrap;
}

function pageGender(){
  clear();
  app.appendChild(title("Scegli il genere", labelSport(state.sport)));
  const box = h("div",{class:"container panel"});
  box.appendChild(makeChips(DATA.genders, state.gender, (g)=>{
    state.gender=g; pageRegions();  // niente “Avanti”: click → avanti
  }));
  app.appendChild(box);
}

function pageRegions(){
  clear();
  app.appendChild(title("Scegli la regione", `${labelSport(state.sport)} · ${state.gender}`));
  const box = h("div",{class:"container panel"});
  box.appendChild(makeChips(DATA.regions, state.region, (r)=>{
    state.region=r; pageLeagues();
  }));
  app.appendChild(box);
}

function pageLeagues(){
  clear();
  const leagues = DATA.leaguesBySport[state.sport] || [];
  app.appendChild(title("Scegli il campionato", `${state.gender} · ${state.region}`));
  const box = h("div",{class:"container panel"});
  box.appendChild(makeChips(leagues, state.league, (l)=>{
    state.league=l; pageClubs();
  }));
  app.appendChild(box);
}

function pageClubs(){
  clear();
  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  app.appendChild(title("Scegli la società", `${state.league} · ${state.region}`));

  const box = h("div",{class:"container panel"});
  box.appendChild(makeChips(clubs, state.club, (c)=>{
    state.club=c; pageClubProfile();
  }));
  app.appendChild(box);
}

/* ===== Pagina Società (profilo) ===== */
function pageClubProfile(){
  clear();
  app.appendChild(title("", ""));

  const c = h("div",{class:"container"});
  // Header profilo
  const head = h("div",{class:"club-header"},[
    h("img",{class:"club-logo", src:"./images/logo-dark.png", alt:"Logo società"}),
    h("div",{class:"club-name"}, state.club)
  ]);
  c.appendChild(head);

  // Colori maglie (sempre visibili, sfondo bianco)
  const kit = h("div",{class:"kit-box"},[
    h("div",{class:"kit-title"},"Colori divise (casa / trasferta / terza)"),
    makeKitRow("Casa"), makeKitRow("Trasferta"), makeKitRow("Terza")
  ]);
  c.appendChild(kit);

  // Dropdown: Gallery
  c.appendChild(dropdown("Galleria foto", [
    h("div",{}, "Nessuna foto caricata (demo).")
  ]));

  // Dropdown: Sponsor
  c.appendChild(dropdown("Sponsor", [
    h("div",{}, "Sponsor locali collegati alla società (demo).")
  ]));

  // Dropdown: Contatti
  c.appendChild(dropdown("Contatti", [
    h("div",{},"Email: info@societa.it"),
    h("div",{},"Telefono: +39 000 000 000"),
    h("div",{},"Impianto: Via dello Sport 1, Roma (mappa)")
  ]));

  // Prossime partite (mock)
  const box = h("div",{class:"panel", style:"margin-top:1rem"});
  DATA.matchesMock.forEach(m=>{
    box.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"},`${m.home} vs ${m.away}`),
      h("div",{class:"meta"},`${m.when} — ${m.where}`)
    ]));
  });
  c.appendChild(box);

  // CTA “Crea PreMatch” (visibile: in demo la mostriamo sempre)
  const cta = h("div",{class:"cta-wrap"},
    h("button",{class:"prematch-btn", onclick: openPrematchModal},[
      h("img",{src:"./images/logo-light.png", alt:"PM"}),
      "Crea PreMatch"
    ])
  );
  c.appendChild(cta);

  // Back / Nuovo percorso
  const actions = h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro"),
    h("button",{class:"btn", onclick:()=>pageSports()},"Nuovo percorso")
  ]);
  c.appendChild(actions);

  app.appendChild(c);
}

function dropdown(titleText, innerChildren){
  const details = h("details",{class:"dropdown"});
  const summary = h("summary",{},titleText);
  const content = h("div",{class:"content"}, innerChildren);
  details.appendChild(summary);
  details.appendChild(content);
  return details;
}

function makeKitRow(label){
  const row = h("div",{class:"modal-row"});
  row.appendChild(h("label",{} , label));
  const sw = h("div",{class:"swatches"});
  DATA.kitColors.forEach(col=>{
    const dot = h("div",{class:"swatch", style:`background:${col}`, onclick:()=>{
      [...sw.children].forEach(d=>d.classList.remove("selected"));
      dot.classList.add("selected");
      // non salviamo nulla (demo); nel reale salveremo per società
    }});
    sw.appendChild(dot);
  });
  row.appendChild(sw);
  return row;
}

/* ===== Modal PreMatch ===== */
function openPrematchModal(){
  modal.innerHTML = "";
  modal.classList.remove("hidden");
  const card = h("div",{class:"modal-card"},[
    h("div",{class:"modal-title"},"Crea PreMatch"),
    // Colori maglie ospite (sceglie chi è in trasferta)
    h("div",{class:"kit-box"},[
      h("div",{class:"kit-title"},"Scegli colori maglie (ospite)"),
      makeKitRow("Maglia"), makeKitRow("Pantaloncini"), makeKitRow("Calzettoni"),
    ]),
    h("div",{class:"modal-row"},[
      h("label",{},"Data & ora"),
      h("input",{type:"datetime-local", id:"pm-datetime"})
    ]),
    h("div",{class:"modal-row"},[
      h("label",{},"Luogo (indirizzo)"),
      h("input",{type:"text", id:"pm-where", placeholder:"Via dello Sport 1, Città"})
    ]),
    h("div",{class:"modal-actions"},[
      h("button",{class:"btn", onclick:closeModal},"Annulla"),
      h("button",{class:"btn primary", onclick:confirmPrematch},"Conferma")
    ])
  ]);
  modal.appendChild(card);
}
function closeModal(){ modal.classList.add("hidden"); }

function confirmPrematch(){
  const when  = document.getElementById("pm-datetime").value || "da definire";
  const where = document.getElementById("pm-where").value || "da definire";
  closeModal();
  // PDF semplice client-side: apriamo una finestra con i dettagli (demo)
  const win = window.open("", "_blank");
  const now = new Date().toLocaleString("it-IT");
  win.document.write(`
    <html><head><title>PDF PreMatch</title></head>
    <body style="font-family:Arial,Helvetica,sans-serif; padding:24px">
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="${location.origin+location.pathname.replace(/\/[^/]*$/,'')}/images/logo-dark.png" style="width:32px;height:32px;border:1px solid #ccc;border-radius:6px"/>
        <h2 style="margin:0">PreMatch</h2>
      </div>
      <h3>Conferma PreMatch</h3>
      <p><b>Società:</b> ${state.club}</p>
      <p><b>Sport:</b> ${labelSport(state.sport)} — <b>${state.gender}</b></p>
      <p><b>Regione:</b> ${state.region} — <b>Campionato:</b> ${state.league}</p>
      <p><b>Data/Ora:</b> ${when}</p>
      <p><b>Luogo:</b> ${where}</p>
      <p><b>Stato:</b> Confermato (demo)</p>
      <hr/>
      <small>Generato da PreMatch • ${now}</small>
      <script>window.print()</script>
    </body></html>
  `);
  win.document.close();
}

/* ===== Helper ===== */
function labelSport(key){
  const s = DATA.sports.find(x=>x.key===key);
  return s ? s.name : "";
}

/* ===== AVVIO ===== */
pageSports();

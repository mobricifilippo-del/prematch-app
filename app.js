// ====== Dataset demo ======
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
  regions: ["Lazio", "Lombardia", "Sicilia", "Piemonte", "Veneto", "Emilia-Romagna"],

  // per semplicità: categorie calcio ricche, gli altri sport essenziali
  leaguesBySportGenderRegion: {
    "calcio|Maschile|Lazio": [
      "Serie A","Serie B","Serie C","Dilettanti Eccellenza","Promozione","Prima Categoria","Scuola Calcio"
    ],
    "calcio|Femminile|Lazio": [
      "Serie A Femminile","Serie B Femminile","Serie C Femminile","Eccellenza Femminile","Scuola Calcio"
    ],
    "basket|Maschile|Lazio": ["Serie B Interregionale","Serie C Unica","Giovanili"],
    "basket|Femminile|Lazio": ["A2 Femminile","B Femminile","Giovanili"],
    "volley|Maschile|Lazio": ["A3","B","Giovanili"],
    "volley|Femminile|Lazio": ["A2","B1","Giovanili"],
    "rugby|Maschile|Lazio": ["Serie A Elite","Serie A","Giovanili"],
    "rugby|Femminile|Lazio": ["Serie A Femminile","Giovanili"],
    "pallanuoto|Maschile|Lazio": ["A2","B","Giovanili"],
    "pallanuoto|Femminile|Lazio": ["A1","A2","Giovanili"],
    // fallback automatico per altre regioni
  },

  clubsByLeague: {
    "Eccellenza Femminile": ["ASD Roma Nord Women", "Sporting Tuscolano Women"],
    "Serie A Femminile":    ["Roma Women", "Lazio Women"],
    "Promozione":           ["Virtus Marino", "Borghesiana FC"],
    "Serie B Interregionale":["Treviso Volley"],
    "Serie A Elite":        ["Capitolina", "Fiamme Oro"],
    "A2 Femminile":         ["Virtus Basket Rosa", "Stellazzurra Rosa"],
    "Scuola Calcio":        ["Pulcini 2015", "Esordienti 2012"],
  },

  matchesMock: [
    { home: "Prima Squadra", away: "—", when: "31/08/2025 14:07", where: "Roma – Stadio Olimpico", status:"pending" },
    { home: "Juniores",      away: "—", when: "01/09/2025 18:30", where: "Roma – Campo Test",       status:"pending" },
  ],
};

const COLOR_SWATCHES = ["#ffffff","#000000","#ff0000","#0044ff","#41d27b","#ff9900","#aa00ff","#00c2ff"];

// ====== Stato ======
const state = { sport:null, gender:null, region:null, league:null, club:null };

// ====== Root ======
const app = document.getElementById("app");
const toastEl = document.getElementById("toast");
const modal = document.getElementById("prematchModal");
const homeColorsEl = document.getElementById("homeColors");
const awayColorsEl = document.getElementById("awayColors");
const inputDate = document.getElementById("matchDate");
const inputTime = document.getElementById("matchTime");
const inputPlace = document.getElementById("matchPlace");
const btnCreate = document.getElementById("btnCreate");

// ====== Helpers ======
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
function titleBlock(t, s){ return h("div",{class:"container"},[
  h("div",{class:"h1"},t), h("div",{class:"sub"}, s||"")
]);}
function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(()=>toastEl.classList.remove("show"), 2200);
}
function todayStr(){ const d=new Date(); return d.toISOString().slice(0,10); }
function timeStr(){ const d=new Date(); return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0"); }

// ====== FLOW ======
function pageSports(){
  clearMain();
  app.appendChild(titleBlock("Scegli lo sport","Seleziona per iniziare"));
  const grid = h("div",{class:"container grid"});

  DATA.sports.forEach(s=>{
    const card = h("div",{class:"card", onclick:()=>{ state.sport=s.key; pageGender(); }},[
      h("img",{src:s.img, alt:s.name, onerror:"this.style.display='none'"}),
      h("div",{class:"title"},s.name),
    ]);
    grid.appendChild(card);
  });

  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  const sportName = (DATA.sports.find(x=>x.key===state.sport)||{}).name || "";
  app.appendChild(titleBlock(`Seleziona il genere`, sportName));

  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});

  DATA.genders.forEach(g=>{
    const chip = h("div",{class:"chip", onclick:()=>{
      state.gender = g;
      // auto-advance
      pageRegions();
    }}, g);
    chips.appendChild(chip);
  });

  box.appendChild(chips);
  app.appendChild(box);
}

function pageRegions(){
  clearMain();
  app.appendChild(titleBlock("Scegli la regione", `${cap(s(state.sport))} • ${state.gender}`));

  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});

  DATA.regions.forEach(r=>{
    const chip = h("div",{class:"chip", onclick:()=>{
      state.region = r;
      pageLeagues();
    }}, r);
    chips.appendChild(chip);
  });

  box.appendChild(chips);
  app.appendChild(box);
}

function pageLeagues(){
  clearMain();
  app.appendChild(titleBlock("Scegli il campionato", `${state.region} • ${state.gender}`));

  const key = `${state.sport}|${state.gender}|${state.region}`;
  let leagues = DATA.leaguesBySportGenderRegion[key];

  // fallback se mancano categorie per regione
  if(!leagues){
    if(state.sport==="calcio" && state.gender==="Femminile"){
      leagues = ["Serie A Femminile","Serie B Femminile","Serie C Femminile","Eccellenza Femminile","Scuola Calcio"];
    }else if(state.sport==="calcio"){
      leagues = ["Serie A","Serie B","Serie C","Dilettanti Eccellenza","Promozione","Prima Categoria","Scuola Calcio"];
    }else{
      leagues = ["Campionato", "Giovanili"];
    }
  }

  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});

  leagues.forEach(l=>{
    const chip = h("div",{class:"chip", onclick:()=>{
      state.league = l;
      pageClubs();
    }}, l);
    chips.appendChild(chip);
  });

  box.appendChild(chips);
  app.appendChild(box);
}

function pageClubs(){
  clearMain();
  app.appendChild(titleBlock("Scegli la società", `${state.league} • ${state.region}`));
  const list = DATA.clubsByLeague[state.league] || ["Società Dimostrativa A","Società Dimostrativa B"];

  const box = h("div",{class:"container panel"});
  const chips = h("div",{class:"chips"});

  list.forEach(c=>{
    const chip = h("div",{class:"chip", onclick:()=>{
      state.club = c;
      pageClubDetail();
    }}, c);
    chips.appendChild(chip);
  });

  box.appendChild(chips);
  app.appendChild(box);
}

function pageClubDetail(){
  clearMain();
  app.appendChild(titleBlock(state.club, `${state.league} • ${state.gender} • ${state.region}`));

  const wrap = h("div",{class:"container panel"});
  // logo società demo + info
  wrap.appendChild(h("div",{class:"row"},[
    h("div",{class:"team"}, "Logo/Info Società"),
    h("div",{class:"meta"}, "Indirizzo • Contatti • Sponsor")
  ]));

  // partite demo
  DATA.matchesMock.forEach(m=>{
    const status = m.status==="confirmed" ? "🟢 Confermato" : "🔴 In attesa";
    wrap.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, `${m.home} vs ${m.away}`),
      h("div",{class:"meta"}, `${m.when} — ${m.where} • ${status}`)
    ]));
  });

  // CTA: Crea PreMatch
  const actions = h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro"),
    h("button",{class:"btn primary", onclick:()=>openPreMatchModal()}, "Crea PreMatch")
  ]);

  app.appendChild(wrap);
  app.appendChild(h("div",{class:"container"},actions));
}

// ====== PreMatch Modal ======
let homeColor = COLOR_SWATCHES[0];
let awayColor = COLOR_SWATCHES[1];

function openPreMatchModal(){
  // riempi swatch
  homeColorsEl.innerHTML = "";
  awayColorsEl.innerHTML = "";
  COLOR_SWATCHES.forEach(col=>{
    const a = h("button",{class:"swatch", style:`background:${col}`, onclick:(e)=>{
      [...homeColorsEl.children].forEach(s=>s.classList.remove("active"));
      e.currentTarget.classList.add("active"); homeColor = col;
    }});
    if(col===homeColor) a.classList.add("active");
    homeColorsEl.appendChild(a);

    const b = h("button",{class:"swatch", style:`background:${col}`, onclick:(e)=>{
      [...awayColorsEl.children].forEach(s=>s.classList.remove("active"));
      e.currentTarget.classList.add("active"); awayColor = col;
    }});
    if(col===awayColor) b.classList.add("active");
    awayColorsEl.appendChild(b);
  });

  // default data/ora/luogo
  inputDate.value = todayStr();
  inputTime.value = timeStr();
  inputPlace.value = "Impianto di casa";

  // conferma
  btnCreate.onclick = (ev)=>{
    ev.preventDefault();
    if(!inputDate.value || !inputTime.value || !inputPlace.value){
      showToast("Compila data, ora e luogo.");
      return;
    }
    // segna conferma demo
    DATA.matchesMock = DATA.matchesMock.map((m,i)=> i===0 ? ({...m, away: state.club, when: `${fmtDate(inputDate.value)} ${inputTime.value}`, where: inputPlace.value, status:"confirmed"}) : m);

    modal.close();
    showToast("PreMatch creato e confermato (demo).");

    // crea PDF PreMatch demo
    downloadPrematchPDF();
    // torna alla pagina società per mostrare stato aggiornato
    pageClubDetail();
  };

  modal.showModal();
}

function fmtDate(d){
  const [y,m,dd] = d.split("-");
  return `${dd}/${m}/${y}`;
}

function downloadPrematchPDF(){
  const club = state.club || "Società Avversaria";
  const league = state.league || "-";
  const region = state.region || "-";
  const gender = state.gender || "-";
  const sportName = (DATA.sports.find(x=>x.key===state.sport)||{}).name || "-";

  const when = `${fmtDate(inputDate.value)} ${inputTime.value}`;
  const where = inputPlace.value;

  const html = `
  <html><head><meta charset="utf-8"><title>PreMatch</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif; padding:24px; color:#111}
    .head{display:flex; align-items:center; gap:12px; margin-bottom:12px}
    .head img{width:28px; height:28px}
    h1{margin:8px 0 14px; font-size:20px}
    table{border-collapse:collapse; width:100%}
    td,th{border:1px solid #ddd; padding:8px; font-size:14px}
    th{background:#f4f7f9; text-align:left}
    .badge{display:inline-block; padding:4px 8px; border-radius:8px; background:#e8fff2; color:#0a5; font-weight:bold}
    .color{display:inline-block; width:14px; height:14px; border-radius:50%; border:1px solid #888; vertical-align:middle}
    .muted{color:#777}
  </style>
  </head><body>
    <div class="head">
      <img src="${location.origin}${location.pathname.replace(/\/[^/]*$/,'')}/images/logo-dark.png" alt="PreMatch"/>
      <strong>PreMatch</strong>
    </div>
    <h1>Conferma PreMatch <span class="badge">Confermato</span></h1>
    <table>
      <tr><th>Sport</th><td>${sportName}</td></tr>
      <tr><th>Genere</th><td>${gender}</td></tr>
      <tr><th>Regione</th><td>${region}</td></tr>
      <tr><th>Campionato</th><td>${league}</td></tr>
      <tr><th>Società avversaria</th><td>${club}</td></tr>
      <tr><th>Data/Ora</th><td>${when}</td></tr>
      <tr><th>Luogo</th><td>${where}</td></tr>
      <tr><th>Colori</th>
        <td>
          Casa: <span class="color" style="background:${homeColor}"></span>
          &nbsp;&nbsp;Trasferta: <span class="color" style="background:${awayColor}"></span>
        </td>
      </tr>
      <tr><th>Riferimento</th><td class="muted">${new Date().toISOString()}</td></tr>
    </table>
  </body></html>`;

  const blob = new Blob([html], {type:"text/html"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "PreMatch.pdf.html";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

// ====== Utils ======
const s = x=>x||"";
const cap = x=>x ? x.charAt(0).toUpperCase()+x.slice(1) : "";

// ====== Avvio ======
pageSports();

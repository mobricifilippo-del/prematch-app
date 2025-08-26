/* =============== Config & Assets =============== */
const IS_VISITOR = true; // demo: mostra il tasto Crea PreMatch
const DEMO_COACH_CODE = "PM-2025";

const LOGOS = {
  light:"./images/logo-light.png",
  dark:"./images/logo-dark.png",
  icon:"./images/logo-icon.png",
};

/* =============== Dati DEMO =============== */
const DATA = {
  sports:[
    {key:"calcio",name:"Calcio",img:"./images/calcio.jpg"},
    {key:"futsal",name:"Futsal",img:"./images/futsal.jpg"},
    {key:"basket",name:"Basket",img:"./images/basket.jpg"},
    {key:"volley",name:"Volley",img:"./images/volley.jpg"},
    {key:"rugby",name:"Rugby",img:"./images/rugby.jpg"},
    {key:"pallanuoto",name:"Pallanuoto",img:"./images/pallanuoto.jpg"},
  ],
  genders:["Maschile","Femminile"],
  regions:["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"],
  leaguesBy:{
    "Lazio":["Eccellenza","Promozione","Scuola Calcio"],
    "Lombardia":["Serie C Silver","Serie D","Scuola Calcio"],
    "Sicilia":["Serie C","Promozione","Scuola Calcio"],
    "Piemonte":["Eccellenza","Scuola Calcio"],
    "Veneto":["Serie B Interregionale","Scuola Calcio"],
    "Emilia-Romagna":["Promozione","Scuola Calcio"],
  },
  clubsByLeague:{
    "Eccellenza":["ASD Roma Nord","Sporting Tuscolano"],
    "Promozione":["Virtus Marino","Borghesiana FC","Atletico Ostia"],
    "Scuola Calcio":["Accademia Ragazzi","Junior Sporting"],
    "Serie C Silver":[], "Serie D":[], "Serie C":[], "Serie B Interregionale":[]
  },
  clubProfiles:{
    "ASD Roma Nord": clubProfile("ASD Roma Nord"),
    "Sporting Tuscolano": clubProfile("Sporting Tuscolano"),
    "Virtus Marino": clubProfile("Virtus Marino"),
    "Borghesiana FC": clubProfile("Borghesiana FC"),
    "Atletico Ostia": clubProfile("Atletico Ostia"),
    "Accademia Ragazzi": clubProfile("Accademia Ragazzi"),
    "Junior Sporting": clubProfile("Junior Sporting"),
  }
};
function clubProfile(name){
  return {
    logo: LOGOS.icon,
    uniforms:{casa:"#e74a3c",trasferta:"#2c3e50",terza:"#2980b9"},
    contacts:{ campo:"Centro Sportivo Demo, Roma", email:"info@societa.demo", tel:"+39 000 000 0000" },
    gallery:["./images/calcio.jpg","./images/volley.jpg"],
    matches:[
      {home:name,when:"31/08/2025 14:07",where:"Roma — Stadio Olimpico"},
      {home:"Juniores",when:"01/09/2025 18:30",where:"Roma — Campo Test"}
    ]
  };
}

/* =============== Stato =============== */
const state = { sport:null, gender:null, region:null, league:null, club:null };

/* =============== Helpers DOM =============== */
const app = document.getElementById("app");

function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==="class") el.className=v;
    else if(k==="onclick") el.addEventListener("click", v);
    else if(k==="oninput") el.addEventListener("input", v);
    else if(k==="onchange") el.addEventListener("change", v);
    else if(k==="style") Object.assign(el.style, v);
    else el.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c==null) return;
    el.appendChild(typeof c==="string" ? document.createTextNode(c) : c);
  });
  return el;
}
function clearMain(){ app.innerHTML = ""; }
function sectionTitle(title, subtitle){
  return h("div", {class:"container"}, [
    h("div", {class:"h1"}, title),
    h("div", {class:"sub"}, subtitle||"")
  ]);
}
function chip(text, active, onClick){
  return h("div", {class:"chip"+(active?" active":""), onclick:onClick}, text);
}
function gridCard(item, onClick){
  const card = h("div", {class:"card"}, [
    h("img",{src:item.img,alt:item.name,onerror(){this.style.display="none"}}),
    h("div",{class:"title"}, item.name)
  ]);
  card.addEventListener("click", ()=>{
    card.classList.add("flash");
    setTimeout(()=>{ onClick(); card.classList.remove("flash"); }, 180);
  });
  return card;
}
function toast(msg){
  const t = h("div",{class:"toast"}, msg);
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2000);
}

/* =============== Topbar: Coach link =============== */
document.getElementById("btnCoach").addEventListener("click", openCoachGate);

/* =============== Pagine =============== */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare"));
  const grid = h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    grid.appendChild(gridCard(s,()=>{ state.sport=s.key; pageGender(); }));
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));
  const wrap = h("div",{class:"container chips"});
  DATA.genders.forEach(g=>{
    wrap.appendChild(chip(g,state.gender===g,(ev)=>{
      state.gender=g;
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      ev.currentTarget.classList.add("active");
      setTimeout(pageRegions,150);
    }));
  });
  app.appendChild(wrap);
}

function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione",""));
  const wrap = h("div",{class:"container chips"});
  DATA.regions.forEach(r=>{
    wrap.appendChild(chip(r,state.region===r,(ev)=>{
      state.region=r;
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      ev.currentTarget.classList.add("active");
      setTimeout(pageLeagues,150);
    }));
  });
  app.appendChild(wrap);
}

function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il campionato", state.region||""));
  const leagues = DATA.leaguesBy[state.region] || [];
  const wrap = h("div",{class:"container chips"});
  leagues.forEach(l=>{
    wrap.appendChild(chip(l,state.league===l,(ev)=>{
      state.league=l;
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      ev.currentTarget.classList.add("active");
      setTimeout(pageClubs,150);
    }));
  });
  app.appendChild(wrap);
}

function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la società", state.league||""));
  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  const wrap = h("div",{class:"container chips"});
  clubs.forEach(c=>{
    wrap.appendChild(chip(c,state.club===c,(ev)=>{
      state.club=c;
      [...wrap.children].forEach(x=>x.classList.remove("active"));
      ev.currentTarget.classList.add("active");
      setTimeout(()=>pageClubProfile(c),150);
    }));
  });
  app.appendChild(wrap);
}

/* =============== Pagina Società =============== */
function pageClubProfile(clubName){
  clearMain();
  const club = DATA.clubProfiles[clubName] || clubProfile(clubName);

  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // header: logo + bottone PM (stessa misura)
  const header = h("div",{class:"container club-header"},[
    h("div",{class:"club-logo"},[
      h("img",{src:club.logo||LOGOS.icon,alt:clubName})
    ]),
    h("div",{style:{display:"grid",placeItems:"center"}},[
      createPmRoundButton(club)
    ])
  ]);
  app.appendChild(header);

  // Accordion
  const acc = h("div",{class:"container acc"});
  acc.appendChild(accordionItem("Informazioni", infoContent(club.contacts)));
  acc.appendChild(accordionItem("Galleria foto", galleryContent(club.gallery)));
  acc.appendChild(accordionItem("Match in programma", matchesContent(club.matches)));
  app.appendChild(acc);

  // Indietro
  app.appendChild(h("div",{class:"container"},[
    h("button",{class:"btn",onclick:()=>pageClubs()},"Indietro")
  ]));
}

function accordionItem(title, bodyEl){
  const item = h("div",{class:"item"});
  const hd = h("div",{class:"hd"}, title);
  const bd = h("div",{class:"bd"}, bodyEl);
  hd.addEventListener("click",()=> item.classList.toggle("open"));
  item.appendChild(hd); item.appendChild(bd);
  return item;
}
function infoContent(c){
  return h("div",{},[
    h("div",{},"Campo: "+(c.campo||"-")),
    h("div",{},"Email: "+(c.email||"-")),
    h("div",{},"Tel: "+(c.tel||"-"))
  ]);
}
function galleryContent(list){
  if(!list || !list.length) return h("div",{class:"sub"},"Nessuna foto caricata.");
  const g = h("div",{class:"grid"});
  list.forEach(src => g.appendChild(h("img",{src,alt:"Foto",style:{width:"100%",height:"140px",objectFit:"cover",borderRadius:"12px"}})));
  return g;
}
function matchesContent(arr){
  const panel = h("div",{class:"panel"});
  (arr && arr.length?arr:[{home:"—",when:"—",where:"—"}]).forEach(m=>{
    panel.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, m.home + " vs —"),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  return panel;
}

/* =============== PreMatch =============== */
function createPmRoundButton(club){
  const wrap = h("div");
  const btn = h("button",{class:"pm-round"},[h("img",{src:LOGOS.icon,alt:"PM"})]);
  btn.addEventListener("click", ()=> openPrematchModal(club));
  wrap.appendChild(btn);
  wrap.appendChild(h("div",{class:"pm-cta"},"Crea PreMatch"));
  return wrap;
}
function colorPalette(){ return ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"]; }

function openPrematchModal(club){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  const hd = h("div",{class:"hd"},"Crea PreMatch");
  const bd = h("div",{class:"bd"});
  const bar = h("div",{class:"bar"});

  sheet.appendChild(hd); sheet.appendChild(bd); sheet.appendChild(bar); overlay.appendChild(sheet);

  // Stato modale
  const sel = { maglia:null, when:"", where:"", friendly:false, note:"" };

  // Colore maglia
  bd.appendChild(h("div",{class:"sub"},"Scegli colore maglia (ospite)"));
  const row = h("div",{class:"swatch-row"});
  colorPalette().forEach(hex=>{
    const dot = h("div",{class:"color-dot",style:{backgroundColor:hex},onclick:(ev)=>{
      sel.maglia=hex; [...row.children].forEach(x=>x.classList.remove("selected")); ev.currentTarget.classList.add("selected");
    }});
    row.appendChild(dot);
  });
  bd.appendChild(row);

  // Data & ora
  bd.appendChild(h("div",{class:"sub"},"Data & ora"));
  const dt = h("input",{type:"datetime-local",class:"input",onchange:(e)=>sel.when=e.target.value});
  bd.appendChild(dt);

  // Luogo
  bd.appendChild(h("div",{class:"sub"},"Luogo (indirizzo)"));
  const place = h("input",{type:"text",placeholder:"Via dello Sport 1, Città",class:"input",oninput:(e)=>sel.where=e.target.value});
  bd.appendChild(place);

  // Amichevole + Messaggio
  const chkWrap = h("label",{style:{display:"flex",alignItems:"center",gap:".6rem"}},[
    h("input",{type:"checkbox",onchange:(e)=>sel.friendly=e.target.checked}),
    h("span",{},"Richiedi amichevole")
  ]);
  bd.appendChild(chkWrap);

  bd.appendChild(h("div",{class:"sub"},"Messaggio"));
  const msg = h("textarea",{class:"input",placeholder:"Es. Buonasera mister, proponiamo questi colori... ",oninput:(e)=>sel.note=e.target.value});
  bd.appendChild(msg);

  // Bottoni
  const annulla = h("button",{class:"btn",onclick:()=>document.body.removeChild(overlay)},"Annulla");
  const conferma = h("button",{class:"btn primary",onclick:()=>{
    if(!sel.maglia){ alert("Seleziona il colore della maglia."); return; }
    document.body.removeChild(overlay);
    toast("Richiesta PreMatch inviata ✅");
    console.log("PREMATCH", {club:state.club, ...sel});
  }},"Conferma");
  bar.appendChild(annulla); bar.appendChild(conferma);

  document.body.appendChild(overlay);
}

/* =============== Area Allenatore =============== */
function openCoachGate(){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  sheet.appendChild(h("div",{class:"hd"},"Area Allenatore"));
  const bd = h("div",{class:"bd"});
  sheet.appendChild(bd);
  const bar = h("div",{class:"bar"});
  sheet.appendChild(bar);
  overlay.appendChild(sheet);

  bd.appendChild(h("div",{},"Inserisci il codice fornito dalla società:"));
  const inp = h("input",{type:"text",class:"input",placeholder:"Es. PM-2025"});
  bd.appendChild(inp);

  bar.appendChild(h("button",{class:"btn",onclick:()=>document.body.removeChild(overlay)},"Annulla"));
  bar.appendChild(h("button",{class:"btn primary",onclick:()=>{
    if(inp.value.trim()===DEMO_COACH_CODE){
      document.body.removeChild(overlay);
      pageCoach();
    } else alert("Codice errato.");
  }},"Entra"));
  document.body.appendChild(overlay);
}

function pageCoach(){
  clearMain();
  app.appendChild(sectionTitle("Convocazioni — Allenatore","Demo accesso con codice"));

  const box = h("div",{class:"container panel"});
  const players = ["Rossi","Bianchi","Verdi","Neri","Gialli","Azzurri","Mancini","Ferrari","Esposito","Romano","Colombo","Ricci","Marino","Greco","Bruno","Galli"];
  const selected = new Set();

  // meta partita
  const meta = h("div",{style:{display:"grid",gap:".6rem",gridTemplateColumns:"1fr 1fr"}},[
    h("input",{class:"input",placeholder:"Avversario",id:"opp"}),
    h("input",{type:"datetime-local",class:"input",id:"when"}),
  ]);
  box.appendChild(meta);

  // lista
  players.forEach(p=>{
    const row = h("div",{class:"row"},[
      h("div",{class:"team"},p),
      h("div",{},[
        h("input",{type:"checkbox",onchange:(e)=>{ e.target.checked?selected.add(p):selected.delete(p); }})
      ])
    ]);
    box.appendChild(row);
  });

  // azioni
  const copyBtn = h("button",{class:"btn primary",onclick:()=>{
    const opp = document.getElementById("opp").value || "—";
    const when = document.getElementById("when").value || "—";
    const text = `Convocazione\nAvversario: ${opp}\nQuando: ${when}\nConvocati (${selected.size}): ${[...selected].join(", ")}`;
    navigator.clipboard?.writeText(text).then(()=>toast("Convocazione copiata 📋"));
  }},"Copia convocazione");
  app.appendChild(box);
  app.appendChild(h("div",{class:"container"},[
    copyBtn,
    h("div",{style:{height:"10px"}}),
    h("button",{class:"btn",onclick:()=>pageSports()},"Chiudi area allenatore")
  ]));
}

/* =============== Avvio =============== */
pageSports();

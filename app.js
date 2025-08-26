/* =========================
   PreMatch DEMO - app.js
   ========================= */

/* ---------- Config ---------- */
const IS_VISITOR = true; // demo: visitando pagina avversaria
const LOGOS = {
  light: "./images/logo-light.png",
  dark: "./images/logo-dark.png",
  icon: "./images/logo-icon.png",
};

/* ---------- Dati demo ---------- */
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
  leaguesBy: {
    "Lazio": ["Eccellenza", "Promozione", "Prima Categoria", "Scuola Calcio"],
    "Lombardia": ["Serie C Silver", "Serie D", "Scuola Calcio"],
    "Sicilia": ["Serie C", "Promozione", "Scuola Calcio"],
    "Piemonte": ["Eccellenza", "Scuola Calcio"],
    "Veneto": ["Serie B Interregionale", "Scuola Calcio"],
    "Emilia-Romagna": ["Promozione", "Scuola Calcio"],
  },
  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino", "Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Scuola Calcio": ["Accademia Ragazzi", "Junior Sporting"],
    "Serie C Silver": ["Brixia Basket", "Gorla Team"],
    "Serie D": ["Lario Basket"],
    "Serie C": ["Siracusa Calcio"],
    "Serie B Interregionale": ["Treviso Volley"],
  },
  clubProfiles: {
    "ASD Roma Nord": {
      logo: LOGOS.icon,
      uniforms: { casa: "#e74a3c", trasferta: "#2c3e50", terza: "#2980b9" },
      gallery: ["./images/calcio.jpg", "./images/volley.jpg"],
      sponsors: ["Hotel Demo", "Ristorante Demo"],
      contacts: { email: "info@societa.demo", tel: "+39 000 000 0000", indirizzo:"Via dello Sport 1, Roma" },
      matches: [
        { home: "Prima Squadra", when: "31/08/2025 14:07", where: "Roma — Stadio Olimpico" },
        { home: "Juniores",      when: "01/09/2025 18:30", where: "Roma — Campo Test" },
      ]
    },
  }
};

/* ---------- Stato ---------- */
const state = { sport:null, gender:null, region:null, league:null, club:null };

/* ---------- Helpers DOM ---------- */
const app = document.getElementById("app");

function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k === "class") el.className = v;
    else if (k === "onclick") el.addEventListener("click", v);
    else if (k === "oninput") el.addEventListener("input", v);
    else if (k === "onchange") el.addEventListener("change", v);
    else if (k === "style") Object.assign(el.style, v);
    else el.setAttribute(k, v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if (c==null) return;
    el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
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
/* piccolo helper: mostra feedback tap prima di navigare */
function pressThen(fn, target){
  target.classList.add("pressed");
  setTimeout(()=>{ target.classList.remove("pressed"); fn(); }, 120);
}
function chip(text, active, onClick){
  const el = h("div", {class: "chip"+(active?" active":""), onclick:(e)=>{
    el.classList.add("active");
    setTimeout(()=>onClick(e), 100);
  }}, text);
  return el;
}

/* ---------- Pagine ---------- */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport", "Seleziona per iniziare"));

  const grid = h("div", {class:"container grid"});
  DATA.sports.forEach(s=>{
    const card = h("div", {class:"card"}, [
      h("img", {src:s.img, alt:s.name, onerror(){this.style.display="none"}}),
      h("div", {class:"title"}, s.name)
    ]);
    card.addEventListener("click", ()=> pressThen(()=>{ state.sport=s.key; pageGender(); }, card));
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));

  const box = h("div",{class:"container panel"});
  const row = h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    row.appendChild(
      chip(g, state.gender===g, ()=>{
        state.gender = g;
        pageRegions();
      })
    );
  });
  box.appendChild(row);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageSports()},"Indietro"),
  ]));
  app.appendChild(box);
}

function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione",""));

  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  DATA.regions.forEach(r=>{
    wrap.appendChild(
      chip(r, state.region===r, ()=>{
        state.region = r;
        pageLeagues();
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageGender()},"Indietro"),
  ]));
  app.appendChild(box);
}

function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il campionato", state.region||""));

  const leagues = DATA.leaguesBy[state.region] || [];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  leagues.forEach(l=>{
    wrap.appendChild(
      chip(l, state.league===l, ()=>{
        state.league = l;
        pageClubs();
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageRegions()},"Indietro"),
  ]));
  app.appendChild(box);
}

function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la società", state.league||""));

  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  clubs.forEach(c=>{
    wrap.appendChild(
      chip(c, state.club===c, ()=>{
        state.club = c;
        pageClubProfile(c);
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageLeagues()},"Indietro"),
  ]));
  app.appendChild(box);
}

/* ----- Pagina Società ----- */
function pageClubProfile(clubName){
  clearMain();

  const club = DATA.clubProfiles[clubName] || {
    logo: LOGOS.icon,
    uniforms: {casa:"#ffffff", trasferta:"#000000", terza:"#2ecc71"},
    gallery: [], sponsors: [], contacts:{email:"-", tel:"-", indirizzo:"-"},
    matches: []
  };

  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // Hero con due cerchi uguali
  const hero = h("div",{class:"container club-hero"},[
    h("div",{class:"club-logo"},[
      h("img",{src:club.logo||LOGOS.icon, alt:clubName})
    ]),
    h("div",{},[
      h("div",{class:"prematch-btn", onclick:()=>openPrematchModal(club)},[
        h("img",{src:LOGOS.icon, alt:"PM"})
      ]),
      h("div",{class:"prematch-cta"},"Crea PreMatch")
    ])
  ]);
  app.appendChild(hero);

  // Accordion
  const acc = h("div",{class:"container accordion"});

  // Informazioni
  acc.appendChild(accordionItem("Informazioni", h("div",{},[
    elRow("Indirizzo", club.contacts.indirizzo||"-"),
    elRow("Email", club.contacts.email||"-"),
    elRow("Telefono", club.contacts.tel||"-")
  ])));

  // Galleria
  acc.appendChild(accordionItem("Galleria foto", galleryContent(club.gallery)));

  // Match in programma
  const mPanel = h("div",{});
  (club.matches.length?club.matches:[{home:"—",when:"—",where:"—"}]).forEach(m=>{
    mPanel.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, m.home+" vs —"),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  acc.appendChild(accordionItem("Match in programma", mPanel));

  app.appendChild(acc);

  // Azioni
  app.appendChild(h("div",{class:"container actions"},[
    h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro"),
  ]));
}
function elRow(label, value){
  const d = h("div",{class:"row"});
  d.appendChild(h("div",{class:"team"}, label));
  d.appendChild(h("div",{class:"meta"}, value));
  return d;
}
function accordionItem(title, content){
  const item = h("div",{class:"acc-item"});
  const hd = h("div",{class:"acc-hd"},[
    h("span",{class:"t"}, title),
    h("span",{}, "▾")
  ]);
  const bd = h("div",{class:"acc-bd"}, content);
  hd.addEventListener("click", ()=> item.classList.toggle("open"));
  item.appendChild(hd); item.appendChild(bd);
  return item;
}
function galleryContent(list){
  if (!list || !list.length) return h("div",{class:"sub"},"Nessuna foto caricata.");
  const g = h("div",{class:"grid"});
  list.forEach(src=> g.appendChild(
    h("img",{src, alt:"Foto impianto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}})
  ));
  return g;
}

/* ----- Modale PreMatch ----- */
function openPrematchModal(club){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  overlay.appendChild(sheet);

  const hd = h("div",{class:"hd"},"Crea PreMatch");
  const bd = h("div",{class:"bd"});
  const bar = h("div",{class:"bar"});

  sheet.appendChild(hd); sheet.appendChild(bd); sheet.appendChild(bar);

  // colore maglia
  bd.appendChild(h("div",{class:"sub", style:{margin:"0"}}, "Scegli colore maglia (ospite)"));
  const colors = ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];
  const sel = { maglia:null, when:"", where:"", friendly:false };
  const pal = h("div",{class:"palette"},
    colors.map(c=>{
      const d = h("button",{class:"dot", style:{backgroundColor:c}, onclick:(e)=>{
        [...pal.children].forEach(x=>x.classList.remove("sel"));
        e.currentTarget.classList.add("sel");
        sel.maglia = c;
      }});
    return d;})
  );
  bd.appendChild(pal);

  // data/ora + luogo
  bd.appendChild(h("div",{class:"sub mt8"},"Data & ora"));
  const dt = h("input",{type:"datetime-local", class:"input", onchange:e=> sel.when=e.target.value});
  bd.appendChild(dt);

  bd.appendChild(h("div",{class:"sub mt8"},"Luogo (indirizzo)"));
  const place = h("input",{type:"text", placeholder:"Via dello Sport 1, Città", class:"input", oninput:e=> sel.where=e.target.value});
  bd.appendChild(place);

  // toggle amichevole
  const friendly = h("label",{style:{display:"flex",alignItems:"center",gap:".6rem",marginTop:".4rem"}},[
    h("input",{type:"checkbox", onchange:e=> sel.friendly = e.target.checked}),
    h("span",{},"Richiedi amichevole")
  ]);
  bd.appendChild(friendly);

  // bottoni
  bar.appendChild(h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Annulla"));
  bar.appendChild(h("button",{class:"btn primary", onclick:()=>{
    if(!sel.maglia){ alert("Seleziona il colore della maglia."); return; }
    document.body.removeChild(overlay);
    confirmToast(sel.friendly);
  }},"Conferma"));

  document.body.appendChild(overlay);
}

function confirmToast(isFriendly){
  const msg = isFriendly ? "Richiesta AMICHEVOLE inviata ✅" : "Richiesta PreMatch inviata ✅";
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"800", zIndex:1200, border:"1px solid transparent"
  }}, msg);
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1800);
}

/* ---------- Avvio ---------- */
pageSports();

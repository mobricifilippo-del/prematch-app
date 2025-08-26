/* ---------- Config ---------- */
const IS_VISITOR = true;
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
      contacts: { email: "info@societa.demo", tel: "+39 000 000 0000" },
      matches: [
        { home: "Prima Squadra", when: "31/08/2025 14:07", where: "Roma — Stadio Olimpico" },
        { home: "Juniores",      when: "01/09/2025 18:30", where: "Roma — Campo Test" },
      ]
    },
  }
};

/* ---------- Stato ---------- */
const state = { sport:null, gender:null, region:null, league:null, club:null };
const app = document.getElementById("app");

/* ---------- Helpers DOM ---------- */
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
function pressAnd(go, el){
  el.classList.add("pressed");
  setTimeout(go, 120);
}
function chip(text, isActive, onClick){
  const el = h("div",{class:"chip"+(isActive?" active":""), onclick:()=>pressAnd(onClick, el)},text);
  return el;
}
function gridCard(item, onGo){
  const el = h("div",{class:"card", onclick:()=>pressAnd(onGo, el)},[
    h("img",{src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div",{class:"title"}, item.name)
  ]);
  return el;
}

/* ---------- Topbar: logo chiaro ---------- */
(function fixBrandLogo(){
  const brand = document.querySelector(".brand img");
  if (brand) { brand.src = LOGOS.light; brand.alt = "PreMatch"; }
})();

/* ---------- Pagine ---------- */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare"));
  const grid = h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    grid.appendChild( gridCard({img:s.img, name:s.name}, ()=>{
      state.sport = s.key; pageGender();
    }));
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));
  const box = h("div",{class:"container panel"});
  const row = h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    row.appendChild( chip(g, state.gender===g, ()=>{
      state.gender=g; pageRegions();
    }));
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
    wrap.appendChild( chip(r, state.region===r, ()=>{
      state.region=r; pageLeagues();
    }));
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
    wrap.appendChild( chip(l, state.league===l, ()=>{
      state.league=l; pageClubs();
    }));
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
    wrap.appendChild( chip(c, state.club===c, ()=>{
      state.club=c; pageClubProfile(c);
    }));
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageLeagues()},"Indietro"),
  ]));
  app.appendChild(box);
}

/* ----- Società ----- */
function pageClubProfile(clubName){
  clearMain();
  const club = DATA.clubProfiles[clubName] || {
    logo: LOGOS.icon,
    uniforms: {casa:"#ffffff", trasferta:"#000000", terza:"#2ecc71"},
    gallery: [], sponsors: [], contacts:{email:"-", tel:"-"},
    matches: []
  };
  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // avatar + CTA affiancati (stessa misura 92px)
  const row = h("div",{class:"container", style:{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px", alignItems:"center", justifyItems:"center"}},[
    h("div",{class:"club-avatar"}, [ h("img",{src:club.logo||LOGOS.icon, alt:clubName}) ]),
    h("div",{},[
      h("div",{class:"cta-prematch", onclick:()=>openPrematchModal(club)}, [
        h("img",{src:LOGOS.icon, alt:"PM"})
      ]),
      h("div",{class:"cta-caption"},"Crea PreMatch")
    ])
  ]);
  app.appendChild(row);

  // Accordion
  app.appendChild(accordion("Informazioni", contactsContent(club.contacts)));
  app.appendChild(accordion("Galleria foto", galleryContent(club.gallery)));
  app.appendChild(accordion("Match in programma", matchList(club.matches)));
}

function accordion(title, content){
  const item = h("div",{class:"container acc-item"});
  const head = h("div",{class:"acc-hd"},[
    h("div",{class:"t"}, title),
    h("div",{}, "▾")
  ]);
  const body = h("div",{class:"acc-bd"}, content);
  head.addEventListener("click", ()=> item.classList.toggle("open"));
  item.appendChild(head); item.appendChild(body);
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
function contactsContent(c){
  return h("div",{},[
    h("div",{},"Email: "+(c.email||"-")),
    h("div",{},"Tel: "+(c.tel||"-"))
  ]);
}
function matchList(list){
  const panel = h("div",{class:"panel"});
  (list && list.length ? list : [{home:"—", when:"—", where:"—"}]).forEach(m=>{
    panel.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, m.home+" vs —"),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  return panel;
}

/* ----- PreMatch modal ----- */
function colorPalette(){ return ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"]; }

function openPrematchModal(club){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  const hd = h("div",{class:"hd"},"Crea PreMatch");
  const bd = h("div",{class:"bd"});
  const bar = h("div",{class:"bar"});
  sheet.appendChild(hd); sheet.appendChild(bd); sheet.appendChild(bar); overlay.appendChild(sheet);

  // colore maglia (ospite)
  const chosen = { jersey:null, when:"", where:"", friendly:false, note:"" };
  bd.appendChild(h("div",{class:"sub"},"Scegli colore maglia (ospite)"));
  const row = h("div",{class:"color-row"},
    colorPalette().map(hex=>{
      const b = h("button",{class:"color-dot", style:{backgroundColor:hex}, onclick:()=>{
        chosen.jersey = hex;
        [...row.children].forEach(x=>x.classList.remove("selected"));
        b.classList.add("selected");
      }});
      return b;
    })
  );
  bd.appendChild(row);

  // data/ora
  bd.appendChild(h("div",{class:"sub"},"Data & ora"));
  const dt = h("input",{type:"datetime-local", class:"input", onchange:(e)=>chosen.when=e.target.value});
  bd.appendChild(dt);

  // luogo
  bd.appendChild(h("div",{class:"sub"},"Luogo (indirizzo)"));
  const place = h("input",{type:"text", placeholder:"Via dello Sport 1, Città", class:"input", oninput:(e)=>chosen.where=e.target.value});
  bd.appendChild(place);

  // amichevole
  const chkWrap = h("label",{style:{display:"flex", alignItems:"center", gap:"8px", userSelect:"none"}},[
    h("input",{type:"checkbox", onchange:(e)=>chosen.friendly=e.target.checked}),
    h("span",{},"Richiedi amichevole")
  ]);
  bd.appendChild(chkWrap);

  // messaggio opzionale
  bd.appendChild(h("div",{class:"sub"},"Messaggio per la società (opzionale)"));
  const note = h("textarea",{class:"textarea", placeholder:"Es. Buonasera mister, proponiamo maglia blu. A presto!"});
  note.addEventListener("input", e=> chosen.note = e.target.value);
  bd.appendChild(note);

  // azioni
  const cancel = h("button",{class:"btn", onclick:()=>overlay.remove()},"Annulla");
  const ok = h("button",{class:"btn primary", onclick:()=>{
    if(!chosen.jersey){ alert("Seleziona il colore della maglia."); return; }
    overlay.remove();
    toast("Richiesta PreMatch inviata ✅");
    // qui in reale invieresti chosen + info club/state
    console.log("PREMATCH", {club: state.club, ...chosen});
  }},"Conferma");
  bar.appendChild(cancel); bar.appendChild(ok);

  document.body.appendChild(overlay);
}

function toast(txt){
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"700", zIndex:1200
  }}, txt);
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1800);
}

/* ---------- Avvio ---------- */
pageSports();

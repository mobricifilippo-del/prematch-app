/* =========================
   PreMatch DEMO - app.js
   ========================= */

/* ---------- Config demo ---------- */
const IS_VISITOR = true; // visitatore (società avversaria)
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
function chip(text, active, onClick){
  return h("div", {class: "chip"+(active?" active":""), onclick:onClick}, text);
}
function gridCard(item, onClick){
  const card = h("div", {class:"card"}, [
    h("img", {src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div", {class:"title"}, item.name)
  ]);
  // feedback tap + piccolo delay prima di navigare
  card.addEventListener("click", ()=>{
    card.classList.add("pressed");
    setTimeout(onClick, 120);
  });
  return card;
}

/* ---------- Topbar logo fix ---------- */
(function fixBrandLogo(){
  const brand = document.querySelector(".brand img");
  if (brand) { brand.src = LOGOS.light; brand.alt = "PreMatch"; }
})();

/* ---------- Pagine ---------- */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport", "Seleziona per iniziare"));

  const grid = h("div", {class:"container grid"});
  DATA.sports.forEach(s=>{
    grid.appendChild(
      gridCard({img:s.img, name:s.name}, ()=>{
        state.sport = s.key;
        pageGender();
      })
    );
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));

  const box = h("div",{class:"container panel"});
  const row = h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    const c = chip(g, state.gender===g, ()=>{
      state.gender = g;
      [...row.children].forEach(x=>x.classList.remove("active"));
      c.classList.add("active");
      setTimeout(pageRegions, 120);
    });
    row.appendChild(c);
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
    const c = chip(r, state.region===r, ()=>{
      state.region = r;
      [...wrap.children].forEach(x=>x.classList.remove("active"));
      c.classList.add("active");
      setTimeout(pageLeagues, 120);
    });
    wrap.appendChild(c);
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
    const c = chip(l, state.league===l, ()=>{
      state.league = l;
      [...wrap.children].forEach(x=>x.classList.remove("active"));
      c.classList.add("active");
      setTimeout(pageClubs, 120);
    });
    wrap.appendChild(c);
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
  clubs.forEach(cname=>{
    const c = chip(cname, state.club===cname, ()=>{
      state.club = cname;
      [...wrap.children].forEach(x=>x.classList.remove("active"));
      c.classList.add("active");
      setTimeout(()=>pageClubProfile(cname), 120);
    });
    wrap.appendChild(c);
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

  // Logo + FAB (dimensione uguale)
  const hero = h("div",{class:"container club-hero"},[
    h("div",{class:"club-logo"}, [
      h("img",{src:club.logo||LOGOS.icon, alt:clubName, style:{width:"72px", height:"72px", objectFit:"contain"}})
    ]),
    (IS_VISITOR ? (()=>{
      const wrap = h("div",{},[
        h("div",{class:"fab-match", onclick:()=>openPrematchModal(club)},[
          h("img",{src:LOGOS.icon, alt:"PM"})
        ]),
        h("div",{class:"fab-caption"},"Crea PreMatch")
      ]);
      return wrap;
    })() : h("div"))
  ]);
  app.appendChild(hero);

  // Accordion: info / gallery / matches
  app.appendChild(accordion("Informazioni", [
    h("div",{},"Email: "+(club.contacts.email||"-")),
    h("div",{},"Tel: "+(club.contacts.tel||"-"))
  ]));
  app.appendChild(accordion("Galleria foto", gallery(club.gallery)));
  app.appendChild(accordion("Match in programma", matchesPanel(club.matches)));

  // back
  app.appendChild(h("div",{class:"container actions"},[
    h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro")
  ]));
}

function accordion(title, contentNodes){
  const it = h("div",{class:"container acc-item"});
  const hd = h("div",{class:"acc-hd"},[
    h("div",{class:"t"},title),
    h("div",{}, "▾")
  ]);
  const bd = h("div",{class:"acc-bd"});
  (Array.isArray(contentNodes)?contentNodes:[contentNodes]).forEach(n=>bd.appendChild(n));
  hd.addEventListener("click", ()=> it.classList.toggle("open"));
  it.appendChild(hd); it.appendChild(bd);
  return it;
}
function gallery(list){
  if (!list || !list.length) return h("div",{class:"sub"},"Nessuna foto caricata.");
  const g = h("div",{class:"grid"});
  list.forEach(src=> g.appendChild(
    h("img",{src, alt:"Foto impianto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}})
  ));
  return g;
}
function matchesPanel(list){
  const box = h("div",{});
  (list && list.length ? list : [{home:"—",when:"—",where:"—"}]).forEach(m=>{
    box.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, m.home+" vs —"),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  return box;
}

/* ----- Modale PreMatch ----- */
function openPrematchModal(club){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  const hd = h("div",{class:"hd"},"Crea PreMatch");
  const bd = h("div",{class:"bd"});
  const bar = h("div",{class:"bar"});

  sheet.appendChild(hd); sheet.appendChild(bd); sheet.appendChild(bar); overlay.appendChild(sheet);

  // palette + selezione colore maglia
  bd.appendChild(h("div",{class:"sub"},"Scegli colore maglia (ospite)"));
  const colors = ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];
  const strip = h("div",{style:{
    display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:"10px", background:"#fff",
    padding:"10px", borderRadius:"12px"
  }});
  const sel = { shirt:null, when:"", where:"", friendly:false, note:"" };
  colors.forEach(hex=>{
    const b = h("button",{style:{
      width:"32px", height:"32px", borderRadius:"8px", border:"1px solid #d0d7de", background:hex, cursor:"pointer"
    }});
    b.addEventListener("click", ()=>{
      sel.shirt = hex;
      [...strip.children].forEach(x=>x.style.outline="none");
      b.style.outline = "2px solid var(--accent)";
      b.style.outlineOffset = "2px";
    });
    strip.appendChild(b);
  });
  bd.appendChild(strip);

  // data/ora + luogo
  const dt = h("input",{type:"datetime-local", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}});
  const place = h("input",{type:"text", placeholder:"Via dello Sport 1, Città", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}});
  dt.addEventListener("change", e=> sel.when = e.target.value);
  place.addEventListener("input", e=> sel.where = e.target.value);
  bd.appendChild(h("div",{class:"sub"},"Data & ora"));
  bd.appendChild(dt);
  bd.appendChild(h("div",{class:"sub"},"Luogo (indirizzo)"));
  bd.appendChild(place);

  // amichevole
  const chkWrap = h("label",{style:{display:"flex", alignItems:"center", gap:"10px"}},[
    h("input",{type:"checkbox", onchange:e=> sel.friendly = e.target.checked}),
    h("span",{},"Richiedi amichevole")
  ]);
  bd.appendChild(chkWrap);

  // NUOVO: messaggio testo libero
  bd.appendChild(h("div",{class:"sub"},"Messaggio per la società (opzionale)"));
  const note = h("textarea",{placeholder:"Scrivi un saluto o una nota…", style:{
    width:"100%", minHeight:"80px", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)",
    background:"#0f141a", color:"var(--text)", resize:"vertical"
  }});
  note.addEventListener("input", e=> sel.note = e.target.value);
  bd.appendChild(note);

  // azioni
  const annulla = h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Annulla");
  const conferma = h("button",{class:"btn primary", onclick:()=>{
    if(!sel.shirt){ alert("Seleziona il colore della maglia."); return; }
    document.body.removeChild(overlay);
    confirmToast(sel);
  }},"Conferma");
  bar.appendChild(annulla); bar.appendChild(conferma);

  document.body.appendChild(overlay);
}

function confirmToast(sel){
  const msg =
    "PreMatch inviato ✅"
    + (sel.friendly ? " • Richiesta amichevole" : "")
    + (sel.note ? " • Messaggio incluso" : "");
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"700", zIndex:1200
  }}, msg);
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 2200);
}

/* ---------- Avvio ---------- */
pageSports();

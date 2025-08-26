/* =========================
   PreMatch DEMO - app.js
   ========================= */

/* ---------- Config demo ---------- */
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
    Lazio: ["Eccellenza", "Promozione", "Prima Categoria", "Scuola Calcio"],
    Lombardia: ["Serie C Silver", "Serie D", "Scuola Calcio"],
    Sicilia: ["Serie C", "Promozione", "Scuola Calcio"],
    Piemonte: ["Eccellenza", "Scuola Calcio"],
    Veneto: ["Serie B Interregionale", "Scuola Calcio"],
    "Emilia-Romagna": ["Promozione", "Scuola Calcio"],
  },
  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord", "Virtus Marino"],
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
      contacts: { email: "info@societa.demo", tel: "+39 000 000 0000", impianto:"Centro Sportivo Demo, Roma" },
      matches: [
        { home: "Prima Squadra", when: "31/08/2025 14:07", where: "Roma — Stadio Olimpico" },
        { home: "Juniores",      when: "01/09/2025 18:30", where: "Roma — Campo Test" },
      ]
    },
    "Virtus Marino": {
      logo: LOGOS.icon,
      uniforms: { casa:"#2ecc71", trasferta:"#34495e", terza:"#f39c12" },
      gallery: ["./images/calcio.jpg"],
      sponsors: ["Caffè 2000"],
      contacts: { email:"info@virtus.demo", tel:"+39 000 111 222", impianto:"Centro Sportivo Marino" },
      matches: [{ home:"Prima Squadra", when:"Dom 14:30", where:"Centro Sportivo Demo" }]
    }
  }
};

/* ---------- Stato ---------- */
const state = {
  sport: null, gender: null, region: null, league: null, club: null,
  coachAuth: false
};

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
  return h("div", {class:"card", onclick:onClick}, [
    h("img", {src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div", {class:"title"}, item.name)
  ]);
}
function toast(msg){
  const t = h("div",{class:"toast"},msg);
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1800);
}

/* ---------- Topbar ---------- */
(function mountTopbar(){
  const header = document.querySelector(".topbar");
  if (!header) return;
  header.innerHTML = "";
  const row = h("div",{class:"topbar-row"});
  const brand = h("div",{class:"brand"},[
    h("img",{src:LOGOS.light, alt:"PreMatch"}),
    h("span","PreMatch")
  ]);
  const auth = h("div",{class:"auth"},[
    h("button",{class:"btn", onclick:openCoachGate},"Allenatore"),
    h("button",{class:"btn", onclick:()=>toast("Login (demo)")},"Login"),
    h("button",{class:"btn primary", onclick:()=>toast("Registrazione (demo)")},"Registrazione")
  ]);
  row.appendChild(brand); row.appendChild(auth);
  header.appendChild(row);
})();

/* ---------- Pagine ---------- */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport", "Seleziona per iniziare"));

  const grid = h("div", {class:"container grid"});
  DATA.sports.forEach(s=>{
    const card = gridCard({img:s.img, name:s.name}, ()=>{
      card.classList.add("selected");      // flash visivo
      setTimeout(()=>{ state.sport = s.key; pageGender(); }, 120);
    });
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
      chip(g, state.gender===g, (e)=>{
        [...row.children].forEach(c=>c.classList.remove("active"));
        e.currentTarget.classList.add("active");
        state.gender = g;
        setTimeout(pageRegions, 120);
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
      chip(r, state.region===r, (e)=>{
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        e.currentTarget.classList.add("active");
        state.region = r;
        setTimeout(pageLeagues, 120);
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
      chip(l, state.league===l, (e)=>{
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        e.currentTarget.classList.add("active");
        state.league = l;
        setTimeout(pageClubs, 120);
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
      chip(c, state.club===c, (e)=>{
        [...wrap.children].forEach(x=>x.classList.remove("active"));
        e.currentTarget.classList.add("active");
        state.club = c;
        setTimeout(()=>pageClubProfile(c), 120);
      })
    );
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
    gallery: [], sponsors: [], contacts:{email:"-", tel:"-", impianto:"-"},
    matches: []
  };

  // immagine sport “a caso” (selezionato) per il cerchio sinistro
  const sportImg = (() => {
    const s = DATA.sports.find(x => x.key === state.sport);
    if (s) return s.img;
    // fallback: prima disponibile
    return DATA.sports[0].img;
  })();

  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // header con due cerchi IDENTICI
  const header = h("div",{class:"container club-header"},[
    h("div",{class:"left"},[
      h("div",{class:"club-circle"},[ 
        h("img",{src:sportImg, alt:"Sport", class:"cover"})
      ])
    ]),
    h("div",{class:"pm-wrap"},[
      h("div",{class:"club-circle button", role:"button", tabindex:"0", onclick:()=>openPrematchModal(club)},[
        h("img",{src:LOGOS.light, alt:"PreMatch", class:"cover"})
      ]),
      h("div",{class:"pm-cta"},"Crea PreMatch")
    ])
  ]);
  app.appendChild(header);

  // Accordion: Info / Gallery / Match
  app.appendChild(accordion("Informazioni", infoContent(club.contacts)));
  app.appendChild(accordion("Galleria foto", galleryContent(club.gallery)));
  app.appendChild(accordion("Match in programma", matchesContent(club.matches)));

  app.appendChild(h("div",{class:"container actions"},[
    h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro")
  ]));
}

function infoContent(c){
  const box = h("div",{},[
    h("div",{},"Impianto: "+(c.impianto||"-")),
    h("div",{},"Email: "+(c.email||"-")),
    h("div",{},"Tel: "+(c.tel||"-"))
  ]);
  return box;
}
function galleryContent(list){
  if (!list || !list.length) return h("div",{class:"sub"},"Nessuna foto caricata.");
  const g = h("div",{class:"grid"});
  list.forEach(src=> g.appendChild(
    h("img",{src, alt:"Foto impianto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}})
  ));
  return g;
}
function matchesContent(list){
  const panel = h("div",{});
  (list && list.length ? list : [{home:"—",when:"—",where:"—"}]).forEach(m=>{
    panel.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, m.home+" vs —"),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  return panel;
}
function accordion(title, contentEl){
  const head = h("button",{class:"btn", style:{width:"100%", textAlign:"left", fontWeight:"700"}}, title);
  const body = h("div",{style:{display:"none", marginTop:".6rem"}}, contentEl);
  const wrap = h("div",{class:"container panel"},[head, body]);
  head.addEventListener("click", ()=>{ body.style.display = (body.style.display==="none"?"block":"none"); });
  return wrap;
}

/* ----- Modale PreMatch (con Messaggio + Amichevole) ----- */
function openPrematchModal(club){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  const hd = h("div",{class:"hd"},"Crea PreMatch");
  const bd = h("div",{class:"bd"});
  const bar = h("div",{class:"bar"});
  sheet.appendChild(hd); sheet.appendChild(bd); sheet.appendChild(bar); overlay.appendChild(sheet);

  const palette = ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];
  const sel = { maglia:null, when:"", where:"", friendly:false, note:"" };

  function dot(hex){ 
    const b = h("button",{style:{
      width:"28px", height:"28px", borderRadius:"8px", border:"1px solid #252b35",
      backgroundColor:hex, cursor:"pointer"
    }});
    b.addEventListener("click", (e)=>{
      sel.maglia = hex;
      [...e.currentTarget.parentElement.children].forEach(x=> x.style.outline="none");
      e.currentTarget.style.outline = "2px solid var(--accent)";
      e.currentTarget.style.outlineOffset = "2px";
    });
    return b;
  }

  bd.appendChild(h("div",{class:"sub"},"Scegli colore maglia (ospite)"));
  bd.appendChild(h("div",{style:{display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:"8px", background:"#fff", padding:"10px", borderRadius:"12px"}},
    palette.map(dot)
  ));

  bd.appendChild(h("div",{class:"sub"},"Data & ora"));
  const dt = h("input",{type:"datetime-local", class:"input", onchange:(e)=> sel.when = e.target.value});
  bd.appendChild(dt);

  bd.appendChild(h("div",{class:"sub"},"Luogo (indirizzo)"));
  const place = h("input",{type:"text", class:"input", placeholder:"Via dello Sport 1, Città", oninput:(e)=> sel.where = e.target.value});
  bd.appendChild(place);

  // amichevole
  const chk = h("label",{style:{display:"flex", alignItems:"center", gap:".6rem"}},[
    h("input",{type:"checkbox", onchange:(e)=> sel.friendly = e.target.checked}),
    h("span","Richiedi amichevole")
  ]);
  bd.appendChild(chk);

  // messaggio all’avversario
  bd.appendChild(h("div",{class:"sub"},"Messaggio per l’avversario"));
  const msg = h("textarea",{class:"input", placeholder:"Es. Buonasera mister, proponiamo questi colori...", oninput:(e)=> sel.note = e.target.value});
  bd.appendChild(msg);

  const annulla = h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Annulla");
  const conferma = h("button",{class:"btn primary", onclick:()=>{
    document.body.removeChild(overlay);
    toast("Richiesta PreMatch inviata ✅");
    console.log("PREMATCH",{club:state.club, ...sel});
  }},"Conferma");
  bar.appendChild(annulla); bar.appendChild(conferma);

  document.body.appendChild(overlay);
}

/* ---------- Angolo allenatore (codice + convocazioni) ---------- */
function openCoachGate(){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  const hd = h("div",{class:"hd"},"Area Allenatore");
  const bd = h("div",{class:"bd"});
  const bar = h("div",{class:"bar"});
  sheet.appendChild(hd); sheet.appendChild(bd); sheet.appendChild(bar); overlay.appendChild(sheet);

  const inp = h("input",{type:"text", class:"input", placeholder:"Inserisci codice (es. PM-1234)"});
  bd.appendChild(inp);

  const annulla = h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Chiudi");
  const ok = h("button",{class:"btn primary", onclick:()=>{
    if (inp.value.trim().toUpperCase() === "PM-1234"){
      state.coachAuth = true;
      document.body.removeChild(overlay);
      pageCoach();
    } else {
      toast("Codice non valido");
    }
  }},"Entra");
  bar.appendChild(annulla); bar.appendChild(ok);

  document.body.appendChild(overlay);
}

function pageCoach(){
  clearMain();
  app.appendChild(sectionTitle("Convocazioni", state.club ? `Società: ${state.club}` : "Demo"));

  const key = "pm_convocazioni";
  const saved = JSON.parse(localStorage.getItem(key) || "[]");

  const box = h("div",{class:"container panel"});
  const help = h("div",{class:"sub"},"Aggiungi i convocati (uno per riga). Rimangono salvati solo su questo dispositivo.");
  const ta = h("textarea",{class:"input", placeholder:"Mario Rossi\nLuca Bianchi\n…"});
  ta.value = saved.join("\n");
  const actions = h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>{
      const list = ta.value.split("\n").map(s=>s.trim()).filter(Boolean);
      localStorage.setItem(key, JSON.stringify(list));
      toast("Convocazioni salvate");
    }},"Salva"),
    h("button",{class:"btn primary", onclick:()=>{
      const list = ta.value.split("\n").map(s=>s.trim()).filter(Boolean);
      showConvocati(list);
    }},"Mostra convocati")
  ]);
  box.appendChild(help); box.appendChild(ta); box.appendChild(actions);
  app.appendChild(box);

  function showConvocati(list){
    const p = h("div",{class:"container panel"});
    if (!list.length){ p.appendChild(h("div",{class:"sub"},"Nessuno inserito.")); app.appendChild(p); return; }
    list.forEach(n=>{
      p.appendChild(h("div",{class:"row"},[
        h("div",{class:"team"}, n),
        h("div",{class:"meta"},"convocato")
      ]));
    });
    app.appendChild(p);
  }

  app.appendChild(h("div",{class:"container actions"},[
    h("button",{class:"btn", onclick:()=>pageSports()},"Home")
  ]));
}

/* ---------- Avvio ---------- */
pageSports();

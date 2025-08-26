/* =========================
   PreMatch DEMO - app.js
   ========================= */

/* ---------- Config/logo ---------- */
const LOGOS = {
  light: "./images/logo-light.png", // topbar (dark background)
  dark: "./images/logo-dark.png",   // PDF/sfondi chiari
  icon: "./images/logo-icon.png",   // tondo
};

/* ---------- AUTENTICAZIONE (mock) ---------- */
/* Salva solo in localStorage: {name, role: 'societa'|'utente'} */
const Auth = {
  get(){ try{ return JSON.parse(localStorage.getItem("pm_user")) || null; }catch(e){ return null; } },
  set(u){ localStorage.setItem("pm_user", JSON.stringify(u)); renderAuth(); },
  clear(){ localStorage.removeItem("pm_user"); renderAuth(); }
};
function renderAuth(){
  const mount = document.getElementById("auth");
  const u = Auth.get();
  mount.innerHTML = "";
  if (!u){
    mount.appendChild(btn("Accedi", ()=>openAuthModal("login"), "link"));
    mount.appendChild(btn("Registrati", ()=>openAuthModal("register"), "primary"));
  }else{
    mount.appendChild(el("span",{class:"name"},`👤 ${u.name} • ${u.role==='societa'?'Società':'Utente'}`));
    mount.appendChild(btn("Esci", ()=>Auth.clear(), "link"));
  }
}
function openAuthModal(mode){
  const overlay = el("div",{class:"overlay"});
  const sheet = el("div",{class:"sheet"});
  overlay.appendChild(sheet);

  sheet.appendChild(el("div",{class:"hd"}, mode==="login"?"Accedi":"Registrati"));
  const bd = el("div",{class:"bd"});
  const bar = el("div",{class:"bar"});
  sheet.appendChild(bd); sheet.appendChild(bar);

  const name = inputText("Nome/Club");
  const roleWrap = el("div",{},[
    label("Sei una:"),
    el("div",{class:"chips"},[
      chip("Società", false, ()=>selectRole("societa")),
      chip("Utente", false, ()=>selectRole("utente"))
    ])
  ]);
  let role = null;
  function selectRole(r){
    role = r;
    [...roleWrap.querySelectorAll(".chip")].forEach(c=>c.classList.remove("active"));
    const t = r==="societa" ? "Società" : "Utente";
    [...roleWrap.querySelectorAll(".chip")].find(x=>x.textContent===t).classList.add("active");
  }

  bd.appendChild(name.wrap);
  bd.appendChild(roleWrap);

  bar.appendChild(btn("Annulla", ()=>overlay.remove()));
  bar.appendChild(btn(mode==="login"?"Accedi":"Crea account", ()=>{
    if (!name.input.value) return alert("Inserisci il nome.");
    if (!role) return alert("Seleziona il ruolo.");
    Auth.set({name:name.input.value.trim(), role});
    overlay.remove();
  },"primary"));

  document.body.appendChild(overlay);
}

/* ---------- Dati DEMO ---------- */
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
      gallery: ["./images/calcio.jpg","./images/volley.jpg"],
      sponsors: ["Hotel Demo", "Ristorante Demo"],
      contacts: { email: "info@societa.demo", tel: "+39 000 000 0000" },
      uniforms: { casa: "#e74a3c", trasferta: "#2c3e50", terza: "#2980b9" },
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

function el(tag, attrs={}, children=[]){
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k==="class") n.className=v;
    else if (k==="onclick") n.addEventListener("click", v);
    else if (k==="onchange") n.addEventListener("change", v);
    else if (k==="style") Object.assign(n.style, v);
    else n.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if (c==null) return;
    n.appendChild(typeof c==="string"?document.createTextNode(c):c);
  });
  return n;
}
function btn(label, onClick, extraClass=""){ return el("button",{class:`btn ${extraClass}`.trim(), onclick:onClick},label); }
function label(text){ return el("div",{class:"sub", style:{margin:"0 0 6px 0"}}, text); }
function inputText(ph){ 
  const input = el("input",{type:"text",placeholder:ph,style:{width:"100%",padding:"10px",borderRadius:"10px",border:"1px solid var(--border)",background:"#0f141a",color:"var(--text)"}});
  return {input, wrap: el("div",{},[label(ph), input])};
}
function chip(text, active, onClick){
  return el("div",{class:`chip chip-green${active?" active":""}`, onclick:onClick},text);
}
function sectionTitle(title, subtitle){
  return el("div",{class:"container"},[
    el("div",{class:"h1"},title),
    el("div",{class:"sub"},subtitle||"")
  ]);
}

/* ---------- HOME ---------- */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare"));

  const grid = el("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    const card = el("div",{class:"card", onclick:()=>{
      // feedback visivo
      card.classList.add("selected");
      setTimeout(()=>{ card.classList.remove("selected"); proceed(); }, 140);
      function proceed(){ state.sport = s.key; pageGender(); }
    }},[
      el("img",{src:s.img,alt:s.name, onerror(){this.style.display="none"}}),
      el("div",{class:"title"}, s.name)
    ]);
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

/* ---------- GENERE ---------- */
function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));

  const box = el("div",{class:"container panel"});
  const row = el("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    row.appendChild(
      chip(g, state.gender===g, ()=>{
        state.gender=g;
        [...row.children].forEach(c=>c.classList.remove("active"));
        event.currentTarget.classList.add("active");
        pageRegions();
      })
    );
  });
  box.appendChild(row);
  box.appendChild(el("div",{class:"actions"},[btn("Indietro", ()=>pageSports())]));
  app.appendChild(box);
}

/* ---------- REGIONI ---------- */
function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione",""));

  const box = el("div",{class:"container panel"});
  const row = el("div",{class:"chips"});
  DATA.regions.forEach(r=>{
    row.appendChild(
      chip(r, state.region===r, ()=>{
        state.region=r;
        [...row.children].forEach(c=>c.classList.remove("active"));
        event.currentTarget.classList.add("active");
        pageLeagues();
      })
    );
  });
  box.appendChild(row);
  box.appendChild(el("div",{class:"actions"},[btn("Indietro", ()=>pageGender())]));
  app.appendChild(box);
}

/* ---------- CAMPIONATI ---------- */
function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il campionato", state.region||""));

  const leagues = DATA.leaguesBy[state.region] || [];
  const box = el("div",{class:"container panel"});
  const row = el("div",{class:"chips"});
  leagues.forEach(l=>{
    row.appendChild(
      chip(l, state.league===l, ()=>{
        state.league=l;
        [...row.children].forEach(c=>c.classList.remove("active"));
        event.currentTarget.classList.add("active");
        pageClubs();
      })
    );
  });
  box.appendChild(row);
  box.appendChild(el("div",{class:"actions"},[btn("Indietro", ()=>pageRegions())]));
  app.appendChild(box);
}

/* ---------- SOCIETÀ (lista) ---------- */
function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la società", state.league||""));

  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  const box = el("div",{class:"container panel"});
  const row = el("div",{class:"chips"});
  clubs.forEach(c=>{
    row.appendChild(
      chip(c, state.club===c, ()=>{
        state.club=c;
        [...row.children].forEach(x=>x.classList.remove("active"));
        event.currentTarget.classList.add("active");
        pageClubProfile(c);
      })
    );
  });
  box.appendChild(row);
  box.appendChild(el("div",{class:"actions"},[btn("Indietro", ()=>pageLeagues())]));
  app.appendChild(box);
}

/* ---------- PAGINA SOCIETÀ ---------- */
function pageClubProfile(clubName){
  clearMain();

  const club = DATA.clubProfiles[clubName] || {
    logo: LOGOS.icon,
    gallery: [], sponsors: [], contacts:{email:"-", tel:"-"},
    uniforms: {casa:"#ffffff", trasferta:"#000000"},
    matches: []
  };

  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // Logo centrale
  app.appendChild(el("div",{class:"container", style:{display:"flex",justifyContent:"center"}},[
    el("img",{src:club.logo||LOGOS.icon, alt:clubName, class:"avatar"})
  ]));

  // Divise (mostro solo colori ufficiali già impostati dalla società)
  const uni = club.uniforms || {};
  const panel = el("div",{class:"container panel"});
  panel.appendChild(el("div",{class:"h2", style:{fontWeight:"800"}}, "Colori divise (ufficiali società)"));
  panel.appendChild(el("div",{class:"sub"},"Casa / Trasferta / Terza (se presente)"));
  const row = el("div",{style:{display:"flex", gap:"10px", marginTop:"8px", alignItems:"center"}},[
    swatch(uni.casa||"#ccc"),
    swatch(uni.trasferta||"#555"),
    uni.terza ? swatch(uni.terza) : el("span",{})
  ]);
  panel.appendChild(row);
  app.appendChild(panel);

  // Info extra in accordion
  app.appendChild(accordion("Galleria foto", gallery(club.gallery)));
  app.appendChild(accordion("Sponsor", sponsor(club.sponsors)));
  app.appendChild(accordion("Contatti", contacts(club.contacts)));

  // Prossime partite
  const mpanel = el("div",{class:"container panel"});
  mpanel.appendChild(el("div",{class:"h2", style:{fontWeight:"800", color:"var(--accent)"}}, "Prossime partite"));
  (club.matches.length?club.matches:[{home:"—",when:"—",where:"—"}]).forEach(m=>{
    mpanel.appendChild(el("div",{class:"row"},[
      el("div",{class:"team"}, `${m.home} vs —`),
      el("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });

  // Azioni
  const actions = el("div",{class:"actions"},[
    btn("Indietro", ()=>pageClubs())
  ]);

  // Mostra “Crea PreMatch” se:
  // - sei loggato
  // - e sei una Società
  // (nel reale potrai anche impedire il bottone sulla “tua” pagina)
  const u = Auth.get();
  if (u && u.role === "societa"){
    actions.appendChild(createPrematchButton(clubName));
  }

  app.appendChild(mpanel);
  app.appendChild(el("div",{class:"container"}, actions));
}

/* ---------- Componenti utili ---------- */
function accordion(title, content){
  const wrap = el("div",{class:"container panel"});
  const hd = btn(title, ()=>toggle(), "");
  hd.style.width="100%"; hd.style.textAlign="left";
  hd.style.fontWeight="800";
  const bd = el("div",{style:{display:"none", marginTop:".6rem"}}, content);
  wrap.appendChild(hd); wrap.appendChild(bd);
  function toggle(){ bd.style.display = bd.style.display==="none" ? "block" : "none"; }
  return wrap;
}
function gallery(list){
  if (!list || !list.length) return el("div",{class:"sub"},"Nessuna foto caricata.");
  const g = el("div",{class:"grid"});
  list.forEach(src=> g.appendChild(el("img",{src, alt:"Foto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}})));
  return g;
}
function sponsor(list){
  if (!list || !list.length) return el("div",{class:"sub"},"Nessuno sponsor collegato.");
  const ul = el("ul"); list.forEach(n=>ul.appendChild(el("li",{},n))); return ul;
}
function contacts(c){
  return el("div",{},[
    el("div",{},"Email: "+(c.email||"-")),
    el("div",{},"Tel: "+(c.tel||"-"))
  ]);
}
function swatch(hex){ return el("span",{style:{display:"inline-block", width:"24px", height:"24px", borderRadius:"6px", border:"1px solid #d0d7de", background:hex}}); }

/* ---------- PreMatch (solo MAGLIA) ---------- */
function createPrematchButton(clubName){
  const b = btn("Crea PreMatch", ()=>openPrematchModal(clubName), "primary");
  // badge con logo
  b.style.display="inline-flex"; b.style.alignItems="center"; b.style.gap=".5rem";
  b.prepend(el("img",{src:LOGOS.icon, alt:"PM", style:{width:"18px", height:"18px", borderRadius:"4px"}}));
  return b;
}
function openPrematchModal(clubName){
  const overlay = el("div",{class:"overlay"});
  const sheet = el("div",{class:"sheet"});
  overlay.appendChild(sheet);
  sheet.appendChild(el("div",{class:"hd"},"Crea PreMatch"));
  const bd = el("div",{class:"bd"});
  const bar = el("div",{class:"bar"});
  sheet.appendChild(bd); sheet.appendChild(bar);

  // Colore maglia ospite (SOLO maglia)
  bd.appendChild(label("Scegli colore maglia (ospite)"));
  const colors = ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];
  let sel = { maglia:null, when:"", where:"" };
  const row = el("div",{class:"color-row"},
    colors.map(hex=> colorDot(hex,false,()=>{
      sel.maglia = hex;
      [...row.children].forEach(n=>n.classList.remove("selected"));
      event.currentTarget.classList.add("selected");
    }))
  );
  bd.appendChild(row);

  // Data/Ora + Luogo
  const dt = el("input",{type:"datetime-local", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}, onchange:e=>sel.when=e.target.value});
  const place = el("input",{type:"text", placeholder:"Via dello Sport 1, Città", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}, onchange:e=>sel.where=e.target.value});
  bd.appendChild(el("div",{},[label("Data & ora"), dt]));
  bd.appendChild(el("div",{},[label("Campo / indirizzo"), place]));

  bar.appendChild(btn("Annulla", ()=>overlay.remove()));
  bar.appendChild(btn("Conferma", ()=>{
    if(!sel.maglia) return alert("Seleziona il colore maglia.");
    if(!sel.when) return alert("Inserisci data/ora.");
    if(!sel.where) return alert("Inserisci il campo/indirizzo.");
    overlay.remove();
    showPrematchSummary(clubName, sel);
  }, "primary"));

  document.body.appendChild(overlay);
}
function showPrematchSummary(clubName, sel){
  const overlay = el("div",{class:"overlay"});
  const sheet = el("div",{class:"sheet"});
  overlay.appendChild(sheet);

  const tit = `${state.league||""} • ${state.gender||""} • ${state.region||""}`;
  sheet.appendChild(el("div",{class:"hd"},"Riepilogo PreMatch"));
  const bd = el("div",{class:"bd"});
  const bar = el("div",{class:"bar"});
  sheet.appendChild(bd); sheet.appendChild(bar);

  const u = Auth.get();
  const myClub = u?.role==="societa" ? (u.name || "Società A") : "Società A";
  const other = clubName || "Società B";

  bd.appendChild(el("div",{},[
    el("div",{class:"sub"}, tit),
    el("div",{style:{fontWeight:"800", margin:"6px 0 8px 0"}}, `${myClub} vs ${other}`),
  ]));
  bd.appendChild(el("div",{},[
    el("div",{class:"sub"},"Colore maglia (ospite)"),
    swatch(sel.maglia)
  ]));
  bd.appendChild(el("div",{},[
    el("div",{class:"sub"},"Data & ora"),
    el("div",{}, sel.when || "—")
  ]));
  bd.appendChild(el("div",{},[
    el("div",{class:"sub"},"Campo / indirizzo"),
    el("div",{}, sel.where || "—")
  ]));

  bar.appendChild(btn("Chiudi", ()=>overlay.remove()));
  bar.appendChild(btn("Invia richiesta", ()=>{
    toast("Richiesta PreMatch inviata ✅");
    overlay.remove();
  },"primary"));

  document.body.appendChild(overlay);
}

/* ---------- Utils ---------- */
function clearMain(){ app.innerHTML=""; }
function toast(msg){
  const t = el("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"800", zIndex:1200
  }}, msg);
  document.body.appendChild(t); setTimeout(()=>t.remove(),1800);
}

/* ---------- Avvio ---------- */
renderAuth();
pageSports();

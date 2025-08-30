/* ======================================================
   PreMatch – app.js (SPA semplice con viste dinamiche)
   ====================================================== */

/* ---- Config loghi (stessi nomi della cartella /images) ---- */
const LOGOS = {
  light: "images/logo-light.png",
  dark:  "images/logo-dark.png",
  icon:  "images/logo-icon.png",
};

/* ---- Dati demo (sostituibili poi con backend) ---- */
const DATA = {
  sports: [
    { key: "calcio",     name: "Calcio",     img: "images/calcio.jpg" },
    { key: "futsal",     name: "Futsal",     img: "images/futsal.jpg" },
    { key: "basket",     name: "Basket",     img: "images/basket.jpg" },
    { key: "volley",     name: "Volley",     img: "images/volley.jpg" },
    { key: "rugby",      name: "Rugby",      img: "images/rugby.jpg" },
    { key: "pallanuoto", name: "Pallanuoto", img: "images/pallanuoto.jpg" },
  ],
  genders: ["Maschile", "Femminile"],
  regions: ["Lazio", "Lombardia", "Piemonte", "Veneto", "Sicilia", "Emilia-Romagna"],
  leaguesBy: { // in reale incrocerai sport+genere+regione
    "Lazio": ["Serie A", "Eccellenza", "Promozione", "Scuola Calcio"],
    "Lombardia": ["Serie C Silver", "Serie D", "Scuola Calcio"],
    "Piemonte": ["Eccellenza"],
    "Veneto": ["Serie B Interregionale"],
    "Sicilia": ["Serie C", "Promozione"],
    "Emilia-Romagna": ["Promozione"]
  },
  clubsByLeague: {
    "Serie A": ["Roma Femminile", "Juventus Women"],
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino", "Borghesiana FC"],
    "Scuola Calcio": ["Accademia Ragazzi", "Junior Sporting"],
    "Serie C Silver": ["Brixia Basket", "Gorla Team"],
    "Serie D": ["Lario Basket"],
    "Serie C": ["Siracusa Calcio"],
    "Serie B Interregionale": ["Treviso Volley"]
  },
  clubProfiles: {
    "ASD Roma Nord": {
      logo: LOGOS.icon,
      uniforms: { casa:"#e74a3c", trasferta:"#2c3e50" },
      gallery: ["images/calcio.jpg"],
      sponsors: ["Hotel Demo", "Ristorante Demo"],
      contacts: { email:"info@romanor.example", tel:"+39 000 000 0000" },
      matches: [
        { home:"Prima Squadra", when:"31/08/2025 14:00", where:"Roma — Stadio Olimpico", status:"Confermato" },
        { home:"Juniores", when:"01/09/2025 18:30", where:"Roma — Campo Test", status:"In attesa" }
      ]
    }
  }
};

/* ---- Stato SPA ---- */
const state = {
  sport: null,
  gender: null,
  region: null,
  league: null,
  club: null
};

const app = document.getElementById("app");

/* ---------- Helpers DOM ---------- */
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k === "onclick") el.addEventListener("click", v, { passive: true });
    else if (k === "onchange") el.addEventListener("change", v);
    else if (k === "oninput") el.addEventListener("input", v);
    else if (k === "style") Object.assign(el.style, v);
    else el.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return el;
}
function clearMain(){ app.innerHTML = ""; }
function titleBlock(t, sub){
  return h("div",{class:"container"},[
    h("div",{class:"h1"}, t),
    h("div",{class:"sub"}, sub||"")
  ]);
}
function chip(text, active, onClick){
  return h("div",{class:"chip"+(active?" active":""), onclick:onClick}, text);
}
function selectField(placeholder, options, value, onChange){
  const sel = h("select",{class:"select", onchange:onChange, style:{
    width:"100%", padding:"12px", borderRadius:"12px",
    border:"1px solid var(--border)", background:"#10161a", color:"var(--text)"
  }});
  const opt0 = h("option",{value:""}, placeholder);
  sel.appendChild(opt0);
  options.forEach(o => {
    sel.appendChild(h("option",{value:o, selected: value===o ? "selected":null}, o));
  });
  return sel;
}
function cardSport(item){
  return h("div",{class:"card card-sport", "data-sport":item.key},[
    h("img",{src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div",{class:"title"}, item.name)
  ]);
}
function toastOk(text){
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"700", zIndex:1200
  }}, text);
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1600);
}

/* ---------- Viste ---------- */
// HOME: griglia sport, click “accende” e poi passa alla vista Filtri
function viewHome(){
  clearMain();
  // forza il logo chiaro in alto a sinistra (se presente nell'header)
  const brandImg = document.querySelector(".brand img");
  if (brandImg) brandImg.src = LOGOS.light;

  app.appendChild(titleBlock("Scegli lo sport","Seleziona per iniziare"));

  const grid = h("div",{class:"container grid", id:"sportGrid"});
  DATA.sports.forEach(s => grid.appendChild(cardSport(s)));
  app.appendChild(grid);

  // Effetto “selected” e passaggio a Filtri
  grid.querySelectorAll(".card-sport").forEach(card=>{
    card.addEventListener("click", ()=>{
      grid.querySelectorAll(".card-sport").forEach(c=>c.classList.remove("selected"));
      card.classList.add("selected");
      state.sport = card.getAttribute("data-sport");
      setTimeout(()=> viewFilters(), 140);
    },{passive:true});
  });
}

/* Filtri in UNA PAGINA: Genere → Regione → Campionato (tendine progressive) */
function viewFilters(){
  clearMain();
  app.appendChild(titleBlock("Filtra la ricerca","Genere • Regione • Campionato"));

  const box = h("div",{class:"container panel"});
  // 1) GENERE (chips)
  const gWrap = h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    gWrap.appendChild(chip(g, state.gender===g, ()=>{
      state.gender = g;
      [...gWrap.children].forEach(c=>c.classList.remove("active"));
      event.currentTarget.classList.add("active");
      // sblocca Regione
      regionSel.disabled = false;
      regionSel.focus();
    }));
  });

  // 2) REGIONE (select)
  const regionSel = selectField("Scegli regione…", DATA.regions, state.region, (e)=>{
    state.region = e.target.value || null;
    // quando scelgo regione, preparo le leghe e sblocco campionati
    const leagues = state.region ? (DATA.leaguesBy[state.region]||[]) : [];
    leagueSel.innerHTML = ""; // reset
    leagueSel.appendChild(h("option",{value:""},"Scegli campionato…"));
    leagues.forEach(l => leagueSel.appendChild(h("option",{value:l}, l)));
    leagueSel.disabled = leagues.length===0;
    if (leagues.length) leagueSel.focus();
  });
  regionSel.disabled = !state.gender;

  // 3) CAMPIONATO (select) → al change va alla lista società
  const leagueSel = selectField("Scegli campionato…", [], state.league, (e)=>{
    const v = e.target.value || null;
    state.league = v;
    if (v) viewClubs();
  });
  leagueSel.disabled = true;

  box.appendChild(h("div",{},[
    h("div",{class:"sub"}, "Genere"),
    gWrap
  ]));
  box.appendChild(h("div",{style:{marginTop:"10px"}},[
    h("div",{class:"sub"},"Regione"),
    regionSel
  ]));
  box.appendChild(h("div",{style:{marginTop:"10px"}},[
    h("div",{class:"sub"},"Campionato"),
    leagueSel
  ]));

  // Azione sola: Indietro
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>viewHome()},"Indietro")
  ]));

  app.appendChild(box);
}

/* Lista società (chips) */
function viewClubs(){
  clearMain();
  app.appendChild(titleBlock("Scegli la società", `${state.gender||""} • ${state.region||""} • ${state.league||""}`));

  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  clubs.forEach(c=>{
    wrap.appendChild(
      chip(c, state.club===c, ()=>{
        state.club = c;
        [...wrap.children].forEach(x=>x.classList.remove("active"));
        event.currentTarget.classList.add("active");
        viewClubDetail(c);
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>viewFilters()},"Indietro")
  ]));
  app.appendChild(box);
}

/* Pagina società */
function viewClubDetail(clubName){
  clearMain();

  const club = DATA.clubProfiles[clubName] || {
    logo: LOGOS.icon,
    uniforms: { casa:"#2ecc71", trasferta:"#000000" },
    gallery: [], sponsors: [], contacts:{email:"-",tel:"-"},
    matches: []
  };

  app.appendChild(titleBlock(clubName, `${state.gender||""} • ${state.region||""} • ${state.league||""}`));

  // Riga logo + bottone PreMatch (stessa dimensione 92x92, tondi)
  const headerRow = h("div",{class:"container", style:{display:"flex", alignItems:"center"}},[
    h("img",{src:club.logo||LOGOS.icon, alt:clubName, class:"logo",
      style:{
        width:"92px", height:"92px", borderRadius:"50%", border:"1px solid var(--border)",
        background:"#0b0f14", padding:"10px", objectFit:"contain"
      }}),
    h("button",{class:"prematch-btn", style:{
      width:"92px", height:"92px", borderRadius:"50%", marginLeft:"14px",
      background:"var(--accent)", border:"none", display:"flex",
      alignItems:"center", justifyContent:"center", cursor:"pointer"
    }, onclick:()=>openPrematchModal(clubName)},[
      h("img",{src:LOGOS.icon, alt:"PM", style:{width:"42px", height:"42px"}})
    ])
  ]);
  app.appendChild(headerRow);

  // Accordion: Info / Gallery / Match
  app.appendChild(accordion("Informazioni", infoContent(club)));
  app.appendChild(accordion("Galleria foto", galleryContent(club.gallery)));
  app.appendChild(accordion("Match in programma", matchesContent(club.matches)));

  // Azioni
  app.appendChild(h("div",{class:"container actions"},[
    h("button",{class:"btn", onclick:()=>viewClubs()},"Indietro"),
  ]));
}

/* Contenuti accordion */
function accordion(title, bodyEl){
  const card = h("div",{class:"container panel"});
  const hd = h("button",{class:"btn", style:{width:"100%", textAlign:"left", fontWeight:"800"}}, title);
  const bd = h("div",{style:{display:"none", marginTop:"10px"}}, bodyEl);
  hd.addEventListener("click", ()=>{
    bd.style.display = (bd.style.display==="none" ? "block" : "none");
  });
  card.appendChild(hd);
  card.appendChild(bd);
  return card;
}
function infoContent(c){
  return h("div",{},[
    h("div",{},"Email: "+(c.contacts?.email||"-")),
    h("div",{},"Tel: "+(c.contacts?.tel||"-")),
    h("div",{},"Sponsor: "+(c.sponsors?.join(", ")||"—"))
  ]);
}
function galleryContent(list){
  if (!list || !list.length) return h("div",{class:"sub"},"Nessuna foto caricata.");
  const g = h("div",{class:"grid"});
  list.forEach(src => g.appendChild(h("img",{src, alt:"Foto impianto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}})));
  return g;
}
function matchesContent(list){
  if (!list || !list.length) return h("div",{class:"sub"},"Nessuna partita programmata.");
  const box = h("div",{});
  list.forEach(m=>{
    const badge = m.status==="Confermato" ? "🟢 PREMATCH CONFERMATO" : "🔴 Prematch in attesa di verifica";
    box.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, `${m.home} vs —`),
      h("div",{class:"meta"}, `${m.when} — ${m.where} • ${badge}`)
    ]));
  });
  return box;
}

/* ---- Modale PreMatch (con messaggio testuale) ---- */
function openPrematchModal(clubName){
  const overlay = h("div",{style:{
    position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:1000,
    display:"flex", justifyContent:"center", alignItems:"flex-start", paddingTop:"8vh"
  }});
  const modal = h("div",{style:{
    width:"min(640px, 92%)", background:"#11161c", color:"var(--text)",
    border:"1px solid var(--border)", borderRadius:"16px", overflow:"hidden",
    boxShadow:"0 20px 60px rgba(0,0,0,.45)"
  }});

  const hd = h("div",{style:{padding:"14px 16px", fontWeight:"800", fontSize:"1.2rem", borderBottom:"1px solid var(--border)"}}, `Crea PreMatch — ${clubName}`);
  const bd = h("div",{style:{padding:"16px", display:"grid", gap:"14px"}});
  const ft = h("div",{style:{padding:"12px 16px", display:"flex", gap:"8px", justifyContent:"flex-end", borderTop:"1px solid var(--border)"}});

  // Colore maglia OSPITE (solo maglia)
  bd.appendChild(h("div",{class:"sub"},"Colore maglia (ospite)"));
  const palette = ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#8e44ad","#e67e22"];
  const sel = { maglia:null, when:"", where:"", note:"", tipo:"Gara ufficiale" };

  const gridColors = h("div",{style:{
    display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:"8px", background:"#fff", padding:"10px", borderRadius:"12px"
  }});
  palette.forEach(hex=>{
    const b = h("button",{style:{
      width:"28px", height:"28px", borderRadius:"8px", border:"1px solid #252b35", background:hex, cursor:"pointer"
    }, onclick:()=>{
      sel.maglia = hex;
      [...gridColors.children].forEach(x=>x.style.outline="none");
      b.style.outline = "2px solid var(--accent)";
      b.style.outlineOffset = "2px";
    }});
    gridColors.appendChild(b);
  });
  bd.appendChild(gridColors);

  // Tipo (Gara / Amichevole)
  bd.appendChild(h("div",{class:"sub", style:{marginTop:"6px"}}, "Tipo partita"));
  const tipoSel = selectField("", ["Gara ufficiale","Amichevole"], sel.tipo, (e)=> sel.tipo = e.target.value);
  bd.appendChild(tipoSel);

  // Data/Ora + Luogo
  bd.appendChild(h("div",{class:"sub"}, "Data & ora"));
  const dt = h("input",{type:"datetime-local", oninput:e=>sel.when=e.target.value, style:{
    width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"
  }});
  bd.appendChild(dt);

  bd.appendChild(h("div",{class:"sub"}, "Luogo (indirizzo)"));
  const place = h("input",{type:"text", placeholder:"Via dello Sport 1, Città", oninput:e=>sel.where=e.target.value, style:{
    width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"
  }});
  bd.appendChild(place);

  // Messaggio facoltativo
  bd.appendChild(h("div",{class:"sub"}, "Messaggio alla società"));
  const note = h("textarea",{placeholder:"Es. Buonasera, proponiamo maglia rossa, arrivo alle 13:30…", oninput:e=>sel.note=e.target.value, style:{
    width:"100%", minHeight:"90px", padding:"10px", borderRadius:"10px",
    border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)", resize:"vertical"
  }});
  bd.appendChild(note);

  const annulla = h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Annulla");
  const conferma = h("button",{class:"btn primary", onclick:()=>{
    if(!sel.maglia){ alert("Seleziona il colore maglia."); return; }
    if(!sel.when || !sel.where){ alert("Compila data/ora e luogo."); return; }
    document.body.removeChild(overlay);
    toastOk("Richiesta PreMatch inviata ✅");
  }},"Invia richiesta");
  ft.appendChild(annulla); ft.appendChild(conferma);

  modal.appendChild(hd); modal.appendChild(bd); modal.appendChild(ft);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

/* ---- Avvio ---- */
document.addEventListener("DOMContentLoaded", ()=>{
  viewHome();
});

/* =========================
   PreMatch - app.js (FULL)
   ========================= */

/* ---------- Paracadute anti-nero ---------- */
(function safetyNet(){
  const oldErr = console.error;
  window.addEventListener("error", (e)=>{
    showError("JS runtime error: " + (e.error?.message || e.message));
  });
  console.error = function(...args){
    showError(args.join(" "));
    oldErr.apply(console, args);
  }
})();
function showError(msg){
  let bar = document.getElementById("pm-error");
  if(!bar){
    bar = document.createElement("div");
    bar.id = "pm-error";
    Object.assign(bar.style, {
      position:"fixed", left:"0", right:"0", top:"0", zIndex:"9999",
      background:"#b91c1c", color:"#fff", padding:"10px 12px",
      fontWeight:"700", fontFamily:"ui-sans-serif, system-ui",
      borderBottom:"2px solid #7f1d1d"
    });
    document.body.appendChild(bar);
  }
  bar.textContent = "PreMatch — " + msg;
}

/* ---------- Config ---------- */
const LOGOS = {
  light: "./images/logo-light.png",
  dark: "./images/logo-dark.png",
  icon: "./images/logo-icon.png",
};
const IS_VISITOR = true; // (demo) mostra il CTA Crea PreMatch
const COACH_CODE = "CODICE123"; // codice demo allenatore

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
    "Eccellenza": ["ASD Roma Nord", "Virtus Marino"],
    "Promozione": ["Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Scuola Calcio": ["Accademia Ragazzi", "Junior Sporting"],
    "Serie C Silver": ["Brixia Basket", "Gorla Team"],
    "Serie D": ["Lario Basket"],
    "Serie C": ["Siracusa Calcio"],
    "Serie B Interregionale": ["Treviso Volley"],
  },
  clubProfiles: {
    "ASD Roma Nord": {
      logo: LOGOS.icon, // puoi sostituire con logo reale
      cover: "./images/calcio.jpg",
      uniforms: { casa:"#e74a3c", trasferta:"#2c3e50", terza:"#2980b9" },
      gallery: ["./images/calcio.jpg", "./images/volley.jpg"],
      sponsors: ["Hotel Demo", "Ristorante Demo"],
      contacts: { email: "info@societa.demo", tel: "+39 000 000 0000", address:"Via dello Sport 1, Roma" },
      matches: [
        { home: "Prima Squadra", when: "Dom 14:30", where: "Centro Sportivo Demo" },
        { home: "Juniores",      when: "01/09/2025 18:30", where: "Campo Test" },
      ]
    },
    "Virtus Marino": {
      logo: LOGOS.icon,
      cover: "./images/calcio.jpg",
      uniforms: { casa:"#16a34a", trasferta:"#1e293b", terza:"#f59e0b" },
      gallery: ["./images/futsal.jpg"],
      sponsors: ["Bar Sport", "Palestra 2000"],
      contacts: { email: "contatti@virtus.demo", tel: "+39 111 111 1111", address:"Via dei Tigli, Marino" },
      matches: [
        { home: "Prima Squadra", when: "Sab 18:00", where: "Stadio Comunale" }
      ]
    }
  }
};

/* ---------- Stato ---------- */
const state = {
  sport: null,
  gender: null,
  region: null,
  league: null,
  club: null,
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
  return h("div", {
    class: "chip"+(active?" active":""), 
    onclick: (e)=>{
      e.currentTarget.classList.add("active");
      onClick && onClick(e);
    }
  }, text);
}
function gridCard(item, onClick){
  const card = h("div", {class:"card", onclick:(e)=>{
    // Effetto “pressed” evidente prima del cambio pagina
    card.classList.add("selected");
    setTimeout(()=> onClick && onClick(e), 140);
  }}, [
    h("img", {src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div", {class:"title"}, item.name)
  ]);
  return card;
}
function accordion(title, bodyEl){
  const wrap = h("div",{class:"container panel"});
  const hd = h("button",{class:"btn", style:{width:"100%", textAlign:"left", fontWeight:"700"}}, title);
  const bd = h("div",{style:{display:"none", marginTop:".6rem"}}, bodyEl);
  hd.addEventListener("click", ()=>{
    bd.style.display = (bd.style.display==="none")?"block":"none";
  });
  wrap.appendChild(hd); wrap.appendChild(bd);
  return wrap;
}

/* ---------- Topbar fix ---------- */
(function fixTopbar(){
  const brand = document.querySelector(".brand img");
  if (brand) { brand.src = LOGOS.light; brand.alt = "PreMatch"; }
  // Aggiungo pulsante Allenatore in topbar (solo demo)
  const header = document.querySelector(".topbar");
  if (header && !document.getElementById("btn-coach")) {
    const btnWrap = h("div",{style:{position:"absolute", right:"160px", top:"8px"}});
    const b = h("button",{id:"btn-coach", class:"btn", onclick:()=>pageCoachGate()},"Allenatore");
    btnWrap.appendChild(b);
    header.appendChild(btnWrap);
  }
})();

/* ---------- Pagine ---------- */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport", "Seleziona per iniziare"));

  const grid = h("div", {class:"container grid"});
  DATA.sports.forEach(s=>{
    grid.appendChild(
      gridCard(s, ()=>{
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
    row.appendChild(
      chip(g, state.gender===g, ()=>{
        state.gender = g;
        [...row.children].forEach(c=>c.classList.remove("active"));
        event.currentTarget.classList.add("active");
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
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        event.currentTarget.classList.add("active");
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
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        event.currentTarget.classList.add("active");
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

  const clubs = DATA.clubsByLeague[state.league] || ["ASD Roma Nord"];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  clubs.forEach(c=>{
    wrap.appendChild(
      chip(c, state.club===c, ()=>{
        state.club = c;
        [...wrap.children].forEach(x=>x.classList.remove("active"));
        event.currentTarget.classList.add("active");
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

/* ----- Società ----- */
function pageClubProfile(clubName){
  clearMain();

  const club = DATA.clubProfiles[clubName] || {
    logo: LOGOS.icon,
    cover: "./images/calcio.jpg",
    uniforms: {casa:"#ffffff", trasferta:"#000000", terza:"#2ecc71"},
    gallery: [], sponsors: [], contacts:{email:"-", tel:"-", address:"-"},
    matches: []
  };

  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // Cerchi uguali (logo a sx, CTA a dx)
  const ringWrap = h("div",{class:"container", style:{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px", alignItems:"center", justifyItems:"center", marginBottom:"10px"}});
  const DIAM = 160; // stesso diametro
  const circleBase = { width:DIAM+"px", height:DIAM+"px", borderRadius:"999px", border:"1px solid var(--border)", display:"grid", placeItems:"center", background:"#0b0f14", position:"relative" };

  // sinistra (logo/cover)
  const left = h("div",{style:circleBase});
  left.appendChild(h("img",{src:club.logo || club.cover || LOGOS.icon, alt:clubName, style:{width:"58%", height:"58%", objectFit:"contain", filter:"none"}}));
  ringWrap.appendChild(left);

  // destra (CTA prematch)
  const right = h("button",{style:Object.assign({}, circleBase, {background:"var(--accent)", borderColor:"transparent", boxShadow:"0 0 0 8px rgba(65,210,123,.12)"}), onclick:()=>openPrematchModal(club)},[
    h("img",{src:LOGOS.dark, alt:"PM", style:{width:"42%", height:"42%", objectFit:"contain", background:"#fff", borderRadius:"12px", padding:"6px"}})
  ]);
  ringWrap.appendChild(right);
  // label CTA
  ringWrap.appendChild(h("div",{style:{gridColumn:"2", marginTop:"-6px", fontWeight:"800", color:"var(--accent)", textAlign:"center"}}, "Crea PreMatch"));
  app.appendChild(ringWrap);

  // Tendine
  app.appendChild(
    accordion("Informazioni",
      h("div",{},[
        h("div",{},"Indirizzo: "+(club.contacts.address||"-")),
        h("div",{},"Email: "+(club.contacts.email||"-")),
        h("div",{},"Tel: "+(club.contacts.tel||"-")),
        h("div",{},"Sponsor: "+(club.sponsors?.join(", ")||"—"))
      ])
    )
  );

  app.appendChild(
    accordion("Galleria foto",
      (club.gallery && club.gallery.length)
        ? (function(){
            const g = h("div",{class:"grid"});
            club.gallery.forEach(src=> g.appendChild(h("img",{src, alt:"Foto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}})));
            return g;
          })()
        : h("div",{class:"sub"},"Nessuna foto caricata.")
    )
  );

  app.appendChild(
    accordion("Match in programma",
      (club.matches && club.matches.length)
        ? (function(){
            const box = h("div",{});
            club.matches.forEach(m=>{
              box.appendChild(h("div",{class:"row"},[
                h("div",{class:"team"}, `${m.home} vs —`),
                h("div",{class:"meta"}, `${m.when} — ${m.where}`)
              ]));
            });
            return box;
          })()
        : h("div",{class:"sub"},"Nessun match programmato.")
    )
  );

  // Indietro
  app.appendChild(h("div",{class:"container"},[
    h("div",{class:"actions"},[
      h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro"),
    ])
  ]));
}

/* ----- Modale PreMatch ----- */
function colorPalette(){ return ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"]; }
function colorDot(hex, selected, onClick){
  return h("button", {
    class:"color-dot"+(selected?" selected":""),
    onclick:onClick,
    style:{
      width:"28px", height:"28px", borderRadius:"8px",
      border:"1px solid #252b35", backgroundColor:hex, cursor:"pointer"
    }
  });
}
function colorSwatch(hex, big=false){
  return h("span", {style:{
    display:"inline-block",
    width: big?"24px":"16px", height: big?"24px":"16px",
    borderRadius:"6px", border:"1px solid #d0d7de", background:hex
  }});
}

function openPrematchModal(club){
  const overlay = h("div",{style:{
    position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:1000, display:"flex", justifyContent:"center", alignItems:"flex-start", paddingTop:"8vh"
  }});
  const modal = h("div",{style:{
    width:"min(640px, 92%)", background:"#11161c", color:"var(--text)",
    border:"1px solid var(--border)", borderRadius:"16px", overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,.45)"
  }});
  overlay.appendChild(modal);

  const header = h("div",{style:{padding:"14px 16px", fontWeight:"800", fontSize:"1.3rem", borderBottom:"1px solid var(--border)"}}, "Crea PreMatch");
  const body = h("div",{style:{padding:"16px"}});
  const footer = h("div",{style:{padding:"12px 16px", display:"flex", gap:"8px", justifyContent:"flex-end", borderTop:"1px solid var(--border)"}});

  modal.appendChild(header); modal.appendChild(body); modal.appendChild(footer);

  const palette = colorPalette();
  const sel = { maglia:null, when:"", where:"", friendly:false, message:"" };

  // Colore maglia
  body.appendChild(h("div",{class:"sub", style:{margin:"0 0 8px 0"}}, "Scegli colore maglia (ospite)"));
  const row = h("div",{style:{display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:"8px", background:"#fff", padding:"10px", borderRadius:"12px"}});
  palette.forEach(hex => row.appendChild(colorDot(hex, false, (e)=>{
    sel.maglia=hex;
    [...row.children].forEach(b=>b.classList.remove("selected"));
    e.currentTarget.classList.add("selected");
  })));
  body.appendChild(row);

  // Data/Ora + Luogo
  body.appendChild(h("div",{class:"sub", style:{margin:"12px 0 6px 0"}}, "Data & ora"));
  const dt = h("input",{type:"datetime-local", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}});
  dt.addEventListener("change", e=> sel.when = e.target.value);
  body.appendChild(dt);

  body.appendChild(h("div",{class:"sub", style:{margin:"12px 0 6px 0"}}, "Luogo (indirizzo)"));
  const place = h("input",{type:"text", placeholder:"Via dello Sport 1, Città", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}});
  place.addEventListener("input", e=> sel.where = e.target.value);
  body.appendChild(place);

  // Richiedi amichevole
  const fr = h("label",{style:{display:"flex", gap:"8px", alignItems:"center", marginTop:"12px", userSelect:"none"}},[
    h("input",{type:"checkbox", onchange:(e)=> sel.friendly = e.target.checked}),
    h("span",{},"Richiedi amichevole")
  ]);
  body.appendChild(fr);

  // Messaggio
  body.appendChild(h("div",{class:"sub", style:{margin:"12px 0 6px 0"}}, "Messaggio (facoltativo)"));
  const ta = h("textarea",{rows:"3", placeholder:"Scrivi un saluto o una nota per la società…", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)", resize:"vertical"}});
  ta.addEventListener("input", e=> sel.message = e.target.value);
  body.appendChild(ta);

  const annulla = h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Annulla");
  const conferma = h("button",{class:"btn primary", onclick:()=>{
    if(!sel.maglia){ alert("Seleziona il colore della maglia."); return; }
    showSummary(club, sel, overlay);
  }},"Conferma");
  footer.appendChild(annulla); footer.appendChild(conferma);

  document.body.appendChild(overlay);
}

function showSummary(club, sel, overlay){
  const home = club.uniforms || {casa:"#ffffff"};
  const content = h("div",{style:{padding:"16px"}},[
    h("div",{class:"h2", style:{fontWeight:"800"}}, "Riepilogo PreMatch"),
    h("div",{style:{margin:"8px 0 10px 0"}}, "Controlla i dati e invia."),
    // Casa
    h("div",{style:{display:"grid", gridTemplateColumns:"120px 1fr", gap:"10px", marginTop:"8px"}},[
      h("div",{class:"sub", style:{margin:0}}, "Casa (società)"),
      h("div",{},[
        h("div",{style:{display:"flex", alignItems:"center", gap:"8px"}},[
          colorSwatch(home.casa||"#ffffff",true), h("span",{},"Maglia casa"),
        ])
      ])
    ]),
    // Ospite
    h("div",{style:{display:"grid", gridTemplateColumns:"120px 1fr", gap:"10px", marginTop:"12px"}},[
      h("div",{class:"sub", style:{margin:0}}, "Ospite (proposta)"),
      h("div",{},[
        h("div",{style:{display:"flex", gap:"12px", flexWrap:"wrap"}},[
          h("div",{},[colorSwatch(sel.maglia,true), h("span",{style:{marginLeft:"6px"}},"Maglia")]),
        ])
      ])
    ]),
    h("div",{style:{marginTop:"10px"}}, `Data & ora: ${sel.when || "—"}`),
    h("div",{}, `Luogo: ${sel.where || "—"}`),
    h("div",{}, `Amichevole: ${sel.friendly ? "Sì" : "No"}`),
    h("div",{}, `Messaggio: ${sel.message?.trim() ? sel.message : "—"}`),
  ]);

  const modal = overlay.firstChild;
  const sections = modal.children;
  sections[0].textContent = "Conferma PreMatch";
  sections[1].innerHTML = "";
  sections[1].appendChild(content);

  const footer = sections[2];
  footer.innerHTML = "";
  footer.appendChild(h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Indietro"));
  footer.appendChild(h("button",{class:"btn primary", onclick:()=>{
    document.body.removeChild(overlay);
    confirmToast(); // demo
  }},"Invia richiesta"));
}

function confirmToast(){
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"700", zIndex:1200, border:"1px solid transparent"
  }},"Richiesta PreMatch inviata ✅");
  document.body.appendChild(t);
  setTimeout(()=>{ t.remove(); }, 1800);
}

/* ----- Allenatore: gate + convocazioni ----- */
function pageCoachGate(){
  clearMain();
  app.appendChild(sectionTitle("Area Allenatore","Inserisci il codice fornito dalla società"));
  const box = h("div",{class:"container panel"});
  const inp = h("input",{type:"password", placeholder:"Codice accesso", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}});
  const bar = h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageSports()},"Indietro"),
    h("button",{class:"btn primary", onclick:()=>{
      if((inp.value||"").trim()===COACH_CODE){ pageCoachConvocations(); }
      else alert("Codice non valido.");
    }},"Entra")
  ]);
  box.appendChild(inp); box.appendChild(bar);
  app.appendChild(box);
}

function pageCoachConvocations(){
  clearMain();
  app.appendChild(sectionTitle("Convocazioni","Crea e gestisci la lista convocati"));
  const box = h("div",{class:"container panel"});

  // lista in localStorage
  const KEY = "pm_convocati";
  const saved = JSON.parse(localStorage.getItem(KEY) || "[]");

  const ul = h("ul",{});
  function render(){
    ul.innerHTML = "";
    if(!saved.length){ ul.appendChild(h("div",{class:"sub"},"Nessun convocato.")); return; }
    saved.forEach((name,idx)=>{
      const row = h("div",{class:"row"},[
        h("div",{class:"team"},name),
        h("div",{}, h("button",{class:"btn", onclick:()=>{ saved.splice(idx,1); localStorage.setItem(KEY, JSON.stringify(saved)); render(); }},"Rimuovi"))
      ]);
      ul.appendChild(row);
    });
  }
  render();

  const input = h("input",{type:"text", placeholder:"Nome giocatore", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)", marginTop:"10px"}});
  const add = h("button",{class:"btn primary", style:{marginTop:"8px"}, onclick:()=>{
    const name = (input.value||"").trim();
    if(!name) return;
    saved.push(name);
    localStorage.setItem(KEY, JSON.stringify(saved));
    input.value=""; render();
  }},"Aggiungi");

  box.appendChild(ul);
  box.appendChild(input);
  box.appendChild(add);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageSports()},"Fine")
  ]));
  app.appendChild(box);
}

/* ---------- Avvio ---------- */
try {
  pageSports();
} catch(e){
  showError(e.message || String(e));
}

/* ---------- Stili interattivi extra (inietto) ---------- */
const extraCss = `
  .card { position: relative; }
  .card.selected { outline:2px solid var(--accent); outline-offset:2px; }
  .color-dot.selected { outline:2px solid var(--accent); outline-offset:2px; }

  /* micro-anim per feedback tap sulle card sport */
  .card:active { transform: scale(.98); }

  /* chip attiva già definita in style.css, qui rafforzo visibilità */
  .chip.active { border-color: var(--accent); color: var(--accent); box-shadow: 0 0 0 2px rgba(65,210,123,.15) inset; }
`;
const styleTag = document.createElement("style");
styleTag.appendChild(document.createTextNode(extraCss));
document.head.appendChild(styleTag);

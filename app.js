/* =========================
   PreMatch DEMO - app.js
   ========================= */

const LOGOS = {
  light: "./images/logo-light.png",
  dark: "./images/logo-dark.png",
  icon: "./images/logo-icon.png",
};

const DATA = {
  sports: [
    { key: "calcio", name: "Calcio", img: "./images/calcio.jpg" },
    { key: "futsal", name: "Futsal", img: "./images/futsal.jpg" },
    { key: "basket", name: "Basket", img: "./images/basket.jpg" },
    { key: "volley", name: "Volley", img: "./images/volley.jpg" },
    { key: "rugby", name: "Rugby", img: "./images/rugby.jpg" },
    { key: "pallanuoto", name: "Pallanuoto", img: "./images/pallanuoto.jpg" },
  ],
  genders: ["Maschile", "Femminile"],
  regions: ["Lazio", "Lombardia", "Sicilia", "Piemonte", "Veneto", "Emilia-Romagna"],
  leaguesBy: {
    Lazio: ["Eccellenza", "Promozione", "Prima Categoria", "Scuola Calcio"],
    Lombardia: ["Serie D", "Scuola Calcio"],
    Sicilia: ["Serie C", "Scuola Calcio"],
    Piemonte: ["Eccellenza"],
    Veneto: ["Serie B Interregionale"],
    "Emilia-Romagna": ["Promozione"],
  },
  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino"],
    "Prima Categoria": ["Atletico Ostia"],
    "Scuola Calcio": ["Accademia Ragazzi"],
    "Serie D": ["Lario Basket"],
    "Serie C": ["Siracusa Calcio"],
    "Serie B Interregionale": ["Treviso Volley"],
  }
};

const state = { sport:null, gender:null, region:null, league:null, club:null };
const app = document.getElementById("app");

/* Helpers */
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k==="class") el.className = v;
    else if (k==="onclick") el.addEventListener("click", v);
    else if (k==="style") Object.assign(el.style, v);
    else el.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c==null) return;
    el.appendChild(typeof c==="string"?document.createTextNode(c):c);
  });
  return el;
}
function clearMain(){ app.innerHTML=""; }
function sectionTitle(t, st){
  return h("div",{class:"container"},[
    h("div",{class:"h1"}, t),
    st ? h("div",{class:"sub"}, st) : null
  ]);
}
function chip(txt, active, onClick){
  return h("div",{class:"chip"+(active?" active":""), onclick:onClick}, txt);
}
function gridCard(item,onClick){
  const selected = state.sport === item.key ? " selected" : "";
  return h("div",{class:"card"+selected, onclick:onClick},[
    h("img",{src:item.img,alt:item.name, onerror(){this.style.display="none"}}),
    h("div",{class:"title"}, item.name)
  ]);
}

/* Pagine */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare"));
  const grid=h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    grid.appendChild(gridCard(s,()=>{
      state.sport=s.key;
      pageGender();
    }));
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));
  const box=h("div",{class:"container panel"});
  const row=h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    row.appendChild(chip(g,state.gender===g,()=>{
      state.gender=g;
      [...row.children].forEach(c=>c.classList.remove("active"));
      event.currentTarget.classList.add("active");
      pageRegions();
    }));
  });
  box.appendChild(row);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageSports()},"Indietro"),
  ]));
  app.appendChild(box);
}

function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione",""));
  const box=h("div",{class:"container panel"});
  const wrap=h("div",{class:"chips"});
  DATA.regions.forEach(r=>{
    wrap.appendChild(chip(r,state.region===r,()=>{
      state.region=r;
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      event.currentTarget.classList.add("active");
      pageLeagues();
    }));
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageGender()},"Indietro"),
  ]));
  app.appendChild(box);
}

function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il campionato", state.region||""));
  const leagues=DATA.leaguesBy[state.region]||[];
  const box=h("div",{class:"container panel"});
  const wrap=h("div",{class:"chips"});
  leagues.forEach(l=>{
    wrap.appendChild(chip(l,state.league===l,()=>{
      state.league=l;
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      event.currentTarget.classList.add("active");
      pageClubs();
    }));
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageRegions()},"Indietro"),
  ]));
  app.appendChild(box);
}

function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la società", state.league||""));
  const clubs=DATA.clubsByLeague[state.league]||["Società Dimostrativa"];
  const box=h("div",{class:"container panel"});
  const wrap=h("div",{class:"chips"});
  clubs.forEach(c=>{
    wrap.appendChild(chip(c,state.club===c,()=>{
      state.club=c;
      [...wrap.children].forEach(x=>x.classList.remove("active"));
      event.currentTarget.classList.add("active");
      pageClubProfile(c);
    }));
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageLeagues()},"Indietro"),
  ]));
  app.appendChild(box);
}

function pageClubProfile(clubName){
  clearMain();
  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // logo piccolo e centrato
  app.appendChild(
    h("div",{class:"container",style:{display:"flex",justifyContent:"center",marginTop:".2rem"}},[
      h("img",{src:LOGOS.icon, alt:"Logo", class:"club-logo"})
    ])
  );

  // prossime partite (mock, leggere)
  const panel=h("div",{class:"container panel"});
  panel.appendChild(h("div",{class:"h2",style:{fontWeight:"800",color:"var(--accent)"}}, "Prossime partite"));
  panel.appendChild(h("div",{class:"row"},[
    h("div",{class:"team"},"Prima Squadra vs —"),
    h("div",{class:"meta"},"Dom 14:30 — Centro Sportivo Demo")
  ]));
  app.appendChild(panel);

  // CTA: bottone Crea PreMatch (con logo)
  app.appendChild(
    h("div",{class:"container"},[
      h("button",{class:"pm-btn", onclick:openPrematch},[
        h("img",{src:LOGOS.icon, alt:"PM"}), "Crea PreMatch"
      ])
    ])
  );

  // back
  app.appendChild(h("div",{class:"container actions"},[
    h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro"),
  ]));
}

/* Modale PreMatch - SOLO MAGLIETTA (come richiesto) */
function openPrematch(){
  const overlay=h("div",{style:{
    position:"fixed", inset:0, background:"rgba(0,0,0,.6)",
    display:"flex", alignItems:"flex-start", justifyContent:"center",
    paddingTop:"8vh", zIndex:1000
  }});
  const modal=h("div",{style:{
    width:"min(640px,92%)", background:"#11161c", color:"var(--text)",
    border:"1px solid var(--border)", borderRadius:"16px", overflow:"hidden",
    boxShadow:"0 20px 60px rgba(0,0,0,.45)"
  }});
  overlay.appendChild(modal);

  const header=h("div",{style:{padding:"14px 16px", fontWeight:"800", fontSize:"1.2rem", borderBottom:"1px solid var(--border)"}}, "Crea PreMatch");
  const body=h("div",{style:{padding:"16px"}});
  const footer=h("div",{style:{padding:"12px 16px", display:"flex", gap:"8px", justifyContent:"flex-end", borderTop:"1px solid var(--border)"}});

  modal.appendChild(header); modal.appendChild(body); modal.appendChild(footer);

  const palette=["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];
  let maglia=null, when="", where="";

  body.appendChild(h("div",{class:"sub",style:{margin:"0 0 8px 0"}}, "Colore maglietta (ospite)"));
  const grid=h("div",{style:{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:"8px",background:"#fff",padding:"10px",borderRadius:"12px"}});
  palette.forEach(hex=>{
    const b=h("button",{style:{
      width:"28px", height:"28px", borderRadius:"8px", border:"1px solid #252b35", background:hex, cursor:"pointer"
    }, onclick:()=>{
      maglia=hex;
      [...grid.children].forEach(x=>x.style.outline="none");
      b.style.outline="2px solid var(--accent)";
      b.style.outlineOffset="2px";
    }});
    grid.appendChild(b);
  });
  body.appendChild(grid);

  body.appendChild(h("div",{class:"sub",style:{margin:"12px 0 6px 0"}}, "Data & ora"));
  const dt=h("input",{type:"datetime-local",style:{width:"100%",padding:"10px",borderRadius:"10px",border:"1px solid var(--border)",background:"#0f141a",color:"var(--text)"}, onchange:e=>when=e.target.value});
  body.appendChild(dt);

  body.appendChild(h("div",{class:"sub",style:{margin:"12px 0 6px 0"}}, "Luogo (indirizzo)"));
  const pl=h("input",{type:"text",placeholder:"Via dello Sport 1, Città",style:{width:"100%",padding:"10px",borderRadius:"10px",border:"1px solid var(--border)",background:"#0f141a",color:"var(--text)"}, oninput:e=>where=e.target.value});
  body.appendChild(pl);

  footer.appendChild(h("button",{class:"btn",onclick:()=>document.body.removeChild(overlay)},"Annulla"));
  footer.appendChild(h("button",{class:"btn primary",onclick:()=>{
    if(!maglia){ alert("Seleziona il colore della maglia."); return; }
    document.body.removeChild(overlay);
    toast("Richiesta PreMatch inviata ✅");
  }},"Conferma"));

  document.body.appendChild(overlay);
}

function toast(msg){
  const t=h("div",{style:{
    position:"fixed", left:"50%", bottom:"20px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"800", zIndex:1200
  }}, msg);
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 1800);
}

/* Avvio */
pageSports();

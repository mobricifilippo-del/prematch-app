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
      contacts: { email: "info@societa.demo", tel: "+39 000 000 0000", indirizzo:"Centro Sportivo Demo – Roma" },
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
    if(k==="class") el.className=v;
    else if(k==="onclick") el.addEventListener("click", v);
    else if(k==="oninput") el.addEventListener("input", v);
    else if(k==="onchange") el.addEventListener("change", v);
    else if(k==="style") Object.assign(el.style, v);
    else el.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c==null) return;
    el.appendChild(typeof c==="string"?document.createTextNode(c):c);
  });
  return el;
}
function clearMain(){ app.innerHTML=""; }
function sectionTitle(title, subtitle){
  return h("div",{class:"container"},[
    h("div",{class:"h1"},title),
    h("div",{class:"sub"},subtitle||"")
  ]);
}
function chip(text, active, onClick){
  return h("div",{class:"chip"+(active?" active":""), onclick:onClick}, text);
}
function gridCard(item, onClick){
  const card = h("div",{class:"card"},[
    h("img",{src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div",{class:"title"}, item.name)
  ]);
  card.addEventListener("click", (e)=>{
    // feedback visivo, poi naviga
    [...card.parentElement.children].forEach(c=>c.classList.remove("selected"));
    card.classList.add("selected");
    setTimeout(()=> onClick(e), 130);
  });
  return card;
}

/* ---------- Topbar logo ---------- */
(function fixBrandLogo(){
  const brand=document.querySelector(".brand img");
  if(brand){ brand.src=LOGOS.light; brand.alt="PreMatch"; }
})();

/* ---------- Pagine ---------- */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare"));
  const grid=h("div",{class:"container grid"});
  DATA.sports.forEach(s=> grid.appendChild(gridCard({img:s.img,name:s.name},()=>{
    state.sport=s.key; pageGender();
  })));
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
      setTimeout(()=>pageRegions(),130);
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
      setTimeout(()=>pageLeagues(),130);
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
      setTimeout(()=>pageClubs(),130);
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
      setTimeout(()=>pageClubProfile(c),130);
    }));
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageLeagues()},"Indietro"),
  ]));
  app.appendChild(box);
}

/* ---------- Helpers accordion ---------- */
function accordionSection(title, contentEl){
  const item=h("div",{class:"acc-item"});
  const hd=h("div",{class:"acc-hd"},[
    h("div",{class:"t"},title),
    h("div",{class:"sub"},"▼")
  ]);
  const bd=h("div",{class:"acc-bd"}, contentEl);
  hd.addEventListener("click",()=>{
    item.classList.toggle("open");
  });
  item.appendChild(hd); item.appendChild(bd);
  return item;
}
function galleryContent(list){
  if(!list||!list.length) return h("div",{class:"sub"},"Nessuna foto caricata.");
  const g=h("div",{class:"grid"});
  list.forEach(src=> g.appendChild(h("img",{src,alt:"Foto",style:{width:"100%",height:"140px",objectFit:"cover",borderRadius:"12px"}})));
  return g;
}
function contactsContent(c){
  return h("div",{},[
    h("div",{},"Indirizzo: "+(c.indirizzo||"-")),
    h("div",{},"Email: "+(c.email||"-")),
    h("div",{},"Tel: "+(c.tel||"-")),
  ]);
}
function matchesContent(list){
  const wrap=h("div",{});
  (list&&list.length?list:[{home:"—",when:"—",where:"—"}]).forEach(m=>{
    wrap.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, m.home+" vs —"),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  return wrap;
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

  // Header: logo + CTA tondo
  const headerRow = h("div",{class:"container cta-wrap"},[
    h("div",{class:"club-avatar"},[ h("img",{src:club.logo||LOGOS.icon, alt:clubName}) ]),
    IS_VISITOR ? h("div",{class:"cta-col"},[
      h("button",{class:"round-cta", onclick:()=>openPrematchModal(club)},[ h("img",{src:LOGOS.icon, alt:"PM"}) ]),
      h("div",{class:"cta-label"},"Crea PreMatch")
    ]):h("div")
  ]);
  app.appendChild(headerRow);

  // Accordion: Info / Galleria / Match in programma
  const acc = h("div",{class:"container accordion"},[
    accordionSection("Informazioni", contactsContent(club.contacts)),
    accordionSection("Galleria foto", galleryContent(club.gallery)),
    accordionSection("Match in programma", matchesContent(club.matches)),
  ]);
  app.appendChild(acc);

  // Indietro
  app.appendChild(h("div",{class:"container actions"},[
    h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro")
  ]));
}

/* ----- Modal PreMatch ----- */
function colorPalette(){ return ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"]; }
function colorDot(hex, selected, onClick){
  return h("button",{
    class:"color-dot"+(selected?" selected":""), onclick:onClick,
    style:{width:"28px",height:"28px",borderRadius:"8px",border:"1px solid #252b35",backgroundColor:hex,cursor:"pointer"}
  });
}
function colorSwatch(hex,big=false){
  return h("span",{style:{
    display:"inline-block", width: big?"24px":"16px", height: big?"24px":"16px",
    borderRadius:"6px", border:"1px solid #d0d7de", background:hex
  }});
}

function openPrematchModal(club){
  const overlay = h("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:1000,display:"flex",justifyContent:"center",alignItems:"flex-start",paddingTop:"8vh"}});
  const modal = h("div",{style:{width:"min(640px, 92%)",background:"#11161c",color:"var(--text)",border:"1px solid var(--border)",borderRadius:"16px",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.45)"}});
  overlay.appendChild(modal);

  const header = h("div",{style:{padding:"14px 16px",fontWeight:"800",fontSize:"1.3rem",borderBottom:"1px solid var(--border)"}}, "Crea PreMatch");
  const body   = h("div",{style:{padding:"16px"}});
  const footer = h("div",{style:{padding:"12px 16px",display:"flex",gap:"8px",justifyContent:"flex-end",borderTop:"1px solid var(--border)"}});

  modal.appendChild(header); modal.appendChild(body); modal.appendChild(footer);

  const palette = colorPalette();
  const sel = { maglia:null, when:"", where:"", friendly:false };

  function makeRow(label,key){
    return h("div",{style:{marginBottom:"14px"}},[
      h("div",{class:"sub",style:{margin:"0 0 8px 0"}},label),
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:"8px",background:"#fff",padding:"10px",borderRadius:"12px"}},
        palette.map(hex=> colorDot(hex, sel[key]===hex, ()=>{
          sel[key]=hex;
          [...event.currentTarget.parentElement.children].forEach(b=>b.classList.remove("selected"));
          event.currentTarget.classList.add("selected");
        }))
      )
    ]);
  }

  body.appendChild(h("div",{class:"sub",style:{margin:"0 0 8px 0"}}, "Scegli colore maglia (ospite)"));
  body.appendChild(makeRow("Maglia","maglia"));

  // friendly toggle
  const friendlyWrap=h("label",{style:{display:"flex",alignItems:"center",gap:"8px",margin:"6px 0 12px 0"}},[
    h("input",{type:"checkbox",onchange:e=> sel.friendly=e.target.checked}),
    h("span",{},"Richiesta amichevole")
  ]);
  body.appendChild(friendlyWrap);

  // Data/Ora + Luogo
  const dt = h("input",{type:"datetime-local",style:{width:"100%",padding:"10px",borderRadius:"10px",border:"1px solid var(--border)",background:"#0f141a",color:"var(--text)"}});
  const place = h("input",{type:"text",placeholder:"Via dello Sport 1, Città",style:{width:"100%",padding:"10px",borderRadius:"10px",border:"1px solid var(--border)",background:"#0f141a",color:"var(--text)",marginTop:"10px"}});
  dt.addEventListener("change",e=> sel.when=e.target.value);
  place.addEventListener("input",e=> sel.where=e.target.value);
  body.appendChild(h("div",{style:{marginTop:"6px"}},[
    h("div",{class:"sub",style:{margin:"0 0 6px 0"}}, "Data & ora"), dt,
    h("div",{class:"sub",style:{margin:"12px 0 6px 0"}}, "Luogo (indirizzo)"), place
  ]));

  const annulla = h("button",{class:"btn",onclick:()=>document.body.removeChild(overlay)},"Annulla");
  const conferma = h("button",{class:"btn primary",onclick:()=>{
    if(!sel.maglia){ alert("Seleziona il colore della maglia."); return; }
    document.body.removeChild(overlay);
    confirmToast(sel.friendly);
  }},"Conferma");
  footer.appendChild(annulla); footer.appendChild(conferma);

  document.body.appendChild(overlay);
}

function confirmToast(isFriendly=false){
  const text = isFriendly ? "Richiesta AMICHEVOLE inviata ✅" : "Richiesta PreMatch inviata ✅";
  const t = h("div",{style:{
    position:"fixed",left:"50%",bottom:"22px",transform:"translateX(-50%)",
    background:"var(--accent)",color:"#0b1115",padding:"10px 14px",
    borderRadius:"10px",fontWeight:"700",zIndex:1200
  }}, text);
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1800);
}

/* ---------- Avvio ---------- */
pageSports();

/* ---------- Micro stile runtime ---------- */
const extraCss = `.color-dot.selected{outline:2px solid var(--accent);outline-offset:2px;}`;
document.head.appendChild(Object.assign(document.createElement("style"),{textContent:extraCss}));

/* ====== DEMO SOLO CALCIO ====== */

const LOGOS = {
  light: "./images/logo-light.png",
  dark: "./images/logo-dark.png",
  icon: "./images/logo-icon.png",
};

const DATA = {
  sports: [
    { key: "calcio", name: "Calcio", img: "./images/calcio.jpg" }, // SOLO calcio
  ],
  genders: ["Maschile", "Femminile"],
  regions: ["Lazio", "Lombardia", "Sicilia", "Piemonte", "Veneto", "Emilia-Romagna"],
  leaguesBy: {
    "Lazio": ["Eccellenza", "Promozione", "Prima Categoria"],
    "Lombardia": ["Serie D"],
    "Sicilia": ["Promozione"],
    "Piemonte": ["Eccellenza"],
    "Veneto": ["Serie B Interregionale"],
    "Emilia-Romagna": ["Promozione"],
  },
  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino"],
    "Prima Categoria": ["Atletico Ostia"],
    "Serie D": ["Lario Calcio"],
    "Serie B Interregionale": ["Treviso Calcio"],
  },
  clubProfiles: {
    "ASD Roma Nord": {
      logo: LOGOS.icon,
      uniforms: { casa:"#e74a3c" },
      info: {
        indirizzo: "Centro Sportivo Demo — Via dello Sport 1, Roma",
        contatti: "info@societa.demo • +39 000 000 0000",
      },
      gallery: ["./images/calcio.jpg"],
      matches: [
        { home:"Prima Squadra", when:"31/08/2025 14:07", where:"Roma — Stadio Olimpico" },
        { home:"Juniores", when:"01/09/2025 18:30", where:"Roma — Campo Test" },
      ]
    }
  }
};

const state = { sport:null, gender:null, region:null, league:null, club:null };
const app = document.getElementById("app");

/* Helpers */
function h(tag, attrs={}, children=[]){
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k==="class") el.className = v;
    else if (k==="onclick") el.addEventListener("click", v);
    else if (k==="oninput") el.addEventListener("input", v);
    else if (k==="onchange") el.addEventListener("change", v);
    else if (k==="style") Object.assign(el.style, v);
    else el.setAttribute(k, v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if (c==null) return;
    el.appendChild(typeof c==="string"?document.createTextNode(c):c);
  });
  return el;
}
function clearMain(){ app.innerHTML=""; }
function sectionTitle(t, s){ return h("div",{class:"container"},[
  h("div",{class:"h1"}, t), h("div",{class:"sub"}, s||"")
]);}
function chip(text, active, onClick){
  const el = h("div",{class:"chip"+(active?" active":""), onclick:(e)=>pressAnd(()=>onClick(e), el)}, text);
  return el;
}
function gridCard(item, onClick){
  const el = h("div",{class:"card", onclick:(e)=>pressAnd(()=>onClick(e), el)},[
    h("img",{src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div",{class:"title"}, item.name)
  ]);
  return el;
}
/* Press feedback più lungo e visibile */
function pressAnd(go, el){
  el.classList.add("pressed");
  setTimeout(()=>{ el.classList.remove("pressed"); go(); }, 250);
}

/* Pagine */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport", "Seleziona per iniziare"));

  const grid = h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    grid.appendChild(gridCard(s, ()=>{
      state.sport = s.key;
      pageGender();
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
    row.appendChild(chip(g, state.gender===g, ()=>{
      state.gender = g; pageRegions();
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
    wrap.appendChild(chip(r, state.region===r, ()=>{
      state.region = r; pageLeagues();
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
    wrap.appendChild(chip(l, state.league===l, ()=>{
      state.league = l; pageClubs();
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
  const clubs = DATA.clubsByLeague[state.league] || ["Società Demo"];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  clubs.forEach(c=>{
    wrap.appendChild(chip(c, state.club===c, ()=>{
      state.club = c; pageClubProfile(c);
    }));
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageLeagues()},"Indietro"),
  ]));
  app.appendChild(box);
}

function pageClubProfile(clubName){
  clearMain();
  const club = DATA.clubProfiles[clubName] || {
    logo: LOGOS.icon, uniforms:{casa:"#2ecc71"},
    info:{indirizzo:"—", contatti:"—"}, gallery:[], matches:[]
  };

  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // Logo + CTA uguali
  const row = h("div",{class:"club-row container"},[
    h("div",{class:"club-avatar"},[
      h("img",{src:club.logo||LOGOS.icon, alt:clubName})
    ]),
    h("div",{},[
      h("button",{class:"cta-prematch", onclick:()=>openPrematchModal(club)},[
        h("img",{src:LOGOS.icon, alt:"PM"})
      ]),
      h("div",{class:"cta-label"},"Crea PreMatch")
    ])
  ]);
  app.appendChild(row);

  // Accordion
  const acc = h("div",{class:"container accordion"});

  // Info
  acc.appendChild(accordionItem("Informazioni", h("div",{},[
    h("div",{},"Indirizzo: "+(club.info.indirizzo||"—")),
    h("div",{},"Contatti: "+(club.info.contatti||"—")),
    h("div",{},[
      "Colori casa: ", colorSwatch(club.uniforms.casa||"#2ecc71",true)
    ])
  ])));

  // Galleria
  const gal = (!club.gallery||!club.gallery.length)
    ? h("div",{class:"sub"},"Nessuna foto.")
    : (()=>{ const g=h("div",{class:"grid"}); club.gallery.forEach(src=>g.appendChild(h("img",{src,alt:"foto",style:{width:"100%",height:"140px",objectFit:"cover",borderRadius:"12px"}}))); return g;})();
  acc.appendChild(accordionItem("Galleria foto", gal));

  // Partite
  const panel = h("div",{},[
    ...(club.matches.length?club.matches:[{home:"—",when:"—",where:"—"}]).map(m =>
      h("div",{class:"row"},[
        h("div",{class:"team"}, `${m.home} vs —`),
        h("div",{class:"meta"}, `${m.when} — ${m.where}`)
      ])
    )
  ]);
  acc.appendChild(accordionItem("Match in programma", panel));

  app.appendChild(acc);

  // Indietro
  app.appendChild(h("div",{class:"container"},[
    h("div",{class:"actions"},[
      h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro"),
    ])
  ]));
}

/* Accordion helper */
function accordionItem(title, bodyEl){
  const item = h("div",{class:"acc-item"});
  const hd = h("div",{class:"acc-hd"},[
    h("span",{class:"t"},title),
    h("span",{}, "▾")
  ]);
  const bd = h("div",{class:"acc-bd"}, bodyEl);
  hd.addEventListener("click", ()=>{ item.classList.toggle("open"); });
  item.appendChild(hd); item.appendChild(bd);
  return item;
}
function colorSwatch(hex, big=false){
  return h("span",{style:{
    display:"inline-block", width: big?"24px":"16px", height: big?"24px":"16px",
    borderRadius:"6px", border:"1px solid #d0d7de", background:hex, verticalAlign:"middle"
  }});
}

/* Modal PreMatch (con amichevole + messaggio) */
function openPrematchModal(club){
  const ov = h("div",{class:"modal-ov"});
  const modal = h("div",{class:"modal"});
  ov.appendChild(modal);

  const hd = h("div",{class:"hd"},"Crea PreMatch");
  const bd = h("div",{class:"bd"});
  const ft = h("div",{class:"ft"});
  modal.appendChild(hd); modal.appendChild(bd); modal.appendChild(ft);

  const colors = ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];
  const sel = { maglia:null, when:"", where:"", friendly:false, message:"" };

  // Colori
  bd.appendChild(h("div",{},[
    h("div",{class:"sub",style:{margin:"0 0 6px 0"}},"Scegli colore maglia (ospite)"),
    h("div",{class:"palette"},
      colors.map(hex=>{
        const d = h("button",{class:"dot", style:{backgroundColor:hex}, onclick:(e)=>{
          document.querySelectorAll(".dot").forEach(x=>x.classList.remove("selected"));
          d.classList.add("selected"); sel.maglia = hex;
        }});
        return d;
      })
    )
  ]));

  // Data & luogo
  const dt = h("input",{type:"datetime-local", class:"input", onchange:e=>sel.when=e.target.value});
  const place = h("input",{type:"text", placeholder:"Via dello Sport 1, Città", class:"input", oninput:e=>sel.where=e.target.value});
  bd.appendChild(h("div",{},[
    h("div",{class:"sub"},"Data & ora"), dt,
    h("div",{class:"sub",style:{marginTop:"6px"}},"Luogo (indirizzo)"), place
  ]));

  // Amichevole + Messaggio
  const chk = h("input",{type:"checkbox", id:"friendly", onchange:e=>sel.friendly=e.target.checked});
  const lbl = h("label",{for:"friendly"}," Richiedi amichevole");
  const msg = h("textarea",{class:"textarea", placeholder:"Scrivi un messaggio… (opzionale)", oninput:e=>sel.message=e.target.value});
  bd.appendChild(h("div",{class:"checkbox"},[chk,lbl]));
  bd.appendChild(msg);

  // Bottoni
  ft.appendChild(h("button",{class:"btn", onclick:()=>ov.remove()},"Annulla"));
  ft.appendChild(h("button",{class:"btn primary", onclick:()=>{
    if(!sel.maglia){ alert("Seleziona il colore della maglia."); return; }
    // Qui in reale invieresti i dati al backend
    ov.remove();
    toast("Richiesta inviata ✅");
  }},"Conferma"));

  document.body.appendChild(ov);
}

function toast(text){
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"700", zIndex:1200
  }}, text);
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 1800);
}

/* Avvio */
pageSports();

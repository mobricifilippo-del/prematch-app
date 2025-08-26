/* =========================
   PreMatch DEMO - app.js
   ========================= */

/* ---- Config / assets ---- */
const LOGOS = {
  light:"./images/logo-light.png",
  dark :"./images/logo-dark.png",
  icon :"./images/logo-icon.png",
};
const STAFF_CODE_DEMO = "ALLENATORE2025"; // codice demo per Area Staff

/* ---- Dati demo ---- */
const DATA = {
  sports: [
    { key:"calcio",     name:"Calcio",     img:"./images/calcio.jpg" },
    { key:"futsal",     name:"Futsal",     img:"./images/futsal.jpg" },
    { key:"basket",     name:"Basket",     img:"./images/basket.jpg" },
    { key:"volley",     name:"Volley",     img:"./images/volley.jpg" },
    { key:"rugby",      name:"Rugby",      img:"./images/rugby.jpg" },
    { key:"pallanuoto", name:"Pallanuoto", img:"./images/pallanuoto.jpg" },
  ],
  genders: ["Maschile","Femminile"],
  regions: ["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"],
  leaguesBy: {
    "Lazio":["Eccellenza","Promozione","Prima Categoria","Scuola Calcio"],
    "Lombardia":["Serie C Silver","Serie D","Scuola Calcio"],
    "Sicilia":["Serie C","Promozione","Scuola Calcio"],
    "Piemonte":["Eccellenza","Scuola Calcio"],
    "Veneto":["Serie B Interregionale","Scuola Calcio"],
    "Emilia-Romagna":["Promozione","Scuola Calcio"],
  },
  clubsByLeague: {
    "Eccellenza":["ASD Roma Nord","Sporting Tuscolano"],
    "Promozione":["Virtus Marino","Borghesiana FC"],
    "Prima Categoria":["Atletico Ostia"],
    "Scuola Calcio":["Accademia Ragazzi","Junior Sporting"],
    "Serie C Silver":["Brixia Basket","Gorla Team"],
    "Serie D":["Lario Basket"],
    "Serie C":["Siracusa Calcio"],
    "Serie B Interregionale":["Treviso Volley"],
  },
  clubProfiles:{
    "ASD Roma Nord":{
      logo: LOGOS.icon,
      uniforms:{ casa:"#e74c3c", trasferta:"#2c3e50", terza:"#3498db" },
      contacts:{ email:"info@societa.demo", tel:"+39 000 000 0000", indirizzo:"Centro Sportivo Demo, Via dello Sport 1, Roma" },
      gallery:["./images/calcio.jpg","./images/volley.jpg"],
      matchesVenue:[
        { title:"Prima Squadra vs —", when:"Dom 14:30", where:"Centro Sportivo Demo" },
        { title:"Juniores vs —",     when:"Lun 18:30", where:"Campo 2 Demo" }
      ]
    }
  }
};

/* ---- Stato ---- */
const state = { sport:null, gender:null, region:null, league:null, club:null };

/* ---- Helpers DOM ---- */
const app = document.getElementById("app");
const $ = (sel,root=document)=>root.querySelector(sel);

function h(tag, attrs={}, children=[]){
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k==="class") el.className=v;
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
function sectionTitle(title, subtitle){
  return h("div",{class:"container"},[
    h("div",{class:"h1"}, title),
    h("div",{class:"sub"}, subtitle||"")
  ]);
}
function gridCard(item, onClick){
  const card = h("div",{class:"card", onclick:onClick},[
    h("img",{src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div",{class:"title"}, item.name)
  ]);
  card.addEventListener("mousedown", ()=>card.classList.add("selected"));
  card.addEventListener("touchstart", ()=>card.classList.add("selected"),{passive:true});
  card.addEventListener("mouseup", ()=>card.classList.remove("selected"));
  card.addEventListener("mouseleave", ()=>card.classList.remove("selected"));
  card.addEventListener("touchend", ()=>card.classList.remove("selected"));
  return card;
}
function chip(text, active, onClick){
  return h("div",{class:"chip"+(active?" active":""), onclick:onClick}, text);
}
function swatch(hex){ return h("span",{class:"sw", style:{background:hex}}); }

/* ---- Topbar auth (solo demo) ---- */
$("#btnLogin")?.addEventListener("click", ()=>alert("Login (demo)"));
$("#btnSignup")?.addEventListener("click", ()=>alert("Registrazione (demo)"));

/* ---- Pagine ---- */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare"));

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
    row.appendChild(
      chip(g, state.gender===g, (ev)=>{
        state.gender=g;
        [...row.children].forEach(c=>c.classList.remove("active"));
        ev.currentTarget.classList.add("active");
        pageRegions();
      })
    );
  });
  box.appendChild(row);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageSports()},"Indietro")
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
      chip(r, state.region===r, (ev)=>{
        state.region=r;
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        ev.currentTarget.classList.add("active");
        pageLeagues();
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageGender()},"Indietro")
  ]));
  app.appendChild(box);
}

function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il campionato", state.region||""));

  const leagues = DATA.leaguesBy[state.region]||[];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  leagues.forEach(l=>{
    wrap.appendChild(
      chip(l, state.league===l, (ev)=>{
        state.league=l;
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        ev.currentTarget.classList.add("active");
        pageClubs();
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageRegions()},"Indietro")
  ]));
  app.appendChild(box);
}

function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la società", state.league||""));

  const clubs = DATA.clubsByLeague[state.league]||["Società Dimostrativa"];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  clubs.forEach(c=>{
    wrap.appendChild(
      chip(c, state.club===c, (ev)=>{
        state.club=c;
        [...wrap.children].forEach(x=>x.classList.remove("active"));
        ev.currentTarget.classList.add("active");
        pageClubProfile(c);
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageLeagues()},"Indietro")
  ]));
  app.appendChild(box);
}

/* ---- Pagina Società ---- */
function pageClubProfile(clubName){
  clearMain();

  const club = DATA.clubProfiles[clubName] || {
    logo:LOGOS.icon,
    uniforms:{casa:"#ffffff", trasferta:"#000000", terza:"#2ecc71"},
    contacts:{email:"-", tel:"-", indirizzo:"-"},
    gallery:[],
    matchesVenue:[]
  };

  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // Logo centrato
  app.appendChild(
    h("div",{class:"container center"},[
      h("img",{src:club.logo||LOGOS.icon, alt:clubName, class:"logo-circle"})
    ])
  );

  // Colori divise (in evidenza)
  const kits = h("div",{class:"container panel"},[
    h("div",{class:"sub", style:{margin:"0 0 .6rem 0", fontWeight:"800", color:"var(--accent)"}}, "Colori divise (ufficiali società)"),
    h("div",{class:"kits"},[
      h("div",{class:"kit"},[ h("label",{},"Casa"),      swatch(club.uniforms.casa) ]),
      h("div",{class:"kit"},[ h("label",{},"Trasferta"), swatch(club.uniforms.trasferta) ]),
      club.uniforms.terza ? h("div",{class:"kit"},[ h("label",{},"Terza"), swatch(club.uniforms.terza) ]) : null
    ])
  ]);
  app.appendChild(kits);

  // Accordion sezioni
  const acc = h("div",{class:"container acc"});

  // Info società
  acc.appendChild(accordionItem(
    "Informazioni",
    h("div",{},[
      h("div",{},"Indirizzo: "+(club.contacts.indirizzo||"-")),
      h("div",{},"Email: "+(club.contacts.email||"-")),
      h("div",{},"Tel: "+(club.contacts.tel||"-")),
    ])
  ));

  // Gallery
  acc.appendChild(accordionItem(
    "Gallery foto",
    (club.gallery && club.gallery.length)
      ? h("div",{class:"grid"}, club.gallery.map(src=>h("img",{src, alt:"Foto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}})))
      : h("div",{class:"sub"},"Nessuna foto caricata.")
  ));

  // Match in programma nel centro sportivo
  acc.appendChild(accordionItem(
    "Match in programma (impianto)",
    (club.matchesVenue && club.matchesVenue.length)
      ? h("div",{}, club.matchesVenue.map(m =>
          h("div",{class:"row"},[ h("div",{class:"team"}, m.title), h("div",{class:"meta"}, `${m.when} — ${m.where}`) ])
        ))
      : h("div",{class:"sub"},"Nessuna partita programmata.")
  ));

  // Area Staff (codice)
  acc.appendChild(accordionItem(
    "Area Staff (allenatori/dirigenti)",
    staffArea()
  ));

  app.appendChild(acc);

  // Prossime partite (società)
  const next = h("div",{class:"container panel"},[
    h("div",{class:"sub", style:{margin:"0 0 .6rem 0", fontWeight:"800", color:"var(--accent)"}}, "Prossime partite"),
    h("div",{class:"row"},[
      h("div",{class:"team"},"Prima Squadra vs —"),
      h("div",{class:"meta"},"Dom 14:30 — Centro Sportivo Demo")
    ])
  ]);
  app.appendChild(next);

  // Azioni: indietro + Crea PreMatch
  const actions = h("div",{class:"actions container"},[
    h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro"),
    createPrematchButton()
  ]);
  app.appendChild(actions);
}

function accordionItem(title, bodyEl){
  const item = h("div",{class:"acc-item"});
  const hd = h("div",{class:"acc-hd"},[
    h("div",{class:"t"}, title),
    h("div",{class:"muted"},"▾")
  ]);
  const bd = h("div",{class:"acc-bd"}, bodyEl);
  hd.addEventListener("click", ()=>{
    item.classList.toggle("open");
  });
  item.appendChild(hd); item.appendChild(bd);
  return item;
}

/* ---- Area Staff ---- */
function staffArea(){
  const wrap = h("div",{style:{display:"grid", gap:".6rem", maxWidth:"420px"}});
  const inp = h("input",{type:"password", placeholder:"Inserisci codice staff", style:{
    width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)",
    background:"#0f141a", color:"var(--text)"
  }});
  const go = h("button",{class:"btn primary", onclick:()=>{
    if (inp.value.trim()===STAFF_CODE_DEMO) showConvocazioni();
    else alert("Codice non valido.");
  }},"Entra");
  wrap.appendChild(inp); wrap.appendChild(go);
  return wrap;
}

function showConvocazioni(){
  clearMain();
  app.appendChild(sectionTitle("Convocazioni (demo)","Seleziona giocatrici da convocare"));
  const rosa = ["Rossi","Bianchi","Verdi","Neri","Gialli","Blu","Viola","Marroni","Azzurri","Ferri","Testa","De Luca"];
  const sel = new Set();

  const list = h("div",{class:"container panel"});
  rosa.forEach(n=>{
    const row = h("div",{class:"row", onclick:()=>{
      if (sel.has(n)) sel.delete(n); else sel.add(n);
      badge.textContent = sel.has(n)?"✓":"＋";
    }});
    const name = h("div",{class:"team"},n);
    const badge = h("div",{class:"meta"},"＋");
    row.appendChild(name); row.appendChild(badge);
    list.appendChild(row);
  });

  const actions = h("div",{class:"actions container"},[
    h("button",{class:"btn", onclick:()=>pageClubProfile(state.club)},"Indietro"),
    h("button",{class:"btn primary", onclick:()=>{
      alert(`Convocati: ${[...sel].join(", ")||"nessuno"}`);
    }},"Conferma convocazioni")
  ]);

  app.appendChild(list);
  app.appendChild(actions);
}

/* ---- Crea PreMatch ---- */
function createPrematchButton(){
  const btn = h("button",{class:"btn primary", style:{display:"inline-flex", alignItems:"center", gap:".5rem"}},[
    h("span",{class:"pm-badge"},[ h("img",{src:LOGOS.icon, alt:"PM"}) ]),
    "Crea PreMatch"
  ]);
  btn.addEventListener("click", openPrematchModal);
  return btn;
}

function openPrematchModal(){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  overlay.appendChild(sheet);

  const hd = h("div",{class:"hd"},"Crea PreMatch");
  const bd = h("div",{class:"bd"});
  const bar = h("div",{class:"bar"});

  // palette maglia (solo maglia, come richiesto)
  const colors = ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];
  const sel = { maglia:null, when:"", where:"" };

  const maglia = h("div",{},[
    h("div",{class:"sub", style:{margin:"0 0 6px 0"}}, "Colore maglia (ospite)"),
    h("div",{class:"palette"},
      colors.map(hex => {
        const b = h("button",{class:"color-dot", style:{backgroundColor:hex}, onclick:(ev)=>{
          sel.maglia = hex;
          [...ev.currentTarget.parentElement.children].forEach(x=>x.classList.remove("selected"));
          ev.currentTarget.classList.add("selected");
        }});
        return b;
      })
    )
  ]);

  const dt = h("input",{type:"datetime-local", style:{
    width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"
  }, onchange:e=> sel.when=e.target.value});
  const place = h("input",{type:"text", placeholder:"Via dello Sport 1, Città", style:{
    width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"
  }, oninput:e=> sel.where=e.target.value});

  bd.appendChild(maglia);
  bd.appendChild(h("div",{},[ h("div",{class:"sub"},"Data & ora"), dt ]));
  bd.appendChild(h("div",{},[ h("div",{class:"sub"},"Luogo (indirizzo)"), place ]));

  const ann = h("button",{class:"btn", onclick:()=>overlay.remove()},"Annulla");
  const ok  = h("button",{class:"btn primary", onclick:()=>{
    if(!sel.maglia || !sel.when || !sel.where){ alert("Completa tutti i campi."); return; }
    overlay.remove();
    toast("Richiesta PreMatch inviata ✅");
  }},"Conferma");
  bar.appendChild(ann); bar.appendChild(ok);

  sheet.appendChild(hd); sheet.appendChild(bd); sheet.appendChild(bar);
  document.body.appendChild(overlay);
}

function toast(msg){
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"700", zIndex:1200
  }}, msg);
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1800);
}

/* ---- Avvio ---- */
pageSports();

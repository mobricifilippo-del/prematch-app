/* =========================
   PreMatch DEMO – app.js
   Flusso corretto:
   Home (Sport) → Pagina Filtro con tendine:
   Genere → Regione → Campionato → Società → Pagina Società
   Evidenziazione stabile su click (chip/card)
   ========================= */

const LOGOS = {
  light: "./images/logo-light.png",
  icon: "./images/logo-icon.png",
};

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
    Lazio: ["Eccellenza", "Promozione", "Prima Categoria"],
    Lombardia: ["Serie C Silver", "Serie D"],
    Sicilia: ["Serie C", "Promozione"],
    Piemonte: ["Eccellenza"],
    Veneto: ["Serie B Interregionale"],
    "Emilia-Romagna": ["Promozione"],
  },
  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino", "Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Serie C Silver": ["Brixia Basket", "Gorla Team"],
    "Serie D": ["Lario Basket"],
    "Serie C": ["Siracusa Calcio"],
    "Serie B Interregionale": ["Treviso Volley"],
  },
  clubProfiles: {
    "ASD Roma Nord": {
      logo: "./images/logo-icon.png",
      gallery: ["./images/calcio.jpg"],
      sponsors: ["Hotel Demo", "Ristorante Demo"],
      contacts: { email: "info@societa.demo", tel: "+39 000 000 0000" },
      matches: [
        { home: "Prima Squadra", when: "31/08/2025 14:07", where: "Roma — Stadio Olimpico" }
      ]
    },
  }
};

// ---- stato app
const state = { sport:null, gender:null, region:null, league:null, club:null };
const app = document.getElementById("app");

// ---- helper mini-UI
function h(tag, attrs={}, children=[]) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==="class") el.className = v;
    else if(k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if(k==="style" && typeof v==="object") Object.assign(el.style, v);
    else el.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c!=null) el.appendChild(typeof c==="string"?document.createTextNode(c):c);
  });
  return el;
}
function clearMain(){ app.innerHTML=""; }
function title(t,sub){ return h("div",{class:"container"},[h("div",{class:"h1"},t),h("div",{class:"sub"},sub||"")]); }
function toast(msg){
  const t=h("div",{class:"toast"},msg);
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1400);
}

// ===== Home (sport)
function pageSports(){
  clearMain();
  app.appendChild(title("Scegli lo sport","Seleziona per iniziare"));

  const grid=h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    const card=h("div",{class:"card card-sport"+(state.sport===s.key?" selected":""),onclick:()=>{
      // evidenzia e passa ai filtri in tendina
      document.querySelectorAll(".card-sport").forEach(c=>c.classList.remove("selected"));
      card.classList.add("selected");
      state.sport=s.key;
      setTimeout(()=>pageFilters(),220);
    }},[
      h("img",{src:s.img,alt:s.name,onerror(){this.style.display="none"}}),
      h("div",{class:"title"},s.name)
    ]);
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

// ===== Pagina filtri con tendine (Genere → Regione → Campionato → Società)
function pageFilters(){
  clearMain();

  const sportName = (DATA.sports.find(x=>x.key===state.sport)||{}).name || "";
  app.appendChild(title(`${sportName}`,"Seleziona genere, regione e campionato"));

  const wrap=h("div",{class:"container"});

  // riepilogo breadcrumb in alto (es: Calcio • Femminile • Lazio • Eccellenza)
  const crumb=h("div",{class:"sub", style:{marginBottom:"12px", fontWeight:"800"}});
  wrap.appendChild(crumb);

  // pannello filtri
  const panel=h("div",{class:"panel"});
  wrap.appendChild(panel);

  // sezioni (mostrate in cascata)
  const secGen=h("div");
  const secReg=h("div");
  const secLea=h("div");
  const secClu=h("div");

  panel.appendChild(h("div",{class:"sub",style:{fontWeight:"800"}}, "Genere"));
  panel.appendChild(secGen);

  panel.appendChild(h("div",{class:"sub",style:{fontWeight:"800", marginTop:"10px"}}, "Regione"));
  panel.appendChild(secReg);

  panel.appendChild(h("div",{class:"sub",style:{fontWeight:"800", marginTop:"10px"}}, "Campionato"));
  panel.appendChild(secLea);

  panel.appendChild(h("div",{class:"sub",style:{fontWeight:"800", marginTop:"10px"}}, "Società"));
  panel.appendChild(secClu);

  // azioni
  wrap.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>{state.gender=null;state.region=null;state.league=null;state.club=null;pageSports();}},"Indietro")
  ]));

  app.appendChild(wrap);

  // render funzioni locali
  const chips = (list, current, onPick)=>{
    const box=h("div",{class:"chips"});
    list.forEach(val=>{
      const chip=h("div",{class:"chip"+(current===val?" active":""),onclick:()=>{
        // attiva visivamente
        [...box.children].forEach(x=>x.classList.remove("active"));
        chip.classList.add("active");
        onPick(val);
      }},val);
      box.appendChild(chip);
    });
    return box;
  };

  function renderCrumb(){
    const parts=[sportName, state.gender, state.region, state.league].filter(Boolean);
    crumb.textContent = parts.length ? parts.join(" • ") : "";
  }

  function renderGen(){
    secGen.innerHTML="";
    secGen.appendChild(chips(DATA.genders, state.gender, (g)=>{
      // scegliendo genere, reset passo successivi
      state.gender=g; state.region=null; state.league=null; state.club=null;
      renderAll();
      // scroll leggero alla sezione successiva
      setTimeout(()=>secReg.scrollIntoView({behavior:"smooth",block:"center"}),60);
    }));
  }

  function renderReg(){
    secReg.innerHTML="";
    const disabled = !state.gender;
    secReg.style.opacity = disabled? ".45" : "1";
    if(disabled){ return; }
    secReg.appendChild(chips(DATA.regions, state.region, (r)=>{
      state.region=r; state.league=null; state.club=null;
      renderAll();
      setTimeout(()=>secLea.scrollIntoView({behavior:"smooth",block:"center"}),60);
    }));
  }

  function renderLea(){
    secLea.innerHTML="";
    const disabled = !state.region;
    secLea.style.opacity = disabled? ".45" : "1";
    if(disabled){ return; }
    const leagues = DATA.leaguesBy[state.region]||[];
    secLea.appendChild(chips(leagues, state.league, (l)=>{
      state.league=l; state.club=null;
      renderAll();
      setTimeout(()=>secClu.scrollIntoView({behavior:"smooth",block:"center"}),60);
    }));
  }

  function renderClu(){
    secClu.innerHTML="";
    const disabled = !state.league;
    secClu.style.opacity = disabled? ".45" : "1";
    if(disabled){ return; }
    const clubs = DATA.clubsByLeague[state.league] || [];
    const list=h("div",{});
    clubs.forEach(name=>{
      const row=h("div",{class:"row",onclick:()=>{ state.club=name; pageClubProfile(name); }},[
        h("div",{class:"team"},name),
        h("div",{class:"meta"},"PreMatch ›")
      ]);
      list.appendChild(row);
    });
    secClu.appendChild(list);
  }

  function renderAll(){
    renderCrumb();
    renderGen();
    renderReg();
    renderLea();
    renderClu();
  }

  renderAll();
}

// ===== Pagina società
function pageClubProfile(name){
  clearMain();
  const sportName = (DATA.sports.find(x=>x.key===state.sport)||{}).name || "";
  app.appendChild(title(name, `${sportName} • ${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  const profile = DATA.clubProfiles[name] || {
    logo: LOGOS.icon,
    gallery: [], sponsors: [], contacts:{email:"-", tel:"-"},
    matches:[]
  };

  // Testata: logo sinistra + bottone PM tondo a destra
  const head=h("div",{class:"club-head"},[
    h("img",{src:profile.logo, alt:name, class:"club-logo"}),
    h("div",{style:{flex:1}}),
    h("div",{},[
      h("div",{class:"pm-round", onclick:()=>toast('Demo: Crea PreMatch')}, [
        h("img",{src:LOGOS.icon, alt:"PM"})
      ]),
      h("div",{class:"pm-label"},"Crea PreMatch")
    ])
  ]);
  app.appendChild(head);

  // Accordion info / gallery / match
  const acc=h("div",{class:"acc"});
  acc.appendChild(accItem("Informazioni", [
    pRow("Email", profile.contacts.email),
    pRow("Tel", profile.contacts.tel)
  ]));
  acc.appendChild(accItem("Gallery", profile.gallery.length
    ? gridImgs(profile.gallery)
    : h("div",{class:"sub"},"Nessuna foto caricata.")
  ));
  acc.appendChild(accItem("Match in programma", (profile.matches.length
    ? listMatches(profile.matches)
    : h("div",{class:"sub"},"Nessuna partita programmata.")
  )));
  app.appendChild(acc);

  app.appendChild(h("div",{class:"container"},[
    h("div",{class:"actions"},[
      h("button",{class:"btn",onclick:()=>pageFilters()},"Indietro")
    ])
  ]));
}

// --- componenti secondari
function pRow(label,val){
  return h("div",{class:"row"},[
    h("div",{class:"team"},label),
    h("div",{class:"meta"},val||"-")
  ]);
}
function gridImgs(list){
  const g=h("div",{class:"grid"});
  list.forEach(src=> g.appendChild(
    h("img",{src,alt:"foto",style:{width:"100%",height:"140px",objectFit:"cover",borderRadius:"12px"}})
  ));
  return g;
}
function listMatches(list){
  const wrap=h("div",{});
  list.forEach(m=>{
    wrap.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, `${m.home} vs —`),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  return wrap;
}
function accItem(title, bodyEl){
  const item=h("div",{class:"acc-item"});
  const hd=h("div",{class:"acc-hd"},[
    h("div",{class:"t"}, title),
    h("div",{}, "▾")
  ]);
  const bd=h("div",{class:"acc-bd"}, bodyEl);
  hd.addEventListener("click", ()=> item.classList.toggle("open"));
  item.appendChild(hd); item.appendChild(bd);
  return item;
}

/* Avvio sull'home sport */
pageSports();

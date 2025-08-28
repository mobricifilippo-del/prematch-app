/* =========================
   PreMatch DEMO – app.js
   Flusso: Sport → Genere → Regione → Campionato → Società → Pagina Società
   Evidenziazione stabile su click
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

const state = { sport:null, gender:null, region:null, league:null, club:null };
const app = document.getElementById("app");

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

function pageSports(){
  clearMain();
  app.appendChild(title("Scegli lo sport",""));

  const grid=h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    const card=h("div",{class:"card card-sport"+(state.sport===s.key?" selected":""),onclick:()=>{
      document.querySelectorAll(".card-sport").forEach(c=>c.classList.remove("selected"));
      card.classList.add("selected");
      state.sport=s.key;
      setTimeout(()=>pageGender(),220);
    }},[
      h("img",{src:s.img,alt:s.name,onerror(){this.style.display="none"}}),
      h("div",{class:"title"},s.name)
    ]);
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function chips(list, current, onPick){
  const wrap=h("div",{class:"chips"});
  list.forEach(val=>{
    const c=h("div",{class:"chip"+(current===val?" active":""),onclick:()=>{
      [...wrap.children].forEach(x=>x.classList.remove("active"));
      c.classList.add("active");
      onPick(val);
    }},val);
    wrap.appendChild(c);
  });
  return wrap;
}

function pageGender(){
  clearMain();
  app.appendChild(title("Seleziona il genere",""));

  const box=h("div",{class:"container panel"});
  box.appendChild(chips(DATA.genders, state.gender, (g)=>{
    state.gender=g;
    setTimeout(()=>pageRegions(),220);
  }));
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageSports()},"Indietro")
  ]));
  app.appendChild(box);
}

function pageRegions(){
  clearMain();
  app.appendChild(title("Scegli la regione",""));

  const box=h("div",{class:"container panel"});
  box.appendChild(chips(DATA.regions, state.region, (r)=>{
    state.region=r;
    setTimeout(()=>pageLeagues(),220);
  }));
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageGender()},"Indietro")
  ]));
  app.appendChild(box);
}

function pageLeagues(){
  clearMain();
  app.appendChild(title("Scegli il campionato", state.region||""));
  const leagues = DATA.leaguesBy[state.region] || [];

  const box=h("div",{class:"container panel"});
  box.appendChild(chips(leagues, state.league, (l)=>{
    state.league=l;
    setTimeout(()=>pageClubs(),220);
  }));
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageRegions()},"Indietro")
  ]));
  app.appendChild(box);
}

function pageClubs(){
  clearMain();
  app.appendChild(title("Scegli la società", state.league||""));
  const clubs = DATA.clubsByLeague[state.league] || ["Società Demo"];

  const box=h("div",{class:"container panel"});
  box.appendChild(chips(clubs, state.club, (c)=>{
    state.club=c;
    setTimeout(()=>pageClubProfile(c),220);
  }));
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn",onclick:()=>pageLeagues()},"Indietro")
  ]));
  app.appendChild(box);
}

function pageClubProfile(name){
  clearMain();
  app.appendChild(title(name, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  const profile = DATA.clubProfiles[name] || {
    logo: LOGOS.icon,
    gallery: [], sponsors: [], contacts:{email:"-", tel:"-"},
    matches:[]
  };

  // Testata: logo sinistra + bottone tondo uguale
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

  // Accordion: Info / Gallery / Match
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
      h("button",{class:"btn",onclick:()=>pageClubs()},"Indietro")
    ])
  ]));
}

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
function toast(msg){
  const t=h("div",{class:"toast"},msg);
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1600);
}

/* Avvio */
pageSports();

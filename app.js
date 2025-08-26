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
  regions: ["Lazio", "Lombardia", "Sicilia"],
  leaguesBy: {
    Lazio: ["Eccellenza", "Promozione", "Scuola Calcio"],
    Lombardia: ["Serie D", "Scuola Calcio"],
    Sicilia: ["Serie C", "Scuola Calcio"],
  },
  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino"],
    "Scuola Calcio": ["Accademia Ragazzi"],
    "Serie D": ["Lario Basket"],
    "Serie C": ["Siracusa Calcio"],
  },
};

const state = { sport:null, gender:null, region:null, league:null, club:null };

const app = document.getElementById("app");

function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k==="class") el.className = v;
    else if (k==="onclick") el.addEventListener("click", v);
    else el.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c==null) return;
    el.appendChild(typeof c==="string"?document.createTextNode(c):c);
  });
  return el;
}
function clearMain(){ app.innerHTML=""; }
function sectionTitle(t,st){return h("div",{class:"container"},[
  h("div",{class:"h1"},t), st?h("div",{class:"sub"},st):""
]);}
function chip(txt,active,onClick){
  return h("div",{class:"chip"+(active?" active":""),onclick:onClick},txt);
}
function gridCard(item,onClick){
  return h("div",{class:"card"+(state.sport===item.key?" selected":""),onclick:onClick},[
    h("img",{src:item.img,alt:item.name}),
    h("div",{class:"title"},item.name)
  ]);
}

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
  app.appendChild(sectionTitle("Scegli il campionato",state.region||""));
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
  app.appendChild(sectionTitle("Scegli la società",state.league||""));
  const clubs=DATA.clubsByLeague[state.league]||[];
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
  app.appendChild(sectionTitle(clubName,state.league+" • "+state.gender+" • "+state.region));
  const logo=h("div",{class:"container",style:{display:"flex",justifyContent:"center"}},[
    h("img",{src:LOGOS.icon,style:{width:"92px",height:"92px",borderRadius:"999px"}})
  ]);
  app.appendChild(logo);
  const actions=h("div",{class:"container"},[
    h("button",{class:"pm-btn"},[
      h("img",{src:LOGOS.icon,alt:"PM"}),"Crea PreMatch"
    ])
  ]);
  app.appendChild(actions);
}

pageSports();

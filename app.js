/* =========================
   PreMatch Web App - app.js
   ========================= */

/* ---------- Dati demo ---------- */
const DATA = {
  sports: [
    { key: "calcio", name: "Calcio", img: "./images/calcio.jpg" },
    { key: "basket", name: "Basket", img: "./images/basket.jpg" },
    { key: "volley", name: "Volley", img: "./images/volley.jpg" },
  ],
  genders: ["Maschile", "Femminile"],
  regions: ["Lazio", "Lombardia", "Sicilia"],
  leaguesBy: {
    "Lazio": ["Eccellenza", "Promozione"],
    "Lombardia": ["Serie D", "Serie C Silver"],
    "Sicilia": ["Prima Categoria", "Promozione"],
  },
  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord", "Virtus Marino"],
    "Promozione": ["Borghesiana FC", "Atletico Ostia"],
    "Serie D": ["Lario Basket"],
    "Serie C Silver": ["Brixia Basket"],
    "Prima Categoria": ["Siracusa Calcio"],
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

/* ---------- Helpers ---------- */
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k === "class") el.className = v;
    else if (k === "onclick") el.addEventListener("click", v);
    else el.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(typeof c==="string") el.appendChild(document.createTextNode(c));
    else if(c) el.appendChild(c);
  });
  return el;
}

function clearMain(){ document.getElementById("app").innerHTML = ""; }
function sectionTitle(title, subtitle){
  return h("div",{class:"container"},[
    h("div",{class:"h1"},title),
    h("div",{class:"sub"},subtitle||"")
  ]);
}

function chip(text, active, onClick){
  return h("div",{class:"chip"+(active?" active":""),onclick:onClick},text);
}

function gridCard(item, onClick){
  return h("div",{class:"card card-sport", "data-sport":item.key, onclick:onClick},[
    h("img",{src:item.img,alt:item.name,onerror(){this.style.display="none"}}),
    h("div",{class:"title"},item.name)
  ]);
}

/* ---------- Pagine ---------- */
function pageSports(){
  clearMain();
  const app = document.getElementById("app");
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare"));

  const grid = h("div",{class:"container grid",id:"sportGrid"});
  DATA.sports.forEach(s=>{
    grid.appendChild(gridCard(s, ()=>{
      document.querySelectorAll(".card-sport").forEach(c=>c.classList.remove("selected"));
      event.currentTarget.classList.add("selected");
      setTimeout(()=>{ 
        state.sport=s.key; 
        pageGender(); 
      },200);
    }));
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  const app = document.getElementById("app");
  app.appendChild(sectionTitle("Seleziona il genere",""));

  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    wrap.appendChild(chip(g,state.gender===g,()=>{
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      event.currentTarget.classList.add("active");
      state.gender=g;
      setTimeout(()=>pageRegions(),200);
    }));
  });
  box.appendChild(wrap);
  app.appendChild(box);
}

function pageRegions(){
  clearMain();
  const app = document.getElementById("app");
  app.appendChild(sectionTitle("Scegli la regione",""));

  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  DATA.regions.forEach(r=>{
    wrap.appendChild(chip(r,state.region===r,()=>{
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      event.currentTarget.classList.add("active");
      state.region=r;
      setTimeout(()=>pageLeagues(),200);
    }));
  });
  box.appendChild(wrap);
  app.appendChild(box);
}

function pageLeagues(){
  clearMain();
  const app = document.getElementById("app");
  app.appendChild(sectionTitle("Scegli il campionato",state.region||""));

  const leagues = DATA.leaguesBy[state.region] || [];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  leagues.forEach(l=>{
    wrap.appendChild(chip(l,state.league===l,()=>{
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      event.currentTarget.classList.add("active");
      state.league=l;
      setTimeout(()=>pageClubs(),200);
    }));
  });
  box.appendChild(wrap);
  app.appendChild(box);
}

function pageClubs(){
  clearMain();
  const app = document.getElementById("app");
  app.appendChild(sectionTitle("Scegli la società",state.league||""));

  const clubs = DATA.clubsByLeague[state.league]||["Società demo"];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  clubs.forEach(c=>{
    wrap.appendChild(chip(c,state.club===c,()=>{
      [...wrap.children].forEach(x=>x.classList.remove("active"));
      event.currentTarget.classList.add("active");
      state.club=c;
      setTimeout(()=>pageClubDetail(c),200);
    }));
  });
  box.appendChild(wrap);
  app.appendChild(box);
}

function pageClubDetail(clubName){
  clearMain();
  const app = document.getElementById("app");
  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.region||""}`));

  const box = h("div",{class:"container panel"},[
    h("div",{class:"sub"},"Informazioni della società "+clubName),
    h("button",{class:"btn primary",onclick:()=>alert("PreMatch richiesto!")}, "Crea PreMatch")
  ]);
  app.appendChild(box);
}

/* ---------- Start ---------- */
pageSports();

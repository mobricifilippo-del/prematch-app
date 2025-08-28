/* =========================
   PreMatch DEMO - app.js
   Evidenziazione fissa su click
   ========================= */

const LOGOS = {
  light: "./images/logo-light.png",
  dark: "./images/logo-dark.png",
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
  }
};

const state = {
  sport:null, gender:null, region:null, league:null, club:null
};

const app = document.getElementById("app");

function h(tag, attrs={}, children=[]) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==="class") el.className = v;
    else if(k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c!=null) el.appendChild(typeof c==="string"?document.createTextNode(c):c);
  });
  return el;
}
function clearMain(){ app.innerHTML=""; }
function sectionTitle(t,sub){ return h("div",{class:"container"},[h("div",{class:"h1"},t),h("div",{class:"sub"},sub||"")]); }

function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport",""));
  const grid=h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    const card=h("div",{class:"card card-sport"+(state.sport===s.key?" selected":""),onclick:()=>{
      document.querySelectorAll(".card-sport").forEach(c=>c.classList.remove("selected"));
      card.classList.add("selected");
      state.sport=s.key;
      setTimeout(()=>pageGender(),250); // pausa per far vedere il bordo verde
    }},[
      h("img",{src:s.img,alt:s.name,onerror(){this.style.display="none"}}),
      h("div",{class:"title"},s.name)
    ]);
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));
  const box=h("div",{class:"container panel"});
  const chips=h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    const chip=h("div",{class:"chip"+(state.gender===g?" active":""),onclick:()=>{
      [...chips.children].forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      state.gender=g;
      setTimeout(()=>pageRegions(),250);
    }},g);
    chips.appendChild(chip);
  });
  box.appendChild(chips);
  box.appendChild(h("div",{class:"actions"},[h("button",{class:"btn",onclick:()=>pageSports()},"Indietro")]));
  app.appendChild(box);
}

function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione",""));
  const box=h("div",{class:"container panel"});
  const chips=h("div",{class:"chips"});
  DATA.regions.forEach(r=>{
    const chip=h("div",{class:"chip"+(state.region===r?" active":""),onclick:()=>{
      [...chips.children].forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      state.region=r;
      setTimeout(()=>pageLeagues(),250);
    }},r);
    chips.appendChild(chip);
  });
  box.appendChild(chips);
  box.appendChild(h("div",{class:"actions"},[h("button",{class:"btn",onclick:()=>pageGender()},"Indietro")]));
  app.appendChild(box);
}

function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il campionato",state.region||""));
  const box=h("div",{class:"container panel"});
  const chips=h("div",{class:"chips"});
  (DATA.leaguesBy[state.region]||[]).forEach(l=>{
    const chip=h("div",{class:"chip"+(state.league===l?" active":""),onclick:()=>{
      [...chips.children].forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      state.league=l;
      setTimeout(()=>pageClubs(),250);
    }},l);
    chips.appendChild(chip);
  });
  box.appendChild(chips);
  box.appendChild(h("div",{class:"actions"},[h("button",{class:"btn",onclick:()=>pageRegions()},"Indietro")]));
  app.appendChild(box);
}

function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la società",state.league||""));
  const box=h("div",{class:"container panel"});
  const chips=h("div",{class:"chips"});
  (DATA.clubsByLeague[state.league]||["Società Demo"]).forEach(c=>{
    const chip=h("div",{class:"chip"+(state.club===c?" active":""),onclick:()=>{
      [...chips.children].forEach(x=>x.classList.remove("active"));
      chip.classList.add("active");
      state.club=c;
      setTimeout(()=>pageClubProfile(c),250);
    }},c);
    chips.appendChild(chip);
  });
  box.appendChild(chips);
  box.appendChild(h("div",{class:"actions"},[h("button",{class:"btn",onclick:()=>pageLeagues()},"Indietro")]));
  app.appendChild(box);
}

function pageClubProfile(clubName){
  clearMain();
  app.appendChild(sectionTitle(clubName,state.league+" • "+state.gender+" • "+state.region));
  app.appendChild(h("div",{class:"container"},h("div",{class:"sub"},"Pagina società demo...")));
}

/* Start */
pageSports();

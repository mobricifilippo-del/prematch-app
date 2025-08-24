/* ======== DATI STATICI DI DEMO ======== */
const SPORTS = [
  { key: "Calcio",       img: "images/calcio.jpg" },
  { key: "Futsal",       img: "images/futsal.jpg" },
  { key: "Basket",       img: "images/basket.jpg" },
  { key: "Rugby",        img: "images/rugby.jpg" },
  { key: "Volley",       img: "images/volley.jpg" },
  { key: "Beach Volley", img: "images/beachvolley.jpg" },
  { key: "Pallanuoto",   img: "images/pallanuoto.jpg" },
];

// regioni Italia (ridotto)
const REGIONS = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli-Venezia Giulia",
  "Lazio","Liguria","Lombardia","Marche","Molise","Piemonte","Puglia",
  "Sardegna","Sicilia","Toscana","Trentino-Alto Adige","Umbria","Valle d'Aosta","Veneto"
];

// categorie dimostrative per sport/genere
const CATEGORIES = {
  "Calcio": {
    "Maschile":   ["Eccellenza (Girone A)","Eccellenza (Girone B)","Promozione","Juniores U19","Allievi U17","Giovanissimi U15","Scuola Calcio"],
    "Femminile":  ["Eccellenza (Girone A)","Eccellenza (Girone B)","Juniores U19","Under 17","Under 15","Scuola Calcio"],
    "Entrambi":   ["Eccellenza (Girone A)","Eccellenza (Girone B)","Promozione","Juniores U19","Allievi U17","Giovanissimi U15","Scuola Calcio"]
  },
  "Futsal": {
    "Maschile":  ["Serie C1","C2","U19","U17","U15"],
    "Femminile": ["Serie C","U19","U17","U15"],
    "Entrambi":  ["Serie C1","C2","Serie C","U19","U17","U15"]
  },
  "Basket": {
    "Maschile":  ["Serie D","Promozione","U19","U17","U15"],
    "Femminile": ["Serie C","U19","U17","U15"],
    "Entrambi":  ["Serie D","Promozione","Serie C","U19","U17","U15"]
  },
  "Rugby": {
    "Maschile":  ["Serie C","U19","U17","U15"],
    "Femminile": ["Serie C","U19","U17","U15"],
    "Entrambi":  ["Serie C","U19","U17","U15"]
  },
  "Volley": {
    "Maschile":  ["Serie D","U19","U17","U15"],
    "Femminile": ["Serie C","U19","U17","U15"],
    "Entrambi":  ["Serie C","Serie D","U19","U17","U15"]
  },
  "Beach Volley": {
    "Entrambi":  ["Open","U19"]
  },
  "Pallanuoto": {
    "Maschile":  ["Serie C","U20","U17","U15"],
    "Femminile": ["Serie B","U17","U15"],
    "Entrambi":  ["Serie C","Serie B","U20","U17","U15"]
  }
};

// società demo (per sport/regione/genere/categoria)
const CLUBS = [
  // Calcio — Lazio
  { sport:"Calcio", regione:"Lazio", genere:"Femminile", categoria:"Eccellenza (Girone A)", nome:"SS Lazio Women", citta:"Roma",
    sponsors:["Hotel Tevere", "Ristorante La Porta"], matches:[
      { vs:"Roma CF", when:"2025-03-02 15:00", place:"Via delle Tre Fontane 5, Roma", status:"ok" },
      { vs:"Grifone Gialloverde", when:"2025-03-09 11:00", place:"Impianto Tor di Quinto, Roma", status:"pending" }
    ]
  },
  { sport:"Calcio", regione:"Lazio", genere:"Maschile", categoria:"Eccellenza (Girone B)", nome:"Vis Artena", citta:"Artena",
    sponsors:["Hotel Lepini"], matches:[
      { vs:"Anzio", when:"2025-03-02 15:00", place:"Stadio Comunale Artena", status:"ok" }
    ]
  },
  // Futsal — Lazio
  { sport:"Futsal", regione:"Lazio", genere:"Maschile", categoria:"Serie C1", nome:"Futsal Club Roma", citta:"Roma",
    sponsors:["Hotel EUR", "Pizzeria 90°"], matches:[
      { vs:"Ciampino Futsal", when:"2025-03-03 20:30", place:"PalaTorrino, Roma", status:"pending" }
    ]
  },
  // Basket — Lombardia
  { sport:"Basket", regione:"Lombardia", genere:"Maschile", categoria:"Promozione", nome:"Basket Cinisello", citta:"Cinisello B.",
    sponsors:["B&B Brianza"], matches:[
      { vs:"CUS Milano", when:"2025-03-04 21:00", place:"PalaCinisello", status:"ok" }
    ]
  },
  // Volley — Sicilia
  { sport:"Volley", regione:"Sicilia", genere:"Femminile", categoria:"Serie C", nome:"Pallavolo Etna", citta:"Catania",
    sponsors:["Hotel Ionio"], matches:[
      { vs:"Volley Siracusa", when:"2025-03-01 18:00", place:"PalaCatania", status:"pending" }
    ]
  },
  // Pallanuoto — Liguria
  { sport:"Pallanuoto", regione:"Liguria", genere:"Maschile", categoria:"Serie C", nome:"Waterpolo Genova", citta:"Genova",
    sponsors:["Ristorante Porto Antico"], matches:[
      { vs:"Rapallo WP", when:"2025-03-07 19:00", place:"Piscine Sciorba", status:"ok" }
    ]
  }
];

/* ======== STATO & NAVIGAZIONE ======== */
const qs = s => document.querySelector(s);
const qsa = s => [...document.querySelectorAll(s)];

let state = {
  sport: null,
  regione: null,
  genere: "Maschile",
  categoria: null
};

function show(id){
  qsa(".screen").forEach(el=>el.classList.remove("active"));
  qs(id).classList.add("active");
}
function goHome(){ show("#screen-home"); }

/* ======== RENDER HOME (SPORT) ======== */
function renderSports(){
  const grid = qs("#sportsGrid");
  grid.innerHTML = "";
  SPORTS.forEach(sp=>{
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${sp.img}" alt="${sp.key}" />
      <div class="title">${sp.key}</div>
    `;
    div.onclick = ()=>selectSport(sp.key);
    grid.appendChild(div);
  });
}

/* ======== SCELTA SPORT -> FILTRI ======== */
function selectSport(sportKey){
  state.sport = sportKey;
  qs("#sportTitle").textContent = sportKey;
  // regioni
  const selR = qs("#selRegion");
  selR.innerHTML = REGIONS.map(r=>`<option value="${r}">${r}</option>`).join("");
  state.regione = selR.value;

  // genere (resta quello selezionato)
  qs("#selGender").value = state.genere;

  // categorie in base a sport/genere
  renderCategories();

  // lista società filtrata
  renderClubs();

  show("#screen-filters");
}

function renderCategories(){
  const selC = qs("#selCategory");
  const cats = (CATEGORIES[state.sport] && (CATEGORIES[state.sport][state.genere] || CATEGORIES[state.sport]["Entrambi"])) || [];
  selC.innerHTML = cats.map(c=>`<option value="${c}">${c}</option>`).join("");
  state.categoria = selC.value || null;
}

/* ======== EVENT HANDLERS FILTRI ======== */
function onRegionChange(){ state.regione = qs("#selRegion").value; renderClubs(); }
function onGenderChange(){ state.genere  = qs("#selGender").value; renderCategories(); renderClubs(); }
function onCategoryChange(){ state.categoria = qs("#selCategory").value; renderClubs(); }

/* ======== RENDER SOCIETÀ ======== */
function renderClubs(){
  const box = qs("#clubsList");
  box.innerHTML = "";
  const filtered = CLUBS.filter(c =>
    c.sport===state.sport &&
    c.regione===state.regione &&
    (state.genere==="Entrambi" ? true : c.genere===state.genere) &&
    (!state.categoria || c.categoria===state.categoria)
  );

  if(!filtered.length){
    box.innerHTML = `<div class="item meta">Nessuna società trovata con questi filtri.</div>`;
    return;
  }

  filtered.forEach(c=>{
    const row = document.createElement("div");
    row.className = "item row";
    row.innerHTML = `
      <div>
        <div style="font-weight:700">${c.nome}</div>
        <div class="meta">${c.citta || ""} • ${c.categoria}</div>
      </div>
      <button class="link" onclick='openClub(${JSON.stringify(c).replace(/'/g,"&#39;")})'>Apri profilo</button>
    `;
    box.appendChild(row);
  });
}

/* ======== DETTAGLIO SOCIETÀ ======== */
function openClub(c){
  qs("#clubName").textContent = c.nome;
  qs("#clubMeta").textContent = `${c.citta || ""} • ${c.sport} • ${c.genere} • ${c.categoria}`;

  // sponsor
  const ul = qs("#sponsorList");
  ul.innerHTML = "";
  (c.sponsors || []).forEach(s=>{
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  });
  if(!c.sponsors || !c.sponsors.length){
    ul.innerHTML = `<li class="meta">Nessuno sponsor</li>`;
  }

  // partite
  const wrap = qs("#matchesList");
  wrap.innerHTML = "";
  (c.matches || []).forEach(m=>{
    const div = document.createElement("div");
    div.className = "item";
    const badge = m.status==="ok"
      ? `<span class="badge ok">PREMATCH CONFERMATO</span>`
      : `<span class="badge pending">In attesa di verifica</span>`;
    div.innerHTML = `
      <div class="row">
        <div>
          <div style="font-weight:700">${c.nome} vs ${m.vs}</div>
          <div class="meta">${m.when} — ${m.place}</div>
        </div>
        ${badge}
      </div>
    `;
    wrap.appendChild(div);
  });
  if(!c.matches || !c.matches.length){
    wrap.innerHTML = `<div class="item meta">Nessuna partita programmata</div>`;
  }

  show("#screen-club");
}
function backToFilters(){ show("#screen-filters"); }

/* ======== AVVIO ======== */
document.addEventListener("DOMContentLoaded", ()=>{
  renderSports();
});

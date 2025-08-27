// ===== Dati demo stabili =====
const DATA = {
  sports: [
    { id: "calcio", name: "Calcio", img: "images/calcio.jpg" },
    { id: "futsal", name: "Futsal", img: "images/futsal.jpg" },
    { id: "basket", name: "Basket", img: "images/basket.jpg" },
    { id: "volley", name: "Volley", img: "images/volley.jpg" },
    { id: "rugby", name: "Rugby", img: "images/rugby.jpg" },
    { id: "pallanuoto", name: "Pallanuoto", img: "images/pallanuoto.jpg" },
  ],
  regions: ["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"],
  campionati: {
    Lazio: ["Eccellenza","Promozione"],
    Lombardia: ["Eccellenza"],
    Sicilia: ["Eccellenza"],
    Piemonte: ["Eccellenza"],
    Veneto: ["Eccellenza"],
    "Emilia-Romagna": ["Eccellenza"],
  },
  societa: {
    // campionato -> array società
    "Lazio|Eccellenza|Femminile|Calcio": [
      {
        id:"virtus-marino",
        nome:"Virtus Marino",
        logo:"images/virtus.png",
        citta:"Roma",
        stadio:"Campo Test",
        prossime:[]
      },
      {
        id:"asd-roma-nord",
        nome:"ASD Roma Nord",
        logo:"images/pm-logo-round.png", // placeholder
        citta:"Roma",
        stadio:"Stadio Olimpico",
        prossime:[]
      }
    ],
    "Lazio|Eccellenza|Maschile|Calcio":[
      {
        id:"calcio-lazio",
        nome:"Calcio Lazio",
        logo:"images/pm-logo-round.png",
        citta:"Roma",
        stadio:"Campo A",
        prossime:[]
      }
    ]
  }
};

// Stato di navigazione
const state = {
  sport: null,
  gender: null,
  region: null,
  campionato: null,
};

// Helpers
const el = (html) => {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};
const app = document.getElementById("app");

function resetBelow(key){
  if(key === "sport"){ state.gender = state.region = state.campionato = null; }
  if(key === "gender"){ state.region = state.campionato = null; }
  if(key === "region"){ state.campionato = null; }
}

// ====== VIEW: HOME (SPORT) ======
function renderHome(){
  state.sport = state.gender = state.region = state.campionato = null;

  app.innerHTML = `
    <section>
      <h1 class="pm-section-title">Scegli lo sport</h1>
      <p class="pm-subtitle">Seleziona per iniziare</p>
      <div class="pm-grid" id="sportGrid"></div>
    </section>
  `;

  const grid = document.getElementById("sportGrid");
  DATA.sports.forEach(s=>{
    const card = el(`
      <article class="pm-card" data-sport="${s.id}">
        <img src="${s.img}" alt="${s.name}" loading="lazy"/>
        <div class="cap"><span>${s.name}</span></div>
      </article>
    `);
    card.addEventListener("click", ()=>{
      state.sport = s.id;
      renderGender();
    });
    grid.appendChild(card);
  });
}

// ====== VIEW: GENERE (con Regioni inline) ======
function renderGender(){
  resetBelow("sport");
  app.innerHTML = `
    <section>
      <h1 class="pm-section-title">Seleziona il genere</h1>
      <div class="pm-row pm-gender">
        <button class="pm-btn pm-btn-chip ${state.gender==='Maschile'?'active':''}" id="g-m">Maschile</button>
        <button class="pm-btn pm-btn-chip ${state.gender==='Femminile'?'active':''}" id="g-f">Femminile</button>
        <button class="pm-btn pm-btn-chip" id="g-back">Indietro</button>
      </div>

      <div id="regionWrap" style="display:${state.gender? 'block':'none'}">
        <h2 class="pm-subtitle" style="margin:8px 0 12px">Scegli la regione</h2>
        <div class="pm-regions" id="regionGrid"></div>
      </div>
    </section>
  `;

  document.getElementById("g-m").onclick = ()=>{
    state.gender = "Maschile"; renderGender(); renderRegions();
  };
  document.getElementById("g-f").onclick = ()=>{
    state.gender = "Femminile"; renderGender(); renderRegions();
  };
  document.getElementById("g-back").onclick = renderHome;

  if(state.gender) renderRegions();
}

function renderRegions(){
  const grid = document.getElementById("regionGrid");
  grid.innerHTML = "";
  DATA.regions.forEach(r=>{
    const b = el(`<button class="pm-btn pm-btn-chip">${r}</button>`);
    b.addEventListener("click", ()=>{ state.region = r; renderCampionati(); });
    grid.appendChild(b);
  });
}

// ====== VIEW: CAMPIONATI ======
function renderCampionati(){
  resetBelow("region");
  const list = (DATA.campionati[state.region] || []);
  app.innerHTML = `
    <section>
      <h1 class="pm-section-title">${state.region}</h1>
      <p class="pm-subtitle">Seleziona il campionato</p>
      <div class="pm-list" id="campList"></div>
      <div class="pm-row" style="margin-top:12px">
        <button class="pm-btn pm-btn-chip" id="backToGender">Indietro</button>
      </div>
    </section>
  `;
  const l = document.getElementById("campList");
  list.forEach(c=>{
    const it = el(`<div class="pm-item">${c}</div>`);
    it.onclick = ()=>{ state.campionato = c; renderSocietaList(); };
    l.appendChild(it);
  });
  document.getElementById("backToGender").onclick = renderGender;
}

// ====== VIEW: LISTA SOCIETÀ ======
function renderSocietaList(){
  const key = `${state.region}|${state.campionato}|${state.gender}|${capitalize(state.sport)}`;
  const list = DATA.societa[key] || [];

  app.innerHTML = `
    <section>
      <h1 class="pm-section-title">${state.campionato}</h1>
      <p class="pm-subtitle">${state.gender} • ${state.region} • ${capitalize(state.sport)}</p>
      <div class="pm-list" id="socList"></div>
      <div class="pm-row" style="margin-top:12px">
        <button class="pm-btn pm-btn-chip" id="backToCamp">Indietro</button>
      </div>
    </section>
  `;
  const l = document.getElementById("socList");
  list.forEach(s=>{
    const it = el(`<div class="pm-item">${s.nome}</div>`);
    it.onclick = ()=> renderSocietaPage(s);
    l.appendChild(it);
  });
  document.getElementById("backToCamp").onclick = renderCampionati;
}

// ====== VIEW: PAGINA SOCIETÀ ======
function renderSocietaPage(soc){
  app.innerHTML = `
    <section>
      <div class="pm-soc-top">
        <div class="pm-soc-logo">
          <img src="${soc.logo || 'images/pm-logo-round.png'}" alt="${soc.nome}" onerror="this.src='images/pm-logo-round.png'"/>
        </div>
        <div>
          <h1 class="pm-soc-name">${soc.nome}</h1>
          <p class="pm-subtitle">${state.campionato} • ${state.gender} • ${state.region}</p>
        </div>
        <button class="pm-pm-btn" id="btnPrematch">Crea<br/>PreMatch</button>
      </div>

      <div class="pm-acc">
        <details open>
          <summary>Informazioni</summary>
          <div class="acc-body">
            <div>📍 <strong>Città:</strong> ${soc.citta || '—'}</div>
            <div>🏟️ <strong>Impianto:</strong> ${soc.stadio || '—'}</div>
          </div>
        </details>
        <details>
          <summary>Galleria foto</summary>
          <div class="acc-body">In arrivo…</div>
        </details>
        <details>
          <summary>Match in programma</summary>
          <div class="acc-body">Nessun match programmato.</div>
        </details>
      </div>

      <div class="pm-row" style="margin-top:14px">
        <button class="pm-btn pm-btn-chip" id="backToSocList">Indietro</button>
      </div>
    </section>
  `;

  document.getElementById("backToSocList").onclick = renderSocietaList;
  document.getElementById("btnPrematch").onclick = openPrematchModal;
}

// ====== MODAL PREMATCH (semplice placeholder) ======
function openPrematchModal(){
  alert("PreMatch: seleziona maglia, data/ora, luogo e messaggio all’avversario (UI in arrivo).");
}

// Utils
function capitalize(s){ return s ? s[0].toUpperCase()+s.slice(1) : s; }

// Inizializza
renderHome();

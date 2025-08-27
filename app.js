/* ==========
   DEMO DATA
========== */
const DATA = {
  sports: [
    { id:"calcio", name:"Calcio", img:"https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=1200&auto=format&fit=crop" },
    { id:"futsal", name:"Futsal", img:"https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop" },
    { id:"basket", name:"Basket", img:"https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop" },
    { id:"volley", name:"Volley", img:"https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop" },
    { id:"rugby", name:"Rugby", img:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop" },
    { id:"palla",  name:"Pallanuoto", img:"https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200&auto=format&fit=crop" },
  ],
  regions: ["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"],
  leagues: {
    "Lazio": [
      { id:"ecc-f", name:"Eccellenza Femminile", gender:"femminile" },
      { id:"prom-m", name:"Promozione Maschile", gender:"maschile" }
    ],
    "Lombardia": [
      { id:"ecc-m", name:"Eccellenza Maschile", gender:"maschile" },
      { id:"u17-f", name:"Under 17 Femminile", gender:"femminile" }
    ]
  },
  clubs: {
    "ecc-f":[
      { id:"roma-nord", name:"ASD Roma Nord", level:"Eccellenza • Femminile • Lazio",
        logo:"https://raw.githubusercontent.com/mobricifilippo-del/prematch-assets/main/pm-circle-green.png",
        info:{
          sede:"Via dello Sport 1, Roma",
          stadio:"Centro Sportivo Demo",
          contatti:"info@asfromanord.it • 06 123456",
          colori:["#0d1117","#1f6feb","#e34c26"]
        },
        gallery:[
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop"
        ],
        matches:[
          { title:"Prima Squadra vs —", when:"31/08/2025 14:07", where:"Roma — Stadio Olimpico" },
          { title:"Juniores vs —", when:"01/09/2025 18:30", where:"Roma — Campo Test" },
        ]
      },
      { id:"virtus-marino", name:"Virtus Marino", level:"Eccellenza • Femminile • Lazio",
        logo:"https://raw.githubusercontent.com/mobricifilippo-del/prematch-assets/main/pm-circle-green.png",
        info:{ sede:"Via dei Platani 5, Marino", stadio:"Campo Comunale", contatti:"segreteria@virtus.it", colori:["#1f6feb","#35c46a","#f39c12"] },
        gallery:[], matches:[]
      }
    ]
  },
  coachCodes:{
    // codice -> riepilogo partita
    "RN-FEM-U17-2025":{
      team:"ASD Roma Nord U17",
      opponent:"SS Test",
      date:"2025-09-01 18:30",
      place:"Campo Test, Roma",
      list:["Bianchi","Verdi","Rossi","Neri","Gialli","Blu","Arancio","Viola","Rosa","Azzurri","Marroni","Celesti","Grigi","Argento","Oro","Nero","Bianco","Verde"]
    }
  }
};

/* ==========
   ROUTER/UI
========== */
const qs = s => document.querySelector(s);
const qsa = s => [...document.querySelectorAll(s)];
const views = [
  "#view-sport","#view-gender","#view-region","#view-league",
  "#view-clubs","#view-club","#view-coach","#view-callup"
];

const state = {
  sport:null, gender:null, region:null, league:null, club:null
};

function show(id){
  views.forEach(v => qs(v).classList.remove('active'));
  qs(id).classList.add('active');
  window.scrollTo({top:0,behavior:"instant"});
}

/* Build sport grid */
function buildSports(){
  const wrap = qs("#sport-grid");
  wrap.innerHTML = "";
  DATA.sports.forEach(s => {
    const card = document.createElement("div");
    card.className="card";
    card.innerHTML = `
      <img class="thumb" src="${s.img}" alt="${s.name}">
      <div class="title">${s.name}</div>
    `;
    card.addEventListener("click", () => {
      state.sport = s.id;
      show("#view-gender");
    });
    wrap.appendChild(card);
  });
}

/* Gender */
qsa("#gender-row .chip.toggle").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    qsa("#gender-row .chip.toggle").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    btn.setAttribute("aria-pressed","true");
    state.gender = btn.dataset.gender;
    qs("#go-region").disabled = false;
  });
});
qs("#go-region").addEventListener("click", ()=>{
  buildRegions(); show("#view-region");
});

/* Regions */
function buildRegions(){
  const wrap = qs("#region-wrap");
  wrap.innerHTML="";
  DATA.regions.forEach(r=>{
    const b = document.createElement("button");
    b.className="chip toggle";
    b.textContent = r;
    b.addEventListener("click", ()=>{
      qsa("#region-wrap .chip").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      state.region = r;
      qs("#go-league").disabled = false;
    });
    wrap.appendChild(b);
  });
}
qs("[id='go-league']").addEventListener("click", ()=>{
  buildLeagues(); show("#view-league");
});

/* Leagues */
function buildLeagues(){
  const list = qs("#league-list");
  list.innerHTML = "";
  const leagues = (DATA.leagues[state.region]||[])
    .filter(l => !state.gender || l.gender===state.gender);
  leagues.forEach(l=>{
    const row = document.createElement("div");
    row.className="item";
    row.innerHTML = `<div><div class="title">${l.name}</div><div class="sub">${state.region}</div></div>
                     <button class="chip">Seleziona</button>`;
    row.querySelector("button").addEventListener("click", ()=>{
      state.league = l.id;
      buildClubs(); show("#view-clubs");
    });
    list.appendChild(row);
  });
  if(!leagues.length){
    list.innerHTML = `<div class="item"><div class="title">Nessun campionato demo per i filtri selezionati.</div></div>`;
  }
}

/* Clubs */
function buildClubs(){
  const list = qs("#club-list");
  list.innerHTML="";
  (DATA.clubs[state.league]||[]).forEach(c=>{
    const row = document.createElement("div");
    row.className="item";
    row.innerHTML = `<div class="title">${c.name}</div><div class="sub">${c.level||""}</div>`;
    row.addEventListener("click", ()=>{ state.club=c; mountClub(c); show("#view-club"); });
    list.appendChild(row);
  });
}

/* Club page */
function mountClub(c){
  qs("#club-name").textContent = c.name;
  qs("#club-meta").textContent = c.level || "";
  const logo = qs("#club-logo");
  logo.src = c.logo;
  logo.onerror = ()=>{ logo.src="https://raw.githubusercontent.com/mobricifilippo-del/prematch-assets/main/pm-circle-green.png"; };

  // info
  const info = qs("#club-info");
  info.innerHTML = `
    <div><b>Sede:</b> ${c.info?.sede||"—"}</div>
    <div><b>Impianto:</b> ${c.info?.stadio||"—"}</div>
    <div><b>Contatti:</b> ${c.info?.contatti||"—"}</div>
    <div style="margin-top:6px;"><b>Colori ufficiali:</b> ${(c.info?.colori||[]).map(hex=>`<span style="display:inline-block;width:16px;height:16px;border-radius:4px;background:${hex};border:1px solid #0002;margin-right:6px;"></span>`).join("")}</div>
  `;

  // gallery
  const gal = qs("#club-gallery");
  gal.innerHTML = (c.gallery||[]).map(u=>`<img src="${u}" style="width:120px;height:80px;object-fit:cover;border-radius:10px;margin-right:8px;border:1px solid var(--stroke)">`).join("") || "—";

  // matches
  const mat = qs("#club-matches");
  mat.innerHTML = (c.matches||[]).map(m=>`
    <div class="item"><div><div class="title">${m.title}</div><div class="sub">${m.when} — ${m.where}</div></div></div>
  `).join("") || "—";
}

/* PreMatch modal */
const COLORS = ["#ffffff","#111111","#ffcc00","#ef5d52","#57a8ff","#3ad372","#f29931","#8b4fcb"];
function openPreMatch(){
  const dlg = qs("#modal-prematch");
  // build colors
  const row = qs("#color-row");
  row.innerHTML="";
  COLORS.forEach(hex=>{
    const b = document.createElement("button");
    b.type="button"; b.className="color-dot"; b.style.background = hex;
    b.addEventListener("click", ()=>{
      qsa(".color-dot").forEach(x=>x.classList.remove("active"));
      b.classList.add("active"); b.dataset.sel="1";
      row.dataset.value = hex;
    });
    row.appendChild(b);
  });
  qs("#pm-datetime").value = "";
  qs("#pm-place").value = state.club?.info?.stadio ? `${state.club.info.stadio}, ${state.region}` : "";
  qs("#pm-friendly").checked = false;
  qs("#pm-message").value = "";
  dlg.showModal();
}
qs("#btn-create-prematch").addEventListener("click", openPreMatch);

qs("#pm-confirm").addEventListener("click", (e)=>{
  e.preventDefault();
  const color = qsa(".color-dot.active")[0]?.style.background || "#ffffff";
  const dt = qs("#pm-datetime").value || "—";
  const place = qs("#pm-place").value || "—";
  const friendly = qs("#pm-friendly").checked ? "Sì (amichevole)" : "No";
  const msg = qs("#pm-message").value?.trim() || "—";
  qs("#modal-prematch").close();

  const sum = qs("#pm-summary");
  sum.innerHTML = `
    <div><b>Società:</b> ${state.club?.name||"—"}</div>
    <div><b>Colore maglia ospite:</b> <span style="display:inline-block;width:16px;height:16px;border-radius:4px;border:1px solid #0002;background:${color};vertical-align:middle;margin-left:4px;"></span></div>
    <div><b>Data & ora:</b> ${dt}</div>
    <div><b>Luogo:</b> ${place}</div>
    <div><b>Richiesta amichevole:</b> ${friendly}</div>
    <div><b>Messaggio:</b> ${msg}</div>
  `;
  qs("#modal-confirm").showModal();
});
qs("#pm-close").addEventListener("click", ()=> qs("#modal-confirm").close());
qs("#pm-print").addEventListener("click", ()=>{
  // crea certificato “on the fly” per la stampa singola
  const cert = document.createElement("section");
  cert.id = "print-certificate";
  cert.innerHTML = `
    <div style="padding:20px 16px;font-family:Arial,Helvetica,sans-serif;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="width:32px;height:32px;border-radius:8px;background:#35c46a;display:grid;place-items:center;font-weight:700">PM</div>
        <div style="font-size:18px;font-weight:700">PreMatch — Certificato</div>
      </div>
      <h2 style="margin:8px 0 6px">${state.club?.name||"Società"}</h2>
      <div>${qs("#pm-summary").innerHTML}</div>
    </div>
  `;
  document.body.appendChild(cert);
  window.print();
  setTimeout(()=>cert.remove(), 300);
});

/* Allenatore - accesso da header o pagina club */
qsa('[data-route="coach"]').forEach(b=>b.addEventListener("click", ()=>show("#view-coach")));
qs("#coach-in-club").addEventListener("click", ()=>show("#view-coach"));

qs("#coach-enter").addEventListener("click", ()=>{
  const code = qs("#coach-code").value.trim();
  const data = DATA.coachCodes[code];
  if(!data){ alert("Codice non valido"); return; }
  mountCallup(data, code); show("#view-callup");
});

function mountCallup(data, code){
  qs("#callup-meta").textContent = `${data.team} — ${data.date} — ${data.place} — Codice ${code}`;
  const box = qs("#callup-list");
  box.innerHTML = data.list.map((n,i)=>`
    <div class="player"><div>#${String(i+1).padStart(2,"0")} ${n}</div><div>✔</div></div>
  `).join("");
}
qs("#print-callup").addEventListener("click", ()=>window.print());

/* Back generic */
qsa("[data-back]").forEach(b=>b.addEventListener("click", ()=>history.back()));

/* History handling to keep it simple for demo */
(function simpleRouter(){
  // map sections to hash
  const map = {
    "#sport":"#view-sport",
    "#gender":"#view-gender",
    "#region":"#view-region",
    "#league":"#view-league",
    "#clubs":"#view-clubs",
    "#club":"#view-club",
    "#coach":"#view-coach",
    "#callup":"#view-callup",
  };
  function nav(){
    const h = location.hash || "#sport";
    const v = map[h] || "#view-sport";
    show(v);
  }
  window.addEventListener("hashchange", nav);
  nav();
})();

/* Init */
buildSports();

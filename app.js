/* =========================
   PreMatch DEMO - app.js
   ========================= */

/* ---------- Config logo ---------- */
const LOGOS = {
  light: "./images/logo-light.png", // topbar su sfondo scuro
  icon:  "./images/logo-icon.png"   // per badge/pulsante
};

/* ---------- Dati demo ---------- */
const DATA = {
  sports: [
    { key:"calcio",     name:"Calcio",     img:"./images/calcio.jpg" },
    { key:"futsal",     name:"Futsal",     img:"./images/futsal.jpg" },
    { key:"basket",     name:"Basket",     img:"./images/basket.jpg" },
    { key:"volley",     name:"Volley",     img:"./images/volley.jpg" },
    { key:"rugby",      name:"Rugby",      img:"./images/rugby.jpg" },
    { key:"pallanuoto", name:"Pallanuoto", img:"./images/pallanuoto.jpg" }
  ],
  genders: ["Maschile","Femminile"],
  regions: ["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"],
  leaguesBy: {
    // semplice per demo (in reale filtrerai per sport+genere+regione)
    "Lazio": ["Serie A","Eccellenza","Promozione","Prima Categoria","Scuola Calcio"],
    "Lombardia": ["Serie C Silver","Serie D","Scuola Calcio"],
    "Sicilia": ["Serie C","Promozione","Scuola Calcio"],
    "Piemonte": ["Eccellenza","Scuola Calcio"],
    "Veneto": ["Serie B Interregionale","Scuola Calcio"],
    "Emilia-Romagna": ["Promozione","Scuola Calcio"]
  },
  clubsByLeague: {
    "Serie A": ["Trust Every Woman", "Atletico Donna"],
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino", "Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Scuola Calcio": ["Accademia Ragazzi", "Junior Sporting"],
    "Serie C Silver": ["Brixia Basket", "Gorla Team"],
    "Serie D": ["Lario Basket"],
    "Serie C": ["Siracusa Calcio"],
    "Serie B Interregionale": ["Treviso Volley"]
  },
  clubProfiles: {
    "ASD Roma Nord": {
      logo: "./images/logo-icon.png",
      uniforms: { casa:"#2ecc71" },
      gallery: ["./images/calcio.jpg","./images/volley.jpg"],
      sponsors: ["Hotel Demo","Ristorante Demo"],
      contacts: { email:"info@romnord.it", tel:"+39 000 111 2222" },
      matches: [
        { title:"Prima Squadra vs —", when:"31/08/2025 14:30", where:"Roma — Stadio Olimpico" },
        { title:"Juniores vs —",      when:"01/09/2025 18:30", where:"Roma — Campo Test" }
      ]
    },
    "Trust Every Woman": {
      logo: "./images/logo-icon.png",
      uniforms: { casa:"#41d27b" },
      gallery: ["./images/calcio.jpg"],
      sponsors: [],
      contacts: { email:"info@tew.it", tel:"+39 000 333 4444" },
      matches: []
    }
  }
};

/* ---------- Stato ---------- */
const state = {
  sport:null,
  gender:null,
  region:null,
  league:null,
  club:null
};

/* ---------- Helpers DOM ---------- */
const app = document.getElementById("app");

function h(tag, attrs={}, children=[]) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k==="class") el.className = v;
    else if (k==="onclick") el.addEventListener("click", v, {passive:true});
    else if (k==="oninput") el.addEventListener("input", v, {passive:true});
    else if (k==="onchange") el.addEventListener("change", v, {passive:true});
    else if (k==="style") Object.assign(el.style, v);
    else el.setAttribute(k, v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if (c==null) return;
    el.appendChild(typeof c==="string" ? document.createTextNode(c) : c);
  });
  return el;
}
function clearMain(){ app.innerHTML = ""; }
function sectionTitle(title, subtitle){
  return h("div",{class:"container"},[
    h("div",{class:"h1"}, title),
    h("div",{class:"sub"}, subtitle||"")
  ]);
}
function chip(text, active, onClick){
  return h("button", {class: "chip"+(active?" active":""), onclick:onClick}, text);
}
function cardSport(item, onClick){
  return h("div", {class:"card-sport", "data-sport":item.key}, [
    h("img",{src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div",{class:"title"}, item.name)
  ]);
}

/* ---------- Topbar: forza logo bianco ---------- */
(function ensureBrandLogo(){
  const img = document.querySelector(".brand img");
  if (img) img.src = LOGOS.light;
})();

/* ---------- Navigazione Pagine ---------- */
function pageHome(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport",""));

  const grid = h("div",{class:"container grid-sport", id:"sportGrid"});
  DATA.sports.forEach(s=>{
    function cardSport(item, onClick){
  return h("div", {
    class:"card-sport",
    "data-sport": item.key,
    onclick: onClick            // <— aggancio il tap qui
  }, [
    h("img",{src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div",{class:"title"}, item.name)
  ]);
}
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));

  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    wrap.appendChild(
      chip(g, state.gender===g, (e)=>{
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        e.currentTarget.classList.add("active");
        state.gender = g;
        setTimeout(()=> pageRegions(), 120);
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageHome()},"Indietro")
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
      chip(r, state.region===r, (e)=>{
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        e.currentTarget.classList.add("active");
        state.region = r;
        setTimeout(()=> pageLeagues(), 120);
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

  const leagues = DATA.leaguesBy[state.region] || [];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  leagues.forEach(l=>{
    wrap.appendChild(
      chip(l, state.league===l, (e)=>{
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        e.currentTarget.classList.add("active");
        state.league = l;
        setTimeout(()=> pageClubs(), 120);
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

  const clubs = DATA.clubsByLeague[state.league] || [];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  clubs.forEach(c=>{
    wrap.appendChild(
      chip(c, state.club===c, (e)=>{
        [...wrap.children].forEach(x=>x.classList.remove("active"));
        e.currentTarget.classList.add("active");
        state.club = c;
        setTimeout(()=> pageClubDetail(c), 120);
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageLeagues()},"Indietro")
  ]));
  app.appendChild(box);
}

/* ---------- Pagina Società ---------- */
function pageClubDetail(clubName){
  clearMain();

  const club = DATA.clubProfiles[clubName] || {
    logo: LOGOS.icon,
    uniforms: { casa:"#41d27b" },
    gallery: [],
    sponsors: [],
    contacts:{ email:"-", tel:"-" },
    matches: []
  };

  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // Header con logo tondo e pulsante tondo (stessa dimensione)
  const head = h("div",{class:"container", style:{display:"flex", alignItems:"center", gap:"14px", justifyContent:"center"}},[
    circleImg(club.logo||LOGOS.icon, 92),
    prematchCircleBtn(() => openPrematchModal(clubName))
  ]);
  app.appendChild(head);

  // Accordion Info / Galleria / Prossimi match
  app.appendChild(accordion("Informazioni", infoContent(club)));
  app.appendChild(accordion("Galleria foto", galleryContent(club.gallery)));
  app.appendChild(accordion("Match in programma", matchesContent(club.matches)));

  // Azioni
  app.appendChild(h("div",{class:"container"},[
    h("div",{class:"actions"},[
      h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro"),
      h("button",{class:"btn primary", onclick:()=>openCoachAccess()},"Allenatore: inserisci codice")
    ])
  ]));
}

function circleImg(src, size){
  return h("img",{
    src, alt:"logo",
    style:{
      width:`${size}px`, height:`${size}px`,
      borderRadius:"999px",
      border:"1px solid var(--border)",
      background:"#0b0f14",
      objectFit:"cover",
      padding:"10px"
    }
  });
}
function prematchCircleBtn(onClick){
  const size = 92;
  const btn = h("button",{
    class:"btn",
    onclick:onClick,
    style:{
      width:`${size}px`, height:`${size}px`,
      borderRadius:"999px",
      display:"flex", alignItems:"center", justifyContent:"center",
      position:"relative", borderColor:"var(--accent)", background:"#141922"
    }
  }, [
    h("img",{src:LOGOS.icon, alt:"PM", style:{width:"28px", height:"28px", borderRadius:"6px", border:"1px solid var(--border)"}})
  ]);
  return btn;
}

function accordion(title, contentEl){
  const box = h("div",{class:"container panel"});
  const head = h("button",{class:"btn", style:{width:"100%", textAlign:"left", fontWeight:"700"}}, title);
  const body = h("div",{style:{display:"none", marginTop:".6rem"}}, contentEl);
  head.addEventListener("click", ()=>{
    body.style.display = (body.style.display==="none" ? "block" : "none");
  }, {passive:true});
  box.appendChild(head); box.appendChild(body);
  return box;
}
function infoContent(club){
  const c = club.contacts||{};
  const list = [
    ["Email", c.email||"-"],
    ["Telefono", c.tel||"-"]
  ];
  const frag = h("div");
  list.forEach(([k,v])=>{
    frag.appendChild(h("div",{},`${k}: ${v}`));
  });
  return frag;
}
function galleryContent(list){
  if (!list || !list.length) return h("div",{class:"sub"},"Nessuna foto caricata.");
  const g = h("div",{class:"grid-sport"});
  list.forEach(src=>{
    g.appendChild(h("img",{src, alt:"foto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}}));
  });
  return g;
}
function matchesContent(list){
  if (!list || !list.length) return h("div",{class:"sub"},"Nessun match programmato.");
  const box = h("div",{});
  list.forEach(m=>{
    box.appendChild(
      h("div",{class:"row", style:{display:"flex", justifyContent:"space-between", borderBottom:"1px dashed var(--border)", padding:".8rem 0"}},[
        h("div",{class:"team"}, m.title),
        h("div",{class:"meta"}, `${m.when} — ${m.where}`)
      ])
    );
  });
  return box;
}

/* ---------- Modale PreMatch ---------- */
function openPrematchModal(clubName){
  const overlay = h("div",{style:{
    position:"fixed", inset:0, background:"rgba(0,0,0,.55)",
    display:"flex", alignItems:"flex-start", justifyContent:"center",
    paddingTop:"8vh", zIndex:1000
  }});
  const card = h("div",{style:{
    width:"min(720px, 92%)", background:"#11161c", color:"var(--text)",
    border:"1px solid var(--border)", borderRadius:"16px", overflow:"hidden",
    boxShadow:"0 20px 60px rgba(0,0,0,.45)"
  }});

  const hd = h("div",{style:{padding:"14px 16px", fontWeight:"800", fontSize:"1.2rem", borderBottom:"1px solid var(--border)"}}, "Crea PreMatch");
  const bd = h("div",{style:{padding:"14px 16px", display:"grid", gap:"12px"}});
  const ft = h("div",{style:{padding:"12px 16px", display:"flex", gap:"8px", justifyContent:"flex-end", borderTop:"1px solid var(--border)"}});

  // Tipo partita
  const tipoSel = h("select",{style:{width:"100%", padding:"10px", borderRadius:"10px", background:"#0f141a", color:"var(--text)", border:"1px solid var(--border)"}},[
    h("option",{value:"Ufficiale"},"Ufficiale"),
    h("option",{value:"Amichevole"},"Amichevole")
  ]);

  // Colore maglia (ospite)
  const colors = ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];
  let selColor = null;
  const swatches = h("div",{style:{display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:"8px", background:"#fff", padding:"10px", borderRadius:"12px"}});
  colors.forEach(hex=>{
    const b = h("button",{
      style:{
        width:"28px", height:"28px", borderRadius:"8px",
        border:"1px solid #252b35", background:hex, cursor:"pointer"
      },
      onclick:(e)=>{
        selColor = hex;
        [...swatches.children].forEach(x=> x.style.outline="none");
        e.currentTarget.style.outline = "2px solid var(--accent)";
        e.currentTarget.style.outlineOffset = "2px";
      }
    });
    swatches.appendChild(b);
  });

  // Data/ora e luogo
  const dt = h("input",{type:"datetime-local", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}});
  const place = h("input",{type:"text", placeholder:"Indirizzo campo", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}});

  // Messaggio facoltativo
  const msg = h("textarea",{placeholder:"Messaggio per la società avversaria (facoltativo)", rows:3, style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}});

  bd.appendChild(h("div",{}, "Tipo partita"));
  bd.appendChild(tipoSel);
  bd.appendChild(h("div",{}, "Colore maglia (ospite)"));
  bd.appendChild(swatches);
  bd.appendChild(h("div",{}, "Data & ora"));
  bd.appendChild(dt);
  bd.appendChild(h("div",{}, "Luogo"));
  bd.appendChild(place);
  bd.appendChild(h("div",{}, "Messaggio"));
  bd.appendChild(msg);

  const annulla = h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Annulla");
  const conferma = h("button",{class:"btn primary", onclick:()=>{
    if(!selColor){ alert("Seleziona il colore maglia."); return; }
    document.body.removeChild(overlay);
    toast("Richiesta PreMatch inviata ✅");
  }},"Invia richiesta");

  ft.appendChild(annulla); ft.appendChild(conferma);

  card.appendChild(hd); card.appendChild(bd); card.appendChild(ft);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

/* ---------- Accesso allenatore (codice) ---------- */
function openCoachAccess(){
  const code = prompt("Inserisci il codice allenatore (demo: 1234)");
  if (!code) return;
  if (code.trim()==="1234") {
    toast("Codice valido: apri Convocazioni");
    // qui potresti navigare a pageConvocazioni()
  } else {
    alert("Codice non valido");
  }
}

/* ---------- Toast ---------- */
function toast(text){
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"700", zIndex:1200
  }}, text);
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1800);
}

/* ---------- Avvio ---------- */
pageHome();

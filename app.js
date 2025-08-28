/* =========================
   PreMatch – app.js (COMPLETO)
   Flusso: Sport → Genere → Regione → Campionato → Società → Pagina Società
   ========================= */

/* ---- Config/logo ---- */
const LOGOS = {
  light: "./images/logo-light.png", // per topbar scura
  dark:  "./images/logo-dark.png",  // per PDF/sfondi chiari
  icon:  "./images/logo-icon.png",  // tondo per bottoni
};

/* Mostra sempre il logo chiaro nella topbar (anche se l'HTML punta ad altro) */
(function ensureBrandLogo(){
  const img = document.querySelector(".brand img");
  if (img) { img.src = LOGOS.light; img.alt = "PreMatch"; }
})();

/* ---- Dati DEMO (puoi ampliare quando vuoi) ---- */
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
  regions: ["Lazio","Lombardia","Piemonte","Veneto","Emilia-Romagna","Sicilia"],
  leaguesBy: {
    Lazio:["Eccellenza","Promozione","Prima Categoria","Scuola Calcio"],
    Lombardia:["Serie C Silver","Serie D","Scuola Calcio"],
    Piemonte:["Eccellenza","Scuola Calcio"],
    Veneto:["Serie B Interregionale","Scuola Calcio"],
    "Emilia-Romagna":["Promozione","Scuola Calcio"],
    Sicilia:["Serie C","Promozione","Scuola Calcio"],
  },
  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord","Sporting Tuscolano"],
    "Promozione": ["Virtus Marino","Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Scuola Calcio": ["Accademia Ragazzi","Junior Sporting"],
    "Serie C Silver": ["Brixia Basket","Gorla Team"],
    "Serie D": ["Lario Basket"],
    "Serie C": ["Siracusa Calcio"],
    "Serie B Interregionale": ["Treviso Volley"]
  },
  clubProfiles: {
    "ASD Roma Nord": {
      logo: LOGOS.icon,
      uniforms: { casa:"#e74a3c" },
      gallery: ["./images/calcio.jpg"],
      sponsors: ["Hotel Demo","Ristorante Demo"],
      contacts: { email:"info@societa.demo", tel:"+39 000 000 0000" },
      matches: [
        { home:"Prima Squadra", when:"31/08/2025 14:07", where:"Roma — Stadio Olimpico" }
      ]
    },
    "Sporting Tuscolano": { logo: LOGOS.icon, uniforms:{casa:"#2ecc71"}, gallery:[], sponsors:[], contacts:{}, matches:[] },
    "Virtus Marino": { logo: LOGOS.icon, uniforms:{casa:"#2980b9"}, gallery:[], sponsors:[], contacts:{}, matches:[] },
    "Borghesiana FC": { logo: LOGOS.icon, uniforms:{casa:"#8e44ad"}, gallery:[], sponsors:[], contacts:{}, matches:[] },
    "Atletico Ostia": { logo: LOGOS.icon, uniforms:{casa:"#f1c40f"}, gallery:[], sponsors:[], contacts:{}, matches:[] },
    "Accademia Ragazzi": { logo: LOGOS.icon, uniforms:{casa:"#1abc9c"}, gallery:[], sponsors:[], contacts:{}, matches:[] },
    "Junior Sporting": { logo: LOGOS.icon, uniforms:{casa:"#e67e22"}, gallery:[], sponsors:[], contacts:{}, matches:[] },
    "Brixia Basket": { logo: LOGOS.icon, uniforms:{casa:"#9b59b6"}, gallery:[], sponsors:[], contacts:{}, matches:[] },
    "Gorla Team": { logo: LOGOS.icon, uniforms:{casa:"#34495e"}, gallery:[], sponsors:[], contacts:{}, matches:[] },
    "Lario Basket": { logo: LOGOS.icon, uniforms:{casa:"#c0392b"}, gallery:[], sponsors:[], contacts:{}, matches:[] },
    "Siracusa Calcio": { logo: LOGOS.icon, uniforms:{casa:"#16a085"}, gallery:[], sponsors:[], contacts:{}, matches:[] },
    "Treviso Volley": { logo: LOGOS.icon, uniforms:{casa:"#27ae60"}, gallery:[], sponsors:[], contacts:{}, matches:[] },
  }
};

/* ---- Stato semplice ---- */
const state = { sport:null, gender:null, region:null, league:null, club:null };

/* ---- Helpers DOM ---- */
const app = document.getElementById("app");

function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k === "class") el.className = v;
    else if (k === "onclick") el.addEventListener("click", v, {passive:true});
    else if (k === "oninput") el.addEventListener("input", v, {passive:true});
    else if (k === "onchange") el.addEventListener("change", v, {passive:true});
    else if (k === "style") Object.assign(el.style, v);
    else el.setAttribute(k, v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if (c==null) return;
    el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return el;
}
function clearMain(){ app.innerHTML = ""; }
function titleBlock(t, sub=""){ 
  return h("div",{class:"container"},[
    h("div",{class:"h1"}, t),
    sub ? h("div",{class:"sub"},sub) : null
  ]);
}
function chip(text, active, onClick){
  return h("div",{class:"chip"+(active?" active":""), onclick:onClick}, text);
}
function lightPulse(node, next){
  node.classList.add("selected");
  setTimeout(()=>{ node.classList.remove("selected"); next && next(); }, 140);
}

/* ---- Rendering pagine ---- */
function pageSports(){
  clearMain();
  app.appendChild(titleBlock("Scegli lo sport","Seleziona per iniziare"));
  const grid = h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    const card = h("div",{class:"card card-sport"},[
      h("img",{src:s.img, alt:s.name, onerror(){this.style.display="none"}}),
      h("div",{class:"title"}, s.name)
    ]);
    card.addEventListener("click", ()=>{
      state.sport = s.key;
      lightPulse(card, pageGender);
    }, {passive:true});
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(titleBlock("Seleziona il genere",""));
  const box = h("div",{class:"container panel"});
  const row = h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    row.appendChild(
      chip(g, state.gender===g, (ev)=>{
        state.gender=g;
        [...row.children].forEach(c=>c.classList.remove("active"));
        ev.currentTarget.classList.add("active");
        setTimeout(pageRegions, 120);
      })
    );
  });
  box.appendChild(row);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:pageSports},"Indietro")
  ]));
  app.appendChild(box);
}

function pageRegions(){
  clearMain();
  app.appendChild(titleBlock("Scegli la regione",""));
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  DATA.regions.forEach(r=>{
    wrap.appendChild(
      chip(r, state.region===r, (ev)=>{
        state.region=r;
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        ev.currentTarget.classList.add("active");
        setTimeout(pageLeagues, 120);
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:pageGender},"Indietro")
  ]));
  app.appendChild(box);
}

function pageLeagues(){
  clearMain();
  app.appendChild(titleBlock("Scegli il campionato", state.region||""));
  const leagues = DATA.leaguesBy[state.region] || [];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  leagues.forEach(l=>{
    wrap.appendChild(
      chip(l, state.league===l, (ev)=>{
        state.league=l;
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        ev.currentTarget.classList.add("active");
        setTimeout(pageClubs, 120);
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:pageRegions},"Indietro")
  ]));
  app.appendChild(box);
}

function pageClubs(){
  clearMain();
  app.appendChild(titleBlock("Scegli la società", state.league||""));
  const clubs = DATA.clubsByLeague[state.league] || [];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  clubs.forEach(c=>{
    wrap.appendChild(
      chip(c, state.club===c, (ev)=>{
        state.club=c;
        [...wrap.children].forEach(x=>x.classList.remove("active"));
        ev.currentTarget.classList.add("active");
        setTimeout(()=>pageClubProfile(c), 120);
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:pageLeagues},"Indietro")
  ]));
  app.appendChild(box);
}

/* ---- Pagina società ---- */
function pageClubProfile(clubName){
  clearMain();
  const club = DATA.clubProfiles[clubName] || {
    logo: LOGOS.icon,
    uniforms:{casa:"#2ecc71"},
    gallery:[], sponsors:[], contacts:{ email:"-", tel:"-" }, matches:[]
  };

  app.appendChild(titleBlock(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // header società: logo tondo + bottone tondo "Crea PreMatch"
  const header = h("div",{class:"container", style:{
    display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px"
  }},[
    h("img",{src:club.logo||LOGOS.icon, alt:clubName, style:{
      width:"72px", height:"72px", borderRadius:"50%", objectFit:"cover",
      border:"1px solid #252b35", background:"#0b0f14", padding:"6px"
    }}),
    (function(){
      const btn = h("button",{class:"btn", style:{
        display:"inline-flex", alignItems:"center", gap:".5rem",
        borderRadius:"999px", padding:".55rem .9rem", background:"#141922"
      }},[
        h("img",{src:LOGOS.icon, alt:"PM", style:{width:"28px", height:"28px", borderRadius:"50%"} }),
        h("span",{style:{fontWeight:"800"}}, "Crea PreMatch")
      ]);
      btn.classList.add("primary"); // verde
      btn.addEventListener("click", ()=> openPrematchModal(clubName));
      return btn;
    })()
  ]);
  app.appendChild(header);

  // pannello colori divise (solo maglia, come richiesto)
  app.appendChild(kitsPanel(club.uniforms));

  // Accordion INFO / GALLERY / MATCH
  app.appendChild(accordion("Informazioni", infoContent(club.contacts)));
  app.appendChild(accordion("Galleria foto", galleryContent(club.gallery)));
  app.appendChild(accordion("Match in programma", matchesContent(club.matches)));

  // back/nuovo
  app.appendChild(h("div",{class:"container actions"},[
    h("button",{class:"btn", onclick:pageClubs},"Indietro")
  ]));
}

/* ---- Componenti pagina società ---- */
function kitsPanel(uniforms){
  const u = Object.assign({casa:"#2ecc71"}, uniforms||{});
  const box = h("div",{class:"container panel"});
  box.appendChild(h("div",{class:"h2", style:{fontWeight:"800"}}, "Colore maglia (casa)"));
  const sw = h("div",{style:{
    display:"inline-block", width:"28px", height:"28px",
    borderRadius:"8px", border:"1px solid #252b35", background:u.casa, marginTop:"8px"
  }});
  box.appendChild(sw);
  return box;
}

function accordion(title, inner){
  const wrap = h("div",{class:"container panel"});
  const head = h("button",{class:"btn", style:{width:"100%", textAlign:"left", fontWeight:"800"}}, title);
  const body = h("div",{style:{display:"none", marginTop:".6rem"}}, inner);
  head.addEventListener("click", ()=>{
    body.style.display = (body.style.display==="none" ? "block" : "none");
  });
  wrap.appendChild(head); wrap.appendChild(body);
  return wrap;
}
function infoContent(c){
  return h("div",{},[
    h("div",{},"Email: "+(c.email||"-")),
    h("div",{},"Tel: "+(c.tel||"-"))
  ]);
}
function galleryContent(list){
  if (!list || !list.length) return h("div",{class:"sub"},"Nessuna foto caricata.");
  const g = h("div",{class:"grid"});
  list.forEach(src=> g.appendChild(h("img",{src, alt:"Foto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}})));
  return g;
}
function matchesContent(list){
  if (!list || !list.length) return h("div",{class:"sub"},"Nessuna partita programmata.");
  const box = h("div",{});
  list.forEach(m=>{
    box.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, `${m.home} vs —`),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  return box;
}

/* ---- Modale PreMatch (con campo messaggio) ---- */
function openPrematchModal(clubName){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  const hd = h("div",{class:"hd"},"Crea PreMatch");
  const bd = h("div",{class:"bd"});
  const bar = h("div",{class:"bar"});

  // campi: data/ora, luogo, colore maglia ospite, tipo partita, messaggio
  const dt = h("input",{type:"datetime-local", style:inputStyle()});
  const place = h("input",{type:"text", placeholder:"Indirizzo campo", style:inputStyle()});
  const typeSel = h("select",{style:inputStyle()},[
    h("option",{value:"Campionato"},"Campionato"),
    h("option",{value:"Coppa"},"Coppa"),
    h("option",{value:"Amichevole"},"Amichevole"),
    h("option",{value:"Torneo"},"Torneo")
  ]);
  const msg = h("textarea",{placeholder:"Messaggio alla società (opzionale)", style:Object.assign(inputStyle(),{minHeight:"80px"})});

  // palette colori (solo maglia)
  const palette = ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];
  let jersey = null;
  const colorRow = h("div",{style:{display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:"8px", background:"#fff", padding:"10px", borderRadius:"12px"}},
    palette.map(hex => colorDot(hex, false, (ev)=>{
      jersey = hex;
      [...ev.currentTarget.parentElement.children].forEach(b=>b.classList.remove("selected"));
      ev.currentTarget.classList.add("selected");
    }))
  );

  bd.appendChild(h("div",{class:"sub"},"Data & ora")); bd.appendChild(dt);
  bd.appendChild(h("div",{class:"sub", style:{marginTop:"8px"}},"Luogo")); bd.appendChild(place);
  bd.appendChild(h("div",{class:"sub", style:{marginTop:"8px"}},"Tipo partita")); bd.appendChild(typeSel);
  bd.appendChild(h("div",{class:"sub", style:{marginTop:"8px"}},"Colore maglia (ospite)"));
  bd.appendChild(colorRow);
  bd.appendChild(h("div",{class:"sub", style:{marginTop:"8px"}},"Messaggio"));
  bd.appendChild(msg);

  const cancel = h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Annulla");
  const ok = h("button",{class:"btn primary", onclick:()=>{
    if(!dt.value || !place.value || !jersey){
      alert("Compila data/ora, luogo e scegli il colore maglia."); return;
    }
    document.body.removeChild(overlay);
    toast("Richiesta PreMatch inviata ✅");
  }},"Invia richiesta");

  bar.appendChild(cancel); bar.appendChild(ok);
  sheet.appendChild(hd); sheet.appendChild(bd); sheet.appendChild(bar);
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
}

/* Helpers UI modale */
function inputStyle(){ return {
  width:"100%", padding:"10px", borderRadius:"10px",
  border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"
};}
function colorDot(hex, selected, onClick){
  return h("button",{
    class:"sw"+(selected?" sel":""),
    style:{ backgroundColor:hex },
    onclick:onClick
  },"");
}
function toast(text){
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"700", zIndex:1200
  }}, text);
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1800);
}

/* ---- Avvio ---- */
pageSports();
```0

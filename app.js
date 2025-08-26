/* =========================
   PreMatch DEMO - app.js
   ========================= */

/* ---------- Config demo ---------- */
const IS_VISITOR = true; // visitatore su pagina società avversaria
const LOGOS = {
  light: "./images/logo-light.png",
  dark: "./images/logo-dark.png",
  icon: "./images/logo-icon.png",
};

/* ---------- Dati demo ---------- */
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
    Lazio: ["Serie A", "Eccellenza", "Promozione", "Prima Categoria", "Scuola Calcio"],
    Lombardia: ["Serie C Silver", "Serie D", "Scuola Calcio"],
    Sicilia: ["Serie C", "Promozione", "Scuola Calcio"],
    Piemonte: ["Eccellenza", "Scuola Calcio"],
    Veneto: ["Serie B Interregionale", "Scuola Calcio"],
    "Emilia-Romagna": ["Promozione", "Scuola Calcio"],
  },
  clubsByLeague: {
    "Serie A": ["Trust Every Woman", "City United"],
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino", "Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Scuola Calcio": ["Accademia Ragazzi", "Junior Sporting"],
    "Serie C Silver": ["Brixia Basket", "Gorla Team"],
    "Serie D": ["Lario Basket"],
    "Serie C": ["Siracusa Calcio"],
    "Serie B Interregionale": ["Treviso Volley"],
  },
  clubProfiles: {
    "ASD Roma Nord": {
      logo: LOGOS.icon,
      jersey: "#e74a3c",
      gallery: ["./images/calcio.jpg", "./images/volley.jpg"],
      sponsors: ["Hotel Demo", "Ristorante Demo"],
      contacts: { email: "info@societa.demo", tel: "+39 000 000 0000" },
      matches: [
        { home: "Prima Squadra", when: "31/08/2025 14:07", where: "Roma — Stadio Olimpico" },
        { home: "Juniores",      when: "01/09/2025 18:30", where: "Roma — Campo Test" },
      ]
    }
  }
};

/* ---------- Stato ---------- */
const state = { sport:null, gender:null, region:null, league:null, club:null };

/* ---------- Helpers DOM ---------- */
const app = document.getElementById("app");
function h(tag, attrs={}, children=[]){
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==="class") el.className=v;
    else if(k==="onclick") el.addEventListener("click", v);
    else if(k==="oninput") el.addEventListener("input", v);
    else if(k==="onchange") el.addEventListener("change", v);
    else if(k==="style") Object.assign(el.style, v);
    else el.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c==null) return;
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
  const el = h("div",{class:"chip"+(active?" active":""), onclick:()=>{
    // micro-feedback visivo prima di navigare
    el.classList.add("pressed");
    setTimeout(()=>{ onClick(); }, 160);
    setTimeout(()=>{ el.classList.remove("pressed"); }, 260);
  }}, text);
  return el;
}
function gridCard(item, onClick){
  const card = h("div",{class:"card", onclick:()=>{
    card.classList.add("selected");
    setTimeout(()=>onClick(), 160);
    setTimeout(()=>card.classList.remove("selected"), 260);
  }},[
    h("img",{src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div",{class:"title"}, item.name)
  ]);
  return card;
}
function colorSwatch(hex,big=false){
  return h("span",{style:{
    display:"inline-block",
    width:big?"24px":"16px", height:big?"24px":"16px",
    borderRadius:"6px", border:"1px solid #d0d7de", background:hex
  }});
}

/* ---------- Topbar quick links (demo) ---------- */
document.querySelectorAll('.nav .link').forEach(b=>{
  b.addEventListener('click', ()=>{
    alert(b.dataset.nav === 'login' ? "Login (demo non attivo)" : "Registrazione (demo non attiva)");
  });
});

/* ---------- Pagine ---------- */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare"));

  const grid = h("div",{class:"container grid"});
  DATA.sports.forEach(s=>{
    grid.appendChild(
      gridCard({img:s.img, name:s.name}, ()=>{
        state.sport = s.key;
        pageGender();
      })
    );
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));

  const box = h("div",{class:"container panel"});
  const row = h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    row.appendChild(
      chip(g, state.gender===g, ()=>{
        state.gender=g;
        [...row.children].forEach(c=>c.classList.remove("active"));
        // attivo visivamente quello premuto
        event.currentTarget.classList.add("active");
        pageRegions();
      })
    );
  });
  box.appendChild(row);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageSports()},"Indietro")
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
      chip(r, state.region===r, ()=>{
        state.region=r;
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        event.currentTarget.classList.add("active");
        pageLeagues();
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
      chip(l, state.league===l, ()=>{
        state.league=l;
        [...wrap.children].forEach(c=>c.classList.remove("active"));
        event.currentTarget.classList.add("active");
        pageClubs();
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

  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  clubs.forEach(c=>{
    wrap.appendChild(
      chip(c, state.club===c, ()=>{
        state.club=c;
        [...wrap.children].forEach(x=>x.classList.remove("active"));
        event.currentTarget.classList.add("active");
        pageClubProfile(c);
      })
    );
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageLeagues()},"Indietro")
  ]));
  app.appendChild(box);
}

/* ----- Pagina Società ----- */
function pageClubProfile(clubName){
  clearMain();

  const club = DATA.clubProfiles[clubName] || {
    logo: LOGOS.icon,
    jersey: "#2ecc71",
    gallery: [], sponsors: [], contacts:{email:"-", tel:"-"},
    matches: []
  };

  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // Testata: logo + CTA Crea PreMatch affiancati (stessa dimensione)
  const head = h("div",{class:"club-head container"},[
    // logo società (o nostro segnaposto)
    h("div",{class:"club-logo"},[
      h("img",{src:club.logo||LOGOS.icon, alt:clubName})
    ]),
    // CTA Prematch (stesso cerchio + label sotto)
    (IS_VISITOR ? h("div",{},[
      h("div",{class:"cta-pm", onclick:()=>openPrematchModal(clubName)},[
        h("img",{src:LOGOS.icon, alt:"PM"})
      ]),
      h("div",{class:"cta-label"},"Crea PreMatch")
    ]) : null)
  ]);
  app.appendChild(head);

  // Colori divisa in evidenza (SOLO maglia)
  const colors = h("div",{class:"container panel"},[
    h("div",{class:"h2", style:{fontWeight:"900", color:"var(--accent)"}}, "Colore maglia (casa)"),
    h("div",{style:{display:"flex", alignItems:"center", gap:"10px"}},[
      colorSwatch(club.jersey, true),
      h("div",{class:"sub", style:{margin:0}}, "Maglia ufficiale casa")
    ])
  ]);
  app.appendChild(colors);

  // Sezioni a tendina (informazioni / gallery / match in programma)
  app.appendChild(sectionAccordion("Informazioni", infoContent(club)));
  app.appendChild(sectionAccordion("Gallery foto", galleryContent(club.gallery)));
  app.appendChild(sectionAccordion("Match in programma", matchesContent(club)));
}

/* Accordion Helpers */
function sectionAccordion(title, bodyEl){
  const wrap = h("div",{class:"container section"});
  const panel = h("div",{class:"panel"});
  const hd = h("div",{class:"hd"},[
    h("div",{class:"tt"}, title),
    h("button",{class:"btn", onclick:()=>{
      bd.style.display = (bd.style.display==="none" ? "block" : "none");
    }}, "Apri/Chiudi")
  ]);
  const bd = h("div",{class:"bd"}, bodyEl);
  bd.style.display="none";
  panel.appendChild(hd); panel.appendChild(bd);
  wrap.appendChild(panel);
  return wrap;
}

function infoContent(club){
  const c = club.contacts||{};
  return h("div",{},[
    h("div",{},"Indirizzo impianto: via dello Sport 1, Città"),
    h("div",{},"Email: "+(c.email||"-")),
    h("div",{},"Tel: "+(c.tel||"-"))
  ]);
}
function galleryContent(list){
  if(!list || !list.length) return h("div",{class:"sub"},"Nessuna foto caricata.");
  const g = h("div",{class:"grid"});
  list.forEach(src=> g.appendChild(
    h("img",{src, alt:"Foto impianto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}})
  ));
  return g;
}
function matchesContent(club){
  const box = h("div",{});
  const list = club.matches && club.matches.length ? club.matches : [{home:"—", when:"—", where:"—"}];
  list.forEach(m=>{
    box.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, `${m.home} vs —`),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  return box;
}

/* ----- Modale PreMatch (solo MAGLIA, + data/luogo) ----- */
function palette(){ return ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"]; }

function openPrematchModal(clubName){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  overlay.appendChild(sheet);

  const hd = h("div",{class:"hd"},"Crea PreMatch");
  const bd = h("div",{class:"bd"});
  const bar = h("div",{class:"bar"});

  // scelta colore MAGLIA (ospite)
  bd.appendChild(h("div",{},[
    h("div",{class:"sub", style:{margin:"0 0 8px 0"}}, "Colore maglia (ospite)"),
    (function(){
      const row = h("div",{class:"swatches"});
      const sel = { hex:null };
      palette().forEach(hex=>{
        const b = h("div",{class:"sw", onclick:()=>{
          sel.hex = hex;
          [...row.children].forEach(x=>x.classList.remove("sel"));
          b.classList.add("sel");
        }});
        b.style.background = hex;
        row.appendChild(b);
      });
      row.dataset.bind = "maglia";
      return row;
    })()
  ]));

  // data/ora + luogo
  const dt = h("input",{type:"datetime-local", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}})
  const place = h("input",{type:"text", placeholder:"Via / Impianto", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)", marginTop:"10px"}})
  bd.appendChild(h("div",{},[
    h("div",{class:"sub", style:{margin:"12px 0 6px 0"}}, "Data & ora"),
    dt,
    h("div",{class:"sub", style:{margin:"12px 0 6px 0"}}, "Luogo (indirizzo)"),
    place
  ]));

  const annulla = h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Annulla");
  const conferma = h("button",{class:"btn primary", onclick:()=>{
    const pick = [...bd.querySelectorAll(".swatches .sw")].find(x=>x.classList.contains("sel"));
    if(!pick){ alert("Seleziona il colore della maglia."); return; }
    const color = getComputedStyle(pick).backgroundColor;
    showSummary({clubName, color, when:dt.value, where:place.value}, overlay);
  }},"Conferma");

  bar.appendChild(annulla); bar.appendChild(conferma);
  sheet.appendChild(hd); sheet.appendChild(bd); sheet.appendChild(bar);
  document.body.appendChild(overlay);
}

function showSummary(sel, overlay){
  const sheet = overlay.querySelector('.sheet');
  sheet.innerHTML = "";
  sheet.appendChild(h("div",{class:"hd"},"Conferma PreMatch"));

  const body = h("div",{class:"bd"},[
    h("div",{class:"h2", style:{fontWeight:"900"}}, "Riepilogo"),
    h("div",{},"Società avversaria: "+sel.clubName),
    h("div",{},"Categoria: "+(state.league||"-")),
    h("div",{},"Regione: "+(state.region||"-")),
    h("div",{},"Maglia ospite: "),
    h("div",{style:{display:"flex", alignItems:"center", gap:"8px", marginTop:"6px"}},[
      colorSwatch(rgbToHex(sel.color), true), h("span",{},"Maglia")
    ]),
    h("div",{style:{marginTop:"8px"}}, "Data & ora: "+(sel.when||"-")),
    h("div",{},"Luogo: "+(sel.where||"-")),
  ]);

  const bar = h("div",{class:"bar"});
  bar.appendChild(h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Indietro"));
  bar.appendChild(h("button",{class:"btn primary", onclick:()=>{
    document.body.removeChild(overlay);
    toast("Richiesta PreMatch inviata ✅");
  }},"Invia richiesta"));

  sheet.appendChild(body); sheet.appendChild(bar);
}

function rgbToHex(rgb){
  // es: "rgb(65, 210, 123)"
  const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgb||"");
  if(!m) return "#41d27b";
  const toH = x => ("0"+Number(x).toString(16)).slice(-2);
  return "#"+toH(m[1])+toH(m[2])+toH(m[3]);
}

function toast(txt){
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"900", zIndex:1200
  }}, txt);
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 1800);
}

/* ---------- Avvio ---------- */
(function init(){
  // forza logo light nella topbar
  const brand = document.querySelector(".brand img");
  if (brand) { brand.src = LOGOS.light; brand.alt="PreMatch"; }
  pageSports();
})();

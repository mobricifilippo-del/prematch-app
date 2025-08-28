/* =========================
   PreMatch DEMO - app.js
   Evidenziazione selezioni FIX
   ========================= */

/* ---------- Config ---------- */
const LOGOS = {
  light: "./images/logo-light.png", // per topbar su sfondo scuro
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
    Lazio: ["Eccellenza", "Promozione", "Prima Categoria", "Scuola Calcio"],
    Lombardia: ["Serie C Silver", "Serie D", "Scuola Calcio"],
    Sicilia: ["Serie C", "Promozione", "Scuola Calcio"],
    Piemonte: ["Eccellenza", "Scuola Calcio"],
    Veneto: ["Serie B Interregionale", "Scuola Calcio"],
    "Emilia-Romagna": ["Promozione", "Scuola Calcio"],
  },
  clubsByLeague: {
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
      uniforms: { casa: "#e74a3c", trasferta: "#2c3e50", terza: "#2980b9" },
      gallery: ["./images/calcio.jpg", "./images/volley.jpg"],
      sponsors: ["Hotel Demo", "Ristorante Demo"],
      contacts: { email: "info@societa.demo", tel: "+39 000 000 0000" },
      matches: [
        { home: "Prima Squadra", when: "31/08/2025 14:07", where: "Roma — Stadio Olimpico" },
        { home: "Juniores",      when: "01/09/2025 18:30", where: "Roma — Campo Test" },
      ]
    },
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

/* ---------- Helpers DOM ---------- */
const app = document.getElementById("app");

function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k === "class") el.className = v;
    else if (k === "onclick") el.addEventListener("click", v);
    else if (k === "oninput") el.addEventListener("input", v);
    else if (k === "onchange") el.addEventListener("change", v);
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
function sectionTitle(title, subtitle){
  return h("div", {class:"container"}, [
    h("div", {class:"h1"}, title),
    h("div", {class:"sub"}, subtitle||"")
  ]);
}
function chip(text, active, onClick){
  return h("div", {class: "chip"+(active?" active":""), onclick:onClick}, text);
}
function gridCard(item, selected, onClick){
  const card = h("div", {
    class: "card card-sport"+(selected?" selected":""),
    "data-sport": item.key,
    onclick: onClick
  }, [
    h("img", {src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div", {class:"title"}, item.name)
  ]);
  return card;
}

/* ---------- Topbar logo (bianco) ---------- */
(function fixBrandLogo(){
  const brand = document.querySelector(".brand img");
  if (brand) {
    brand.src = LOGOS.light; // logo chiaro
    brand.alt = "PreMatch";
  }
})();

/* =========================================================
   PAGINE
   ========================================================= */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport", "Seleziona per iniziare"));

  const grid = h("div", {class:"container grid"});
  DATA.sports.forEach(s=>{
    const card = gridCard(s, state.sport===s.key, ()=>{
      // evidenziazione visibile
      document.querySelectorAll(".card-sport").forEach(c=>c.classList.remove("selected"));
      card.classList.add("selected");
      state.sport = s.key;
      // piccola pausa per far “vedere” il click
      setTimeout(()=> pageGender(), 160);
    });
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));

  const box = h("div",{class:"container panel"});
  const row = h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    const el = chip(g, state.gender===g, ()=>{
      // evidenziazione
      [...row.children].forEach(c=>c.classList.remove("active"));
      el.classList.add("active");
      state.gender = g;
      setTimeout(()=> pageRegions(), 140);
    });
    row.appendChild(el);
  });
  box.appendChild(row);
  // solo "Indietro"
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageSports()},"Indietro"),
  ]));
  app.appendChild(box);
}

function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione",""));

  const box = h("div",{class:"container panel"});
  const wrap = h("div",{class:"chips"});
  DATA.regions.forEach(r=>{
    const el = chip(r, state.region===r, ()=>{
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      el.classList.add("active");
      state.region = r;
      setTimeout(()=> pageLeagues(), 140);
    });
    wrap.appendChild(el);
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageGender()},"Indietro"),
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
    const el = chip(l, state.league===l, ()=>{
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      el.classList.add("active");
      state.league = l;
      setTimeout(()=> pageClubs(), 140);
    });
    wrap.appendChild(el);
  });

  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageRegions()},"Indietro"),
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
    const el = chip(c, state.club===c, ()=>{
      [...wrap.children].forEach(x=>x.classList.remove("active"));
      el.classList.add("active");
      state.club = c;
      setTimeout(()=> pageClubProfile(c), 140);
    });
    wrap.appendChild(el);
  });

  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageLeagues()},"Indietro"),
  ]));
  app.appendChild(box);
}

/* ----- Pagina Società ----- */
function pageClubProfile(clubName){
  clearMain();

  const club = DATA.clubProfiles[clubName] || {
    logo: LOGOS.icon,
    uniforms: {casa:"#ffffff", trasferta:"#000000", terza:"#2ecc71"},
    gallery: [], sponsors: [], contacts:{email:"-", tel:"-"},
    matches: []
  };

  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // Logo centrale (cerchio)
  const avatar = h("div",{class:"container", style:{display:"flex", justifyContent:"center", marginBottom:"-0.2rem"}},[
    h("img",{src:club.logo||LOGOS.icon, alt:clubName, style:{
      width:"92px", height:"92px", borderRadius:"999px", border:"1px solid #252b35",
      background:"#0b0f14", padding:"10px", objectFit:"contain"
    }})
  ]);
  app.appendChild(avatar);

  // Colori divise (riquadro chiaro)
  app.appendChild(divisePanel(club.uniforms));

  // Accordion info
  app.appendChild(accordionSection("Galleria foto", galleryContent(club.gallery)));
  app.appendChild(accordionSection("Sponsor", sponsorContent(club.sponsors)));
  app.appendChild(accordionSection("Contatti", contactsContent(club.contacts)));

  // Prossime partite
  const panel = h("div",{class:"container panel"});
  panel.appendChild(h("div",{class:"h2", style:{fontWeight:"800", color:"var(--accent)"}}, "Prossime partite"));
  (club.matches.length?club.matches:[{home:"—",when:"—",where:"—"}]).forEach(m=>{
    panel.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, m.home+" vs —"),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });

  // Azioni
  const actions = h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro"),
    createPrematchButton(club) // sempre visibile nella demo
  ]);
  app.appendChild(panel);
  app.appendChild(h("div",{class:"container"}, actions));
}

function divisePanel(uniforms){
  const u = Object.assign({casa:"#ffffff", trasferta:"#000000", terza:"#2ecc71"}, uniforms||{});
  const block = h("div",{
    class:"container panel",
    style:{background:"#101419", borderColor:"var(--border)"}
  });

  block.appendChild(h("div",{class:"h2", style:{fontWeight:"800"}}, "Colori divise (casa / trasferta / terza)"));

  const grid = h("div",{style:{display:"grid", gap:"1rem", gridTemplateColumns:"repeat(3,1fr)", maxWidth:"420px"}});
  [["Casa",u.casa],["Trasferta",u.trasferta],["Terza",u.terza]].forEach(([label,hex])=>{
    const cell = h("div",{style:{display:"grid", gap:".4rem"}},[
      h("div",{class:"sub", style:{margin:0}}, label),
      h("div",{
        style:{
          background:"#fff", padding:"8px", borderRadius:"12px",
          display:"flex", gap:"6px", alignItems:"center", justifyContent:"flex-start"
        }
      },[
        colorSwatch(hex, true)
      ])
    ]);
    grid.appendChild(cell);
  });
  block.appendChild(grid);
  return block;
}

function accordionSection(title, contentEl){
  const head = h("button",{class:"btn", style:{width:"100%", textAlign:"left", fontWeight:"700"}}, title);
  const body = h("div",{style:{display:"none", marginTop:".6rem"}}, contentEl);
  const wrap = h("div",{class:"container panel"},[head, body]);
  head.addEventListener("click", ()=>{
    body.style.display = (body.style.display==="none"?"block":"none");
  });
  return wrap;
}
function galleryContent(list){
  if (!list || !list.length) return h("div",{class:"sub"},"Nessuna foto caricata.");
  const g = h("div",{class:"grid"});
  list.forEach(src=> g.appendChild(
    h("img",{src, alt:"Foto impianto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}})
  ));
  return g;
}
function sponsorContent(list){
  if (!list || !list.length) return h("div",{class:"sub"},"Nessuno sponsor collegato.");
  const ul = h("ul");
  list.forEach(n=> ul.appendChild(h("li",{}, n)));
  return ul;
}
function contactsContent(c){
  return h("div",{},[
    h("div",{},"Email: "+(c.email||"-")),
    h("div",{},"Tel: "+(c.tel||"-"))
  ]);
}

/* ----- Bottone + Modale PreMatch ----- */
function createPrematchButton(club){
  const btn = h("button",{class:"btn primary", style:{display:"flex", alignItems:"center", gap:".5rem"}},[
    h("img",{src:LOGOS.icon, alt:"PM", style:{width:"18px", height:"18px", borderRadius:"4px"}}),
    "Crea PreMatch"
  ]);
  btn.addEventListener("click", ()=> openPrematchModal(club));
  return btn;
}

function colorSwatch(hex, big=false){
  return h("span", {style:{
    display:"inline-block",
    width: big?"24px":"16px", height: big?"24px":"16px",
    borderRadius:"6px", border:"1px solid #d0d7de", background:hex
  }});
}

function openPrematchModal(club){
  const overlay = h("div",{style:{
    position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:1000, display:"flex", justifyContent:"center", alignItems:"flex-start", paddingTop:"8vh"
  }});
  const modal = h("div",{style:{
    width:"min(640px, 92%)", background:"#11161c", color:"var(--text)",
    border:"1px solid var(--border)", borderRadius:"16px", overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,.45)"
  }});
  overlay.appendChild(modal);

  const header = h("div",{style:{padding:"14px 16px", fontWeight:"800", fontSize:"1.3rem", borderBottom:"1px solid var(--border)"}}, "Crea PreMatch");
  const body = h("div",{style:{padding:"16px"}});
  const footer = h("div",{style:{padding:"12px 16px", display:"flex", gap:"8px", justifyContent:"flex-end", borderTop:"1px solid var(--border)"}});

  modal.appendChild(header); modal.appendChild(body); modal.appendChild(footer);

  const palette = ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];
  const sel = { maglia:null, when:"", where:"", note:"" };

  function makeRow(label, key){
    const row = h("div",{style:{marginBottom:"14px"}},[
      h("div",{class:"sub", style:{margin:"0 0 8px 0"}}, label),
      h("div",{style:{display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:"8px", background:"#fff", padding:"10px", borderRadius:"12px"}},
        palette.map(hex => {
          const b = h("button",{
            style:{ width:"28px", height:"28px", borderRadius:"8px", border:"1px solid #252b35", backgroundColor:hex, cursor:"pointer" }
          });
          b.addEventListener("click", ()=>{
            sel[key]=hex;
            [...b.parentElement.children].forEach(x=>x.style.outline="none");
            b.style.outline = "2px solid var(--accent)";
            b.style.outlineOffset = "2px";
          });
          return b;
        })
      )
    ]);
    return row;
  }

  body.appendChild(h("div",{class:"sub", style:{margin:"0 0 8px 0"}}, "Scegli colore maglia (ospite)"));
  body.appendChild(makeRow("Maglia", "maglia"));

  // Data/Ora + Luogo + Messaggio
  const dt = h("input",{type:"datetime-local", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)"}});
  const place = h("input",{type:"text", placeholder:"Via dello Sport 1, Città", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)", marginTop:"10px"}});
  const note = h("textarea",{placeholder:"Messaggio alla società (opzionale)", rows:"3", style:{width:"100%", padding:"10px", borderRadius:"10px", border:"1px solid var(--border)", background:"#0f141a", color:"var(--text)", marginTop:"10px"}});
  dt.addEventListener("change", e=> sel.when = e.target.value);
  place.addEventListener("input", e=> sel.where = e.target.value);
  note.addEventListener("input", e=> sel.note = e.target.value);
  body.appendChild(h("div",{style:{marginTop:"6px"}},[
    h("div",{class:"sub", style:{margin:"0 0 6px 0"}}, "Data & ora"),
    dt,
    h("div",{class:"sub", style:{margin:"12px 0 6px 0"}}, "Luogo (indirizzo)"),
    place,
    h("div",{class:"sub", style:{margin:"12px 0 6px 0"}}, "Messaggio"),
    note
  ]));

  const annulla = h("button",{class:"btn", onclick:()=>document.body.removeChild(overlay)},"Annulla");
  const conferma = h("button",{class:"btn primary", onclick:()=>{
    if(!sel.maglia){ alert("Seleziona il colore della maglia."); return; }
    document.body.removeChild(overlay);
    confirmToast(); // demo
  }},"Invia richiesta");
  footer.appendChild(annulla); footer.appendChild(conferma);

  document.body.appendChild(overlay);
}

function confirmToast(){
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"700", zIndex:1200, border:"1px solid transparent"
  }},"Richiesta PreMatch inviata ✅");
  document.body.appendChild(t);
  setTimeout(()=>{ t.remove(); }, 1800);
}

/* ---------- Avvio ---------- */
pageSports();

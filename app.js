/* =========================
   PreMatch DEMO - app.js
   ========================= */

/* ----- Config demo ----- */
const IS_VISITOR = true; // visitando l’avversario
const STAFF_CODE_DEMO = "PM2025"; // codice staff dimostrativo

const LOGOS = {
  light: "./images/logo-light.png",
  dark: "./images/logo-dark.png",
  icon: "./images/logo-icon.png",
};

/* ----- Dati demo ----- */
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
    "Lazio": ["Eccellenza", "Promozione", "Prima Categoria", "Scuola Calcio"],
    "Lombardia": ["Serie C Silver", "Serie D", "Scuola Calcio"],
    "Sicilia": ["Serie C", "Promozione", "Scuola Calcio"],
    "Piemonte": ["Eccellenza", "Scuola Calcio"],
    "Veneto": ["Serie B Interregionale", "Scuola Calcio"],
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
      ],
      roster: [
        { name:"Rossi Anna",     n:"1",  role:"Por" },
        { name:"Bianchi Sara",   n:"2",  role:"Dif" },
        { name:"Verdi Elisa",    n:"3",  role:"Dif" },
        { name:"Neri Marta",     n:"4",  role:"Cen" },
        { name:"Gialli Chiara",  n:"7",  role:"Att" },
        { name:"Blu Francesca",  n:"9",  role:"Att" },
        { name:"Viola Laura",    n:"10", role:"Cen" },
        { name:"Arancio Giada",  n:"11", role:"Att" },
      ]
    },
  }
};

/* ----- Stato ----- */
const state = { sport:null, gender:null, region:null, league:null, club:null };

/* ----- Helpers DOM ----- */
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
function gridCard(item, onClick){
  return h("div", {class:"card", onclick:onClick}, [
    h("img", {src:item.img, alt:item.name, onerror(){this.style.display="none"}}),
    h("div", {class:"title"}, item.name)
  ]);
}

/* topbar logo (safety) */
(function(){
  const brand = document.querySelector(".brand img");
  if (brand) brand.src = LOGOS.light;
})();

/* ----- Pagine ----- */
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport", "Seleziona per iniziare"));

  const grid = h("div", {class:"container grid"});
  DATA.sports.forEach(s=>{
    grid.appendChild(gridCard({img:s.img, name:s.name}, ()=>{
      state.sport = s.key; pageGender();
    }));
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Seleziona il genere",""));

  const box = h("div",{class:"container panel"});
  const row = h("div",{class:"chips"});
  DATA.genders.forEach(g=>{
    row.appendChild(chip(g, state.gender===g, ()=>{
      state.gender = g;
      [...row.children].forEach(c=>c.classList.remove("active"));
      event.currentTarget.classList.add("active");
      pageRegions();
    }));
  });
  box.appendChild(row);
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
    wrap.appendChild(chip(r, state.region===r, ()=>{
      state.region = r;
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      event.currentTarget.classList.add("active");
      pageLeagues();
    }));
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
    wrap.appendChild(chip(l, state.league===l, ()=>{
      state.league = l;
      [...wrap.children].forEach(c=>c.classList.remove("active"));
      event.currentTarget.classList.add("active");
      pageClubs();
    }));
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
    wrap.appendChild(chip(c, state.club===c, ()=>{
      state.club = c;
      [...wrap.children].forEach(x=>x.classList.remove("active"));
      event.currentTarget.classList.add("active");
      pageClubProfile(c);
    }));
  });
  box.appendChild(wrap);
  box.appendChild(h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageLeagues()},"Indietro"),
  ]));
  app.appendChild(box);
}

/* ----- Pagina società ----- */
function pageClubProfile(clubName){
  clearMain();

  const club = DATA.clubProfiles[clubName] || {
    logo: LOGOS.icon,
    uniforms: {casa:"#ffffff", trasferta:"#000000", terza:"#2ecc71"},
    gallery: [], sponsors: [], contacts:{email:"-", tel:"-"}, matches: [], roster:[]
  };

  app.appendChild(sectionTitle(clubName, `${state.league||""} • ${state.gender||""} • ${state.region||""}`));

  // logo centrato
  app.appendChild(
    h("div",{class:"container", style:{display:"flex", justifyContent:"center", marginBottom:"-0.2rem"}},[
      h("img",{src:club.logo||LOGOS.icon, alt:clubName, style:{
        width:"92px", height:"92px", borderRadius:"999px", border:"1px solid #252b35",
        background:"#0b0f14", padding:"10px", objectFit:"contain"
      }})
    ])
  );

  // colori ufficiali (solo display)
  const u = Object.assign({casa:"#ffffff", trasferta:"#000000", terza:"#2ecc71"}, club.uniforms||{});
  const colorPanel = h("div",{class:"container panel"});
  colorPanel.appendChild(h("div",{class:"h2", style:{fontWeight:"800"}}, "Colori divise (ufficiali società)"));
  colorPanel.appendChild(h("div",{class:"sub"},"Casa / Trasferta / Terza (se presente)"));
  const row = h("div",{style:{display:"flex", gap:"10px", marginTop:"10px"}},[
    sw(u.casa), sw(u.trasferta), sw(u.terza)
  ]);
  colorPanel.appendChild(row);
  app.appendChild(colorPanel);

  // accordion info
  app.appendChild(accordion("Galleria foto", gallery(club.gallery)));
  app.appendChild(accordion("Sponsor", sponsors(club.sponsors)));
  app.appendChild(accordion("Contatti", contacts(club.contacts)));

  // partite
  const panel = h("div",{class:"container panel"});
  panel.appendChild(h("div",{class:"h2", style:{fontWeight:"800", color:"var(--accent)"}}, "Prossime partite"));
  (club.matches.length?club.matches:[{home:"—",when:"—",where:"—"}]).forEach(m=>{
    panel.appendChild(h("div",{class:"row"},[
      h("div",{class:"team"}, m.home+" vs —"),
      h("div",{class:"meta"}, `${m.when} — ${m.where}`)
    ]));
  });
  app.appendChild(panel);

  // azioni in fondo: indietro + Crea PreMatch + Convocazioni (staff)
  const actions = h("div",{class:"container actions"},[
    h("button",{class:"btn", onclick:()=>pageClubs()},"Indietro"),
    IS_VISITOR ? createPrematchButton() : null,
    staffAccessButton(club) // sempre visibile: la società con il codice entra
  ]);
  app.appendChild(actions);

  function sw(hex){ return h("span",{style:{
    display:"inline-block", width:"24px", height:"24px", borderRadius:"6px",
    border:"1px solid #d0d7de", background:hex
  }}); }
  function accordion(title, content){
    const head = h("button",{class:"btn", style:{width:"100%", textAlign:"left", fontWeight:"700"}}, title);
    const body = h("div",{style:{display:"none", marginTop:".6rem"}}, content);
    const wrap = h("div",{class:"container panel"},[head, body]);
    head.addEventListener("click", ()=> body.style.display = (body.style.display==="none"?"block":"none"));
    return wrap;
  }
  function gallery(list){
    if (!list || !list.length) return h("div",{class:"sub"},"Nessuna foto caricata.");
    const g = h("div",{class:"grid"});
    list.forEach(src=> g.appendChild(
      h("img",{src, alt:"Foto impianto", style:{width:"100%", height:"140px", objectFit:"cover", borderRadius:"12px"}})
    ));
    return g;
  }
  function sponsors(list){
    if (!list || !list.length) return h("div",{class:"sub"},"Nessuno sponsor collegato.");
    const ul = h("ul"); list.forEach(n=> ul.appendChild(h("li",{}, n))); return ul;
  }
  function contacts(c){
    return h("div",{},[
      h("div",{},"Email: "+(c.email||"-")),
      h("div",{},"Tel: "+(c.tel||"-"))
    ]);
  }
}

/* ----- Bottone Crea PreMatch ----- */
function createPrematchButton(){
  const btn = h("button",{class:"btn primary pm-badge"},[
    h("img",{src:LOGOS.icon, alt:"PM"}),
    "Crea PreMatch"
  ]);
  btn.addEventListener("click", ()=> openPrematchModal());
  return btn;
}

function openPrematchModal(){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  overlay.appendChild(sheet);

  const sel = { jersey:null, when:"", where:"" };
  const palette = ["#ffffff","#000000","#f1c40f","#e74c3c","#3498db","#2ecc71","#e67e22","#8e44ad"];

  function colorDot(hex){
    const b = h("button",{class:"color-dot", style:{
      width:"28px",height:"28px",borderRadius:"8px",border:"1px solid #252b35",backgroundColor:hex,cursor:"pointer"
    }});
    b.addEventListener("click", ()=>{
      sel.jersey = hex;
      [...grid.children].forEach(x=>x.classList.remove("selected"));
      b.classList.add("selected");
    });
    return b;
  }

  const hd = h("div",{class:"hd"},"Crea PreMatch");
  const bd = h("div",{class:"bd"});
  const bar = h("div",{class:"bar"});

  const grid = h("div",{style:{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:"8px",background:"#fff",padding:"10px",borderRadius:"12px"}}, palette.map(colorDot));
  bd.appendChild(h("div",{class:"sub"},"Scegli colore maglia (ospite)"));
  bd.appendChild(grid);

  const dt = h("input",{type:"datetime-local"});
  const place = h("input",{type:"text", placeholder:"Via dello Sport 1, Città"});
  dt.addEventListener("change", e=> sel.when = e.target.value);
  place.addEventListener("input", e=> sel.where = e.target.value);

  bd.appendChild(h("div",{class:"form-row"},[h("div",{class:"sub"},"Data & ora"), dt]));
  bd.appendChild(h("div",{class:"form-row"},[h("div",{class:"sub"},"Luogo (indirizzo)"), place]));

  const ann = h("button",{class:"btn"},"Annulla");
  ann.onclick = ()=> document.body.removeChild(overlay);
  const ok  = h("button",{class:"btn primary"},"Conferma");
  ok.onclick = ()=>{
    if(!sel.jersey){ alert("Seleziona il colore della maglia."); return; }
    document.body.removeChild(overlay);
    toast("Richiesta PreMatch inviata ✅");
  };

  bar.appendChild(ann); bar.appendChild(ok);
  sheet.appendChild(hd); sheet.appendChild(bd); sheet.appendChild(bar);
  document.body.appendChild(overlay);
}

/* ----- Accesso Convocazioni (staff con codice) ----- */
function staffAccessButton(club){
  const btn = h("button",{class:"btn"},"Convocazioni (staff)");
  btn.addEventListener("click", ()=> openStaffCodeModal(club));
  return btn;
}

function openStaffCodeModal(club){
  const overlay = h("div",{class:"overlay"});
  const sheet = h("div",{class:"sheet"});
  overlay.appendChild(sheet);

  const hd = h("div",{class:"hd"},"Area Staff – Inserisci codice");
  const bd = h("div",{class:"bd"});
  const bar = h("div",{class:"bar"});

  const inp = h("input",{type:"text", placeholder:"Es. PM2025"});
  const hint = h("div",{class:"hint"},"Codice dimostrativo: PM2025");
  bd.appendChild(h("div",{class:"form-row"},[inp, hint]));

  const ann = h("button",{class:"btn"},"Annulla");
  ann.onclick = ()=> document.body.removeChild(overlay);
  const ok  = h("button",{class:"btn primary"},"Entra");
  ok.onclick = ()=>{
    if(inp.value.trim().toUpperCase() === STAFF_CODE_DEMO){
      document.body.removeChild(overlay);
      pageConvocazioni(club);
    } else {
      alert("Codice errato.");
    }
  };

  bar.appendChild(ann); bar.appendChild(ok);
  sheet.appendChild(hd); sheet.appendChild(bd); sheet.appendChild(bar);
  document.body.appendChild(overlay);
}

/* ----- Pagina Convocazioni ----- */
function pageConvocazioni(club){
  clearMain();
  const prof = DATA.clubProfiles[state.club] || { roster:[] };

  app.appendChild(sectionTitle("Convocazioni", `${state.club} • ${state.league||""} • ${state.region||""}`));

  const box = h("div",{class:"container panel"});
  box.appendChild(h("div",{class:"sub"},"Spunta le atlete convocate."));

  const list = h("div",{class:"list"});
  const selected = new Set();
  (prof.roster||[]).forEach(p=>{
    const ck = h("input",{type:"checkbox", class:"ck"});
    ck.addEventListener("change", e=>{
      if(e.target.checked) selected.add(p.name); else selected.delete(p.name);
    });
    list.appendChild(
      h("div",{class:"item"},[
        h("div",{},[
          h("div",{class:"name"}, `${p.n} • ${p.name}`),
          h("div",{class:"meta"}, p.role||"")
        ]),
        ck
      ])
    );
  });
  box.appendChild(list);

  // dettagli raduno
  const when = h("input",{type:"datetime-local"});
  const where = h("input",{type:"text", placeholder:"Luogo raduno (es. Campo Comunale, Via...)"});
  const notes = h("textarea",{placeholder:"Note per le convocate (documenti, orario spogliatoi, ecc.)"});

  box.appendChild(h("div",{class:"form-row"},[h("div",{class:"sub"},"Appuntamento"), when]));
  box.appendChild(h("div",{class:"form-row"},[h("div",{class:"sub"},"Luogo raduno"), where]));
  box.appendChild(h("div",{class:"form-row"},[h("div",{class:"sub"},"Note"), notes]));

  const actions = h("div",{class:"actions"},[
    h("button",{class:"btn", onclick:()=>pageClubProfile(state.club)},"Indietro"),
    h("button",{class:"btn primary", onclick:()=>{
      exportConvocazioni({
        club: state.club, league: state.league, region: state.region,
        players: Array.from(selected), when: when.value, where: where.value, notes: notes.value
      });
    }},"Esporta PDF Lista")
  ]);

  app.appendChild(box);
  app.appendChild(h("div",{class:"container"}, actions));
}

/* stampa semplice (HTML → stampa/PDF) */
function exportConvocazioni(data){
  const w = window.open("", "_blank");
  const css = `
    body{font-family:system-ui,Segoe UI,Roboto,Arial; margin:24px}
    h1{margin:0 0 6px 0} h2{margin:18px 0 8px 0}
    .muted{color:#555} ul{margin:8px 0 0 18px}
    .tag{display:inline-block;padding:2px 6px;border:1px solid #ddd;border-radius:6px;margin-left:6px}
  `;
  const list = (data.players||[]).map(n=>`<li>${n}</li>`).join("") || "<li>—</li>";
  const when = data.when ? new Date(data.when).toLocaleString() : "—";
  w.document.write(`
    <html><head><meta charset="utf-8"><title>Convocazioni</title>
      <style>${css}</style>
    </head><body>
      <div style="display:flex;align-items:center;gap:10px">
        <img src="${LOGOS.dark}" style="width:28px;height:28px;border:1px solid #eee;border-radius:6px" />
        <h1>Convocazioni</h1>
      </div>
      <div class="muted">${data.club} — ${data.league||""} — ${data.region||""}</div>

      <h2>Atlete convocate</h2>
      <ul>${list}</ul>

      <h2>Dettagli raduno</h2>
      <div>Quando: <span class="tag">${when}</span></div>
      <div style="margin-top:6px">Dove: <span class="tag">${data.where||"—"}</span></div>

      <h2>Note</h2>
      <div>${(data.notes||"—").replace(/\n/g,"<br>")}</div>
      <script>window.print()</script>
    </body></html>
  `);
  w.document.close();
}

/* toast */
function toast(msg){
  const t = h("div",{style:{
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"var(--accent)", color:"#0b1115", padding:"10px 14px",
    borderRadius:"10px", fontWeight:"700", zIndex:1200
  }}, msg);
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1800);
}

/* avvio */
pageSports();

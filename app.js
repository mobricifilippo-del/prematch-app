// ===== Dataset di esempio =====
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
    // per semplicità usiamo lo stesso set per demo; in reale si filtra per sport+genere+regione
    default: ["Serie A", "Eccellenza", "Promozione", "Prima Categoria", "Scuola Calcio"],
  },

  clubsByLeague: {
    "Serie A": ["AC Aurora", "Trust Every Woman"],
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino", "Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Scuola Calcio": ["Piccoli Draghi", "Junior Stars"]
  },

  matchesMock: [
    { home: "Prima Squadra", away: "—", when: "31/08/2025 14:07", where: "Roma – Stadio Olimpico" },
    { home: "Juniores",      away: "—", when: "01/09/2025 18:30", where: "Roma – Campo Test" },
  ],
};

// ===== Stato =====
const state = { sport:null, gender:null, region:null, league:null, club:null };

// ===== App root =====
const app = document.getElementById("app");

// ===== Helper DOM =====
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k === "onclick") el.addEventListener("click", v);
    else if (k === "onerror") el.onerror = v;
    else el.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    if (typeof c === "string") el.appendChild(document.createTextNode(c));
    else el.appendChild(c);
  });
  return el;
}
function clearMain(){ app.innerHTML = ""; }
function sectionTitle(title, subtitle){
  return h("div", {class:"container"}, [
    h("div", {class:"h1"}, title),
    h("div", {class:"sub"}, subtitle || ""),
  ]);
}

// ===== Pagine =====
function pageSports(){
  clearMain();
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare"));

  const grid = h("div", {class:"container grid"});
  DATA.sports.forEach(s => {
    const card = h("div", {class:"card", tabindex:"0"}, [
      h("img", {src: s.img, alt: s.name, onerror: function(){ this.style.display="none"; }}),
      h("div", {class:"title"}, s.name),
    ]);
    card.addEventListener("click", () => {
      // evidenzia interazione
      [...grid.children].forEach(c=>c.classList.remove("active"));
      card.classList.add("active");

      state.sport = s.key;
      // auto-avanza
      setTimeout(pageGender, 80);
    });
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function pageGender(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il genere", ""));

  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  DATA.genders.forEach(g => {
    const chip = h("div", {class:"chip"}, g);
    chip.addEventListener("click", ()=>{
      [...chips.children].forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      state.gender = g;
      setTimeout(pageRegions, 80);
    });
    chips.appendChild(chip);
  });
  box.appendChild(chips);
  app.appendChild(box);
}

function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione", ""));

  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  DATA.regions.forEach(r => {
    const chip = h("div", {class:"chip"}, r);
    chip.addEventListener("click", ()=>{
      [...chips.children].forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      state.region = r;
      setTimeout(pageLeagues, 80);
    });
    chips.appendChild(chip);
  });
  box.appendChild(chips);

  // azione “indietro” sola, niente Avanti
  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageGender()}, "Indietro")
  ]);
  box.appendChild(actions);

  app.appendChild(box);
}

function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il campionato", `${state.gender} • ${state.region}`));

  const leagues = DATA.leaguesBy.default; // in reale: filtra per sport+genere+regione
  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  leagues.forEach(l => {
    const chip = h("div", {class:"chip"}, l);
    chip.addEventListener("click", ()=>{
      [...chips.children].forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      state.league = l;
      setTimeout(pageClubs, 80);
    });
    chips.appendChild(chip);
  });
  box.appendChild(chips);

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageRegions()}, "Indietro")
  ]);
  box.appendChild(actions);

  app.appendChild(box);
}

function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la società", `${state.league} • ${state.region}`));

  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  clubs.forEach(c => {
    const chip = h("div", {class:"chip"}, c);
    chip.addEventListener("click", ()=>{
      [...chips.children].forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      state.club = c;
      setTimeout(pageClubDetail, 80);
    });
    chips.appendChild(chip);
  });
  box.appendChild(chips);

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageLeagues()}, "Indietro")
  ]);
  box.appendChild(actions);

  app.appendChild(box);
}

function pageClubDetail(){
  clearMain();
  app.appendChild(sectionTitle(state.club, `${state.league} • ${state.gender} • ${state.region}`));

  const wrap = h("div", {class:"container"});

  // logo società centrato
  const logo = h("img", {
    class:"club-logo",
    src:"./images/club-placeholder.png",
    alt:"Logo società",
    onerror:function(){ this.style.display='none'; }
  });

  const info = h("div", {class:"panel"}, [
    h("div", {class:"label"}, "Contatti ufficiali"),
    h("div", {class:"muted"}, "Email: info@societa.demo • Tel: +39 000 000 0000"),

    h("div", {class:"spacer"}),
    h("div", {class:"label"}, "Impianto"),
    h("div", {class:"muted"}, "Stadio/Impianto — Indirizzo completo"),

    h("div", {class:"spacer"}),
    h("div", {class:"label"}, "Sponsor collegati"),
    h("div", {class:"muted"}, "Hotel Demo, Ristorante Demo (solo esempio)"),
  ]);

  const matchesPanel = h("div", {class:"panel"}, [
    h("div", {class:"label"}, "Prossime partite"),
    ...DATA.matchesMock.map(m =>
      h("div", {class:"row"}, [
        h("div", {class:"team"}, `${m.home} vs ${m.away}`),
        h("div", {class:"meta"}, `${m.when} — ${m.where}`)
      ])
    )
  ]);

  // Bottone Crea PreMatch con logo
  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn"}, "Indietro"),
    (() => {
      const btn = h("button", {class:"btn primary btn-icon"}, [
        h("img", {src:"./images/logo-dark.png", alt:"PM", onerror:function(){ this.style.display='none'; }}),
        "Crea PreMatch"
      ]);
      btn.addEventListener("click", pagePreMatch);
      return btn;
    })()
  ]);
  actions.firstChild.addEventListener("click", () => pageClubs());

  wrap.appendChild(logo);
  wrap.appendChild(info);
  wrap.appendChild(matchesPanel);
  wrap.appendChild(actions);
  app.appendChild(wrap);
}

function colorSwatch(value){
  const sw = h("div", {class:"chip"}, value);
  // colore testo sempre verde già da CSS; attivo con bordo verde
  return sw;
}

function pagePreMatch(){
  clearMain();
  app.appendChild(sectionTitle("Crea PreMatch", `${state.club} • ${state.league} • ${state.region}`));

  const box = h("div", {class:"container panel"});

  // selezione colori maglie con chip (no testo libero)
  const colors = ["Bianco","Nero","Rosso","Blu","Verde","Giallo","Arancio","Azzurro","Bordeaux"];
  let home=null, away=null;

  box.appendChild(h("div", {class:"label"}, "Maglia CASA — Colore"));
  const chipsHome = h("div", {class:"chips"});
  colors.forEach(c=>{
    const chip = colorSwatch(c);
    chip.addEventListener("click", ()=>{
      [...chipsHome.children].forEach(x=>x.classList.remove("active"));
      chip.classList.add("active");
      home = c;
    });
    chipsHome.appendChild(chip);
  });
  box.appendChild(chipsHome);

  box.appendChild(h("div", {class:"label"}, "Maglia TRASFERTA — Colore"));
  const chipsAway = h("div", {class:"chips"});
  colors.forEach(c=>{
    const chip = colorSwatch(c);
    chip.addEventListener("click", ()=>{
      [...chipsAway.children].forEach(x=>x.classList.remove("active"));
      chip.classList.add("active");
      away = c;
    });
    chipsAway.appendChild(chip);
  });
  box.appendChild(chipsAway);

  // azioni
  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageClubDetail()}, "Indietro"),
    (() => {
      const btn = h("button", {class:"btn primary btn-icon"}, [
        h("img", {src:"./images/logo-dark.png", alt:"PM", onerror:function(){ this.style.display='none'; }}),
        "Conferma PreMatch"
      ]);
      btn.addEventListener("click", ()=>{
        if(!home || !away){
          alert("Seleziona i colori delle maglie (casa e trasferta).");
          return;
        }
        pagePreMatchDone(home, away);
      });
      return btn;
    })()
  ]);

  box.appendChild(actions);
  app.appendChild(box);
}

function pagePreMatchDone(homeColor, awayColor){
  clearMain();
  app.appendChild(sectionTitle("PreMatch creato ✅", `${state.club} • ${state.league} • ${state.region}`));

  const box = h("div", {class:"container panel"}, [
    h("div", {class:"label"}, "Riepilogo"),
    h("div", {class:"row"}, [ h("div",{class:"team"},"Casa"), h("div",{class:"meta"}, homeColor) ]),
    h("div", {class:"row"}, [ h("div",{class:"team"},"Trasferta"), h("div",{class:"meta"}, awayColor) ]),
    h("div", {class:"row"}, [ h("div",{class:"team"},"Stato"), h("div",{class:"meta"}, "Inviato — in attesa di conferma") ]),
  ]);

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageSports()}, "Torna alla Home")
  ]);

  app.appendChild(box);
  app.appendChild(h("div", {class:"container"}, actions));
}

// avvio
pageSports();

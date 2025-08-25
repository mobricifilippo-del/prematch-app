// ===== Dati di esempio per far vedere il flusso =====
const DATA = {
  sports: [
    { key: "calcio",     name: "Calcio",     img: "./images/calcio.jpg" },
    { key: "futsal",     name: "Futsal",     img: "./images/futsal.jpg" },
    { key: "basket",     name: "Basket",     img: "./images/basket.jpg" },
    { key: "volley",     name: "Volley",     img: "./images/volley.jpg" },
    { key: "rugby",      name: "Rugby",      img: "./images/rugby.jpg" },
    { key: "pallanuoto", name: "Pallanuoto", img: "./images/pallanuoto.jpg" },
  ],
  regions: ["Lazio", "Lombardia", "Sicilia", "Piemonte", "Veneto", "Emilia-Romagna"],
  leaguesByRegion: {
    Lazio: ["Eccellenza", "Promozione", "Prima Categoria"],
    Lombardia: ["Serie C Silver", "Serie D"],
    Sicilia: ["Serie C", "Promozione"],
    Piemonte: ["Eccellenza"],
    Veneto: ["Serie B Interregionale"],
    "Emilia-Romagna": ["Promozione"],
  },
  clubsByLeague: {
    Eccellenza: ["ASD Roma Nord", "Sporting Tuscolano"],
    Promozione: ["Virtus Marino", "Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Serie C Silver": ["Brixia Basket", "Gorla Team"],
    "Serie D": ["Lario Basket"],
    "Serie C": ["Siracusa Calcio"],
    "Serie B Interregionale": ["Treviso Volley"],
  },
  matchesMock: [
    { home: "Prima Squadra", away: "—", when: "31/08/2025 14:07", where: "Roma – Stadio Olimpico" },
    { home: "Juniores",      away: "—", when: "01/09/2025 18:30", where: "Roma – Campo Test" },
  ],
};

// ===== Stato semplice =====
const state = { sport:null, region:null, league:null, club:null };

// ===== App root =====
const app = document.getElementById("app");

// ===== Helper per creare elementi =====
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
  app.appendChild(sectionTitle("Scegli lo sport","Seleziona per iniziare il percorso"));

  const grid = h("div", {class:"container grid"});
  DATA.sports.forEach(s => {
    const card = h("div", {class:"card", onclick: () => { state.sport = s.key; pageRegions(); }}, [
      h("img", {src: s.img, alt: s.name, onerror: function(){ this.style.display="none"; }}),
      h("div", {class:"title"}, s.name),
    ]);
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

function pageRegions(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la regione",""));

  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  DATA.regions.forEach(r => {
    const chip = h("div", {
      class: "chip" + (state.region===r ? " active": ""),
      onclick: () => {
        state.region = r;
        [...chips.children].forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
      },
    }, r);
    chips.appendChild(chip);
  });

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageSports()}, "Indietro"),
    h("button", {class:"btn primary", onclick: () => pageLeagues(), disabled:true}, "Avanti"),
  ]);

  box.appendChild(chips);
  box.appendChild(actions);
  app.appendChild(box);

  box.addEventListener("click", () => {
    const btnNext = box.querySelector(".btn.primary");
    btnNext.disabled = !state.region;
  }, {capture:true});
}

function pageLeagues(){
  clearMain();
  app.appendChild(sectionTitle("Scegli il campionato", state.region || ""));

  const leagues = DATA.leaguesByRegion[state.region] || [];
  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  leagues.forEach(l => {
    const chip = h("div", {
      class:"chip" + (state.league===l ? " active": ""),
      onclick: () => {
        state.league = l;
        [...chips.children].forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
      }
    }, l);
    chips.appendChild(chip);
  });

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageRegions()}, "Indietro"),
    h("button", {class:"btn primary", onclick: () => pageClubs(), disabled:true}, "Avanti"),
  ]);

  box.appendChild(chips);
  box.appendChild(actions);
  app.appendChild(box);

  box.addEventListener("click", () => {
    const btnNext = box.querySelector(".btn.primary");
    btnNext.disabled = !state.league;
  }, {capture:true});
}

function pageClubs(){
  clearMain();
  app.appendChild(sectionTitle("Scegli la società", state.league || ""));

  const clubs = DATA.clubsByLeague[state.league] || ["Società Dimostrativa"];
  const box = h("div", {class:"container panel"});
  const chips = h("div", {class:"chips"});
  clubs.forEach(c => {
    const chip = h("div", {
      class:"chip" + (state.club===c ? " active": ""),
      onclick: () => {
        state.club = c;
        [...chips.children].forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
      }
    }, c);
    chips.appendChild(chip);
  });

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageLeagues()}, "Indietro"),
    h("button", {class:"btn primary", onclick: () => pageMatches(), disabled:true}, "Avanti"),
  ]);

  box.appendChild(chips);
  box.appendChild(actions);
  app.appendChild(box);

  box.addEventListener("click", () => {
    const btnNext = box.querySelector(".btn.primary");
    btnNext.disabled = !state.club;
  }, {capture:true});
}

function pageMatches(){
  clearMain();
  app.appendChild(sectionTitle("Prossime partite", `${state.club} — ${state.league} — ${state.region}`));

  const box = h("div", {class:"container panel"});
  DATA.matchesMock.forEach(m => {
    box.appendChild(
      h("div", {class:"row"}, [
        h("div", {class:"team"}, `${m.home} vs ${m.away}`),
        h("div", {class:"meta"}, `${m.when} — ${m.where}`)
      ])
    );
  });

  const actions = h("div", {class:"actions"}, [
    h("button", {class:"btn", onclick: () => pageClubs()}, "Indietro"),
    h("button", {class:"btn primary", onclick: () => pageSports()}, "Nuovo percorso"),
  ]);

  const wrap = h("div", {class:"container"}, actions);
  app.appendChild(box);
  app.appendChild(wrap);
}

// Avvio
pageSports();

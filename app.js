// ======== CONFIG SUPABASE ========
const SUPABASE_URL = "https://hzzhypahrzclvfepstro.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6emh5cGFocnpjbHZmZXBzdHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDAxNDUsImV4cCI6MjA3MTAxNjE0NX0.7niKgLcuDKQZQZxkQfxMYzz9fPT4Mm5wzWeq6r87TIY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ======== STATO APP ========
let selectedSport = { id: null, nome: null };
let selectedRegion = { id: null, nome: null };
let selectedGender = null;

// ======== UTILS DOM ========
// Creo (se mancano) i contenitori delle sezioni e imposto la classe .screen
function ensureSections() {
  const main = document.getElementById("home") || document.querySelector("main");

  function ensure(id, title, withBack=false) {
    let sec = document.getElementById(id);
    if (!sec) {
      sec = document.createElement("section");
      sec.id = id;
      sec.className = "screen";
      const h = document.createElement("h2");
      h.textContent = title;
      sec.appendChild(h);
      if (withBack) {
        const back = document.createElement("button");
        back.className = "back";
        back.textContent = "← Indietro";
        back.addEventListener("click", () => goBackFrom(id));
        sec.insertBefore(back, h);
      }
      main.appendChild(sec);
    }
    return sec;
  }

  // sezione esistente della griglia sport
  const sportsGrid = document.querySelector(".sports-grid");
  if (sportsGrid) {
    const s = document.getElementById("sports-step") || document.createElement("section");
    s.id = "sports-step";
    s.className = "screen active"; // la sola visibile all'avvio
    s.appendChild(sportsGrid);
    const hero = document.querySelector(".hero");
    if (hero && hero.parentElement !== s) s.insertBefore(hero, sportsGrid);
    main.prepend(s);
  }

  ensure("region-step",   "Scegli la regione",   true);
  ensure("gender-step",   "Seleziona il genere", true);
  ensure("clubs-step",    "Scegli la società",   true);
  ensure("club-page",     "Società",             true); // dettaglio società
}

// mostra solo una sezione
function showOnly(id) {
  document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add("active");
}

// gestione “Indietro”
function goBackFrom(id) {
  if (id === "region-step") {
    showOnly("sports-step");
  } else if (id === "gender-step") {
    showRegions(); // torna a regioni con sport già scelto
  } else if (id === "clubs-step") {
    showGender();  // torna al genere
  } else if (id === "club-page") {
    showClubs();   // torna all’elenco società
  }
}

// helper per creare bottoni/elenco
function clearAndFill(container, nodes=[]) {
  container.innerHTML = "";
  nodes.forEach(n => container.appendChild(n));
}

function pill(text, onClick) {
  const b = document.createElement("button");
  b.className = "pill";
  b.textContent = text;
  b.addEventListener("click", onClick);
  return b;
}

function card(title, imgSrc, onClick) {
  const d = document.createElement("div");
  d.className = "card";
  if (onClick) d.addEventListener("click", onClick);
  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = title;
  const h = document.createElement("h3");
  h.textContent = title;
  d.append(img, h);
  return d;
}

// mappa immagini per sport
const sportImage = (nome) => {
  const k = (nome || "").toLowerCase().replace(/\s+/g, "");
  return `images/${k}.jpg`;
};

// ======== RENDER: SPORT ========
async function initSportsGrid() {
  // se ci sono già le card statiche, aggiungo il click -> selectSport
  document.querySelectorAll(".sports-grid .card").forEach(c => {
    const h = c.querySelector("h3");
    if (!h) return;
    const nome = h.textContent.trim();
    c.onclick = () => selectSportByName(nome);
  });

  // Se vuoi caricare da DB (tabella public.sports), togli il commento:
  /*
  const { data, error } = await supabase.from("sports").select("id, nome").order("nome");
  if (!error && data && data.length) {
    const grid = document.querySelector(".sports-grid");
    grid.innerHTML = "";
    data.forEach(sp => {
      grid.appendChild(card(sp.nome, sportImage(sp.nome), () => {
        selectedSport = { id: sp.id, nome: sp.nome };
        showRegions();
      }));
    });
  }
  */
}

async function selectSportByName(nome) {
  // prova a trovare l'id dal DB per filtrare le società
  let sportId = null;
  const { data } = await supabase.from("sports").select("id, nome").eq("nome", nome).limit(1);
  if (data && data[0]) sportId = data[0].id;

  selectedSport = { id: sportId, nome };
  showRegions();
}

// ======== RENDER: REGIONI ========
async function showRegions() {
  ensureSections();
  const sec = document.getElementById("region-step");
  const cont = document.createElement("div");
  cont.className = "chips";

  const { data, error } = await supabase.from("regioni").select("id, nome").order("nome");
  const nodes = [];

  if (error) {
    nodes.push(document.createTextNode("Errore nel caricamento regioni."));
  } else {
    // Bottone “Tutte” (nel caso alcune società non abbiano regione valorizzata)
    nodes.push(pill("Tutte", () => {
      selectedRegion = { id: null, nome: "Tutte" };
      showGender();
    }));
    (data || []).forEach(r => {
      nodes.push(pill(r.nome, () => {
        selectedRegion = { id: r.id, nome: r.nome };
        showGender();
      }));
    });
  }

  clearAndFill(sec, [sec.querySelector(".back"), sec.querySelector("h2"), cont]);
  clearAndFill(cont, nodes);
  showOnly("region-step");
}

// ======== RENDER: GENERE ========
function showGender() {
  ensureSections();
  selectedGender = null;
  const sec = document.getElementById("gender-step");
  const g = document.createElement("div");
  g.className = "chips";

  g.appendChild(pill("Maschile", () => { selectedGender = "M"; showClubs(); }));
  g.appendChild(pill("Femminile", () => { selectedGender = "F"; showClubs(); }));

  clearAndFill(sec, [sec.querySelector(".back"), sec.querySelector("h2"), g]);
  showOnly("gender-step");
}

// ======== RENDER: SOCIETÀ ========
async function showClubs() {
  ensureSections();
  const sec = document.getElementById("clubs-step");

  const list = document.createElement("div");
  list.className = "cards";

  // filtro: sport_id e regione_id. Alcune società potrebbero avere regione_id null.
  let query = supabase.from("societa").select("id, nome, regione_id, sport_id").order("nome");

  if (selectedSport.id) query = query.eq("sport_id", selectedSport.id);
  if (selectedRegion.id) query = query.eq("regione_id", selectedRegion.id);

  const { data, error } = await query;

  if (error) {
    list.textContent = "Errore nel caricamento società.";
  } else if (!data || !data.length) {
    list.textContent = "Nessuna società trovata per i filtri selezionati.";
  } else {
    data.forEach(c => {
      list.appendChild(
        card(c.nome, "images/logo.png", () => openClub(c))
      );
    });
  }

  clearAndFill(sec, [sec.querySelector(".back"), sec.querySelector("h2"), list]);
  showOnly("clubs-step");
}

// ======== DETTAGLIO SOCIETÀ ========
async function openClub(club) {
  ensureSections();
  const sec = document.getElementById("club-page");

  const h = sec.querySelector("h2");
  h.textContent = club.nome;

  const wrap = document.createElement("div");
  wrap.className = "club";

  // Prossime partite (se presenti)
  const matchesBox = document.createElement("div");
  matchesBox.className = "box";
  const mh = document.createElement("h3");
  mh.textContent = "Prossime partite";
  matchesBox.appendChild(mh);

  const { data: matches } = await supabase
    .from("partite")
    .select("id, data, struttura, squadra1_id, squadra2_id")
    .gte("data", new Date().toISOString())
    .order("data", { ascending: true })
    .limit(5);
  // Nota: qui potresti voler filtrare per club.id, collegando partite -> squadre -> società.
  // Per demo, mostro le prime 5 future.

  const mlist = document.createElement("ul");
  (matches || []).forEach(m => {
    const li = document.createElement("li");
    li.textContent = new Date(m.data).toLocaleString("it-IT") + (m.struttura ? ` — ${m.struttura}` : "");
    mlist.appendChild(li);
  });
  if (!mlist.children.length) {
    const p = document.createElement("p");
    p.textContent = "Nessuna partita in programma.";
    matchesBox.appendChild(p);
  } else {
    matchesBox.appendChild(mlist);
  }

  // Sponsor collegati (se presenti)
  const sponsorsBox = document.createElement("div");
  sponsorsBox.className = "box";
  const sh = document.createElement("h3");
  sh.textContent = "Sponsor della società";
  sponsorsBox.appendChild(sh);

  const { data: links } = await supabase
    .from("sponsorizzazioni")
    .select("sponsor_id")
    .eq("societa_id", club.id);

  if (!links || !links.length) {
    const p = document.createElement("p");
    p.textContent = "Nessuno sponsor registrato.";
    sponsorsBox.appendChild(p);
  } else {
    const ids = links.map(l => l.sponsor_id);
    const { data: sponsors } = await supabase
      .from("sponsors")
      .select("id, nome")
      .in("id", ids);

    const slist = document.createElement("ul");
    (sponsors || []).forEach(s => {
      const li = document.createElement("li");
      li.textContent = s.nome;
      slist.appendChild(li);
    });
    sponsorsBox.appendChild(slist);
  }

  wrap.append(matchesBox, sponsorsBox);
  clearAndFill(sec, [sec.querySelector(".back"), h, wrap]);
  showOnly("club-page");
}

// ======== AVVIO ========
function boot() {
  ensureSections();
  initSportsGrid();     // collega i click alle card sport già presenti
  showOnly("sports-step");
}

document.addEventListener("DOMContentLoaded", boot);

/* =========================
   PreMatch — app.js (PASSO 2)
   Dati reali da Supabase
   Flusso: Sport → Regione → Genere → Società → Dettaglio
========================= */

// Client Supabase (usa le chiavi definite in index.html)
const supabase = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

// Stato navigazione
const state = {
  sport: null,    // { id, nome }
  regione: null,  // { id, nome }
  genere: null,   // "Maschile" | "Femminile"
  club: null      // { id, nome, citta? }
};

// Utils schermate
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function goTo(id) { show(id); }

/* =========================
   HOME: SPORT
========================= */
const sportsGrid = document.getElementById("sportsGrid");
async function renderSports() {
  sportsGrid.innerHTML = "";

  const { data, error } = await supabase
    .from("sports")
    .select("id,nome")
    .order("nome", { ascending: true });

  if (error) {
    console.error(error);
    sportsGrid.innerHTML = `<p class="path">Errore nel caricamento degli sport.</p>`;
    return;
  }

  const IMG = {
    "Calcio": "images/calcio.jpg",
    "Futsal": "images/futsal.jpg",
    "Basket": "images/basket.jpg",
    "Rugby": "images/rugby.jpg",
    "Volley": "images/volley.jpg",
    "Beach Volley": "images/beachvolley.jpg",
    "Pallanuoto": "images/pallanuoto.jpg"
  };

  data.forEach(sp => {
    const card = document.createElement("article");
    card.className = "sport-card";
    card.innerHTML = `
      <img src="${IMG[sp.nome] || "images/calcio.jpg"}" alt="${sp.nome}">
      <div class="label">${sp.nome}</div>
    `;
    card.onclick = () => selectSport(sp);
    sportsGrid.appendChild(card);
  });
}

function selectSport(sp) {
  state.sport = sp;
  state.regione = null;
  state.genere = null;
  state.club = null;
  document.getElementById("pathSport").textContent = sp.nome;
  renderRegioni();
  goTo("regioni");
}

/* =========================
   REGIONI
========================= */
const regioniGrid = document.getElementById("regioniGrid");

async function renderRegioni() {
  regioniGrid.innerHTML = "";

  const { data, error } = await supabase
    .from("regioni")
    .select("id,nome")
    .order("nome", { ascending: true });

  if (error) {
    console.error(error);
    regioniGrid.innerHTML = `<p class="path">Errore nel caricamento delle regioni.</p>`;
    return;
  }

  data.forEach(r => {
    const btn = document.createElement("button");
    btn.className = "pill";
    btn.textContent = r.nome;
    btn.onclick = () => selectRegione(r);
    regioniGrid.appendChild(btn);
  });
}

function selectRegione(reg) {
  state.regione = reg;
  document.getElementById("pathSport2").textContent = state.sport.nome;
  document.getElementById("pathRegione").textContent = reg.nome;
  goTo("genere");
}

/* =========================
   GENERE
========================= */
document.querySelector('#genere [data-genere="Maschile"]').onclick = () => {
  state.genere = "Maschile";
  loadClubs();
};
document.querySelector('#genere [data-genere="Femminile"]').onclick = () => {
  state.genere = "Femminile";
  loadClubs();
};

/* =========================
   SOCIETÀ (CLUBS)
========================= */
const clubsGrid = document.getElementById("clubsGrid");

async function loadClubs() {
  document.getElementById("pathSport3").textContent = state.sport.nome;
  document.getElementById("pathRegione2").textContent = state.regione.nome;
  document.getElementById("pathGenere").textContent = state.genere;

  clubsGrid.innerHTML = `<p class="path">Carico società…</p>`;

  // Per ora filtro solo per sport+regione (il genere lo terremo a DB quando definisci il campo)
  const { data, error } = await supabase
    .from("societa")
    .select("id,nome,citta")
    .eq("sport_id", state.sport.id)
    .eq("regione_id", state.regione.id)
    .order("nome", { ascending: true });

  if (error) {
    console.error(error);
    clubsGrid.innerHTML = `<p class="path">Errore nel caricamento delle società.</p>`;
    return;
  }

  if (!data || !data.length) {
    clubsGrid.innerHTML = `<p class="path">Nessuna società trovata per ${state.sport.nome} in ${state.regione.nome}.</p>`;
    goTo("clubs");
    return;
  }

  clubsGrid.innerHTML = "";
  data.forEach(club => {
    const row = document.createElement("div");
    row.className = "club-card";
    row.innerHTML = `
      <div class="club-name">${club.nome}</div>
      <button class="pill">Apri</button>
    `;
    row.querySelector("button").onclick = () => openClub(club);
    clubsGrid.appendChild(row);
  });

  goTo("clubs");
}

/* =========================
   DETTAGLIO SOCIETÀ
========================= */
async function openClub(club) {
  state.club = club;

  // Path
  document.getElementById("pathSport4").textContent = state.sport.nome;
  document.getElementById("pathRegione3").textContent = state.regione.nome;
  document.getElementById("pathGenere2").textContent = state.genere;
  document.getElementById("clubTitle").textContent = club.nome;

  await Promise.all([renderMatches(club.id), renderSponsors(club.id)]);

  goTo("clubDetail");
}

// Partite future per le squadre della società (entro 60 giorni)
async function renderMatches(societaId) {
  const wrap = document.getElementById("matchesList");
  wrap.innerHTML = `<p class="path">Carico partite…</p>`;

  const { data: squads, error: e1 } = await supabase
    .from("squadre")
    .select("id,nome")
    .eq("societa_id", societaId);

  if (e1) {
    console.error(e1);
    wrap.innerHTML = `<p class="path">Errore nel caricare le squadre.</p>`;
    return;
  }
  if (!squads || !squads.length) {
    wrap.innerHTML = `<p class="path">Nessuna squadra registrata.</p>`;
    return;
  }

  const ids = squads.map(s => s.id);
  const nameById = Object.fromEntries(squads.map(s => [s.id, s.nome]));

  const now = new Date();
  const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // +60 giorni

  const { data: matches, error: e2 } = await supabase
    .from("partite")
    .select("id,data,luogo,squadra1_id,squadra2_id")
    .gte("data", now.toISOString())
    .lte("data", end.toISOString())
    .or(`squadra1_id.in.(${ids.join(",")}),squadra2_id.in.(${ids.join(",")})`)
    .order("data", { ascending: true })
    .limit(8);

  if (e2) {
    console.error(e2);
    wrap.innerHTML = `<p class="path">Errore nel caricare le partite.</p>`;
    return;
  }

  if (!matches || !matches.length) {
    wrap.innerHTML = `<p class="path">Nessuna partita in programma.</p>`;
    return;
  }

  wrap.innerHTML = "";
  matches.forEach(m => {
    const d = new Date(m.data);
    const vs = `${nameById[m.squadra1_id] || "—"} vs ${nameById[m.squadra2_id] || "—"}`;
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div><b>${vs}</b></div>
      <div>${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} — ${m.luogo || ""}</div>
    `;
    wrap.appendChild(row);
  });
}

// Sponsor attivi (dal <= oggi <= al OR al null)
async function renderSponsors(societaId) {
  const wrap = document.getElementById("sponsorList");
  wrap.innerHTML = `<span class="badge">Carico sponsor…</span>`;

  const today = new Date().toISOString();

  const { data: links, error: e1 } = await supabase
    .from("sponsorizzazioni")
    .select("sponsor_id,dal,al")
    .eq("societa_id", societaId)
    .lte("dal", today)
    .or(`al.is.null,al.gte.${today}`);

  if (e1) {
    console.error(e1);
    wrap.innerHTML = `<span class="badge">Errore nel caricare le sponsorizzazioni</span>`;
    return;
  }
  if (!links || !links.length) {
    wrap.innerHTML = `<span class="badge">Nessuno sponsor attivo</span>`;
    return;
  }

  const ids = links.map(l => l.sponsor_id);
  const { data: sponsors, error: e2 } = await supabase
    .from("sponsors")
    .select("id,nome,logo_url,sito")
    .in("id", ids);

  if (e2) {
    console.error(e2);
    wrap.innerHTML = `<span class="badge">Errore nel caricare gli sponsor</span>`;
    return;
  }

  wrap.innerHTML = "";
  sponsors.forEach(sp => {
    const a = document.createElement("a");
    a.className = "badge";
    a.href = sp.sito || "#";
    a.target = "_blank"; a.rel = "noopener";
    a.textContent = sp.nome;
    wrap.appendChild(a);
  });
}

/* =========================
   BACK BUTTONS
========================= */
document.getElementById("backFromRegioni").onclick = () => goTo("home");
document.getElementById("backFromGenere").onclick = () => goTo("regioni");
document.getElementById("backFromClubs").onclick = () => goTo("genere");
document.getElementById("backFromDetail").onclick = () => goTo("clubs");

/* =========================
   AVVIO
========================= */
document.addEventListener("DOMContentLoaded", () => {
  renderSports();   // sport da Supabase
  // regioni caricate quando si entra nella schermata regioni
});

// === PREMATCH • FRONTEND APP (GitHub Pages + Supabase) ===
// Connessione a Supabase (usa i tuoi dati)
const SUPABASE_URL = "https://hzzhypahrzclvfepstro.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6emh5cGFocnpjbHZmZXBzdHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDAxNDUsImV4cCI6MjA3MTAxNjE0NX0.7niKgLcuDKQZQZxkQfxMYzz9fPT4Mm5wzWeq6r87TIY";

// crea il client
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- utility DOM ---
const $ = (sel) => document.querySelector(sel);
const show = (id) => {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
};

// --- stato semplice ---
const state = {
  sports: [],
  currentSport: null,
  clubs: [],
  currentClub: null,
};

// --- HOME: carica sport e disegna le card con immagini ---
async function loadSports() {
  const grid = $("#sportsGrid");
  grid.innerHTML = `<div class="card">Caricamento…</div>`;

  const { data, error } = await db
    .from("sports")
    .select("id, nome")
    .order("nome", { ascending: true });

  if (error) {
    console.error(error);
    grid.innerHTML = `<div class="card">Errore caricamento sport</div>`;
    return;
  }

  state.sports = data || [];

  // mappa nome sport -> immagine
  const sportImg = {
    "Calcio": "images/calcio.jpg",
    "Futsal": "images/futsal.jpg",
    "Basket": "images/basket.jpg",
    "Volley": "images/volley.jpg",
    "Pallanuoto": "images/pallanuoto.jpg",
    "Rugby": "images/rugby.jpg",
    "Beach Volley": "images/beachvolley.jpg",
  };

  grid.innerHTML = "";
  if (!state.sports.length) {
    grid.innerHTML = `<div class="card">Nessuno sport configurato</div>`;
    return;
  }

  state.sports.forEach((sp) => {
    const card = document.createElement("div");
    card.className = "sportCard";
    card.innerHTML = `
      <img class="sportImg" src="${sportImg[sp.nome] || "images/calcio.jpg"}" alt="${sp.nome}">
      <div class="sportName">${sp.nome}</div>
    `;
    card.onclick = () => openSport(sp);
    grid.appendChild(card);
  });
}

// --- LISTA SOCIETÀ di uno sport ---
async function openSport(sp) {
  state.currentSport = sp;
  $("#clubsTitle").textContent = `Società • ${sp.nome}`;
  show("#clubs");

  const list = $("#clubsList");
  list.innerHTML = `<div class="card">Caricamento società…</div>`;

  const { data, error } = await db
    .from("societa")
    .select("id, nome, citta")
    .eq("sport_id", sp.id)
    .order("nome", { ascending: true });

  if (error) {
    console.error(error);
    list.innerHTML = `<div class="card">Errore nel caricamento delle società</div>`;
    return;
  }

  state.clubs = data || [];
  list.innerHTML = "";

  if (!state.clubs.length) {
    list.innerHTML = `<div class="card meta">Nessuna società per questo sport.</div>`;
    return;
  }

  state.clubs.forEach((c) => {
    const row = document.createElement("div");
    row.className = "card row";
    row.innerHTML = `
      <div>
        <div style="font-weight:600">${c.nome}</div>
        <div class="meta">${c.citta ? c.citta : ""}</div>
      </div>
      <span class="pill">profilo</span>
    `;
    row.onclick = () => openClub(c);
    list.appendChild(row);
  });
}

// --- DETTAGLIO SOCIETÀ: sponsor + prossime partite ---
async function openClub(club) {
  state.currentClub = club;
  $("#clubName").textContent = club.nome;
  $("#clubMeta").innerHTML = club.citta ? `<div class="meta">Città: ${club.citta}</div>` : "";
  show("#clubDetail");

  // Sponsor della società
  const sponsorUL = $("#sponsorList");
  sponsorUL.innerHTML = `<li class="meta">Caricamento sponsor…</li>`;

  const { data: spz, error: errSpz } = await db
    .from("sponsorizzazioni")
    .select("sponsors (nome)")
    .eq("societa_id", club.id);

  sponsorUL.innerHTML = "";
  if (errSpz) {
    console.error(errSpz);
    sponsorUL.innerHTML = `<li class="meta">Errore sponsor</li>`;
  } else if (!spz || !spz.length) {
    sponsorUL.innerHTML = `<li class="meta">Nessuno sponsor</li>`;
  } else {
    spz.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s.sponsors?.nome ?? "Sponsor";
      sponsorUL.appendChild(li);
    });
  }

  // Partite in cui compare la società (da oggi in avanti)
  const list = $("#matchesList");
  list.innerHTML = `<div class="card">Caricamento partite…</div>`;

  const { data: matches, error: errMat } = await db
    .from("partite")
    .select(
      `
      id, data, luogo,
      squadra1:squadra1_id ( id, nome, societa:id ( nome ) ),
      squadra2:squadra2_id ( id, nome, societa:id ( nome ) )
    `
    )
    .gte("data", new Date().toISOString())
    .order("data", { ascending: true });

  if (errMat) {
    console.error(errMat);
    list.innerHTML = `<div class="card meta">Errore nel caricamento delle partite</div>`;
    return;
  }

  // Filtra partite dove la società corrente è squadra1 o squadra2
  const filtered = (matches || []).filter(
    (m) =>
      m.squadra1?.societa?.nome === club.nome ||
      m.squadra2?.societa?.nome === club.nome
  );

  list.innerHTML = "";
  if (!filtered.length) {
    list.innerHTML = `<div class="card meta">Nessuna partita in programma</div>`;
    return;
  }

  filtered.forEach((m) => {
    const when = new Date(m.data).toLocaleString();
    const badge = `<span class="pill badge-ok">PREMATCH CONFERMATO</span>`; // segnaposto per ora
    const r = document.createElement("div");
    r.className = "card";
    r.innerHTML = `
      <div class="row">
        <div>
          <div style="font-weight:600">${m.squadra1?.societa?.nome} vs ${m.squadra2?.societa?.nome}</div>
          <div class="meta">${when} — ${m.luogo ?? "TBD"}</div>
        </div>
        ${badge}
      </div>
    `;
    list.appendChild(r);
  });
}

// --- back buttons ---
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".back");
  if (!btn) return;
  const to = btn.getAttribute("data-go");
  if (to === "home") show("#home");
  if (to === "clubs") show("#clubs");
});

// --- avvio ---
document.addEventListener("DOMContentLoaded", () => {
  // Se la tua home ha le sezioni come nel mio index.html esteso:
  // - #home con #sportsGrid
  // - #clubs
  // - #clubDetail
  // allora carico gli sport all'avvio
  if (document.querySelector("#sportsGrid")) {
    loadSports();
  }
});

// ==== CONFIG SUPABASE ====
const SUPABASE_URL = "https://hzzhypahrzclvfepstro.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6emh5cGFocnpjbHZmZXBzdHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDAxNDUsImV4cCI6MjA3MTAxNjE0NX0.7niKgLcuDKQZQZxkQfxMYzz9fPT4Mm5wzWeq6r87TIY";
const supa = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Stato di navigazione
const state = {
  sport: null,         // { id, nome }
  regione: null,       // { id, nome }
  genere: null,        // 'M' | 'F'
  societa: null        // { id, nome }
};

// Utilità UI
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function goBack() {
  if (document.getElementById("club").classList.contains("active")) show("societa");
  else if (document.getElementById("societa").classList.contains("active")) show("genere");
  else if (document.getElementById("genere").classList.contains("active")) show("regioni");
  else if (document.getElementById("regioni").classList.contains("active")) show("home");
  else show("home");
}

// ====== FETCH ======
async function fetchSports() {
  const { data, error } = await supa.from("sports").select("id,nome").order("nome");
  if (error) throw error;
  return data;
}
async function fetchRegioniBySport(sportId) {
  // tutte le regioni che hanno almeno una società per lo sport scelto
  const { data, error } = await supa
    .from("societa")
    .select("regione_id, regioni:nome, regioni!inner(id,nome)")
    .eq("sport_id", sportId)
    .not("regione_id", "is", null);
  if (error) throw error;

  // uniq per regione
  const map = new Map();
  data.forEach(r => { map.set(r.regioni.id, r.regioni.nome); });
  return Array.from(map, ([id, nome]) => ({ id, nome }));
}
async function fetchSocieta(sportId, regioneId, genere) {
  const { data, error } = await supa
    .from("societa")
    .select("id,nome")
    .eq("sport_id", sportId)
    .eq("regione_id", regioneId)
    .or(`genere.eq.${genere},genere.is.null`) // se non usi colonna 'genere', questa condizione è innocua
    .order("nome");
  if (error) throw error;
  return data;
}
async function fetchMatchesBySocieta(societaId) {
  // prossime partite, ordinati per data
  const { data, error } = await supa
    .from("partite")
    .select("id,data,luogo, squadre1:nome, squadre2:nome, squadra1_id, squadra2_id")
    .or(`squadra1_id.eq.${societaId},squadra2_id.eq.${societaId}`)
    .gte("data", new Date().toISOString())
    .order("data", { ascending: true })
    .limit(10);
  if (error) throw error;
  return data;
}
async function fetchSponsorsBySocieta(societaId) {
  // sponsor legati alla società via tabella 'sponsorizzazioni'
  const { data, error } = await supa
    .from("sponsorizzazioni")
    .select("sponsors!inner(id,nome,logo_url)")
    .eq("societa_id", societaId);
  if (error) throw error;
  // normalizza
  return (data || []).map(r => r.sponsors);
}

// ====== RENDER ======
async function renderSports() {
  try {
    const grid = document.getElementById("sportsGrid");
    grid.innerHTML = "";
    const sports = await fetchSports();
    sports.forEach(s => {
      const card = document.createElement("button");
      card.className = "card";
      card.innerHTML = `
        <img src="images/${s.nome.toLowerCase().replace(' ', '')}.jpg" alt="${s.nome}" />
        <div class="card-title">${s.nome}</div>`;
      card.onclick = async () => {
        state.sport = s;
        await renderRegioni();
        show("regioni");
      };
      grid.appendChild(card);
    });
  } catch (e) { console.error(e); }
}
async function renderRegioni() {
  const grid = document.getElementById("regioniGrid");
  grid.innerHTML = "";
  const items = await fetchRegioniBySport(state.sport.id);
  items.forEach(r => {
    const b = document.createElement("button");
    b.className = "card";
    b.innerHTML = `<div class="card-title">${r.nome}</div>`;
    b.onclick = () => { state.regione = r; show("genere"); };
    grid.appendChild(b);
  });
}
function selectGenere(g) {
  state.genere = g;
  renderSocieta();
  show("societa");
}
async function renderSocieta() {
  const list = document.getElementById("societaList");
  list.innerHTML = "";
  const clubs = await fetchSocieta(state.sport.id, state.regione.id, state.genere);
  clubs.forEach(c => {
    const row = document.createElement("button");
    row.className = "list-item";
    row.textContent = c.nome;
    row.onclick = async () => {
      state.societa = c;
      await renderClub();
      show("club");
    };
    list.appendChild(row);
  });
}
async function renderClub() {
  document.getElementById("clubTitle").textContent = state.societa.nome;

  // partite
  const matchesWrap = document.getElementById("matchesList");
  matchesWrap.innerHTML = "";
  const matches = await fetchMatchesBySocieta(state.societa.id);
  if (!matches.length) {
    matchesWrap.innerHTML = `<div class="empty">Nessuna partita in programma</div>`;
  } else {
    matches.forEach(m => {
      const d = new Date(m.data);
      const card = document.createElement("div");
      card.className = "mini-card";
      card.innerHTML = `
        <div class="mini-title">${d.toLocaleDateString()} ${d.toLocaleTimeString().slice(0,5)}</div>
        <div class="mini-sub">${m.squadre1 || 'Squadra A'} vs ${m.squadre2 || 'Squadra B'}</div>
        <div class="mini-meta">${m.luogo || ''}</div>`;
      matchesWrap.appendChild(card);
    });
  }

  // sponsor (solo quelli della società!)
  const sponsorStrip = document.getElementById("sponsorStrip");
  sponsorStrip.innerHTML = "";
  const sponsors = await fetchSponsorsBySocieta(state.societa.id);
  if (!sponsors.length) {
    sponsorStrip.innerHTML = `<div class="empty small">Nessuno sponsor</div>`;
  } else {
    sponsors.forEach(sp => {
      const a = document.createElement("div");
      a.className = "sponsor-badge";
      a.innerHTML = sp.logo_url
        ? `<img src="${sp.logo_url}" alt="${sp.nome}" />`
        : `<span>${sp.nome}</span>`;
      sponsorStrip.appendChild(a);
    });
  }
}

// Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  if (!supa) {
    console.error("Supabase client non disponibile");
    return;
  }
  renderSports();
});

// === CONFIG SUPABASE (tuoi dati) ===
const SUPABASE_URL  = "https://hzzhypahrzclvfepstro.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6emh5cGFocnpjbHZmZXBzdHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDAxNDUsImV4cCI6MjA3MTAxNjE0NX0.7niKgLcuDKQZQZxkQfxMYzz9fPT4Mm5wzWeq6r87TIY";

// Supabase client (vanilla fetch)
async function sbSelect(table, columns="*", opts={}) {
  const params = new URLSearchParams({ select: columns });
  if (opts.order) params.append("order", `${opts.order.col}.${opts.order.asc?'asc':'desc'}`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      "apikey": SUPABASE_ANON,
      "Authorization": `Bearer ${SUPABASE_ANON}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// Stato selezioni
const state = {
  sport: null,
  regione: null,
  genere: null,
  campionato: null,
};

// mapping immagini sport (devono esistere in /images/)
const sportImages = {
  "Calcio": "images/calcio.jpg",
  "Futsal": "images/futsal.jpg",
  "Basket": "images/basket.jpg",
  "Rugby": "images/rugby.jpg",
  "Volley": "images/volley.jpg",
  "Beach Volley": "images/beachvolley.jpg",
  "Pallanuoto": "images/pallanuoto.jpg",
};

// campionati placeholder [sport][genere] -> array
const CAMPIONATI = {
  "Calcio": {
    "Maschile": ["Serie A", "Serie B", "Serie C"],
    "Femminile": ["Serie A Femminile", "Serie B Femminile"]
  },
  "Futsal": {
    "Maschile": ["Serie A Futsal", "Serie A2 Futsal"],
    "Femminile": ["Serie A Femminile Futsal"]
  },
  "Basket": {
    "Maschile": ["Serie A", "Serie A2"],
    "Femminile": ["Serie A1 Femminile"]
  },
  "Rugby": {
    "Maschile": ["Top10", "Serie A"],
    "Femminile": ["Serie A Femminile"]
  },
  "Volley": {
    "Maschile": ["SuperLega", "A2"],
    "Femminile": ["Serie A1", "A2"]
  },
  "Beach Volley": {
    "Maschile": ["Campionato Nazionale"],
    "Femminile": ["Campionato Nazionale"]
  },
  "Pallanuoto": {
    "Maschile": ["Serie A1", "A2"],
    "Femminile": ["A1 Femminile"]
  }
};

// Helpers UI
function showStep(id) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.querySelector(id).classList.add('active');
}

// RENDER SPORT
async function renderSports() {
  const grid = document.getElementById('sport-grid');
  grid.innerHTML = '';

  let sports = await sbSelect('sports', 'id,nome,posizione', { order:{col:'posizione',asc:true} });
  // fallback: se non c'è "posizione"
  sports = sports.sort((a,b)=> (a.posizione||999) - (b.posizione||999));

  for (const s of sports) {
    const card = document.createElement('div');
    card.className = 'card button';
    card.innerHTML = `
      <img class="cover" src="${sportImages[s.nome] || 'images/calcio.jpg'}" alt="${s.nome}">
      <div class="body"><div class="title">${s.nome}</div></div>`;
    card.onclick = () => {
      state.sport = s.nome;
      renderRegioni(); // next
      showStep('#step-regione');
    };
    grid.appendChild(card);
  }
}

// RENDER REGIONI
async function renderRegioni() {
  const grid = document.getElementById('regioni-grid');
  grid.innerHTML = '';
  const regioni = await sbSelect('regioni','id,nome',{ order:{col:'nome',asc:true}});
  regioni.forEach(r=>{
    const card = document.createElement('div');
    card.className = 'card button';
    card.innerHTML = `<div class="body"><div class="title">${r.nome}</div></div>`;
    card.onclick = ()=>{
      state.regione = r.nome;
      showStep('#step-genere');
    };
    grid.appendChild(card);
  });
}

// GENERE
function hookGenere() {
  document.querySelectorAll('#step-genere .pill').forEach(btn=>{
    btn.onclick = ()=>{
      document.querySelectorAll('#step-genere .pill').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state.genere = btn.dataset.genere;
      renderCampionati();
      showStep('#step-campionato');
    };
  });
}

// CAMPIONATI
function renderCampionati() {
  const list = document.getElementById('campionati-list');
  list.innerHTML = '';
  const arr = (CAMPIONATI[state.sport] && CAMPIONATI[state.sport][state.genere]) || [];
  arr.forEach(nome=>{
    const it = document.createElement('div');
    it.className = 'item';
    it.textContent = nome;
    it.onclick = ()=>{
      list.querySelectorAll('.item').forEach(x=>x.classList.remove('active'));
      it.classList.add('active');
      state.campionato = nome;
      // prepara riepilogo
      const rie = document.getElementById('riepilogo');
      rie.textContent = `Sport: ${state.sport} • Regione: ${state.regione} • Genere: ${state.genere} • Campionato: ${state.campionato}`;
      showStep('#step-cta');
    };
    list.appendChild(it);
  });
}

// NAV BACK
function hookBack() {
  document.getElementById('back-to-sport').onclick = ()=> showStep('#step-sport');
  document.getElementById('back-to-regione').onclick = ()=> showStep('#step-regione');
  document.getElementById('back-to-genere').onclick = ()=> showStep('#step-genere');
  document.getElementById('back-to-campionato').onclick = ()=> showStep('#step-campionato');
}

// CTA
function hookCTA() {
  document.getElementById('avvia-prematch').onclick = ()=>{
    alert(`Avvio PreMatch\n\nSport: ${state.sport}\nRegione: ${state.regione}\nGenere: ${state.genere}\nCampionato: ${state.campionato}\n\nProssimo step: cerca società avversaria.`);
    // Qui poi apriremo la schermata “Cerca Società” filtrata sul campionato selezionato.
  };
}

// BOOT
(async function init(){
  hookBack();
  hookGenere();
  hookCTA();
  await renderSports();
})();

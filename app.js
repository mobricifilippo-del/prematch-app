// ------------------------------
// Stato globale
// ------------------------------
const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
  societaSelezionata: null,
};

// Piccolo helper per cambio vista
function goTo(id, push = true) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('is-active'));
  document.getElementById(id).classList.add('is-active');
  if (push) history.pushState({ view: id }, '', location.pathname + '#' + id);
}

// Router indietro
window.addEventListener('popstate', (e) => {
  const id = (e.state && e.state.view) || 'view-home';
  document.querySelectorAll('.view').forEach(v => v.classList.remove('is-active'));
  document.getElementById(id).classList.add('is-active');
});

// Header: logo sempre Home
document.getElementById('go-home').addEventListener('click', (e) => {
  e.preventDefault();
  resetFiltri();
  goTo('view-home');
});

// Back
document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => history.back());
});

// Effetto “accensione” breve
function flashActive(el) {
  el.classList.add('is-active');
  setTimeout(() => el.classList.remove('is-active'), 160);
}

// ------------------------------
// Dati minimi di esempio
// ------------------------------
const CAMPIONATI = {
  Calcio: ['Eccellenza', 'Promozione', 'Juniores'],
  Futsal: ['Serie A', 'Serie B'],
  Basket: ['Serie C'],
  Volley: ['Serie C'],
  Rugby: ['Serie B'],
  Pallanuoto: ['Serie A2']
};

const SOCIETA = [
  {
    id: 'roma-nord',
    nome: 'ASD Roma Nord',
    sport: 'Calcio',
    genere: 'Femminile',
    regione: 'Lazio',
    campionato: 'Eccellenza',
    logo: 'https://placehold.co/200x200/1a1f24/9ee7bf?text=PM',
    meta: 'Eccellenza • Femminile • Lazio'
  },
  {
    id: 'virtus-marino',
    nome: 'Virtus Marino',
    sport: 'Calcio',
    genere: 'Femminile',
    regione: 'Lazio',
    campionato: 'Eccellenza',
    logo: 'https://placehold.co/200x200/1a1f24/9ee7bf?text=VM',
    meta: 'Eccellenza • Femminile • Lazio'
  }
];

// ------------------------------
// HOME → click Sport
// ------------------------------
document.querySelectorAll('.card-sport').forEach(card => {
  card.addEventListener('click', () => {
    flashActive(card);
    state.sport = (card.dataset.sport || '').toLowerCase();
    // Normalizzo la chiave per CAMPIONATI
    const sportKey = card.querySelector('p')?.textContent.trim() || 'Calcio';
    state.sportLabel = sportKey;

    // reset filtri
    resetFiltri(false);
    // abilito Regione solo dopo genere
    document.getElementById('box-regione').setAttribute('disabled','');
    document.getElementById('box-campionato').setAttribute('disabled','');

    goTo('view-filtri');
  }, { passive: true });
});

// ------------------------------
// FILTRI
// ------------------------------
const rowGenere = document.getElementById('row-genere');
const boxRegione = document.getElementById('box-regione');
const boxCampionato = document.getElementById('box-campionato');
const rowCampionati = document.getElementById('row-campionati');
const crumb = document.getElementById('filtri-breadcrumb');
const listaSocieta = document.getElementById('lista-societa');

// 1) Genere
rowGenere.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-genere]');
  if (!btn) return;
  flashActive(btn);
  state.genere = btn.dataset.genere;

  // abilita regione e apri
  boxRegione.removeAttribute('disabled');
  boxRegione.open = true;

  // chiudi campionato e lista
  boxCampionato.setAttribute('disabled','');
  boxCampionato.open = false;
  listaSocieta.innerHTML = '';
  updateCrumb();
});

// 2) Regione
boxRegione.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-regione]');
  if (!btn) return;
  flashActive(btn);
  state.regione = btn.dataset.regione;

  // genera campionati in base allo sport scelto
  const arr = CAMPIONATI[state.sportLabel] || [];
  rowCampionati.innerHTML = arr.map(c => `<button class="chip" data-campionato="${c}">${c}</button>`).join('');

  // abilita campionato e apri
  boxCampionato.removeAttribute('disabled');
  boxCampionato.open = true;
  listaSocieta.innerHTML = '';
  updateCrumb();
});

// 3) Campionato
boxCampionato.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-campionato]');
  if (!btn) return;
  flashActive(btn);
  state.campionato = btn.dataset.campionato;
  updateCrumb();

  // mostra società
  renderSocieta();
});

// Render breadcrumb
function updateCrumb() {
  const parts = [];
  if (state.sportLabel) parts.push(state.sportLabel);
  if (state.genere) parts.push(state.genere);
  if (state.regione) parts.push(state.regione);
  if (state.campionato) parts.push(state.campionato);
  crumb.textContent = parts.join(' • ');
}

// Render lista società
function renderSocieta() {
  const res = SOCIETA.filter(s =>
    s.sport.toLowerCase() === state.sportLabel?.toLowerCase() &&
    (!state.genere || s.genere === state.genere) &&
    (!state.regione || s.regione === state.regione) &&
    (!state.campionato || s.campionato === state.campionato)
  );

  if (!res.length) {
    listaSocieta.innerHTML = `<p class="meta">Nessuna società trovata per i filtri selezionati.</p>`;
    return;
  }

  listaSocieta.innerHTML = res.map(s => `
    <a class="card-club" href="#" data-club="${s.id}">
      <div class="club-left">
        <img class="club-logo-sm" src="${s.logo}" alt="${s.nome}" />
        <div>
          <div class="club-name">${s.nome}</div>
          <div class="meta">${s.meta}</div>
        </div>
      </div>
      <div class="badge">PM</div>
    </a>
  `).join('');
}

// Click su società
listaSocieta.addEventListener('click', (e) => {
  const a = e.target.closest('[data-club]');
  if (!a) return;
  e.preventDefault();
  flashActive(a);

  const id = a.dataset.club;
  const club = SOCIETA.find(x => x.id === id);
  if (!club) return;

  state.societaSelezionata = club;

  document.getElementById('club-logo').src = club.logo;
  document.getElementById('club-nome').textContent = club.nome;
  document.getElementById('club-meta').textContent = club.meta;

  goTo('view-societa');
});

// ------------------------------
// Utils
// ------------------------------
function resetFiltri(resetSportAlso = true) {
  if (resetSportAlso) {
    state.sport = null; state.sportLabel = null;
  }
  state.genere = null; state.regione = null; state.campionato = null;
  crumb.textContent = '';
  listaSocieta.innerHTML = '';
  // chiudi/azzera box
  boxRegione.open = false; boxCampionato.open = false;
}

// Logo white fallback se qualcosa non carica
const brandLogo = document.getElementById('brandLogo');
brandLogo.addEventListener('error', () => {
  brandLogo.style.background = '#ffffff';
});

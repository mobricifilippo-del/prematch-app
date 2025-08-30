/* -------------------------
   STATO APP
--------------------------*/
const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
  societaSelezionata: null
};

/* -------------------------
   DATI DI ESEMPIO (estendibili)
--------------------------*/
const DATA = [
  // Calcio • Femminile • Lazio • Eccellenza
  { id: 'roma-nord',   nome: 'ASD Roma Nord',   sport: 'calcio', genere: 'femminile', regione: 'Lazio', campionato: 'Eccellenza', sigla: 'RN' },
  { id: 'virtus-marino', nome: 'Virtus Marino', sport: 'calcio', genere: 'femminile', regione: 'Lazio', campionato: 'Eccellenza', sigla: 'VM' },

  // Altri esempi (sicuri, non mostrati finché non filtrati)
  { id: 'milano-fc',   nome: 'Milano FC',       sport: 'calcio', genere: 'maschile',  regione: 'Lombardia', campionato: 'Promozione', sigla: 'MI' },
  { id: 'catania-futsal', nome: 'Catania Futsal', sport: 'futsal', genere: 'maschile',  regione: 'Sicilia', campionato: 'Juniores', sigla: 'CT' },
];

/* -------------------------
   UTILS
--------------------------*/
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function showSection(idToShow){
  ['home','filtri','societa-list','societa-detail'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    if(id === idToShow) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });
}

function resetActive(container, selector){
  $$(selector, container).forEach(el => el.classList.remove('active','is-active'));
}

/* -------------------------
   HEADER LINKS (inerti)
--------------------------*/
$('#brandHome')?.addEventListener('click', (e)=>{
  e.preventDefault();
  // reset stato minimo solo per tornare a Home
  state.sport = state.genere = state.regione = state.campionato = null;
  resetActive(document, '.chip');
  resetActive(document, '#sportGrid', '.card-sport');
  showSection('home');
});

$('#loginLink')?.addEventListener('click', e => e.preventDefault());
$('#signupLink')?.addEventListener('click', e => e.preventDefault());
$('#coachBtn')?.addEventListener('click', e => e.preventDefault());

/* -------------------------
   SPORT CLICK
--------------------------*/
const sportGrid = $('#sportGrid');
sportGrid?.addEventListener('click', (e)=>{
  const btn = e.target.closest('.card-sport');
  if(!btn) return;

  // attiva visualmente la card
  $$('.card-sport').forEach(c => c.classList.remove('is-active'));
  btn.classList.add('is-active');

  state.sport = btn.dataset.sport || null;

  // vai ai filtri
  showSection('filtri');
});

/* -------------------------
   FILTRI: GENERE / REGIONE / CAMPIONATO
--------------------------*/
const genereChips = $('#genereChips');
genereChips?.addEventListener('click', (e)=>{
  const chip = e.target.closest('.chip[data-genere]');
  if(!chip) return;
  resetActive(genereChips, '.chip');
  chip.classList.add('active');
  state.genere = chip.dataset.genere;
});

const regioneChips = $('#regioneChips');
regioneChips?.addEventListener('click', (e)=>{
  const chip = e.target.closest('.chip[data-regione]');
  if(!chip) return;
  resetActive(regioneChips, '.chip');
  chip.classList.add('active');
  state.regione = chip.dataset.regione;
});

const campionatoChips = $('#campionatoChips');
campionatoChips?.addEventListener('click', (e)=>{
  const chip = e.target.closest('.chip[data-campionato]');
  if(!chip) return;
  resetActive(campionatoChips, '.chip');
  chip.classList.add('active');
  state.campionato = chip.dataset.campionato;

  // quando scelgo il campionato → genera elenco società e cambia pagina
  renderSocietaList();
  showSection('societa-list');
});

/* -------------------------
   BACK BUTTONS
--------------------------*/
$$('.back-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const to = btn.dataset.back;
    if(to === 'home') {
      showSection('home');
      return;
    }
    if(to === 'filtri') {
      showSection('filtri');
      return;
    }
    if(to === 'societa-list') {
      showSection('societa-list');
      return;
    }
  })
});

/* -------------------------
   RENDER LISTA SOCIETÀ
--------------------------*/
function renderSocietaList(){
  const { sport, genere, regione, campionato } = state;
  const container = $('#societaContainer');
  if(!container) return;

  // breadcrumb
  $('#breadcrumb').textContent =
    `${cap(sport)} • ${cap(genere)} • ${regione || '-'} • ${campionato || '-'}`;

  // filtra
  const items = DATA
    .filter(x =>
      (!sport || x.sport===sport) &&
      (!genere || x.genere===genere) &&
      (!regione || x.regione===regione) &&
      (!campionato || x.campionato===campionato)
    )
    .sort((a,b)=>a.nome.localeCompare(b.nome,'it'));

  // svuota e riempi
  container.innerHTML = '';
  if(items.length === 0){
    container.innerHTML = `<div class="empty">Nessuna società trovata.</div>`;
    return;
  }

  items.forEach(item=>{
    const el = document.createElement('button');
    el.className = 'team-card';
    el.setAttribute('data-id', item.id);
    el.innerHTML = `
      <div class="team-left">
        <div class="badge-round">${(item.sigla||'PM').slice(0,2).toUpperCase()}</div>
        <div>
          <div class="team-name">${item.nome}</div>
          <div class="team-meta">${item.campionato} • ${item.genere} • ${item.regione}</div>
        </div>
      </div>
      <div class="badge-right">PM</div>
    `;
    el.addEventListener('click', ()=>{
      state.societaSelezionata = item;
      renderSocietaDetail();
      showSection('societa-detail');
    });
    container.appendChild(el);
  });
}

function cap(v){
  if(!v) return '';
  return v.charAt(0).toUpperCase() + v.slice(1);
}

/* -------------------------
   DETTAGLIO SOCIETÀ
--------------------------*/
function renderSocietaDetail(){
  const box = $('#societaCard');
  const s = state.societaSelezionata;
  if(!box || !s) return;

  box.innerHTML = `
    <div class="societa-header">
      <div class="societa-left">
        <div class="logo-round">${(s.sigla||'PM').slice(0,2).toUpperCase()}</div>
        <div>
          <div class="societa-name">${s.nome}</div>
          <div class="societa-tags">${s.campionato} • ${s.genere} • ${s.regione}</div>
        </div>
      </div>
      <div class="badge-right">PM</div>
    </div>
  `;
}

/* -------------------------
   AVVIO
--------------------------*/
showSection('home'); // assicurati di partire dalla Home

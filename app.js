/* ============ UTIL ============ */
const qs  = (s, el=document)=>el.querySelector(s);
const qsa = (s, el=document)=>[...el.querySelectorAll(s)];
const byId = id => document.getElementById(id);

const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
  club: null
};

/* ============ DATA (demo) ============ */
const REGIONI = ["Lazio", "Lombardia", "Sicilia", "Piemonte", "Veneto", "Emilia-Romagna"];

const CAMPIONATI = {
  Lazio: ["Eccellenza","Promozione"],
  Lombardia: ["Eccellenza"],
  Sicilia: ["Eccellenza"],
  Piemonte: ["Eccellenza"],
  Veneto: ["Eccellenza"],
  "Emilia-Romagna": ["Eccellenza"]
};

// Demo club
const CLUBS = [
  { id:"roma-nord",  nome:"ASD Roma Nord",  sport:"calcio", genere:"femminile", regione:"Lazio", campionato:"Eccellenza" },
  { id:"virtus-marino", nome:"Virtus Marino", sport:"calcio", genere:"femminile", regione:"Lazio", campionato:"Eccellenza" },
];

/* ============ NAV ============ */
function show(viewId){
  qsa('.view').forEach(v=>v.classList.add('hidden'));
  byId(viewId).classList.remove('hidden');
  window.scrollTo({top:0, behavior:"instant"});
}

function goTo(viewId, payload = {}){
  Object.assign(state, payload);
  switch(viewId){
    case 'view-genere':
      renderGenere();
      break;
    case 'view-societa':
      renderSocieta();
      break;
    case 'view-scheda':
      renderScheda();
      break;
  }
  show(viewId);
}

/* ============ RENDER: GENERE + TENDINE ============ */
function renderGenere(){
  // reset scelte successive
  state.genere = state.genere ?? null;
  state.regione = null;
  state.campionato = null;

  // attiva/disattiva chip genere
  qsa('#chips-genere .chip').forEach(ch => {
    ch.classList.toggle('active', ch.dataset.genere === state.genere);
  });

  // popola Regioni
  const regBox = byId('reg-list'); regBox.innerHTML = '';
  REGIONI.forEach(r => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = r;
    b.addEventListener('click', () => {
      state.regione = r;
      // attiva selezione visiva
      qsa('#reg-list .chip').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');

      // abilita campionati per regione scelta
      buildCampionati();
    });
    regBox.appendChild(b);
  });

  // abilita dettagli regione
  const ddReg = byId('dd-regione');
  ddReg.disabled = false;
  ddReg.open = true;

  // svuota/lock campionato
  const ddCamp = byId('dd-campionato');
  byId('camp-list').innerHTML = '';
  ddCamp.disabled = true;
  ddCamp.open = false;
}

function buildCampionati(){
  const ddCamp = byId('dd-campionato');
  const box = byId('camp-list');
  box.innerHTML = '';

  const arr = CAMPIONATI[state.regione] || [];
  arr.forEach(c => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = c;
    b.addEventListener('click', () => {
      qsa('#camp-list .chip').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      state.campionato = c;
      // tutte le scelte fatte -> vai alla lista società
      goTo('view-societa');
    });
    box.appendChild(b);
  });

  ddCamp.disabled = false;
  ddCamp.open = true;
}

/* ============ RENDER: LISTA SOCIETÀ ============ */
function renderSocieta(){
  const title = [
    capitalize(state.sport),
    '•',
    capitalize(state.genere),
    '•',
    state.regione,
    '•',
    state.campionato
  ].join(' ');
  byId('societatitle').textContent = title;

  const list = byId('societa-list');
  list.innerHTML = '';

  const results = CLUBS.filter(c =>
    c.sport===state.sport &&
    c.genere===state.genere &&
    c.regione===state.regione &&
    c.campionato===state.campionato
  );

  results.forEach(c => {
    const item = document.createElement('button');
    item.className = 'card-club';
    item.innerHTML = `
      <div class="club-logo-sm" aria-hidden="true"></div>
      <div class="flex">
        <h3>${c.nome}</h3>
        <div class="meta">${c.campionato} • ${capitalize(c.genere)} • ${c.regione}</div>
      </div>
      <div class="btn btn-primary">PreMatch</div>
    `;
    item.addEventListener('click', ()=>{
      state.club = c;
      goTo('view-scheda');
    });
    list.appendChild(item);
  });
}

/* ============ RENDER: SCHEDA SOCIETÀ ============ */
function renderScheda(){
  const c = state.club;
  if(!c){ goTo('view-societa'); return; }

  byId('club-name').textContent = c.nome;
  byId('club-meta').textContent = `${c.campionato} • ${capitalize(c.genere)} • ${c.regione}`;
  // logo è un cerchio “PM” (come placeholder estetico)
  byId('club-logo').textContent = '';

  byId('btn-pm').onclick = () => {
    alert('PreMatch creato (demo)');
  };
}

/* ============ HOME: click sport ============ */
function bindSportClicks(){
  qsa('.card-sport').forEach(card=>{
    card.addEventListener('click', ()=>{
      qsa('.card-sport').forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');

      setTimeout(()=>{
        goTo('view-genere', { sport: card.dataset.sport });
      }, 130);
    }, {passive:true});
  });
}

/* ============ EVENTI GLOBALI ============ */
function bindGlobal(){
  // brand click -> home
  qsa('[data-nav="home"], .brand').forEach(el=>{
    el.addEventListener('click', (e)=>{ e.preventDefault(); show('view-home'); });
  });

  // back
  qsa('[data-back]').forEach(b=>{
    b.addEventListener('click', ()=>{
      // semplice: torna sempre alla vista precedente logica
      if(!state.genere) { show('view-home'); return; }
      if(byId('view-scheda').classList.contains('hidden')===false){
        show('view-societa'); return;
      }
      show('view-home');
    });
  });

  // scelta genere
  qsa('#chips-genere .chip').forEach(ch=>{
    ch.addEventListener('click', ()=>{
      qsa('#chips-genere .chip').forEach(x=>x.classList.remove('active'));
      ch.classList.add('active');
      state.genere = ch.dataset.genere;
      // quando scelgo il genere, abilito subito la sezione Regioni
      renderGenere();
    });
  });
}

/* ============ HELPERS ============ */
function capitalize(s){ return (s??'').charAt(0).toUpperCase() + (s??'').slice(1); }

/* ============ BOOT ============ */
document.addEventListener('DOMContentLoaded', ()=>{
  bindSportClicks();
  bindGlobal();
  show('view-home');
});

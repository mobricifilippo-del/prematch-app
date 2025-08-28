/* ======= MINI ROUTER ======= */
const views = {
  home: document.getElementById('view-home'),
  filtri: document.getElementById('view-filtri'),
  societa: document.getElementById('view-societa'),
};
let STATE = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
};

function goTo(which) {
  Object.values(views).forEach(v => v.classList.remove('is-active'));
  if (views[which]) views[which].classList.add('is-active');
  // scroll top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ======= DATI DEMO (adatta liberamente) ======= */
const CAMPIONATI = {
  calcio:   ['Eccellenza','Promozione','Prima Categoria'],
  futsal:   ['A2 Élite','C1','C2'],
  basket:   ['C Gold','C Silver'],
  volley:   ['Serie C','Serie D'],
  rugby:    ['Serie B','Serie C'],
  pallanuoto:['Serie B','Serie C']
};

const SOCIETA = [
  // sport, genere, regione, campionato, nome, logo
  ['calcio','femminile','Lazio','Eccellenza','ASD Roma Nord','images/logo-sample-roma-nord.png'],
  ['calcio','femminile','Lazio','Eccellenza','Virtus Marino','images/logo-sample-virtus-marino.png'],
  ['futsal','maschile','Lombardia','C1','Futsal Milano','images/logo-sample-generic.png'],
];

/* ======= NAVBAR ======= */
document.querySelector('[data-nav="home"]')?.addEventListener('click', (e)=>{
  e.preventDefault();
  goTo('home');
});

/* ======= HOME: Scelta Sport ======= */
document.querySelectorAll('.card-sport').forEach(card=>{
  card.addEventListener('click', ()=> {
    const sport = card.dataset.sport;
    STATE = { sport, genere:null, regione:null, campionato:null };
    card.classList.add('selected');
    setTimeout(()=> {
      // reset selezioni pagina filtri
      document.querySelectorAll('[data-genere]').forEach(c=>c.classList.remove('chip--active'));
      document.getElementById('box-regione').classList.add('box--hidden');
      document.getElementById('box-campionato').classList.add('box--hidden');
      document.getElementById('select-regione').value = '';
      document.getElementById('select-campionato').innerHTML = `<option value="" selected>Scegli…</option>`;
      goTo('filtri');
      setTimeout(()=>card.classList.remove('selected'),140);
    }, 120);
  }, {passive:true});
});

/* ======= FILTRI ======= */
// Indietro a home
document.querySelector('#view-filtri [data-back="home"]')
  .addEventListener('click', ()=> goTo('home'));

// Scegli Genere → mostra Regione
document.querySelectorAll('[data-genere]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('[data-genere]').forEach(b=>b.classList.remove('chip--active'));
    btn.classList.add('chip--active');
    STATE.genere = btn.dataset.genere;
    document.getElementById('box-regione').classList.remove('box--hidden');
  });
});

// Regione → mostra Campionato con lista in base allo sport selezionato
document.getElementById('select-regione').addEventListener('change', (e)=>{
  STATE.regione = e.target.value || null;

  const selCamp = document.getElementById('select-campionato');
  selCamp.innerHTML = `<option value="" selected>Scegli…</option>`;

  if (!STATE.sport) return;

  (CAMPIONATI[STATE.sport] || []).forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    selCamp.appendChild(opt);
  });

  document.getElementById('box-campionato').classList.remove('box--hidden');
});

// Campionato → vai alla pagina Società
document.getElementById('select-campionato').addEventListener('change',(e)=>{
  const val = e.target.value;
  if (!val) return;
  STATE.campionato = val;
  renderSocieta();
  goTo('societa');
});

/* ======= SOCIETÀ ======= */
document.querySelector('#view-societa [data-back="filtri"]')
  .addEventListener('click', ()=> goTo('filtri'));

function renderSocieta(){
  const title = document.getElementById('soc-title');
  title.textContent = `${cap(STATE.sport)} • ${cap(STATE.genere)} • ${STATE.regione} • ${STATE.campionato}`;

  const box = document.getElementById('soc-list');
  box.innerHTML = '';

  const results = SOCIETA.filter(s =>
    s[0]===STATE.sport &&
    s[1]===STATE.genere &&
    s[2]===STATE.regione &&
    s[3]===STATE.campionato
  );

  if (!results.length){
    const empty = document.createElement('div');
    empty.className = 'soc-item';
    empty.innerHTML = `<div class="soc-body">
        <div class="soc-name">Nessuna società registrata</div>
        <div class="soc-meta">Appena si iscrivono compariranno qui.</div>
      </div>`;
    box.appendChild(empty);
    return;
  }

  results.forEach(([sport,genere,regione,campionato,nome,logo])=>{
    const el = document.createElement('div');
    el.className = 'soc-item';
    el.innerHTML = `
      <div class="badge"><img src="${logo}" alt="${nome}" onerror="this.src='images/logo-sample-generic.png'"/></div>
      <div class="soc-body">
        <div class="soc-name">${nome}</div>
        <div class="soc-meta">${campionato} • ${cap(genere)} • ${regione}</div>
      </div>
      <div class="pm-wrap">
        <button class="pm-btn" data-pm="${nome}">PM</button>
        <div class="pm-label">PreMatch</div>
      </div>`;
    box.appendChild(el);
  });

  // azione PM
  box.querySelectorAll('[data-pm]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      // qui aprirai la convocazione / generazione PDF ecc.
      alert(`PreMatch per ${btn.dataset.pm}`);
    });
  });
}

function cap(s){ return !s ? '' : s[0].toUpperCase()+s.slice(1); }

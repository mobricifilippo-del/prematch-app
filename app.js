// ----------------------------
// DATI DI ESEMPIO (società)
// sport, genere, regione, campionato, nome, logo
const SOCIETA = [
  ["Calcio","Femminile","Lazio","Eccellenza","ASD Roma Nord","images/roma-nord.png"],
  ["Calcio","Femminile","Lazio","Eccellenza","Virtus Marino","images/virtus-marino.png"],
  // Aggiungi altri se vuoi
];

// stato UI
const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
  societaSelezionata: null,
};

// util
const $ = sel => document.querySelector(sel);
const goTo = (name) => {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));
  const id = name.startsWith('view-') ? name : `view-${name}`;
  const el = document.getElementById(id);
  if (el) el.classList.add('view--active');
  window.scrollTo({top:0, behavior:"instant"});
};
const cap = s => s ? (s[0].toUpperCase()+s.slice(1).toLowerCase()) : s;

// NAV
document.querySelectorAll('[data-nav="home"]').forEach(n => n.addEventListener('click', e => {
  e.preventDefault();
  goTo('home');
}));

// BACK
document.querySelectorAll('[data-back]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const to = btn.getAttribute('data-back');
    goTo(to);
  });
});

// HOME: click sport
document.querySelectorAll('.card-sport').forEach(card=>{
  card.addEventListener('click', () => {
    const sport = card.dataset.sport;
    state.sport = sport;
    // micro feedback
    card.classList.add('selected');
    setTimeout(()=> card.classList.remove('selected'), 150);

    // aggiorno titolo filtri e reset
    $('#filters-title').textContent = sport;
    resetFiltersKeepSport();
    goTo('filters');
  }, {passive:true});
});

function resetFiltersKeepSport(){
  state.genere = state.regione = state.campionato = null;
  const g = $('#sel-genere');
  const r = $('#sel-regione');
  const c = $('#sel-campionato');
  g.value = ""; r.value = ""; c.value = "";
  r.disabled = true; c.disabled = true;
  $('#btn-cerca').disabled = true;
}

// FILTRI: logica tendine + auto enable
$('#sel-genere').addEventListener('change', (e)=>{
  state.genere = e.target.value;
  $('#sel-regione').disabled = !state.genere;
  tryEnableSearch();
});

$('#sel-regione').addEventListener('change', (e)=>{
  state.regione = e.target.value;
  $('#sel-campionato').disabled = !state.regione;
  tryEnableSearch();
});

$('#sel-campionato').addEventListener('change', (e)=>{
  state.campionato = e.target.value;
  tryEnableSearch();
});

function tryEnableSearch(){
  const ok = state.genere && state.regione && state.campionato;
  $('#btn-cerca').disabled = !ok;
  if (ok) {
    // vai diretto all’elenco senza far premere un altro bottone? Se vuoi:
    // renderSocieta(); goTo('societa');
  }
}

$('#btn-cerca').addEventListener('click', ()=>{
  renderSocieta();
  goTo('societa');
});

// RENDER LISTA SOCIETÀ
function renderSocieta(){
  const box = $('#soc-list');
  box.innerHTML = "";

  // breadcrumb
  $('#societa-breadcrumb').textContent = `${state.sport} • ${state.genere} • ${state.regione} • ${state.campionato}`;

  const results = SOCIETA.filter(row =>
    row[0] === state.sport &&
    row[1] === state.genere &&
    row[2] === state.regione &&
    row[3] === state.campionato
  );

  if (results.length === 0){
    const empty = document.createElement('p');
    empty.className = 'lead';
    empty.textContent = "Nessuna società trovata.";
    box.appendChild(empty);
    return;
  }

  results.forEach(([sport,genere,regione,campionato,nome,logo])=>{
    const el = document.createElement('div');
    el.className = 'soc-item';
    el.innerHTML = `
      <div class="badge"><img src="${logo}" alt="${nome}" onerror="this.style.display='none';this.parentNode.classList.add('badge--empty');"/></div>
      <div class="soc-body">
        <div class="soc-name">${nome}</div>
        <div class="soc-meta">${campionato} • ${cap(genere)} • ${regione}</div>
      </div>
      <div class="pm-wrap">
        <button class="pm-btn" data-pm="${nome}">PM</button>
        <div class="pm-label">PreMatch</div>
      </div>`;

    // open detail on name/body click
    el.querySelector('.soc-body').addEventListener('click', ()=>{
      showSocietaDetail(nome,logo,`${campionato} • ${cap(genere)} • ${regione}`);
    });

    // PM button demo
    el.querySelector('.pm-btn').addEventListener('click', ()=>{
      // qui potrai aprire direttamente la convocazione; per ora vai al dettaglio
      showSocietaDetail(nome,logo,`${campionato} • ${cap(genere)} • ${regione}`);
    });

    box.appendChild(el);
  });
}

// DETTAGLIO SOCIETÀ
function showSocietaDetail(nome,logo,meta){
  state.societaSelezionata = nome;
  $('#detail-name').textContent = nome;
  const img = $('#detail-logo');
  img.style.display = 'block';
  img.src = logo || '';
  img.onerror = function(){
    this.style.display = 'none';
    this.parentNode.classList.add('badge--empty');
  };
  $('#detail-meta').textContent = meta;
  goTo('societa-detail');
}

// PM dal dettaglio (demo)
$('#btn-pm-detail').addEventListener('click', ()=>{
  alert(`PreMatch creato (demo) per ${state.societaSelezionata || 'società'}.`);
});

// NAV placeholder
document.querySelectorAll('[data-nav]').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const dest = btn.getAttribute('data-nav');
    if (dest === 'home'){ goTo('home'); }
    else alert(`${dest} (demo)`);
  });
});

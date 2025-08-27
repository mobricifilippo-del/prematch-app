/* Stato semplice del wizard */
const state = {
  sport: null,
  gender: null,
  region: null,
  league: null,
};

const pages = {
  home: document.getElementById('home'),
  gender: document.getElementById('gender'),
  regions: document.getElementById('regions'),
  leagues: document.getElementById('leagues'),
  clubs: document.getElementById('clubs'),
};

function show(id){
  Object.values(pages).forEach(p => p.classList.add('hidden'));
  pages[id].classList.remove('hidden');
  window.scrollTo({top:0, behavior:'instant'});
}

/* ---- FEEDBACK TAP + NAV da HOME ---- */
document.querySelectorAll('.sport-card').forEach(card => {
  const press = () => {
    card.classList.add('pressed');
    setTimeout(() => card.classList.remove('pressed'), 180);
  };
  card.addEventListener('touchstart', press, {passive:true});
  card.addEventListener('mousedown', press);

  card.addEventListener('click', () => {
    state.sport = card.dataset.sport;
    show('gender');
  });
});

/* ---- GENERE ---- */
document.querySelectorAll('#gender [data-gender]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.gender = btn.dataset.gender;
    show('regions');
  });
});

/* ---- BACK (funzione unica) ---- */
document.querySelectorAll('[data-action="back"]').forEach(b=>{
  b.addEventListener('click', ()=>{
    if(!pages.leagues.classList.contains('hidden')){
      show('regions'); state.league=null; return;
    }
    if(!pages.regions.classList.contains('hidden')){
      show('gender'); state.region=null; return;
    }
    if(!pages.gender.classList.contains('hidden')){
      show('home'); state.gender=null; state.sport=null; return;
    }
    if(!pages.clubs.classList.contains('hidden')){
      show('leagues'); return;
    }
  });
});

/* ---- REGIONI → CAMPIONATI ---- */
document.querySelectorAll('.region').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.region = btn.textContent.trim();
    // popola i campionati in base allo sport scelto (esempi)
    const perSport = {
      calcio: ['Eccellenza', 'Promozione', 'Prima Categoria'],
      futsal: ['A2', 'B', 'C1', 'C2'],
      basket: ['Serie C', 'Promozione'],
      volley: ['Serie C', 'Serie D'],
      rugby: ['Serie B', 'Serie C'],
      pallanuoto: ['Serie B', 'Serie C'],
    };
    const leagues = perSport[state.sport] || ['Eccellenza'];

    const wrap = document.querySelector('.leagues-table');
    wrap.innerHTML = '';
    leagues.forEach(name=>{
      const b = document.createElement('button');
      b.className = 'btn league';
      b.textContent = name;
      b.addEventListener('click', ()=>{
        state.league = name;
        // (in futuro qui potremmo filtrare le società per regione/lega)
        show('clubs');
      });
      wrap.appendChild(b);
    });

    show('leagues');
  });
});

/* Safe default: mostra Home all’avvio */
show('home');

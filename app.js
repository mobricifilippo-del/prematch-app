// helper: cambia vista
function show(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  window.scrollTo({top:0,behavior:'instant'});
}

// stato scelto
const state = { sport:null, genere:null, regione:null, campionato:null, club:null };

//// HOME -> GENERE
document.querySelectorAll('.card.sport').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.sport = btn.dataset.sport;
    show('view-genere');
  }, {passive:true});
});

// GENERE -> FILTRI
document.querySelectorAll('#view-genere .chip').forEach(ch=>{
  ch.addEventListener('click', ()=>{
    state.genere = ch.dataset.genere;
    show('view-filtri');
  }, {passive:true});
});

// Abilita "Avanti" solo quando entrambi selezionati
const selReg = document.getElementById('sel-regione');
const selCamp = document.getElementById('sel-camp');
const goSoc  = document.getElementById('go-societa');
function toggleGo(){
  goSoc.disabled = !(selReg.value && selCamp.value);
}
selReg.addEventListener('change', ()=>{ state.regione = selReg.value; toggleGo(); }, {passive:true});
selCamp.addEventListener('change', ()=>{ state.campionato = selCamp.value; toggleGo(); }, {passive:true});

// FILTRI -> SOCIETÀ
goSoc.addEventListener('click', ()=> show('view-societa'));

// SOCIETÀ -> PAGINA CLUB
document.querySelectorAll('.club').forEach(c=>{
  c.addEventListener('click', ()=>{
    state.club = c.dataset.club;
    // Popola pagina club
    document.getElementById('club-name').textContent = state.club;
    const meta = `${state.campionato} • ${state.genere} • ${state.regione}`;
    document.getElementById('club-meta').textContent = meta;

    const img = c.querySelector('img').getAttribute('src');
    const clubLogo = document.getElementById('club-logo');
    clubLogo.src = img;
    clubLogo.alt = `Logo ${state.club}`;

    show('view-club');
  }, {passive:true});
});

// NAV "Indietro"
document.querySelectorAll('[data-back]').forEach(b=>{
  b.addEventListener('click', ()=> show(b.dataset.back));
});

// Pulsante PreMatch (placeholder)
document.getElementById('btn-prematch').addEventListener('click', ()=>{
  alert(`PreMatch creato per ${state.club}\n${state.campionato} • ${state.genere} • ${state.regione}`);
});
// Gestione click sulle card sport
document.querySelectorAll('.card-sport').forEach(card => {
  card.addEventListener('click', () => {
    // Aggiunge effetto visivo
    card.classList.add('selected');

    // Dopo 120ms passa allo step successivo (GENERE)
    setTimeout(() => {
      goTo('view-genere', { sport: card.dataset.sport });
    }, 120);
  }, { passive: true });
});

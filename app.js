// Stato globale
const AppState = { sport:null, genere:null, regione:null, campionato:null };

// Utility: cambio vista
function goTo(id, stateDelta={}){
  Object.assign(AppState, stateDelta);
  document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// HOME: click sport
function bindSportCards(){
  document.querySelectorAll('.card-sport').forEach(card=>{
    card.addEventListener('click', ()=>{
      document.querySelectorAll('.card-sport').forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');
      setTimeout(()=> goTo('view-genere', { sport: card.dataset.sport }), 120);
    }, { passive:true });
  });
}

// GENERE → REGIONE → CAMPIONATO
function initFiltroStep(){
  const btnMaschile = document.getElementById('btn-maschile');
  const btnFemminile = document.getElementById('btn-femminile');
  const boxRegione = document.getElementById('box-regione');
  const boxCampionato = document.getElementById('box-campionato');

  const regioneBtns = boxRegione.querySelectorAll('.pill');
  const campBtns    = boxCampionato.querySelectorAll('.pill');

  // Reset selezioni quando entri nella view
  const resetStep = ()=>{
    [btnMaschile, btnFemminile].forEach(b=>b.classList.remove('selected'));
    regioneBtns.forEach(b=>b.classList.remove('selected'));
    campBtns.forEach(b=>b.classList.remove('selected'));
    boxRegione.classList.add('disabled');
    boxCampionato.classList.add('disabled');
  };

  // Mostra “Genere” all’apertura view
  const observer = new MutationObserver(()=>{
    if(!document.getElementById('view-genere').classList.contains('hidden')){
      resetStep();
      // se il genere era già scelto, evidenzialo
      if(AppState.genere === 'Maschile') btnMaschile.classList.add('selected');
      if(AppState.genere === 'Femminile') btnFemminile.classList.add('selected');
      if(AppState.genere) boxRegione.classList.remove('disabled');
    }
  });
  observer.observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']});

  // GENERE
  [btnMaschile, btnFemminile].forEach(btn=>{
    btn.addEventListener('click', ()=>{
      [btnMaschile, btnFemminile].forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      AppState.genere = btn.textContent.trim();
      boxRegione.classList.remove('disabled');
    });
  });

  // REGIONE
  regioneBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      regioneBtns.forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      AppState.regione = btn.dataset.value || btn.textContent.trim();
      boxCampionato.classList.remove('disabled');
    });
  });

  // CAMPIONATO
  campBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      campBtns.forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      AppState.campionato = btn.dataset.value || btn.textContent.trim();
      renderSocietaList();         // crea la lista
      goTo('view-societa');        // mostra la lista
    });
  });

  // back
  document.getElementById('btn-back').addEventListener('click', ()=> goTo('view-home'));
}

// LISTA SOCIETÀ (mock/demo)
function renderSocietaList(){
  const title = document.getElementById('societa-title');
  title.textContent = `${AppState.sport} • ${AppState.genere} • ${AppState.regione} • ${AppState.campionato}`;

  const list = document.getElementById('societa-list');
  list.innerHTML = '';

  // Demo: due società
  const data = [
    { name:'ASD Roma Nord',   comp:'Eccellenza', regione:'Lazio' },
    { name:'Virtus Marino',   comp:'Eccellenza', regione:'Lazio' }
  ];

  data.forEach(club=>{
    const card = document.createElement('div'); card.className='card-soc';
    card.innerHTML = `
      <div class="soc-left">
        <div class="soc-logo">PM</div>
        <div>
          <div class="soc-name">${club.name}</div>
          <div class="badge">${club.comp} • ${AppState.genere} • ${club.regione}</div>
        </div>
      </div>
      <button class="btn-pm">PM</button>
    `;
    card.addEventListener('click', ()=> {
      // qui in futuro apri la pagina società
      alert('Apri pagina società: '+club.name);
    }, { passive:true });

    list.appendChild(card);
  });

  document.getElementById('btn-back-soc').onclick = ()=> goTo('view-genere');
}

// Brand click → Home
function bindBrand(){
  const brand = document.getElementById('brand-link');
  brand.addEventListener('click', (e)=>{ e.preventDefault(); goTo('view-home'); }, { passive:false });
}

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  bindBrand();
  bindSportCards();
  initFiltroStep();
});

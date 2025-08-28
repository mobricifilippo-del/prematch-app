/* ================== DATI DEMO ================== */
const REGIONI = ["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"];
const CAMPIONATI = {
  Lazio: ["Eccellenza","Promozione"],
  Lombardia: ["Eccellenza","Promozione"],
  Sicilia: ["Eccellenza"],
  Piemonte: ["Eccellenza"],
  Veneto: ["Eccellenza"],
  "Emilia-Romagna": ["Eccellenza"]
};
const SOCIETA = {
  Lazio: {
    Eccellenza: [
      {
        id:"roma-nord",
        nome:"ASD Roma Nord",
        meta:"Eccellenza • Femminile • Lazio",
        // lascia vuoto: useremo il fallback PM tondo
        logo:""
      }
    ]
  }
};

const state = {
  sport:null,
  genere:null,
  regione:null,
  campionato:null,
  societa:null
};

/* =============== HELPERS VISTE ================== */
function show(viewId){
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById(viewId).classList.remove('hidden');
}

function fillChips(containerId, items, onClick){
  const box = document.getElementById(containerId);
  box.innerHTML = "";
  items.forEach(label=>{
    const b = document.createElement('button');
    b.className = 'chip chip--soft';
    b.textContent = label;
    b.addEventListener('click', ()=> onClick(label), {passive:true});
    box.appendChild(b);
  });
}

/* =============== NAVBAR BRAND ================== */
(function ensureBrand(){
  const logo = document.getElementById('brandLogo');
  // se il file esiste si vede, altrimenti manteniamo comunque lo spazio del brand
  if(logo){
    logo.addEventListener('error', ()=>{ logo.style.display = 'none'; });
    logo.addEventListener('load',  ()=>{ logo.style.display = 'block'; });
  }
  document.getElementById('nav-home').addEventListener('click', (e)=>{
    e.preventDefault();
    state.sport = state.genere = state.regione = state.campionato = state.societa = null;
    show('view-sport');
    window.scrollTo({top:0,behavior:'instant'});
  }, {passive:false});
})();

/* =============== HOME: CARDS SPORT ============== */
function bindSportCards(){
  document.querySelectorAll('.card-sport').forEach(card=>{
    card.addEventListener('click', ()=>{
      const chosen = card.dataset.sport;
      state.sport = chosen;
      card.classList.add('selected');
      setTimeout(()=>{
        openGenere();
      }, 120);
    }, {passive:true});
  });
}

/* =============== VIEW: GENERE =================== */
function openGenere(){
  show('view-genere');
}
document.getElementById('back-from-genere').addEventListener('click', ()=>{
  state.genere = null;
  show('view-sport');
}, {passive:true});

document.querySelectorAll('#view-genere .chip[data-genere]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.genere = btn.dataset.genere;
    // dopo il genere → regioni
    openRegioni();
  }, {passive:true});
});

/* =============== VIEW: REGIONI ================== */
function openRegioni(){
  fillChips('regioni-list', REGIONI, (reg)=>{
    state.regione = reg;
    openCampionati();
  });
  show('view-regioni');
}
document.getElementById('back-from-regioni').addEventListener('click', ()=>{
  state.regione = null;
  openGenere();
}, {passive:true});

/* ============== VIEW: CAMPIONATI ================ */
function openCampionati(){
  const items = CAMPIONATI[state.regione] || [];
  fillChips('campionati-list', items, (camp)=>{
    state.campionato = camp;
    openSocieta();
  });
  show('view-campionati');
}
document.getElementById('back-from-campionati').addEventListener('click', ()=>{
  state.campionato = null;
  openRegioni();
}, {passive:true});

/* =============== VIEW: SOCIETÀ ================== */
function openSocieta(){
  // prendo la prima società demo
  const item = (((SOCIETA[state.regione]||{})[state.campionato])||[])[0];

  state.societa = item || {
    id:"demo", nome:"Società", meta:`${state.campionato} • ${state.genere} • ${state.regione}`, logo:""
  };

  const soc = state.societa;

  // titolo e meta
  document.getElementById('societa-title').textContent = soc.nome;
  document.getElementById('club-meta').textContent   = soc.meta;

  // avatar tondo con fallback
  const img = document.getElementById('club-logo');
  const fb  = document.getElementById('club-fallback');

  if(soc.logo && soc.logo.trim()!==''){
    img.src = soc.logo;
    img.style.display = 'block';
    fb.classList.add('hidden');
  }else{
    img.removeAttribute('src');
    img.style.display = 'none';
    fb.classList.remove('hidden');
  }

  // bottone PM (FUNZIONA)
  const btn = document.getElementById('btn-create-pm');
  btn.replaceWith(btn.cloneNode(true)); // rimuove vecchi listener se rientri
  const fresh = document.getElementById('btn-create-pm');
  fresh.addEventListener('click', ()=>{
    openCreatePreMatch();
  }, {passive:true});

  show('view-societa');
}
document.getElementById('back-from-societa').addEventListener('click', ()=>{
  state.societa = null;
  openCampionati();
}, {passive:true});

/* ======== VIEW: CREA PREMATCH (DEMO) ============ */
function openCreatePreMatch(){
  show('view-createpm');
}
document.getElementById('back-from-createpm').addEventListener('click', ()=>{
  show('view-societa');
}, {passive:true});

/* ============== INIT ============== */
document.addEventListener('DOMContentLoaded', ()=>{
  bindSportCards();
  show('view-sport');
});

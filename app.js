// ------------ Stato ------------
const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
  history: ['view-home'],
  club: null,
};

// Dati di esempio per le società (puoi espandere)
const CLUBS = {
  'calcio|Femminile|Lazio|Eccellenza': [
    { id: 'roma-nord', nome: 'ASD Roma Nord', regione: 'Lazio', campionato: 'Eccellenza', genere: 'Femminile' },
    { id: 'virtus-marino', nome: 'Virtus Marino', regione: 'Lazio', campionato: 'Eccellenza', genere: 'Femminile' },
  ],
};

const REGIONI = ['Lazio','Lombardia','Sicilia','Piemonte','Veneto','Emilia-Romagna'];
const CAMPIONATI = ['Eccellenza','Promozione','Serie C'];

// ------------ Router ------------
function showView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  state.history.push(id);
}
function goTo(id){ showView(id); }
function goBackFromFilters(){
  // torna alla home e resetta filtri tranne sport
  state.genere = state.regione = state.campionato = null;
  showView('view-home');
}

// ------------ UI helpers ------------
function setPressed(el){
  el.classList.add('selected','active');
  setTimeout(()=>el.classList.remove('active'),150);
}
function setActivePill(btn, groupSelector){
  document.querySelectorAll(groupSelector+' .pill').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

// ------------ HOME: click sport ------------
function initSportCards(){
  document.querySelectorAll('.card-sport').forEach(card=>{
    card.addEventListener('click', ()=>{
      setPressed(card);
      state.sport = card.dataset.sport;
      // prepara filtri
      prepareFilters();
      setTimeout(()=>goTo('view-filter'),140);
    }, {passive:true});
  });
}

// ------------ FILTRI ------------
function prepareFilters(){
  // reset attivi
  document.querySelectorAll('#genderRow .pill').forEach(p=>p.classList.remove('active'));
  // abilita regione/campionato solo dopo genere
  document.getElementById('regioneBox').setAttribute('disabled','');
  document.getElementById('campionatoBox').setAttribute('disabled','');
  document.getElementById('regioniList').innerHTML = '';
  document.getElementById('campionatiList').innerHTML = '';
}

function initFilters(){
  // genere
  document.querySelectorAll('#genderRow .pill').forEach(btn=>{
    btn.addEventListener('click',()=>{
      setActivePill(btn,'#genderRow');
      state.genere = btn.dataset.gender;
      // popola regioni e apri tendina
      const list = document.getElementById('regioniList');
      list.innerHTML = '';
      REGIONI.forEach(r=>{
        const b = document.createElement('button');
        b.className = 'pill';
        b.textContent = r;
        b.addEventListener('click', ()=>{
          setActivePill(b, '#regioniList');
          state.regione = r;
          // abilita campionati
          const cBox = document.getElementById('campionatoBox');
          cBox.removeAttribute('disabled');
          const clist = document.getElementById('campionatiList');
          clist.innerHTML = '';
          CAMPIONATI.forEach(c=>{
            const bc = document.createElement('button');
            bc.className = 'pill';
            bc.textContent = c;
            bc.addEventListener('click', ()=>{
              setActivePill(bc, '#campionatiList');
              state.campionato = c;
              // vai alla lista società
              buildClubs();
              goTo('view-clubs');
            }, {passive:true});
            clist.appendChild(bc);
          });
          // apri campionati
          cBox.open = true;
        }, {passive:true});
        list.appendChild(b);
      });
      const rBox = document.getElementById('regioneBox');
      rBox.removeAttribute('disabled');
      rBox.open = true;
    }, {passive:true});
  });
}

// ------------ LISTA SOCIETÀ ------------
function buildClubs(){
  const key = `${state.sport}|${state.genere}|${state.regione}|${state.campionato}`;
  const items = CLUBS[key] || [];
  const cont = document.getElementById('clubsContainer');
  cont.innerHTML = '';

  document.getElementById('breadcrumb').textContent =
    `${capitalize(state.sport)} • ${state.genere} • ${state.regione} • ${state.campionato}`;

  items.forEach(club=>{
    const row = document.createElement('div');
    row.className = 'club-row';

    const logo = document.createElement('div');
    logo.className = 'club-logo';
    logo.innerHTML = '<span>PM</span>';

    const main = document.createElement('div');
    main.className = 'club-main';
    main.innerHTML = `<div class="name">${club.nome}</div>
                      <div class="meta">${club.campionato} • ${club.genere} • ${club.regione}</div>`;

    const pm = document.createElement('button');
    pm.className = 'pm-pill';
    pm.innerHTML = '<div>PM</div><small>PreMatch</small>';
    pm.addEventListener('click',(e)=>{
      e.stopPropagation();
      alert(`Crea PreMatch per ${club.nome}`);
    });

    row.appendChild(logo);
    row.appendChild(main);
    row.appendChild(pm);

    row.addEventListener('click', ()=>{
      state.club = club;
      openClub(club);
      goTo('view-club');
    });

    cont.appendChild(row);
  });
}

function openClub(club){
  document.getElementById('clubName').textContent = club.nome;
  document.getElementById('clubMeta').textContent = `${club.campionato} • ${club.genere} • ${club.regione}`;
  document.getElementById('pmCreate').onclick = ()=>alert(`Crea PreMatch per ${club.nome}`);
}

// ------------ Utils ------------
function capitalize(s){ return (s||'').charAt(0).toUpperCase()+s.slice(1); }

// ------------ Boot ------------
document.addEventListener('DOMContentLoaded', ()=>{
  initSportCards();
  initFilters();
});

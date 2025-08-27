/* ===========
   PREMATCH APP
   =========== */

// Stato semplice in memoria
const state = {
  sport: null,
  gender: null,
  region: null,
};

// Dati statici (immagini locali in /images)
const SPORTS = [
  { id:'calcio',  name:'Calcio',   img:'images/calcio.jpg' },
  { id:'futsal',  name:'Futsal',   img:'images/futsal.jpg' },
  { id:'basket',  name:'Basket',   img:'images/basket.jpg' },
  { id:'volley',  name:'Volley',   img:'images/volley.jpg' },
  { id:'rugby',   name:'Rugby',    img:'images/rugby.jpg' },
  { id:'palla',   name:'Pallanuoto', img:'images/pallanuoto.jpg' },
];

const REGIONS = ['Lazio','Lombardia','Sicilia','Piemonte','Veneto','Emilia-Romagna'];

// Società esempio per demo
const CLUBS = [
  {
    id:'roma-nord',
    name:'ASD Roma Nord',
    level:'Eccellenza',
    gender:'Femminile',
    region:'Lazio',
    logo:'images/club_roma_nord.png'
  },
  {
    id:'virtus-marino',
    name:'Virtus Marino',
    level:'Eccellenza',
    gender:'Femminile',
    region:'Lazio',
    logo:'images/club_virtus_marino.png'
  }
];

// Helpers
const $ = (sel,scope=document)=>scope.querySelector(sel);
const $$ = (sel,scope=document)=>[...scope.querySelectorAll(sel)];
const app = $('#app');

function mount(view){ app.innerHTML=''; app.appendChild(view); }

/* -------------- Viste -------------- */

// HOME: scelta sport
function ViewHome(){
  const el = document.createElement('div');
  el.innerHTML = `
    <h1>Scegli lo sport</h1>
    <p class="pm-sub">Seleziona per iniziare</p>
    <div class="grid">
      ${SPORTS.map(s => `
        <article class="card" data-id="${s.id}" tabindex="0" role="button" aria-label="${s.name}">
          <img src="${s.img}" alt="${s.name}"/>
          <div class="label">${s.name}</div>
        </article>
      `).join('')}
    </div>
  `;
  // click -> Genere
  $$('.card',el).forEach(c=>{
    c.addEventListener('click',()=>{
      state.sport = c.dataset.id;
      mount(ViewGender());
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });
  return el;
}

// GENERE + Regioni inline
function ViewGender(){
  const el = document.createElement('div');
  el.innerHTML = `
    <h1>Seleziona il genere</h1>
    <div class="choice-row">
      <button class="pill" data-g="Maschile">Maschile</button>
      <button class="pill" data-g="Femminile">Femminile</button>
      <button class="pill" id="back-home">Indietro</button>
    </div>
    <div id="regionWrap" class="region-box hidden">
      <div class="pm-sub">Scegli la regione</div>
      <div class="region-grid">
        ${REGIONS.map(r=>`<button class="region" data-r="${r}">${r}</button>`).join('')}
      </div>
    </div>
    <div id="clubsWrap" class="hidden">
      <div class="pm-sub" style="margin-top:12px">Società disponibili</div>
      <div class="club-list" id="clubList"></div>
    </div>
  `;

  // attiva gender + mostra regioni inline
  $$('.pill[data-g]',el).forEach(btn=>{
    btn.addEventListener('click',()=>{
      $$('.pill[data-g]',el).forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state.gender = btn.dataset.g;
      $('#regionWrap',el).classList.remove('hidden');
      $('#clubsWrap',el).classList.add('hidden');
    });
  });

  // region -> mostra club filtrati
  $$('.region',el).forEach(r=>{
    r.addEventListener('click',()=>{
      state.region = r.dataset.r;
      const list = $('#clubList',el);
      const filtered = CLUBS.filter(c=>c.region===state.region && c.gender===state.gender);
      list.innerHTML = filtered.map(c=>`
        <div class="club-item" data-id="${c.id}">
          <img src="${c.logo}" class="club-logo" alt="${c.name}"/>
          <div>
            <div style="font-weight:800">${c.name}</div>
            <div style="color:var(--muted)">${c.level} • ${c.gender} • ${c.region}</div>
          </div>
        </div>
      `).join('') || `<div class="pm-sub">Nessuna società trovata.</div>`;
      $('#clubsWrap',el).classList.remove('hidden');

      $$('.club-item',el).forEach(ci=>{
        ci.addEventListener('click',()=>{
          const club = CLUBS.find(x=>x.id===ci.dataset.id);
          mount(ViewClub(club));
          window.scrollTo({top:0,behavior:'smooth'});
        });
      });
    });
  });

  $('#back-home',el).addEventListener('click',()=>mount(ViewHome()));
  return el;
}

// Pagina Società
function ViewClub(club){
  const el = document.createElement('div');
  el.innerHTML = `
    <h1>${club.name}</h1>
    <p class="pm-sub">${club.level} • ${club.gender} • ${club.region}</p>

    <div class="club-hero">
      <div class="circle" aria-label="Logo società">
        <img src="${club.logo}" alt="${club.name}"/>
      </div>

      <button class="circle-btn" id="btn-prematch" aria-label="Crea PreMatch">
        Crea<br/>PreMatch
      </button>
    </div>

    <details class="acc">
      <summary>Informazioni</summary>
      <div class="acc-body">
        <p>Indirizzo, contatti e dettagli società. (Demo)</p>
      </div>
    </details>

    <div class="choice-row" style="margin-top:12px">
      <button class="pm-btn pm-btn-ghost" id="club-back">Indietro</button>
    </div>
  `;

  $('#club-back',el).addEventListener('click',()=>mount(ViewGender()));
  $('#btn-prematch',el).addEventListener('click',()=>alert('Finestra PreMatch (demo).\nInseriremo messaggio, colore maglia, data/ora, luogo, opzione amichevole, ecc.'));

  return el;
}

/* --------- NAV TOP (demo) ---------- */
$('#nav-coach')?.addEventListener('click',()=>alert('Area Allenatore (demo).'));
$('#nav-login')?.addEventListener('click',()=>alert('Login (demo).'));
$('#nav-register')?.addEventListener('click',()=>alert('Registrazione (demo).'));

/* BOOT */
mount(ViewHome());

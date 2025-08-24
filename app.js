// Stato selezioni
const state = { sport: null, region: null, gender: null };

// Utility
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

function show(id){
  // nasconde tutte le schermate e mostra solo quella richiesta
  $$('.screen').forEach(s => s.classList.add('hidden'));
  $(`#${id}`).classList.remove('hidden');
  window.scrollTo({ top:0, behavior:'smooth' });
}

// ====== SPORT ======
$$('.sport-card').forEach(card=>{
  card.addEventListener('click', ()=>{
    state.sport = card.dataset.sport;
    $('#selSportName').textContent = state.sport;
    buildRegions();
    show('regions');
  });
});

// ====== REGIONI ======
const REGIONS = [
  'Abruzzo','Basilicata','Calabria','Campania','Emilia-Romagna','Friuli-Venezia Giulia',
  'Lazio','Liguria','Lombardia','Marche','Molise','Piemonte',
  'Puglia','Sardegna','Sicilia','Toscana','Trentino-Alto Adige','Umbria','Veneto'
];

function buildRegions(){
  const box = $('#regionsGrid');
  box.innerHTML = '';
  REGIONS.forEach(name=>{
    const b = document.createElement('button');
    b.className = 'pill';
    b.textContent = name;
    b.addEventListener('click', ()=>{
      state.region = name;
      show('gender');
    });
    box.appendChild(b);
  });
}

// ====== GENERE ======
$$('#gender .pill').forEach(b=>{
  b.addEventListener('click', ()=>{
    state.gender = b.dataset.gender;
    updateSummary();
    buildClubs();
    show('clubs');
  });
});

// ====== SOCIETÀ ======
function updateSummary(){
  $('#sumSport').textContent  = state.sport ?? '-';
  $('#sumRegion').textContent = state.region ?? '-';
  $('#sumGender').textContent = state.gender ?? '-';
}

function buildClubs(){
  // Placeholder: sostituire con fetch a Supabase quando vuoi
  const sample = [
    `${state.sport} Club Roma`,
    `${state.sport} Club Milano`,
    `${state.sport} Club Torino`
  ];
  const ul = $('#clubList');
  ul.innerHTML = '';
  sample.forEach(name=>{
    const li = document.createElement('li');
    li.innerHTML = `<span>${name}</span>
                    <button data-club="${name}">Apri</button>`;
    li.querySelector('button').addEventListener('click', ()=>{
      // Qui potrai caricare partite e sponsor reali della società
      $('#nextMatches').textContent = `Prossime partite di ${name}…`;
      $('#sponsorBox').textContent  = `Sponsor di ${name} (se presenti)…`;
    });
    ul.appendChild(li);
  });
}

// ====== BACK ======
$$('.back').forEach(b=>{
  b.addEventListener('click', ()=>{
    const target = b.dataset.back;
    show(target);
  });
});

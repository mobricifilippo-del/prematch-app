/* ===== Stato ===== */
const state = { sport: null, region: null, gender: null };

/* ===== Utility schermi ===== */
function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
function goBackTo(id){
  if(id==='home'){ state.sport=null; state.region=null; state.gender=null; }
  else if(id==='regions'){ state.region=null; state.gender=null; }
  else if(id==='gender'){ state.gender=null; }
  renderPicked(); show(id);
}

/* ===== SPORT: versione sicura con onclick inline ===== */
function pickSport(s){
  state.sport = s;
  state.region = null;
  state.gender = null;
  renderPicked();
  renderRegions();
  show('regions');
}

/* (opzionale) listener automatici, non indispensabili ora */
function initSportClicks(){
  document.querySelectorAll('.sport-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      pickSport(card.getAttribute('data-sport'));
    });
  });
}

/* ===== Regioni ===== */
const IT_REGIONS = [
  'Abruzzo','Basilicata','Calabria','Campania','Emilia-Romagna',
  'Friuli-Venezia Giulia','Lazio','Liguria','Lombardia','Marche',
  'Molise','Piemonte','Puglia','Sardegna','Sicilia','Toscana',
  'Trentino-Alto Adige','Umbria','Valle d\'Aosta','Veneto'
];
function renderRegions(){
  const grid = document.getElementById('regions-grid');
  grid.innerHTML = '';
  IT_REGIONS.forEach(r=>{
    const btn = document.createElement('button');
    btn.className = 'btn'; btn.style.width='100%';
    btn.textContent = r;
    btn.onclick = ()=>{ state.region=r; state.gender=null; renderPicked(); show('gender'); };
    grid.appendChild(btn);
  });
}

/* ===== Genere ===== */
function pickGender(g){
  state.gender = g;
  renderPicked();
  renderClubs();
  show('clubs');
}

/* ===== Società (mock) ===== */
function renderClubs(){
  const ul = document.getElementById('clubs-list');
  ul.innerHTML = '';
  const base = `${state.sport} ${state.region.slice(0,3).toUpperCase()} ${state.gender[0]}`;
  const clubs = Array.from({length:6},(_,i)=>`${base} — Società ${i+1}`);
  clubs.forEach(name=>{
    const li = document.createElement('li');
    li.className='sport-card';
    li.style.listStyle='none';
    li.style.padding='14px 16px';
    li.textContent=name;
    li.onclick=()=>alert(`Pagina società:\n${name}`);
    ul.appendChild(li);
  });
}

/* ===== Riepilogo ===== */
function renderPicked(){
  const s=document.getElementById('picked-sport');
  const r=document.getElementById('picked-region');
  const g=document.getElementById('picked-gender');
  if(s) s.textContent = state.sport ? `Sport: ${state.sport}` : '';
  if(r) r.textContent = state.region ? `Regione: ${state.region}` : '';
  if(g) g.textContent = state.gender ? `Genere: ${state.gender}` : '';
}

/* start (facoltativo) */
document.addEventListener('DOMContentLoaded', initSportClicks);

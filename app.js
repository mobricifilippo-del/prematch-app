// Helper per asset su gh-pages in sottocartella
const BASE = (document.querySelector('meta[name="gh-base"]')?.content || '').replace(/\/?$/, '/');
const asset = (p) => `${BASE}${p}?v=5`;

// Carica tutte le immagini dichiarate con data-src
function loadImages(root = document) {
  root.querySelectorAll('img[data-src]').forEach(img => {
    const src = img.getAttribute('data-src');
    img.src = asset(src);
    img.onerror = () => { img.removeAttribute('data-src'); img.alt = img.alt || 'immagine'; };
  });
}
loadImages(document);

// Stato
const state = { sport:null, gender:null, region:null, league:null, club:null };

// Navigazione fra "screen"
const screens = [...document.querySelectorAll('.screen')];
function go(id){
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo({top:0, behavior:'instant'});
}

// HOME – click sport con glow visibile
document.querySelectorAll('.sport-card').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.sport = btn.dataset.sport;
    btn.classList.add('glow');
    setTimeout(()=>{ btn.classList.remove('glow'); go('gender'); }, 180); // luce ben visibile
  });
});

// GENERE
document.querySelectorAll('#gender .pill').forEach(p=>{
  p.addEventListener('click', ()=>{
    state.gender = p.dataset.gender;
    buildRegions();          // prepara la tabella regioni
    go('region');
  });
});

// REGIONE
const REGIONS = ['Lazio','Lombardia','Sicilia','Piemonte','Veneto','Emilia-Romagna'];
function buildRegions(){
  const wrap = document.getElementById('regionList');
  wrap.innerHTML = '';
  REGIONS.forEach(r=>{
    const row = document.createElement('button');
    row.className = 'row';
    row.innerHTML = `<span class="name">${r}</span><span class="chev">›</span>`;
    row.addEventListener('click', ()=>{ state.region = r; buildLeagues(); go('league'); });
    wrap.appendChild(row);
  });
}

// CAMPIONATI (mock)
function buildLeagues(){
  const wrap = document.getElementById('leagueList');
  wrap.innerHTML = '';
  const leagues = ['Eccellenza','Promozione','Prima Categoria'];
  leagues.forEach(l=>{
    const row = document.createElement('button');
    row.className = 'row';
    row.innerHTML = `<span class="name">${l}</span><span class="chev">›</span>`;
    row.addEventListener('click', ()=>{ state.league = l; buildClubs(); go('clubs'); });
    wrap.appendChild(row);
  });
}

// SOCIETÀ (mock) – due esempi
function buildClubs(){
  const wrap = document.getElementById('clubList');
  wrap.innerHTML = '';

  const clubs = [
    { id:'roma-nord', name:'ASD Roma Nord', meta:`${state.league} • ${state.gender==='F'?'Femminile':'Maschile'} • ${state.region}`, logo:'images/clubs/roma-nord.png' },
    { id:'virtus-marino', name:'Virtus Marino', meta:`${state.league} • ${state.gender==='F'?'Femminile':'Maschile'} • ${state.region}`, logo:'images/clubs/virtus-marino.png' }
  ];

  clubs.forEach(c=>{
    const card = document.createElement('button');
    card.className = 'club-card';
    card.innerHTML = `
      <img data-src="${c.logo}" alt="${c.name}" />
      <div>
        <h3 class="title">${c.name}</h3>
        <div class="meta">${c.meta}</div>
      </div>`;
    card.addEventListener('click', ()=>openClub(c));
    wrap.appendChild(card);
  });

  loadImages(wrap);
}

function openClub(c){
  state.club = c.id;
  document.getElementById('clubName').textContent = c.name;
  document.getElementById('clubMeta').textContent = c.meta;
  const logo = document.getElementById('clubLogo');
  logo.setAttribute('data-src', c.logo);
  loadImages(document.getElementById('clubPage'));
  go('clubPage');
}

// PREMATCH (apre solo un placeholder)
document.getElementById('btnPrematch').addEventListener('click', ()=>{
  alert('Finestra PreMatch: qui aggiungeremo messaggio all’avversario + conferma.');
});

// Tasto Indietro (presente in ogni screen tranne home)
document.querySelectorAll('[data-back]').forEach(b=>{
  b.addEventListener('click', ()=>{
    if (document.getElementById('clubPage').classList.contains('active')) return go('clubs');
    if (document.getElementById('clubs').classList.contains('active')) return go('league');
    if (document.getElementById('league').classList.contains('active')) return go('region');
    if (document.getElementById('region').classList.contains('active')) return go('gender');
    if (document.getElementById('gender').classList.contains('active')) return go('home');
  });
});

// Coach (placeholder)
document.getElementById('btnCoach').addEventListener('click', ()=>{
  alert('Allenatore: inserisci codice e vai alla convocazione.');
});

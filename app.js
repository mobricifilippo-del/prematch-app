/* ====== DATI DEMO ====== */

/* Sport + cover */
const SPORTS = [
  { id: "calcio",      name: "Calcio",      img: "images/calcio.jpg" },
  { id: "futsal",      name: "Futsal",      img: "images/futsal.jpg" },
  { id: "basket",      name: "Basket",      img: "images/basket.jpg" },
  { id: "rugby",       name: "Rugby",       img: "images/rugby.jpg" },
  { id: "volley",      name: "Volley",      img: "images/volley.jpg" },
  { id: "beachvolley", name: "Beach Volley",img: "images/beachvolley.jpg" },
  { id: "pallanuoto",  name: "Pallanuoto",  img: "images/pallanuoto.jpg" }
];

const REGIONS = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna",
  "Friuli-Venezia Giulia","Lazio","Liguria","Lombardia","Marche",
  "Molise","Piemonte","Puglia","Sardegna","Sicilia",
  "Toscana","Trentino-Alto Adige","Umbria","Valle d'Aosta","Veneto"
];

const LEAGUES = {
  calcio: [
    "Serie A","Serie B","Eccellenza","Promozione","Scuola Calcio"
  ],
  futsal: ["Serie A","Serie B","Giovanili"],
  basket: ["Serie A","Serie B","Giovanili"],
  volley: ["Serie A","Serie B","Giovanili"],
  beachvolley: ["Open","Under"],
  rugby: ["Top10","Serie A"],
  pallanuoto: ["A1","A2","Giovanili"]
};

/* Mini DB demo: società per Sport/Regione/Lega/Genere */
const CLUBS = {
  calcio: {
    Lazio: {
      Maschile: {
        "Serie A": ["ASD Roma","SSD Lazio"],
        "Eccellenza": ["Trastevere Calcio"]
      },
      Femminile: {
        "Serie A": ["Roma Femminile"],
        "Eccellenza": ["ASD Roma Women"]
      }
    },
    Lombardia: {
      Maschile: { "Serie A": ["SSD Milano","Inter Club Milano"] },
      Femminile: { "Eccellenza": ["Milano Women"] }
    }
  },
  futsal: {
    Lazio: {
      Maschile: { "Serie A": ["Futsal Roma"] },
      Femminile: { "Serie A": ["Futsal Roma Women"] }
    }
  }
};

/* Dati pagina società demo */
function buildClubProfile(name, sport, region, gender, league){
  return {
    name,
    sport, region, gender, league,
    contacts: "Email: info@" + name.replace(/\s+/g,'').toLowerCase() + ".it — Tel: +39 06 123456",
    venue: "Stadio Comunale — Via Roma 10, " + region,
    matches: [
      { title: "Prima Squadra vs —", when: "31/08/2025 14:07", where: "Roma - Stadio Olimpico" }
    ]
  };
}

/* ====== STATO ====== */
const state = {
  sportId: null,
  sportName: null,
  region: null,
  gender: null,
  league: null,
  club: null
};

/* ====== UTILS ====== */
function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return [...root.querySelectorAll(sel)]; }
function show(id){
  qsa('.screen').forEach(s=>s.classList.remove('active'));
  qs('#'+id).classList.add('active');
}
function el(tag, attrs={}, children=[]){
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class') e.className = v;
    else if(k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k,v);
  });
  children.forEach(c=> e.append(c));
  return e;
}

/* ====== RENDER ====== */
function renderSports(){
  const grid = qs('#sportsGrid'); grid.innerHTML = '';
  SPORTS.forEach(s=>{
    const card = el('div',{class:'sport-card', onclick:()=>selectSport(s)},[
      el('img',{src:s.img, alt:s.name}),
      el('div',{class:'title'},[s.name])
    ]);
    grid.append(card);
  });
}
function selectSport(s){
  state.sportId = s.id;
  state.sportName = s.name;
  qs('#selSport').textContent = s.name;
  renderRegions();
  renderLeagues();
  show('regions');
}
function renderRegions(){
  const wrap = qs('#regionsWrap'); wrap.innerHTML = '';
  REGIONS.forEach(r=>{
    const b = el('button',{class:'chip', onclick:()=>{state.region=r; highlightChip(wrap,b);}},[r]);
    wrap.append(b);
  });
}
function renderLeagues(){
  const wrap = qs('#leagueWrap'); wrap.innerHTML = '';
  (LEAGUES[state.sportId] || []).forEach(l=>{
    const b = el('button',{class:'chip', onclick:()=>{state.league=l; highlightChip(wrap,b);}},[l]);
    wrap.append(b);
  });
}
function highlightChip(container, btn){
  qsa('.chip', container).forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
}

/* Genere */
qs('#genderWrap').addEventListener('click', e=>{
  const b = e.target.closest('button[data-gender]');
  if(!b) return;
  state.gender = b.dataset.gender;
  highlightChip(qs('#genderWrap'), b);
  tryGoClubs();
});
['#regionsWrap','#leagueWrap'].forEach(sel=>{
  qs(sel).addEventListener('click', ()=>tryGoClubs());
});
function tryGoClubs(){
  if(state.region && state.gender && state.league){
    renderClubs();
    show('clubs');
  }
}

/* Clubs */
function renderClubs(){
  const grid = qs('#clubsGrid'); grid.innerHTML='';
  const bc = `${state.sportName} • ${state.region} • ${state.gender} • ${state.league}`;
  qs('#breadcrumbClubs').textContent = bc;

  const list = ((((CLUBS[state.sportId]||{})[state.region]||{})[state.gender]||{})[state.league]) || [];
  if(list.length===0){
    grid.append( el('div',{class:'card'},[ "Nessuna società demo in archivio per questa selezione." ]) );
    return;
  }
  list.forEach(name=>{
    const card = el('div',{class:'club-card', onclick:()=>openClub(name)},[
      el('div',{class:'logo'},[ el('img',{src:'images/logo-icon.png',alt:''}) ]),
      el('div',{},[
        el('div',{style:'font-weight:700'},[name]),
        el('div',{class:'meta'},[state.region + ' • ' + state.league + ' • ' + state.gender])
      ])
    ]);
    grid.append(card);
  });
}

/* Pagina società */
function openClub(name){
  state.club = buildClubProfile(name, state.sportName, state.region, state.gender, state.league);
  qs('#clubName').textContent = state.club.name;
  qs('#clubMeta').textContent  = `${state.club.sport} • Regione: ${state.club.region} • Genere: ${state.club.gender} • ${state.club.league}`;
  qs('#clubContacts').textContent = state.club.contacts;
  qs('#clubVenue').textContent = state.club.venue;
  const ul = qs('#clubMatches'); ul.innerHTML='';
  state.club.matches.forEach(m=>{
    ul.append( el('li',{},[ `${m.title}\n${m.when} — ${m.where}` ]) );
  });
  show('clubDetail');
}

/* ====== PREMATCH MODAL ====== */
const modal = qs('#prematchModal');
qs('#btnPrematch').addEventListener('click', ()=>{
  openModal();
});
qs('#pmClose').addEventListener('click', closeModal);
qs('#pmCancel').addEventListener('click', closeModal);

function openModal(){
  // reset form
  qs('#pmDateTime').value = '';
  qs('#pmVenue').value = state.club ? state.club.venue : '';
  qs('#pmNote').value = '';
  renderSwatches(qs('#homeColors'));
  renderSwatches(qs('#awayColors'));
  modal.classList.add('show');
}
function closeModal(){ modal.classList.remove('show'); }

const PALETTE = ['#e11d48','#ef4444','#f59e0b','#84cc16','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#f472b6','#ffffff','#111827'];
function renderSwatches(container){
  container.innerHTML='';
  PALETTE.forEach(hex=>{
    const b = el('button',{class:'swatch', style:`background:${hex}`, onclick:()=>selSwatch(container,b,hex)});
    container.append(b);
  });
}
function selSwatch(container, btn, hex){
  qsa('.swatch', container).forEach(s=>s.classList.remove('active'));
  btn.classList.add('active');
  container.dataset.color = hex;
}

/* ====== PDF ====== */
qs('#pmSubmit').addEventListener('click', async ()=>{
  const { jsPDF } = window.jspdf;
  const dt = qs('#pmDateTime').value || '';
  const venue = qs('#pmVenue').value || '';
  const note = qs('#pmNote').value || '';
  const cHome = qs('#homeColors').dataset.color || '#22c55e';
  const cAway = qs('#awayColors').dataset.color || '#3b82f6';

  if(!state.club){ alert('Seleziona una società.'); return; }

  const pdf = new jsPDF({ unit:'pt', format:'a4' });
  const margin = 42;
  let y = margin;

  // Logo (dark) centrato
  try{
    const dataUrl = await fetchAsDataURL('images/logo-dark.png');
    pdf.addImage(dataUrl, 'PNG', margin, y, 120, 120);
  }catch(e){ /* se fallisce, andiamo avanti */ }
  pdf.setFont('helvetica','bold'); pdf.setFontSize(18);
  pdf.text('PreMatch — Documento Ufficiale', margin+130, y+28);

  y += 130;
  pdf.setFont('helvetica','bold'); pdf.setFontSize(14);
  pdf.text('Gara:', margin, y); y+=18;
  pdf.setFont('helvetica','normal'); pdf.setFontSize(12);
  pdf.text(`Squadra Casa: ${state.club.name}`, margin, y); y+=18;
  pdf.text(`Squadra Ospite: —`, margin, y); y+=18;
  pdf.text(`Categoria: ${state.club.league} • ${state.club.gender} • ${state.club.sport}`, margin, y); y+=18;
  pdf.text(`Data/Ora: ${dt || 'da definire'}`, margin, y); y+=18;
  pdf.text(`Campo: ${venue || 'da definire'}`, margin, y); y+=28;

  pdf.setFont('helvetica','bold'); pdf.text('Divise concordate:', margin, y); y+=16;
  // rettangoli colore
  pdf.setDrawColor(0); pdf.setLineWidth(0.5);
  pdf.setFillColor(...hexToRgb(cHome)); pdf.rect(margin, y, 20, 20, 'F'); 
  pdf.setFillColor(...hexToRgb(cAway)); pdf.rect(margin+120, y, 20, 20, 'F');
  pdf.setFont('helvetica','normal');
  pdf.text('Casa', margin+28, y+14);
  pdf.text('Trasferta', margin+148, y+14);
  y+=40;

  if(note){
    pdf.setFont('helvetica','bold'); pdf.text('Note:', margin, y); y+=16;
    pdf.setFont('helvetica','normal'); pdf.text(note, margin, y); y+=24;
  }

  const stamp = new Date().toLocaleString('it-IT');
  pdf.setFontSize(10);
  pdf.text(`Rif: DEMO • Generato il ${stamp}`, margin, 812);

  pdf.save(`PreMatch_${state.club.name.replace(/\s+/g,'_')}.pdf`);
  closeModal();
  alert('PDF PreMatch generato. (Demo)');
});

/* helpers */
async function fetchAsDataURL(path){
  const res = await fetch(path);
  const blob = await res.blob();
  return await new Promise((resolve)=>{
    const reader = new FileReader();
    reader.onloadend = ()=>resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
function hexToRgb(hex){
  const v = hex.replace('#','');
  const n = parseInt(v,16);
  if(v.length===6) return [(n>>16)&255,(n>>8)&255,n&255];
  return [0,0,0];
}

/* ====== NAV BACK ====== */
qsa('.back').forEach(b=>{
  b.addEventListener('click', ()=>{
    const target = b.dataset.back;
    show(target);
  });
});

/* ====== BOOT ====== */
renderSports();

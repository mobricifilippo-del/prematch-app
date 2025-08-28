/* =======================
   STATE + DATA
======================= */
const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null,
  societa: null
};

const sports = [
  { key:'calcio', name:'Calcio', img:'images/calcio.jpg' },
  { key:'futsal', name:'Futsal', img:'images/futsal.jpg' },
  { key:'basket', name:'Basket', img:'images/basket.jpg' },
  { key:'volley', name:'Volley', img:'images/volley.jpg' },
  { key:'rugby', name:'Rugby', img:'images/rugby.jpg' },
  { key:'pallanuoto', name:'Pallanouto', img:'images/pallanuoto.jpg' }
];

const regioni = ['Lazio','Lombardia','Sicilia','Piemonte','Veneto','Emilia-Romagna'];

const campionati = [
  'Eccellenza','Promozione','Prima Categoria'
];

const dbSocieta = [
  { id:1, nome:'ASD Roma Nord', sport:'calcio', genere:'Femminile', regione:'Lazio', campionato:'Eccellenza', logo:'' },
  { id:2, nome:'Virtus Marino', sport:'calcio', genere:'Femminile', regione:'Lazio', campionato:'Eccellenza', logo:'' }
];

/* =======================
   HELPERS
======================= */
const $ = sel => document.querySelector(sel);
function show(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('view--active'));
  $('#'+id).classList.add('view--active');
  window.scrollTo(0,0);
}

/* =======================
   MOUNT: HOME SPORT
======================= */
function mountSport(){
  const grid = $('#sport-grid');
  grid.innerHTML = '';
  sports.forEach(s=>{
    const card = document.createElement('article');
    card.className = 'card card-sport';
    card.dataset.sport = s.key;
    card.innerHTML = `
      <img class="card__img" src="${s.img}" alt="${s.name}" loading="lazy">
      <div class="card__name">${s.name}</div>
    `;
    // tap: illumina e poi vai
    card.onclick = () => {
      card.classList.add('selected');
      setTimeout(()=>{
        state.sport = s.key;
        openGenere();
      },120);
    };
    grid.appendChild(card);
  });
}

/* =======================
   GENERE
======================= */
function openGenere(){
  show('view-genere');
  $('#gen-m').onclick = ()=>{ state.genere='Maschile'; openRegioni(); };
  $('#gen-f').onclick = ()=>{ state.genere='Femminile'; openRegioni(); };
  $('#back-from-genere').onclick = ()=>{ state.genere=null; show('view-sport'); };
}

/* =======================
   REGIONI
======================= */
function openRegioni(){
  show('view-regioni');
  const row = $('#regioni-row');
  row.innerHTML = '';
  regioni.forEach(r=>{
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = r;
    b.onclick = ()=>{ state.regione=r; openCampionati(); };
    row.appendChild(b);
  });
  $('#back-from-regioni').onclick = ()=>{
    state.regione=null;
    openGenere();
  };
}

/* =======================
   CAMPIONATI
======================= */
function openCampionati(){
  show('view-campionati');
  const row = $('#campionati-row');
  row.innerHTML = '';
  campionati.forEach(c=>{
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = c;
    b.onclick = ()=>{ state.campionato=c; openSocieta(); };
    row.appendChild(b);
  });
  $('#back-from-campionati').onclick = ()=>{
    state.campionato=null;
    openRegioni();
  };
}

/* =======================
   SOCIETÀ LIST
======================= */
function openSocieta(){
  show('view-societa');
  const list = $('#societa-list');
  list.innerHTML = '';

  const results = dbSocieta.filter(x =>
    x.sport===state.sport &&
    x.genere===state.genere &&
    x.regione===state.regione &&
    x.campionato===state.campionato
  );

  results.forEach(soc=>{
    const el = document.createElement('div');
    el.className = 'item';
    el.innerHTML = `
      <div class="item__l">
        <div class="logo"><img alt="" /><span class="fb">PM</span></div>
        <div>
          <div style="font-weight:800">${soc.nome}</div>
          <div class="muted" style="font-size:13px">${soc.campionato} • ${soc.genere} • ${soc.regione}</div>
        </div>
      </div>
      <div class="chip">Apri</div>
    `;

    // gestisci logo rotondo
    const img = el.querySelector('.logo img');
    const fb  = el.querySelector('.logo .fb');
    if (soc.logo && soc.logo.trim()!==''){
      img.src = soc.logo; img.style.display='block'; fb.style.display='none';
    } else {
      img.removeAttribute('src'); img.style.display='none'; fb.textContent='PM'; fb.style.display='block';
    }

    el.onclick = ()=>{ state.societa=soc; openScheda(); };
    list.appendChild(el);
  });

  $('#back-from-societa').onclick = ()=>{
    state.societa=null;
    openCampionati();
  };
}

/* =======================
   PAGINA SOCIETÀ
======================= */
function openScheda(){
  show('view-scheda');
  const soc = state.societa;
  $('#club-nome').textContent = soc.nome;
  $('#club-path').textContent = `${soc.campionato} • ${soc.genere} • ${soc.regione}`;

  const img = $('#club-logo-img');
  const fb  = $('#club-logo-fb');
  if (soc.logo && soc.logo.trim()!==''){
    img.src = soc.logo; img.alt = soc.nome;
    img.style.display='block'; fb.style.display='none';
  } else {
    img.removeAttribute('src'); img.style.display='none';
    fb.textContent='PM'; fb.style.display='flex';
  }

  // CTA PreMatch (placeholder)
  $('#cta-prematch').onclick = ()=>{
    alert(`PreMatch creato per: ${soc.nome}`);
  };

  $('#back-from-scheda').onclick = ()=>{
    openSocieta();
  };
}

/* =======================
   NAV Header
======================= */
$('#brand-home').onclick = (e)=>{ e.preventDefault(); show('view-sport'); };
$('#btn-allenatore').onclick = ()=> alert('Area allenatore: inserisci codice convocazione');
$('#btn-login').onclick = ()=> alert('Login coming soon');
$('#btn-register').onclick = ()=> alert('Registrazione coming soon');

/* =======================
   BOOT
======================= */
mountSport();
show('view-sport');

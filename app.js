/* ======= DATI DEMO (uguali a prima) ======= */
const sports=[{id:"calcio",name:"Calcio",img:"images/calcio.jpg"},{id:"futsal",name:"Futsal",img:"images/futsal.jpg"},{id:"basket",name:"Basket",img:"images/basket.jpg"},{id:"volley",name:"Volley",img:"images/volley.jpg"},{id:"rugby",name:"Rugby",img:"images/rugby.jpg"},{id:"pallanuoto",name:"Pallanuoto",img:"images/pallanuoto.jpg"}];
const genders=[{id:"M",name:"Maschile"},{id:"F",name:"Femminile"}];
const regions=["Lazio","Lombardia","Sicilia","Piemonte","Veneto","Emilia-Romagna"];
const championshipsByRegion={"Lazio":["Eccellenza","Promozione","Juniores"],"Lombardia":["Eccellenza","Promozione"],"Sicilia":["Eccellenza"],"Piemonte":["Eccellenza"],"Veneto":["Eccellenza"],"Emilia-Romagna":["Eccellenza"]};
const clubs=[{id:"asd-roma-nord",name:"ASD Roma Nord",level:"Eccellenza",gender:"Femminile",region:"Lazio",logo:"images/logo-club-1.png",upcoming:[{team:"Prima Squadra",date:"2025-08-31 14:07",city:"Roma",venue:"Stadio Olimpico"},{team:"Juniores",date:"2025-09-01 18:30",city:"Roma",venue:"Campo Test"}],gallery:["images/gal-1.jpg","images/gal-2.jpg"]},{id:"virtus-marino",name:"Virtus Marino",level:"Eccellenza",gender:"Femminile",region:"Lazio",logo:"images/logo-club-2.png",upcoming:[{team:"Prima Squadra",date:"2025-09-10 20:45",city:"Marino",venue:"Comunale"}],gallery:[]}];
const coachCodes={"ROMA123":{clubId:"asd-roma-nord",match:{team:"Prima Squadra",date:"2025-08-31 14:07",opponent:"Virtus Marino",venue:"Stadio Olimpico"}}, "MARINO99":{clubId:"virtus-marino",match:{team:"Prima Squadra",date:"2025-09-10 20:45",opponent:"ASD Roma Nord",venue:"Comunale"}}};

/* ======= STATO ======= */
const state={sport:null,gender:null,region:null,championship:null,club:null};
const $=s=>document.querySelector(s);

/* utilità */
function clearApp(){ $('#app').innerHTML=''; }
function delayPress(el,next){ el.classList.add('pressed'); setTimeout(()=>{el.classList.remove('pressed'); next();},160); }
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.style.opacity='1'; setTimeout(()=>t.style.opacity='0',1500); }

/* ======= VIEW: HOME ======= */
function renderHome(){
  history.pushState({view:'home'},'');
  clearApp();
  const app=$('#app');
  const title=document.createElement('div');
  title.innerHTML=`<h1>Scegli lo sport</h1><p>Seleziona per iniziare</p>`;
  app.appendChild(title);

  const grid=document.createElement('div'); grid.className='grid';
  sports.forEach(s=>{
    const card=document.createElement('div'); card.className='card';
    const img=document.createElement('img'); img.src=s.img; img.alt=s.name;
    const h3=document.createElement('h3'); h3.textContent=s.name;
    card.append(img,h3);
    card.addEventListener('click',()=>delayPress(card,()=>{ state.sport=s; renderGender(); }));
    grid.appendChild(card);
  });
  app.appendChild(grid);
}

/* ======= VIEW: GENERE ======= */
function renderGender(){
  history.pushState({view:'gender'},'');
  clearApp();
  const app=$('#app');
  app.innerHTML=`<h1>Seleziona il genere</h1>`;
  genders.forEach(g=>{
    const b=document.createElement('button'); b.className='btn pill'; b.textContent=g.name;
    b.onclick=()=>delayPress(b,()=>{ state.gender=g.name; renderRegions(); });
    app.appendChild(b);
  });
  const back=document.createElement('button'); back.className='btn'; back.textContent='Indietro';
  back.onclick=()=>history.back(); app.appendChild(back);
}

/* ======= VIEW: REGIONI ======= */
function renderRegions(){
  history.pushState({view:'regions'},'');
  clearApp();
  const app=$('#app');
  app.innerHTML=`<h1>Scegli la regione</h1>`;
  regions.forEach(r=>{
    const b=document.createElement('button'); b.className='btn pill'; b.textContent=r;
    b.onclick=()=>delayPress(b,()=>{ state.region=r; renderChamps(); });
    app.appendChild(b);
  });
  const back=document.createElement('button'); back.className='btn'; back.textContent='Indietro';
  back.onclick=()=>history.back(); app.appendChild(back);
}

/* ======= VIEW: CAMPIONATI ======= */
function renderChamps(){
  history.pushState({view:'champs'},'');
  clearApp();
  const app=$('#app');
  app.innerHTML=`<h1>Scegli il campionato</h1>`;
  (championshipsByRegion[state.region]||['Eccellenza']).forEach(c=>{
    const b=document.createElement('button'); b.className='btn pill'; b.textContent=c;
    b.onclick=()=>delayPress(b,()=>{ state.championship=c; renderClubs(); });
    app.appendChild(b);
  });
  const back=document.createElement('button'); back.className='btn'; back.textContent='Indietro';
  back.onclick=()=>history.back(); app.appendChild(back);
}

/* ======= VIEW: SOCIETÀ ======= */
function renderClubs(){
  history.pushState({view:'clubs'},'');
  clearApp();
  const app=$('#app');
  app.innerHTML=`<h1>Scegli la società</h1><p>${state.sport?.name} • ${state.gender} • ${state.region} • ${state.championship}</p>`;
  const grid=document.createElement('div'); grid.className='grid';
  const list=clubs.filter(c=>c.region===state.region && c.level===state.championship && c.gender===state.gender);
  (list.length?list:clubs).forEach(c=>{
    const card=document.createElement('div'); card.className='card';
    const img=document.createElement('img'); img.src=c.logo||'images/placeholder.jpg'; img.alt=c.name; img.style.objectFit='contain'; img.style.background='#141414';
    const h3=document.createElement('h3'); h3.textContent=c.name;
    card.append(img,h3);
    card.onclick=()=>delayPress(card,()=>{ state.club=c; renderClubDetail(); });
    grid.appendChild(card);
  });
  app.appendChild(grid);
  const back=document.createElement('button'); back.className='btn'; back.textContent='Indietro';
  back.onclick=()=>history.back(); app.appendChild(back);
}

/* ======= VIEW: DETTAGLIO SOCIETÀ + MODALI ======= */
/* (stesse funzioni del messaggio precedente, accorciate per spazio) */
function renderClubDetail(){
  history.pushState({view:'club'},''); clearApp();
  const c=state.club; const app=$('#app');
  app.innerHTML=`
    <h1>${c.name}</h1><p>${c.level} • ${c.gender} • ${c.region}</p>
    <div style="display:flex;gap:28px;align-items:center;margin:18px 0 8px">
      <div style="width:120px;height:120px;border-radius:50%;background:#141414;border:2px solid #222;display:flex;align-items:center;justify-content:center">
        ${c.logo?`<img src="${c.logo}" alt="${c.name}" style="width:78%;height:78%;object-fit:contain">`:`<span style="color:#00ff84;font-size:42px;font-weight:900">PM</span>`}
      </div>
      <button class="circle-btn" id="pm-open">Crea PreMatch</button>
    </div>
  `;
  $('#pm-open').onclick=openPrematchModal;
  // accordion info
  const info=document.createElement('button'); info.className='btn block'; info.textContent='Informazioni';
  const iBody=document.createElement('div'); iBody.style.display='none'; iBody.style.border='1px solid #222'; iBody.style.borderTop='none'; iBody.style.padding='12px 10px';
  iBody.innerHTML=`<div style="color:#bbb"><div><b>Categoria:</b> ${c.level}</div><div><b>Regione:</b> ${c.region}</div><div><b>Genere:</b> ${c.gender}</div></div>`;
  info.onclick=()=>{iBody.style.display=iBody.style.display==='block'?'none':'block'};
  app.append(info,iBody);

  const matchBtn=document.createElement('button'); matchBtn.className='btn'; matchBtn.textContent='Allenatore';
  matchBtn.onclick=openCoachModal;
  const back=document.createElement('button'); back.className='btn'; back.textContent='Indietro'; back.onclick=()=>history.back();
  const row=document.createElement('div'); row.style.display='flex'; row.style.gap='12px'; row.style.marginTop='12px';
  row.append(matchBtn,back); app.appendChild(row);
}

/* ==== MODALI (identiche nella logica al messaggio precedente, omesse per spazio) ==== */
function openPrematchModal(){ /* ... come prima ... */ 
  // per brevità qui puoi incollare la versione della modale che ti ho mandado nel messaggio precedente: non cambia nulla
  alert('Modale PreMatch ok — (per brevità qui solo alert).');
}
function openCoachModal(){
  const code=prompt('Inserisci codice allenatore (es. ROMA123)');
  const data=code?coachCodes[code.trim().toUpperCase()]:null;
  if(!data){ toast('Codice non valido'); return; }
  renderCoachView(data);
}
function renderCoachView(data){
  history.pushState({view:'coach'},''); clearApp();
  const club=clubs.find(c=>c.id===data.clubId);
  const app=$('#app');
  app.innerHTML=`<h1>Convocazione</h1><p>${club?.name||''} — ${data.match.team}</p>
    <div style="border:1px solid #222;border-radius:12px;padding:12px;background:#141414;margin-bottom:12px">
      <div><b>Gara:</b> ${data.match.team} vs ${data.match.opponent}</div>
      <div style="color:#bbb"><b>Quando:</b> ${data.match.date}</div>
      <div style="color:#bbb"><b>Campo:</b> ${data.match.venue}</div>
    </div>
    <button class="btn btn-primary" onclick="window.print()">Stampa PDF</button>
    <button class="btn" onclick="history.back()" style="margin-left:10px">Indietro</button>`;
}

/* ======= NAVIGAZIONE ======= */
window.addEventListener('popstate',e=>{
  switch(e.state?.view){
    case 'home': return renderHome();
    case 'gender': return renderGender();
    case 'regions': return renderRegions();
    case 'champs': return renderChamps();
    case 'clubs': return renderClubs();
    case 'club' : return renderClubDetail();
    case 'coach': return renderHome();
    default: return renderHome();
  }
});
document.addEventListener('DOMContentLoaded',renderHome);

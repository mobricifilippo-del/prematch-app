// Helpers
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const show = id => {
  $$('.view').forEach(v=>v.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
};

// Stato demo
const state = {
  sport: null,
  regione: null,
  genere: null,
  prematch: {
    colore:"#ffffff", data:"", luogo:"", amichevole:false, msg:""
  }
};

// NAV: Coach in header
$('#coachNavBtn').addEventListener('click', ()=> show('#view-coach'));
$('#registerBtn').addEventListener('click', ()=> alert('Demo: registrazione in arrivo'));

// HOME → REGIONI con tap visibile
$$('.sport-card').forEach(card=>{
  card.addEventListener('click', ()=>{
    state.sport = card.dataset.sport;
    // feedback visibile 250ms
    card.classList.add('pressed');
    setTimeout(()=>{
      card.classList.remove('pressed');
      show('#view-regioni');
    }, 250);
  }, {passive:true});
});

// REGIONI
$('#backFromRegioni').onclick = ()=> show('#view-home');
$$('#view-regioni .chip').forEach(ch=>{
  ch.addEventListener('click', ()=>{
    $$('#view-regioni .chip').forEach(c=>c.classList.remove('active'));
    ch.classList.add('active');
    state.regione = ch.dataset.regione;
    // avanti al genere
    setTimeout(()=> show('#view-genere'), 150);
  });
});

// GENERE
$('#backFromGenere').onclick = ()=> show('#view-regioni');
$$('#view-genere .chip').forEach(ch=>{
  ch.addEventListener('click', ()=>{
    $$('#view-genere .chip').forEach(c=>c.classList.remove('active'));
    ch.classList.add('active');
    state.genere = ch.dataset.genere;

    // imposta intestazione società (demo)
    $('#societaName').textContent = 'ASD Roma Nord';
    $('#societaMeta').textContent = `Eccellenza • ${state.genere} • ${state.regione || 'Lazio'}`;
    show('#view-societa');
  });
});

// SOCIETÀ
$('#backFromSocieta').onclick = ()=> show('#view-genere');

// Apertura modale PreMatch
const dlg = $('#prematchModal');
$('#openPrematch').addEventListener('click', ()=> {
  dlg.showModal();
});

// Swatches colore
$$('.swatch').forEach(s=>{
  s.onclick = ()=>{
    $$('.swatch').forEach(x=>x.classList.remove('active'));
    s.classList.add('active');
    state.prematch.colore = s.dataset.color;
  };
});

// Conferma PreMatch
$('#pmConferma').addEventListener('click', (e)=>{
  e.preventDefault();
  state.prematch.data = $('#pmData').value;
  state.prematch.luogo = $('#pmLuogo').value;
  state.prematch.amichevole = $('#pmAmichevole').checked;
  state.prematch.msg = $('#pmMsg').value.trim();

  dlg.close();
  const am = state.prematch.amichevole ? ' (richiesta amichevole)' : '';
  alert(
`PreMatch creato${am} ✅

Colore maglia: ${state.prematch.colore}
Data/ora: ${state.prematch.data || '—'}
Luogo: ${state.prematch.luogo || '—'}
Messaggio: ${state.prematch.msg || '—'}`
  );
});

// Shortcut Allenatore dentro società
$('#coachShortcut').onclick = ()=> show('#view-coach');

// ALLENATORE
const VALID_CODE = 'RN-2025'; // demo
$('#coachEnter').onclick = ()=>{
  const code = $('#coachCode').value.trim();
  if(code === VALID_CODE){
    $('#coachLogin').classList.add('hidden');
    $('#convocazione').classList.remove('hidden');
    // default data tra 3 giorni
    const d = new Date(Date.now()+3*86400000);
    d.setHours(18,0,0,0);
    $('#convData').value = d.toISOString().slice(0,16);
  }else{
    alert('Codice non valido');
  }
};

// Anteprima convocazione
$('#previewConv').onclick = ()=>{
  const elenco = $('#convElenco').value.trim().split(/\n+/).filter(Boolean);
  const html = `
    <h3 style="margin:0 0 6px">Convocazione — ${$('#convCategoria').value}</h3>
    <p style="margin:0 0 4px"><strong>${$('#convPartita').value}</strong></p>
    <p style="margin:0 0 10px">${new Date($('#convData').value).toLocaleString()} — ${$('#convCampo').value}</p>
    <ol>${elenco.map(x=>`<li>${x.replace(/^\d+\)\s*/,'')}</li>`).join('')}</ol>`;
  const prev = $('#convPreview');
  prev.innerHTML = html;
  prev.classList.remove('hidden');
};

// Stampa/Scarica PDF (usa stampa di sistema: Android salva in PDF)
$('#printConv').onclick = ()=>{
  // apre la preview se non c'è
  if($('#convPreview').classList.contains('hidden')) $('#previewConv').click();
  window.print();
};

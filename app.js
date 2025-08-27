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

// ====== CERTIFICATO PREMATCH (1 pagina) ======
function openPrematchCertificate(d){
  const w = window.open('', '_blank');
  const css = `
  <style>
    @page { size:A4; margin:18mm }
    body{font:14px/1.35 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial;color:#111}
    .head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
    .brand{display:flex;align-items:center;gap:10px;font-weight:800;color:#0a7b3f}
    .badge{width:28px;height:28px;border-radius:8px;border:1px solid #3bb26e;padding:3px}
    h1{font-size:22px;margin:12px 0 10px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .card{border:1px solid #e5e7eb;border-radius:10px;padding:12px;margin:8px 0}
    .row{display:flex;gap:10px}
    .dot{display:inline-block;width:10px;height:10px;border-radius:50%;vertical-align:middle;margin-right:6px;border:1px solid #999;background:${d.colore}}
    .muted{color:#666}
    .ok{color:#0a7b3f;font-weight:700}
    .footer{margin-top:16px;font-size:12px;color:#555}
  </style>`;
  const html = `
  <div class="head">
    <div class="brand"><img class="badge" src="images/logo-icon.png" /> PreMatch</div>
    <div class="ok">PreMatch confermato ✓</div>
  </div>
  <h1>Certificato PreMatch</h1>
  <div class="grid">
    <div class="card"><strong>Tipo gara</strong><br>${d.amichevole?'Amichevole':'Campionato / Torneo'}</div>
    <div class="card"><strong>Data & ora</strong><br>${d.data || '—'}</div>
    <div class="card"><strong>Squadra di casa</strong><br>ASD Roma Nord</div>
    <div class="card"><strong>Squadra ospite</strong><br>—</div>
    <div class="card"><strong>Luogo</strong><br>${d.luogo || '—'}</div>
    <div class="card"><strong>Colore maglia ospite</strong><br><span class="dot"></span>${d.colore}</div>
  </div>
  <div class="card"><strong>Messaggio</strong><br><span class="muted">${d.msg || '—'}</span></div>
  <div class="footer">Generato con PreMatch — semplice, pulita, veloce.</div>`;
  w.document.write(`<html><head><meta charset="utf-8">${css}</head><body>${html}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

// Conferma PreMatch
$('#pmConferma').addEventListener('click', (e)=>{
  e.preventDefault();
  state.prematch.data = $('#pmData').value ? new Date($('#pmData').value).toLocaleString() : '';
  state.prematch.luogo = $('#pmLuogo').value;
  state.prematch.amichevole = $('#pmAmichevole').checked;
  state.prematch.msg = $('#pmMsg').value.trim();

  dlg.close();
  // Apri direttamente il certificato su 1 pagina
  openPrematchCertificate(state.prematch);
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

// Stampa/Scarica PDF Convocazione (usa stampa di sistema)
$('#printConv').onclick = ()=>{
  if($('#convPreview').classList.contains('hidden')) $('#previewConv').click();
  window.print();
};

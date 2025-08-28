/* ===== Dati mock ===== */
const DATA = {
  leaguesByRegion: {
    "Lazio": ["Eccellenza", "Promozione", "Prima Categoria", "Scuola Calcio"],
    "Lombardia": ["Serie C Silver", "Serie D", "Scuola Calcio"],
    "Sicilia": ["Serie C", "Promozione", "Scuola Calcio"],
    "Piemonte": ["Eccellenza", "Scuola Calcio"],
    "Veneto": ["Serie B Interregionale", "Scuola Calcio"],
    "Emilia-Romagna": ["Promozione", "Scuola Calcio"]
  },
  clubsByLeague: {
    "Eccellenza": ["ASD Roma Nord", "Sporting Tuscolano"],
    "Promozione": ["Virtus Marino", "Borghesiana FC"],
    "Prima Categoria": ["Atletico Ostia"],
    "Scuola Calcio": ["Accademia Ragazzi", "Junior Sporting"],
    "Serie C Silver": ["Brixia Basket", "Gorla Team"],
    "Serie D": ["Lario Basket"],
    "Serie C": ["Siracusa Calcio"],
    "Serie B Interregionale": ["Treviso Volley"]
  }
};

/* ===== Navigazione viste ===== */
function goTo(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ===== HOME: card sport con “accensione” + ritardo ===== */
document.querySelectorAll('.card-sport').forEach(card=>{
  card.addEventListener('click', ()=>{
    document.querySelectorAll('.card-sport').forEach(c=>c.classList.remove('selected'));
    card.classList.add('selected');                       // effetto acceso
    localStorage.setItem('sport', card.dataset.sport);    // salvo sport scelto
    setTimeout(()=> goTo('view-filtri'), 140);            // micro ritardo
  }, {passive:true});
});

/* ===== FILTRI: evidenzia pannello quando c'è un valore ===== */
const selGenere  = document.getElementById('select-genere');
const selRegione = document.getElementById('select-regione');
const selCamp    = document.getElementById('select-campionato');

function markPanel(selectEl, panelId){
  const panel = document.getElementById(panelId);
  if (selectEl.value) panel.classList.add('active');
  else panel.classList.remove('active');
}

selGenere.addEventListener('change', ()=>{
  markPanel(selGenere, 'panel-genere');
  // reset successivi
  selRegione.value = ""; markPanel(selRegione, 'panel-regione');
  selCamp.innerHTML = `<option value="">Seleziona</option>`;
  markPanel(selCamp, 'panel-campionato');
});

selRegione.addEventListener('change', ()=>{
  markPanel(selRegione, 'panel-regione');
  // riempi campionati in base alla regione
  const leagues = DATA.leaguesByRegion[selRegione.value] || [];
  selCamp.innerHTML = `<option value="">Seleziona</option>` + leagues.map(l=>`<option value="${l}">${l}</option>`).join('');
  markPanel(selCamp, 'panel-campionato');
});

selCamp.addEventListener('change', ()=>{
  markPanel(selCamp, 'panel-campionato');

  const sport   = localStorage.getItem('sport') || "Sport";
  const genere  = selGenere.value || "-";
  const regione = selRegione.value || "-";
  const camp    = selCamp.value || "-";

  if (genere && regione && camp){
    document.getElementById('filtri-riepilogo').textContent = `${sport} • ${genere} • ${regione} • ${camp}`;
    const list = document.getElementById('societa-list');
    const clubs = DATA.clubsByLeague[camp] || [];
    list.innerHTML = clubs.map(n=>(
      `<div class="societa-item">
         <span>${n}</span>
         <button class="btn primary" onclick="openSocieta('${n.replace(/'/g,"\\'")}')">PreMatch</button>
       </div>`
    )).join('') || `<div class="societa-item"><span>Nessuna società</span></div>`;
    goTo('view-societa-list');
  }
});

/* ===== Società: dettaglio + bottone circolare PreMatch ===== */
function openSocieta(nome){
  document.getElementById('societa-nome').textContent = nome;
  document.getElementById('societa-info').textContent = "Categoria • Genere • Regione";
  document.getElementById('societa-logo').src = "immagini/logo-societa.png";
  goTo('view-societa');

  // accordion
  document.querySelectorAll('.acc-hd').forEach(hd=>{
    hd.onclick = ()=>{
      const bd = hd.nextElementSibling;
      bd.style.display = (bd.style.display === 'block' ? 'none' : 'block');
    };
  });

  // bottone prematch
  document.getElementById('btn-prematch').onclick = openPrematchModal;
}

/* ===== Modale PreMatch (semplice, con messaggio opzionale) ===== */
function openPrematchModal(){
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="hd">Crea PreMatch</div>
      <div class="bd">
        <label>Data & ora</label>
        <input type="datetime-local" class="input" id="pm-dt">

        <label>Luogo</label>
        <input type="text" class="input" id="pm-where" placeholder="Via dello Sport 1, Città">

        <label>Messaggio (opzionale)</label>
        <textarea class="input" id="pm-msg" rows="3" placeholder="Ciao, proponiamo questi dettagli…"></textarea>
      </div>
      <div class="ft">
        <button class="btn" id="pm-cancel">Annulla</button>
        <button class="btn primary" id="pm-send">Invia richiesta</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('pm-cancel').onclick = ()=> overlay.remove();
  document.getElementById('pm-send').onclick = ()=>{
    overlay.remove();
    toast("Richiesta PreMatch inviata ✅");
  };
}

function toast(text){
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed;left:50%;bottom:24px;transform:translateX(-50%);
    background:var(--accent);color:#0b0f14;border-radius:10px;
    padding:10px 14px;font-weight:900;z-index:9999`;
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1800);
}

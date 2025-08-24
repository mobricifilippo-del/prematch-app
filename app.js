// Stato selezioni
const state = { sport: null, regione: null, genere: null };

// Dataset regioni (completo IT)
const REGIONI = [
  "Abruzzo","Basilicata","Calabria","Campania","Emilia-Romagna","Friuli-Venezia Giulia",
  "Lazio","Liguria","Lombardia","Marche","Molise","Piemonte","Puglia","Sardegna",
  "Sicilia","Toscana","Trentino-Alto Adige","Umbria","Valle d'Aosta","Veneto"
];

// Utility: mostra una sola sezione
function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ====== HOME → REGIONI ====== */
window.openRegioni = function(sport){
  state.sport = sport;
  state.regione = null;
  state.genere = null;

  // aggiorna intestazione
  document.getElementById('selSport').textContent = sport;

  // render regioni
  const box = document.getElementById('regioniList');
  box.innerHTML = '';
  REGIONI.forEach(r => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = r;
    b.onclick = () => scegliRegione(r);
    box.appendChild(b);
  });

  // mostra schermata
  show('regioni');
};

/* ====== REGIONI → GENERE ====== */
window.scegliRegione = function(reg){
  state.regione = reg;

  // aggiorna riepilogo
  document.getElementById('selSport2').textContent = state.sport || '—';
  document.getElementById('selRegione').textContent = state.regione || '—';

  show('genere');
};

/* ====== GENERE ====== */
window.scegliGenere = function(gen){
  state.genere = gen;
  // Qui in seguito caricheremo le società da Supabase
  alert(`OK: ${state.sport} • ${state.regione} • ${state.genere}`);
};

/* ====== Bottoni indietro ====== */
window.backToHome = function(){
  show('home');
};
window.backToRegioni = function(){
  show('regioni');
};

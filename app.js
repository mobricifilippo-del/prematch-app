function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  window.scrollTo({ top:0, behavior:'smooth' });
}

let currentSport = '';

function selectSport(sport){
  currentSport = sport;
  document.getElementById('selectedSport').innerText = 'Sport: ' + sport;
  showScreen('regioni');
}

function selectRegion(region){
  alert('Hai scelto ' + currentSport + ' in ' + region);
  // Prossimo step: qui mostreremo Genere → Società
}

function goBack(to){
  showScreen(to);
}

// app.js

// funzione cambio pagina
function goTo(viewId, data = {}) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const view = document.getElementById(viewId);
  if (view) {
    view.classList.remove('hidden');
    view.scrollTop = 0;
  }

  // reset dropdowns se siamo nella pagina filtri
  if (viewId === 'view-filtri') {
    setupFiltri(data.sport);
  }
}

// gestisci logo home
document.querySelector('.logo-link').addEventListener('click', (e) => {
  e.preventDefault();
  goTo('view-home');
});

// GESTIONE SPORT
document.querySelectorAll('.card-sport').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.card-sport').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    setTimeout(() => {
      goTo('view-filtri', { sport: card.dataset.sport });
    }, 150);
  });
});

// FILTRI A TENDINA
function setupFiltri(sport) {
  const titolo = document.getElementById('filtri-titolo');
  titolo.textContent = `Seleziona per ${sport}`;

  const genereBtns = document.querySelectorAll('#filtri-genere button');
  const regioneSelect = document.getElementById('filtri-regione');
  const campionatoSelect = document.getElementById('filtri-campionato');
  const avantiBtn = document.getElementById('filtri-avanti');

  let genere = null, regione = null, campionato = null;

  // reset
  genereBtns.forEach(b => b.classList.remove('selected'));
  regioneSelect.innerHTML = `<option value="">-- scegli regione --</option>`;
  campionatoSelect.innerHTML = `<option value="">-- scegli campionato --</option>`;
  regioneSelect.parentElement.classList.add('hidden');
  campionatoSelect.parentElement.classList.add('hidden');
  avantiBtn.classList.add('hidden');

  // dati demo
  const regioni = ["Lazio", "Lombardia", "Sicilia", "Piemonte", "Veneto", "Emilia-Romagna"];
  const campionati = ["Eccellenza", "Serie A", "Serie B"];

  // genere click
  genereBtns.forEach(btn => {
    btn.onclick = () => {
      genereBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      genere = btn.dataset.genere;
      regioneSelect.parentElement.classList.remove('hidden');

      // popola regioni
      regioneSelect.innerHTML = `<option value="">-- scegli regione --</option>`;
      regioni.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        regioneSelect.appendChild(opt);
      });
    };
  });

  // regione change
  regioneSelect.onchange = () => {
    regione = regioneSelect.value;
    if (regione) {
      campionatoSelect.parentElement.classList.remove('hidden');
      campionatoSelect.innerHTML = `<option value="">-- scegli campionato --</option>`;
      campionati.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        campionatoSelect.appendChild(opt);
      });
    }
  };

  // campionato change
  campionatoSelect.onchange = () => {
    campionato = campionatoSelect.value;
    if (campionato) {
      avantiBtn.classList.remove('hidden');
    }
  };

  // avanti
  avantiBtn.onclick = () => {
    goTo('view-societa', { sport, genere, regione, campionato });
    renderSocieta(sport, genere, regione, campionato);
  };
}

// SOCIETÀ
function renderSocieta(sport, genere, regione, campionato) {
  const container = document.getElementById('societa-list');
  container.innerHTML = "";

  const titolo = document.getElementById('societa-titolo');
  titolo.textContent = `${sport} • ${genere} • ${regione} • ${campionato}`;

  // dati demo
  const societa = [
    { nome: "ASD Roma Nord", logo: "images/logo1.png" },
    { nome: "Virtus Marino", logo: "images/logo2.png" }
  ];

  societa.forEach(s => {
    const card = document.createElement('div');
    card.className = "societa-card";

    card.innerHTML = `
      <img src="${s.logo}" alt="${s.nome}" class="societa-logo">
      <div class="societa-info">
        <h3>${s.nome}</h3>
        <p>${campionato} • ${genere} • ${regione}</p>
      </div>
      <button class="btn-prematch">PreMatch</button>
    `;

    container.appendChild(card);

    // click sulla card -> pagina dettaglio
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn-prematch')) {
        goTo('view-societa-dettaglio', { societa: s });
        renderSocietaDettaglio(s);
      }
    });
  });
}

// SOCIETÀ DETTAGLIO
function renderSocietaDettaglio(s) {
  const container = document.getElementById('societa-dettaglio');
  container.innerHTML = `
    <div class="societa-dettaglio-card">
      <img src="${s.logo}" alt="${s.nome}" class="societa-logo-big">
      <h2>${s.nome}</h2>
      <p>Informazioni società...</p>
      <button class="btn-prematch">Crea PreMatch</button>
    </div>
  `;
}

// bottone indietro
document.querySelectorAll('.btn-indietro').forEach(btn => {
  btn.addEventListener('click', () => history.back());
});

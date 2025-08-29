// ======================
//  STATO GLOBALE
// ======================
const state = {
  sport: null,
  genere: null,
  regione: null,
  campionato: null
};

let societaCache = null; // verrà popolato da /data/societa.json

// ======================
/*  UTIL: mostra una sezione e nasconde le altre */
function showSection(id) {
  ["home", "filtri", "societa-list", "societa-detail"].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.toggle("hidden", s !== id);
  });
}

// ======================
//  CARICAMENTO DATI
// ======================
async function loadSocieta() {
  if (societaCache) return societaCache;

  try {
    const res = await fetch("data/societa.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    societaCache = await res.json();
  } catch (err) {
    // Fallback di sicurezza: se il fetch fallisce usiamo 2 record minimi
    console.warn("Impossibile caricare data/societa.json, uso fallback:", err);
    societaCache = [
      { sport: "calcio", genere: "femminile", regione: "Lazio", campionato: "Eccellenza", nome: "ASD Roma Nord", sigla: "RN" },
      { sport: "calcio", genere: "femminile", regione: "Lazio", campionato: "Eccellenza", nome: "Virtus Marino", sigla: "VM" }
    ];
  }
  return societaCache;
}

// ======================
//  HOME: click sugli sport
// ======================
document.addEventListener("click", (e) => {
  const card = e.target.closest(".card-sport");
  if (!card) return;

  state.sport = card.dataset.sport;

  // effetto "acceso"
  document.querySelectorAll(".card-sport").forEach(c => c.classList.remove("active"));
  card.classList.add("active");

  showSection("filtri");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ======================
//  FILTRI: genere/regione/campionato
// ======================
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  const g = btn.dataset.genere;
  const r = btn.dataset.regione;
  const c = btn.dataset.campionato;

  if (g) {
    state.genere = g;
    toggleActive(btn, "[data-genere]");
  }
  if (r) {
    state.regione = r;
    toggleActive(btn, "[data-regione]");
  }
  if (c) {
    state.campionato = c;
    toggleActive(btn, "[data-campionato]");

    // quando scelgo il campionato -> lista società
    await renderSocieta();
    showSection("societa-list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

function toggleActive(btn, selector) {
  btn.parentElement.querySelectorAll(selector).forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// ======================
//  LISTA SOCIETÀ
// ======================
async function renderSocieta() {
  const all = await loadSocieta();
  const cont = document.getElementById("societaContainer");
  cont.innerHTML = "";

  const list = all
    .filter(s =>
      s.sport === state.sport &&
      s.genere === state.genere &&
      s.regione === state.regione &&
      s.campionato === state.campionato
    )
    .sort((a, b) => a.nome.localeCompare(b.nome, "it"));

  if (!list.length) {
    cont.innerHTML = `<p style="padding:1rem;color:#aaa">Nessuna società trovata per i filtri selezionati.</p>`;
    return;
  }

  list.forEach(s => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div><span class="badge">${s.sigla}</span></div>
      <div>
        <a href="#" class="societa-link" data-nome="${s.nome}">${s.nome}</a>
        <p>${s.campionato} · ${s.genere} · ${s.regione}</p>
      </div>
      <div><span class="badge">PM</span></div>
    `;
    cont.appendChild(div);
  });
}

// ======================
//  DETTAGLIO SOCIETÀ
// ======================
document.addEventListener("click", async (e) => {
  const link = e.target.closest(".societa-link");
  if (!link) return;
  e.preventDefault();

  const all = await loadSocieta();
  const nome = link.dataset.nome;
  const s = all.find(x => x.nome === nome);
  if (!s) return;

  document.getElementById("societaDetail").innerHTML = `
    <div class="card">
      <h2>${s.nome}</h2>
      <p>${s.campionato} · ${s.genere} · ${s.regione}</p>
      <div class="filter-group">
        <button class="filter-btn">Informazioni</button>
        <button class="filter-btn">Galleria foto</button>
        <button class="filter-btn">Match in programma</button>
      </div>
    </div>
  `;
  showSection("societa-detail");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ======================
//  HEADER: Allenatore (se serve)
// ======================
document.getElementById("coachBtn")?.addEventListener("click", () => {
  alert("Sezione Allenatore in arrivo");
});

/* =========================
   PreMatch – Router semplice
   Flusso: Sport → Genere → Regione → Campionato → Società → Pagina Società
   ========================= */

const state = {
  sport: null,
  gender: null,
  region: null,
  league: null,
  club: null,
};

/* ===== Mock dati minimi per demo ===== */
const DATA = {
  Calcio: {
    Lazio: {
      Maschile: {
        "Eccellenza": ["ASD Roma Nord", "Virtus Marino"],
        "Promozione": ["Atletico Appio"],
      },
      Femminile: {
        "Eccellenza": ["ASD Roma Nord"],
      }
    },
    Lombardia: { Maschile: { "Eccellenza": ["Lombardia FC"] }, Femminile: { "Eccellenza": ["Women Milano"] } },
  },
  Futsal: {
    Lazio: { Maschile: { "Serie C1": ["Futsal Roma"] }, Femminile: { "Serie C1": ["Lady Five"] } }
  }
};

/* ===== Helpers DOM ===== */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const views = {
  home: $("#view-home"),
  gender: $("#view-gender"),
  region: $("#view-region"),
  league: $("#view-league"),
  clubs: $("#view-clubs"),
  clubPage: $("#view-club"),
};

/* ========= Init ========= */
document.addEventListener("DOMContentLoaded", () => {
  wireHome();
  wireGender();
  wireRegion();
  wireLeague();
  wireClubs();
  wireClubPage();
  show("home");
});

/* ======= Show/hide ======= */
function show(name){
  Object.values(views).forEach(v => v?.classList.add("hidden"));
  views[name]?.classList.remove("hidden");
}

/* ======= HOME ======= */
function wireHome(){
  // sport cards
  $$("#view-home .sport-card").forEach(card => {
    card.addEventListener("click", () => {
      state.sport = card.dataset.sport;
      show("gender");
      highlightChips("#view-gender");
    });
  });
}

/* ======= GENERE ======= */
function wireGender(){
  const box = $("#view-gender");
  box?.addEventListener("click", (e)=>{
    const btn = e.target.closest(".chip");
    if(!btn) return;
    state.gender = btn.dataset.value; // Maschile | Femminile
    show("region");
    renderRegions();
  });
}

function renderRegions(){
  const wrap = $("#region-chips");
  wrap.innerHTML = "";
  const regions = Object.keys(DATA[state.sport] || {});
  regions.forEach(r=>{
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = r;
    b.dataset.value = r;
    b.addEventListener("click", ()=>{
      state.region = r;
      show("league");
      renderLeagues();
    });
    wrap.appendChild(b);
  });
}

/* ======= CAMPIONATO ======= */
function wireRegion(){ /* solo per back buttons se servono */ }

function renderLeagues(){
  const wrap = $("#league-chips");
  wrap.innerHTML = "";
  const leagues = Object.keys(
    (DATA[state.sport]?.[state.region]?.[state.gender]) || {}
  );
  leagues.forEach(l=>{
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = l;
    b.dataset.value = l;
    b.addEventListener("click", ()=>{
      state.league = l;
      show("clubs");
      renderClubs();
    });
    wrap.appendChild(b);
  });
}

/* ======= SOCIETÀ ======= */
function wireLeague(){}

function renderClubs(){
  const list = $("#clubs-list");
  list.innerHTML = "";
  const clubs = (DATA[state.sport]?.[state.region]?.[state.gender]?.[state.league]) || [];
  clubs.forEach(name=>{
    const li = document.createElement("li");
    li.className = "club-item";
    li.innerHTML = `
      <button class="club-row">
        <div class="circle"><img src="assets/logo-pm.svg" alt=""></div>
        <div class="club-meta">
          <div class="club-name">${name}</div>
          <div class="club-sub">${state.league} · ${state.gender} · ${state.region}</div>
        </div>
      </button>`;
    li.querySelector(".club-row").addEventListener("click", ()=>{
      state.club = name;
      buildClubPage();
      show("clubPage");
    });
    list.appendChild(li);
  });
}

/* ======= PAGINA SOCIETÀ ======= */
function wireClubs(){}

function buildClubPage(){
  $("#club-title").textContent = state.club;
  $("#club-subtitle").textContent = `${state.league} • ${state.gender} • ${state.region}`;

  // cerchio logo (uguale al pulsante)
  $("#club-logo").innerHTML = `<div class="circle"><img src="assets/logo-pm.svg" alt=""></div>`;

  // pulsante prematch (stessa dimensione del cerchio logo)
  const btnWrap = $("#club-prematch");
  btnWrap.innerHTML = `
    <button class="prematch-btn" id="createPreMatchBtn">
      <img src="assets/logo-pm-dark.svg" alt="" style="width:52%;height:52%">
    </button>
    <div class="prematch-caption">Crea PreMatch</div>`;
  $("#createPreMatchBtn").addEventListener("click", openPreMatchModal);
}

function wireClubPage(){
  // accordion
  $$("#club .ac-head").forEach(h=>{
    h.addEventListener("click", ()=>{
      h.parentElement.classList.toggle("open");
    });
  });

  // Allenatore — codice convocazioni (lasciato nella pagina Società)
  const coachBtn = $("#coach-code-btn");
  coachBtn?.addEventListener("click", ()=>{
    const code = prompt("Inserisci il codice allenatore");
    if(code && code.trim()){
      // mock: vai a convocazioni (demo)
      alert("Codice accettato ✅ Vai alla pagina Convocazioni (demo).");
    }
  });
}

/* ======= MODALE PREMATCH (demo semplice) ======= */
function openPreMatchModal(){
  const html = `
  <div class="modal">
    <div class="modal-body">
      <h3 style="margin:0 0 10px 0">Crea PreMatch</h3>
      <div class="chips" id="kit-colors"></div>
      <div style="margin-top:12px">
        <label>Data & ora</label>
        <input type="datetime-local" id="pm-dt" class="input">
      </div>
      <div style="margin-top:10px">
        <label>Luogo</label>
        <input type="text" id="pm-loc" class="input" placeholder="Via dello Sport 1, Città">
      </div>
      <div style="margin-top:10px">
        <label>Messaggio (opzionale)</label>
        <textarea id="pm-msg" class="input" rows="3" placeholder="Es. Buonasera mister, confermo divisa ospite verde…"></textarea>
      </div>
      <label style="display:flex;gap:8px;align-items:center;margin-top:10px">
        <input type="checkbox" id="pm-friendly"> Richiedi amichevole
      </label>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:14px">
        <button class="btn" id="pm-cancel">Annulla</button>
        <button class="btn btn--primary" id="pm-ok">Conferma</button>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", html);

  // colori maglia
  const colors = ["#ffffff","#111111","#fbbf24","#ef4444","#60a5fa","#34d399","#f59e0b","#a855f7"];
  const wrap = $("#kit-colors");
  wrap.innerHTML = '<div style="font-weight:700;margin-right:6px">Maglia ospite:</div>';
  colors.forEach(c=>{
    const b = document.createElement("button");
    b.className = "chip";
    b.style.background = c;
    b.style.borderColor = "rgba(0,0,0,.2)";
    b.dataset.value = c;
    b.addEventListener("click", ()=>{
      $$("#kit-colors .chip").forEach(x=>x.classList.remove("chip--active"));
      b.classList.add("chip--active");
    });
    wrap.appendChild(b);
  });

  $("#pm-cancel").onclick = closeModal;
  $("#pm-ok").onclick = ()=>{
    const color = $("#kit-colors .chip--active")?.dataset.value || "#ffffff";
    const when = $("#pm-dt").value || "(da definire)";
    const where = $("#pm-loc").value || "(campo da definire)";
    const msg = $("#pm-msg").value || "";
    const friendly = $("#pm-friendly").checked ? "Sì" : "No";

    alert(
      `PreMatch creato ✅\n\nSocietà: ${state.club}\nCampionato: ${state.league}\nGenere: ${state.gender}\nRegione: ${state.region}\nMaglia ospite: ${color}\nData/ora: ${when}\nCampo: ${where}\nAmichevole: ${friendly}\nMessaggio: ${msg}`
    );
    closeModal();
  };
}

function closeModal(){
  $(".modal")?.remove();
}

/* ===== piccole util ===== */
function highlightChips(scope){
  // mette la classe attiva quando clicchi (feedback visivo)
  $$(scope+" .chip").forEach(ch=>{
    ch.addEventListener("click", ()=>{
      $$(scope+" .chip").forEach(x=>x.classList.remove("chip--active"));
      ch.classList.add("chip--active");
    }, {once:true});
  });
}

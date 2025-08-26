/* PreMatch – app.js (versione adattata alla tua index.html) */

const AppState = {
  sport: null,
  region: null,
  gender: null,
  club: null,
  coachCodeValid: "RMN-2025"
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function navigate(view) {
  $("#app").innerHTML = "";
  if (view === "home") renderHome();
  if (view === "gender") renderGender();
  if (view === "regions") renderRegions();
  if (view === "clubs") renderClubs();
  if (view === "club") renderClub();
  if (view === "coach") renderCoach();
}

function pressFeedback(el, cb, delay = 150) {
  el.classList.add("pressed");
  setTimeout(() => {
    el.classList.remove("pressed");
    cb?.();
  }, delay);
}

/* ---------- RENDER ---------- */
function renderHome() {
  $("#app").innerHTML = `
    <h1>Scegli lo sport</h1>
    <p class="sub">Seleziona per iniziare</p>
    <div class="grid">
      <div class="card sport-card" data-sport="Calcio">
        <img src="./images/calcio.jpg"/><div class="title">Calcio</div>
      </div>
      <div class="card sport-card" data-sport="Futsal">
        <img src="./images/futsal.jpg"/><div class="title">Futsal</div>
      </div>
      <div class="card sport-card" data-sport="Basket">
        <img src="./images/basket.jpg"/><div class="title">Basket</div>
      </div>
      <div class="card sport-card" data-sport="Volley">
        <img src="./images/volley.jpg"/><div class="title">Volley</div>
      </div>
      <div class="card sport-card" data-sport="Rugby">
        <img src="./images/rugby.jpg"/><div class="title">Rugby</div>
      </div>
      <div class="card sport-card" data-sport="Pallanuoto">
        <img src="./images/pallanuoto.jpg"/><div class="title">Pallanuoto</div>
      </div>
    </div>`;
  $$(".sport-card").forEach(c => c.addEventListener("click", () => {
    pressFeedback(c, () => {
      AppState.sport = c.dataset.sport;
      navigate("gender");
    });
  }));
}

function renderGender() {
  $("#app").innerHTML = `
    <h1>Scegli il genere</h1>
    <div class="chips">
      <div id="btnMale" class="chip" data-gender="Maschile">Maschile</div>
      <div id="btnFemale" class="chip" data-gender="Femminile">Femminile</div>
    </div>`;
  $$(".chip").forEach(btn => btn.addEventListener("click", () => {
    pressFeedback(btn, () => {
      AppState.gender = btn.dataset.gender;
      navigate("regions");
    });
  }));
}

function renderRegions() {
  $("#app").innerHTML = `
    <h1>Scegli la regione</h1>
    <div class="chips">
      <div class="chip region-chip" data-region="Lazio">Lazio</div>
      <div class="chip region-chip" data-region="Lombardia">Lombardia</div>
      <div class="chip region-chip" data-region="Sicilia">Sicilia</div>
      <div class="chip region-chip" data-region="Piemonte">Piemonte</div>
      <div class="chip region-chip" data-region="Veneto">Veneto</div>
      <div class="chip region-chip" data-region="Emilia-Romagna">Emilia-Romagna</div>
    </div>`;
  $$(".region-chip").forEach(ch => ch.addEventListener("click", () => {
    pressFeedback(ch, () => {
      AppState.region = ch.dataset.region;
      navigate("clubs");
    });
  }));
}

function renderClubs() {
  $("#app").innerHTML = `
    <h1>Scegli la società</h1>
    <div class="list">
      <div class="row club-item" data-name="ASD Roma Nord" data-level="Eccellenza">ASD Roma Nord</div>
      <div class="row club-item" data-name="Virtus Marino" data-level="Eccellenza">Virtus Marino</div>
    </div>`;
  $$(".club-item").forEach(r => r.addEventListener("click", () => {
    pressFeedback(r, () => {
      AppState.club = {
        name: r.dataset.name,
        level: r.dataset.level,
        gender: AppState.gender,
        region: AppState.region
      };
      navigate("club");
    });
  }));
}

function renderClub() {
  const c = AppState.club;
  $("#app").innerHTML = `
    <h1 id="clubName">${c.name}</h1>
    <p id="clubMeta">${c.level} • ${c.gender} • ${c.region}</p>
    <div class="circles">
      <div class="circle logo"><div class="logo-inner">LOGO</div></div>
      <div id="btnPreMatch" class="circle prematch"><div class="pm-inner">PM</div></div>
    </div>
    <div class="pm-label">Crea PreMatch</div>
    <button id="coachAccessBtn" class="btn">Allenatore</button>
    <div class="accordion"><div class="ac-head">Informazioni</div></div>
    <div class="accordion"><div class="ac-head">Galleria foto</div></div>
    <div class="accordion"><div class="ac-head">Match in programma</div></div>`;
  $("#btnPreMatch").onclick = () => openPreMatchModal();
  $("#coachAccessBtn").onclick = () => {
    const code = prompt("Inserisci il codice allenatore:");
    if (code === AppState.coachCodeValid) navigate("coach");
    else alert("Codice non valido");
  };
}

function renderCoach() {
  $("#app").innerHTML = `
    <h1>Convocazioni</h1>
    <ul id="convList"></ul>
    <button id="convPrint" class="btn btn-primary">Stampa PDF</button>
    <button class="btn" onclick="navigate('club')">Indietro</button>`;
  const players = ["Rossi","Bianchi","Verdi","Neri","Gialli","Blu","Viola","Marroni","Rosa","Azzurri","Grigi"];
  const list = $("#convList");
  players.forEach((p,i)=>{
    const li=document.createElement("li");
    li.innerHTML=`<label class="conv-row"><input type="checkbox" class="conv-check" checked><span>${String(i+1).padStart(2,"0")} — ${p}</span></label>`;
    list.appendChild(li);
  });
  $("#convPrint").onclick = () => {
    const selected = $$(".conv-check").map((cb,i)=>cb.checked?$$(".conv-row span")[i].textContent:null).filter(Boolean);
    const html = `
      <html><head><meta charset="utf-8"/><title>Convocazioni</title></head>
      <body><h1>Convocazioni ${AppState.club?.name||""}</h1><ul>${selected.map(s=>`<li>${s}</li>`).join("")}</ul>
      <script>window.onload=()=>window.print()</script></body></html>`;
    const w=window.open("","_blank"); w.document.write(html); w.document.close();
  };
}

/* ---------- PREMATCH MODAL ---------- */
function openPreMatchModal(){
  const html=`
  <div class="modal open" id="prematchModal">
    <div class="backdrop" onclick="closePreMatchModal()"></div>
    <div class="panel">
      <h2>Crea PreMatch</h2>
      <div class="kit">
        <input type="radio" id="c1" name="kitColor" value="bianco" checked><label style="background:#fff" for="c1"></label>
        <input type="radio" id="c2" name="kitColor" value="nero"><label style="background:#000" for="c2"></label>
        <input type="radio" id="c3" name="kitColor" value="rosso"><label style="background:red" for="c3"></label>
      </div>
      <input id="pmDatetime" type="datetime-local" class="input" />
      <input id="pmPlace" placeholder="Luogo" class="input" />
      <textarea id="pmMessage" placeholder="Messaggio" class="input"></textarea>
      <label><input type="checkbox" id="pmFriendly"> Richiedi amichevole</label>
      <div class="actions">
        <button class="btn" onclick="closePreMatchModal()">Annulla</button>
        <button id="pmConfirm" class="btn btn-primary">Conferma</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML("beforeend",html);
  $("#pmConfirm").onclick=()=>{
    const color=$('input[name="kitColor"]:checked').value;
    const dt=$("#pmDatetime").value; const place=$("#pmPlace").value; const msg=$("#pmMessage").value;
    const fr=$("#pmFriendly").checked;
    alert(`PreMatch creato:\nColore: ${color}\nData: ${dt}\nLuogo: ${place}\nAmichevole: ${fr}\nMessaggio: ${msg}`);
    closePreMatchModal();
  };
}
function closePreMatchModal(){ $("#prematchModal")?.remove(); }

/* ---------- START ---------- */
document.addEventListener("DOMContentLoaded",()=>navigate("home"));

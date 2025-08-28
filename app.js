// === DATA DEMO ===
const regions = ["Lazio", "Lombardia", "Sicilia", "Piemonte"];
const leagues = {
  "Lazio": ["Eccellenza", "Promozione"],
  "Lombardia": ["Serie D", "Eccellenza"],
  "Sicilia": ["Serie C", "Promozione"],
  "Piemonte": ["Serie D", "Promozione"]
};
const clubs = {
  "Calcio|Femminile|Lazio|Eccellenza": [
    { name:"ASD Roma Nord" },
    { name:"Virtus Marino" }
  ],
  "Basket|Maschile|Lombardia|Serie D": [
    { name:"Milano Basket" },
    { name:"Bergamo Hawks" }
  ]
};

// === NAVIGATION ===
function goTo(viewId) {
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");
}

// === STATE ===
let selectedSport = null;
let selectedGender = null;
let selectedRegion = null;
let selectedLeague = null;

// === HOME: sport click ===
document.querySelectorAll(".card-sport").forEach(card=>{
  card.addEventListener("click", ()=>{
    document.querySelectorAll(".card-sport").forEach(c=>c.classList.remove("active"));
    card.classList.add("active");
    selectedSport = card.dataset.sport;
    goTo("view-filters");
    renderRegions();
  });
});

// === BACK buttons ===
document.getElementById("backToHome").addEventListener("click", ()=> goTo("view-home"));
document.getElementById("backToFilters").addEventListener("click", ()=> goTo("view-filters"));

// === BRAND click ===
document.getElementById("brandHome").addEventListener("click",(e)=>{
  e.preventDefault();
  goTo("view-home");
});

// === GENDER ===
document.querySelectorAll("#genderChoices button").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll("#genderChoices button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    selectedGender = btn.dataset.gender;
  });
});

// === REGIONS ===
function renderRegions() {
  const box = document.getElementById("regionChoices");
  box.innerHTML = "";
  regions.forEach(r=>{
    const btn = document.createElement("button");
    btn.textContent = r;
    btn.addEventListener("click", ()=>{
      [...box.children].forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      selectedRegion = r;
      renderLeagues(r);
    });
    box.appendChild(btn);
  });
}

// === LEAGUES ===
function renderLeagues(region) {
  const box = document.getElementById("leagueChoices");
  box.innerHTML = "";
  leagues[region].forEach(l=>{
    const btn = document.createElement("button");
    btn.textContent = l;
    btn.addEventListener("click", ()=>{
      [...box.children].forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      selectedLeague = l;
      showClubs();
    });
    box.appendChild(btn);
  });
}

// === CLUBS ===
function showClubs() {
  goTo("view-clubs");
  const title = document.getElementById("clubsTitle");
  title.textContent = `${selectedSport} • ${selectedGender} • ${selectedRegion} • ${selectedLeague}`;
  
  const list = document.getElementById("clubsList");
  list.innerHTML = "";
  const key = `${selectedSport}|${selectedGender}|${selectedRegion}|${selectedLeague}`;
  const data = clubs[key] || [];
  
  if(data.length===0){
    list.innerHTML = "<p>Nessuna società trovata.</p>";
    return;
  }
  data.forEach(club=>{
    const card = document.createElement("div");
    card.className="club-card";
    card.innerHTML = `
      <div class="club-info">
        <strong>${club.name}</strong><br>
        ${selectedLeague} • ${selectedGender} • ${selectedRegion}
      </div>
      <button class="club-btn">PM</button>
    `;
    list.appendChild(card);
  });
}

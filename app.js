// Lista sport in ordine scelto
const SPORTS = [
  { key: "Calcio",       img: "images/calcio.jpg" },
  { key: "Futsal",       img: "images/futsal.jpg" },
  { key: "Basket",       img: "images/basket.jpg" },
  { key: "Rugby",        img: "images/rugby.jpg" },
  { key: "Volley",       img: "images/volley.jpg" },
  { key: "Beach Volley", img: "images/beachvolley.jpg" },
  { key: "Pallanuoto",   img: "images/pallanuoto.jpg" },
];

// Società fittizie per test
const CLUBS = {
  Calcio: [
    { name: "AS Roma", info: "Roma (Stadio Olimpico)", matches: ["vs Milan - Domenica 15:00", "vs Napoli - Mercoledì 20:45"] },
    { name: "Juventus", info: "Torino (Allianz Stadium)", matches: ["vs Inter - Sabato 18:00"] }
  ],
  Futsal: [
    { name: "Futsal Roma", info: "Roma", matches: ["vs Lazio Futsal - Venerdì 21:00"] },
    { name: "Lazio Futsal", info: "Roma", matches: [] }
  ],
  Basket: [
    { name: "Virtus Bologna", info: "Bologna", matches: ["vs Milano - Domenica 18:00"] },
    { name: "Olimpia Milano", info: "Milano", matches: [] }
  ],
  Rugby: [
    { name: "Benetton Treviso", info: "Treviso", matches: ["vs Zebre - Sabato 16:00"] },
    { name: "Zebre Parma", info: "Parma", matches: [] }
  ],
  Volley: [
    { name: "Sir Safety Perugia", info: "Perugia", matches: ["vs Modena - Domenica 17:00"] },
    { name: "Modena Volley", info: "Modena", matches: [] }
  ],
  "Beach Volley": [
    { name: "Beach Team Roma", info: "Roma", matches: ["Torneo Estivo - Sabato 10:00"] },
    { name: "Beach Milano", info: "Milano", matches: [] }
  ],
  Pallanuoto: [
    { name: "Pro Recco", info: "Genova", matches: ["vs Brescia - Domenica 15:00"] },
    { name: "Brescia PN", info: "Brescia", matches: [] }
  ]
};

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelector(id).classList.add('active');
}

// Carica sport in home
const sportsDiv = document.getElementById("sports");
SPORTS.forEach(s => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<img src="${s.img}" alt="${s.key}" /><span>${s.key}</span>`;
  card.onclick = () => loadClubs(s.key);
  sportsDiv.appendChild(card);
});

// Carica società
function loadClubs(sport) {
  const clubsList = document.getElementById("clubsList");
  clubsList.innerHTML = "";
  CLUBS[sport].forEach(c => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<span>${c.name}</span>`;
    card.onclick = () => loadClubDetail(c);
    clubsList.appendChild(card);
  });
  show("#clubs");
}

// Carica dettagli società
function loadClubDetail(club) {
  document.getElementById("clubName").textContent = club.name;
  document.getElementById("clubInfo").textContent = club.info;
  const matchesList = document.getElementById("clubMatches");
  matchesList.innerHTML = "";
  club.matches.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m;
    matchesList.appendChild(li);
  });
  show("#clubDetail");
}

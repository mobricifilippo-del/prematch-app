const sports = [
  { nome: "Calcio", img: "images/calcio.jpg" },
  { nome: "Futsal", img: "images/futsal.jpg" },
  { nome: "Basket", img: "images/basket.jpg" },
  { nome: "Rugby", img: "images/rugby.jpg" },
  { nome: "Volley", img: "images/volley.jpg" },
  { nome: "Beach Volley", img: "images/beachvolley.jpg" },
  { nome: "Pallanuoto", img: "images/pallanuoto.jpg" }
];

function loadSports() {
  const container = document.getElementById("sports-grid");
  container.innerHTML = "";
  sports.forEach(sport => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${sport.img}" alt="${sport.nome}">
      <h3>${sport.nome}</h3>
    `;
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadSports);

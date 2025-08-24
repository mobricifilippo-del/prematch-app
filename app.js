// Funzione per mostrare una sezione e nascondere le altre
function show(id) {
  document.querySelectorAll(".screen").forEach(sec => sec.classList.remove("active"));
  document.querySelector(id).classList.add("active");
}

// Gestione click sugli sport
document.addEventListener("DOMContentLoaded", () => {
  const sportCards = document.querySelectorAll(".sport-card");

  sportCards.forEach(card => {
    card.addEventListener("click", () => {
      const sport = card.dataset.sport;
      // Mostra la pagina dedicata allo sport
      show("#sport-page");
      document.querySelector("#sport-name").innerText = sport;
    });
  });
});

// Connessione Supabase
const { createClient } = supabase;
const supabaseUrl = "https://TUO-PROJECT-REF.supabase.co";
const supabaseKey = "TUO-API-KEY";
const db = createClient(supabaseUrl, supabaseKey);

async function loadSports() {
  let { data, error } = await db.from("sports").select("*");
  if (error) {
    console.error(error);
    return;
  }
  const container = document.getElementById("sports-list");
  container.innerHTML = "";
  data.forEach(sport => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${sport.nome}</h3>
      <img src="images/${sport.nome.toLowerCase()}.jpg" alt="${sport.nome}">
    `;
    container.appendChild(card);
  });
}

// Carica sport quando la pagina è pronta
document.addEventListener("DOMContentLoaded", loadSports);

/* ====== PreMatch app.js ====== */

const supabase = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

// Stato
const state = { sport:null, regione:null, genere:null, club:null };

// Utils
function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}

// HOME: SPORT
const sportsGrid = document.getElementById("sportsGrid");
async function renderSports(){
  sportsGrid.innerHTML = "";
  const { data, error } = await supabase.from("sports").select("id,nome").order("nome");
  if(error){ sportsGrid.innerHTML = `<p class="path">Errore sport</p>`; return; }

  const IMG = {
    "Calcio":"images/calcio.jpg","Futsal":"images/futsal.jpg","Basket":"images/basket.jpg",
    "Rugby":"images/rugby.jpg","Volley":"images/volley.jpg",
    "Beach Volley":"images/beachvolley.jpg","Pallanuoto":"images/pallanuoto.jpg"
  };

  data.forEach(sp=>{
    const el=document.createElement("article");
    el.className="sport-card";
    el.innerHTML=`<img src="${IMG[sp.nome]||"images/calcio.jpg"}" alt="${sp.nome}"><div class="label">${sp.nome}</div>`;
    el.onclick=()=>selectSport(sp);
    sportsGrid.appendChild(el);
  });
}
function selectSport(sp){
  state.sport=sp; state.regione=null; state.genere=null; state.club=null;
  document.getElementById("pathSport").textContent=sp.nome;
  renderRegioni(); show("regioni");
}

// REGIONI
const regioniGrid = document.getElementById("regioniGrid");
async function renderRegioni(){
  regioniGrid.innerHTML="";
  const { data, error } = await supabase.from("regioni").select("id,nome").order("nome");
  if(error){ regioniGrid.innerHTML=`<p class="path">Errore regioni</p>`; return; }
  data.forEach(r=>{
    const b=document.createElement("button");
    b.className="pill"; b.textContent=r.nome; b.onclick=()=>selectRegione(r);
    regioniGrid.appendChild(b);
  });
}
function selectRegione(r){
  state.regione=r;
  document.getElementById("pathSport2").textContent=state.sport.nome;
  document.getElementById("pathRegione").textContent=r.nome;
  show("genere");
}

// GENERE
document.querySelector('#genere [data-genere="Maschile"]').onclick=()=>{ state.genere="Maschile"; loadClubs(); };
document.querySelector('#genere [data-genere="Femminile"]').onclick=()=>{ state.genere="Femminile"; loadClubs(); };

// SOCIETÀ
const clubsGrid = document.getElementById("clubsGrid");
async function loadClubs(){
  document.getElementById("pathSport3").textContent=state.sport.nome;
  document.getElementById("pathRegione2").textContent=state.regione.nome;
  document.getElementById("pathGenere").textContent=state.genere;

  clubsGrid.innerHTML=`<p class="path">Carico società…</p>`;

  const { data, error } = await supabase
    .from("societa")
    .select("id,nome,citta")
    .eq("sport_id", state.sport.id)
    .eq("regione_id", state.regione.id)
    .order("nome");

  if(error){ clubsGrid.innerHTML=`<p class="path">Errore società</p>`; return; }
  if(!data?.length){ clubsGrid.innerHTML=`<p class="path">Nessuna società trovata.</p>`; show("clubs"); return; }

  clubsGrid.innerHTML="";
  data.forEach(club=>{
    const row=document.createElement("div");
    row.className="club-card";
    row.innerHTML=`<div class="club-name">${club.nome}${club.citta?` — ${club.citta}`:""}</div><button class="pill">Apri</button>`;
    row.querySelector("button").onclick=()=>openClub(club);
    clubsGrid.appendChild(row);
  });
  show("clubs");
}

// DETTAGLIO CLUB
async function openClub(club){
  state.club=club;
  document.getElementById("clubTitle").textContent=club.nome;
  document.getElementById("pathSport4").textContent=state.sport.nome;
  document.getElementById("pathRegione3").textContent=state.regione.nome;
  document.getElementById("pathGenere2").textContent=state.genere;

  await Promise.all([renderMatches(club.id), renderSponsors(club.id)]);
  show("clubDetail");
}

// PARTITE
async function renderMatches(societaId){
  const wrap=document.getElementById("matchesList");
  wrap.innerHTML=`<p class="path">Carico partite…</p>`;

  const { data: squads, error:e1 } = await supabase
    .from("squadre").select("id,nome").eq("societa_id", societaId);
  if(e1){ wrap.innerHTML=`<p class="path">Errore squadre</p>`; return; }
  if(!squads?.length){ wrap.innerHTML=`<p class="path">Nessuna squadra registrata.</p>`; return; }

  const ids=squads.map(s=>s.id);
  const nameById=Object.fromEntries(squads.map(s=>[s.id,s.nome]));
  const now=new Date(); const end=new Date(Date.now()+1000*60*60*24*60);

  const { data: matches, error:e2 } = await supabase
    .from("partite")
    .select("id,data,luogo,squadra1_id,squadra2_id")
    .gte("data", now.toISOString())
    .lte("data", end.toISOString())
    .or(`squadra1_id.in.(${ids.join(",")}),squadra2_id.in.(${ids.join(",")})`)
    .order("data",{ascending:true}).limit(8);

  if(e2){ wrap.innerHTML=`<p class="path">Errore partite</p>`; return; }
  if(!matches?.length){ wrap.innerHTML=`<p class="path">Nessuna partita in programma.</p>`; return; }

  wrap.innerHTML="";
  matches.forEach(m=>{
    const d=new Date(m.data);
    const vs=`${nameById[m.squadra1_id]||"—"} vs ${nameById[m.squadra2_id]||"—"}`;
    const row=document.createElement("div");
    row.className="item";
    row.innerHTML=`<div><b>${vs}</b></div>
      <div>${d.toLocaleDateString()} ${d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} — ${m.luogo||""}</div>`;
    wrap.appendChild(row);
  });
}

// SPONSOR
async function renderSponsors(societaId){
  const wrap=document.getElementById("sponsorList");
  wrap.innerHTML=`<span class="badge">Carico sponsor…</span>`;

  const today=new Date().toISOString();
  const { data: links, error:e1 } = await supabase
    .from("sponsorizzazioni")
    .select("sponsor_id,dal,al")
    .eq("societa_id", societaId)
    .lte("dal", today)
    .or(`al.is.null,al.gte.${today}`);
  if(e1){ wrap.innerHTML=`<span class="badge">Errore</span>`; return; }
  if(!links?.length){ wrap.innerHTML=`<span class="badge">Nessuno sponsor attivo</span>`; return; }

  const ids=links.map(l=>l.sponsor_id);
  const { data: sponsors, error:e2 } = await supabase
    .from("sponsors").select("id,nome,logo_url,sito").in("id", ids);
  if(e2){ wrap.innerHTML=`<span class="badge">Errore</span>`; return; }

  wrap.innerHTML="";
  sponsors.forEach(sp=>{
    const a=document.createElement("a");
    a.className="badge"; a.href=sp.sito||"#"; a.target="_blank"; a.rel="noopener";
    a.textContent=sp.nome; wrap.appendChild(a);
  });
}

// BACK
document.getElementById("backFromRegioni").onclick=()=>show("home");
document.getElementById("backFromGenere").onclick=()=>show("regioni");
document.getElementById("backFromClubs").onclick=()=>show("genere");
document.getElementById("backFromDetail").onclick=()=>show("clubs");

// AVVIO
document.addEventListener("DOMContentLoaded",()=>{ renderSports(); });

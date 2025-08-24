import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ====== CONFIG SUPABASE (le tue) ======
const SUPABASE_URL = 'https://hzzhypahrzclvfepstro.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6emh5cGFocnpjbHZmZXBzdHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDAxNDUsImV4cCI6MjA3MTAxNjE0NX0.7niKgLcuDKQZQZxkQfxMYzz9fPT4Mm5wzWeq6r87TIY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ====== UI refs ======
const title = document.querySelector('#title');
const grid = document.querySelector('#grid');
const list = document.querySelector('#list');
const backBtn = document.querySelector('#backBtn');

// ====== Immagini sport (assicurati che esistano in /images) ======
const IMG = {
  'Calcio': 'images/calcio.jpg',
  'Futsal': 'images/futsal.jpg',
  'Basket': 'images/basket.jpg',
  'Rugby': 'images/rugby.jpg',
  'Volley': 'images/volley.jpg',
  'Beach Volley': 'images/beach-volley.jpg',
  'Pallanuoto': 'images/pallanuoto.jpg'
};

// ====== Navigazione stack ======
const stack = [];
function push(view) { stack.push(view); updateBack(); }
function pop() { stack.pop(); updateBack(); }
function updateBack() { backBtn.style.display = stack.length ? 'inline' : 'none'; }
backBtn.addEventListener('click', async () => {
  if (!stack.length) return;
  stack.pop(); // rimuovo view corrente
  const prev = stack[stack.length - 1];
  if (!prev) { start(); return; }
  if (prev.type === 'sports') await loadSports();
  if (prev.type === 'clubs') await loadClubs(prev.sportId, prev.sportName);
  if (prev.type === 'matches') await loadMatches(prev.societaId, prev.societaName);
});

// ====== START (SPORT) ======
window.start = start;
export async function start() {
  stack.length = 0;
  updateBack();
  await loadSports();
}

async function loadSports() {
  title.textContent = 'Scegli lo sport';
  grid.style.display = 'grid';
  list.style.display = 'none';
  grid.innerHTML = '...';

  const { data, error } = await supabase
    .from('sports')
    .select('id, nome')
    .order('posizione', { ascending: true });

  if (error) { grid.innerHTML = msgError(error); return; }

  grid.innerHTML = data.map(s => sportCard(s)).join('');
  grid.querySelectorAll('.sport-card').forEach(el => {
    el.addEventListener('click', () => {
      push({ type: 'clubs', sportId: el.dataset.id, sportName: el.dataset.nome });
      loadClubs(el.dataset.id, el.dataset.nome);
    });
  });

  // salviamo view per "back"
  if (!stack.length) push({ type: 'sports' });
}

function sportCard(s) {
  const img = IMG[s.nome] || 'images/fallback.jpg';
  return `
    <button class="card sport-card" data-id="${s.id}" data-nome="${s.nome}">
      <img src="${img}" alt="${s.nome}">
      <div class="card-title">${s.nome}</div>
    </button>`;
}

// ====== SOCIETÀ PER SPORT ======
async function loadClubs(sportId, sportName) {
  title.textContent = sportName;
  grid.style.display = 'grid';
  list.style.display = 'none';
  grid.innerHTML = '...';

  const { data, error } = await supabase
    .from('societa')
    .select('id, nome, citta')
    .eq('sport_id', sportId)
    .order('nome', { ascending: true });

  if (error) { grid.innerHTML = msgError(error); return; }

  grid.innerHTML = data.length
    ? data.map(c => `
        <button class="card club-card" data-id="${c.id}" data-nome="${escapeHtml(c.nome)}">
          <img src="images/club.jpg" alt="${escapeHtml(c.nome)}">
          <div class="card-title">${escapeHtml(c.nome)}</div>
          <div class="card-sub">${c.citta ? escapeHtml(c.citta) : ''}</div>
        </button>`).join('')
    : `<p>Nessuna società trovata.</p>`;

  grid.querySelectorAll('.club-card').forEach(el => {
    el.addEventListener('click', () => {
      push({ type: 'matches', societaId: el.dataset.id, societaName: el.dataset.nome });
      loadMatches(el.dataset.id, el.dataset.nome);
    });
  });
}

// ====== PARTITE PER SOCIETÀ ======
async function loadMatches(societaId, societaName) {
  title.textContent = `Partite — ${societaName}`;
  grid.style.display = 'none';
  list.style.display = 'block';
  list.innerHTML = '...';

  // 1) squadre della società
  const { data: teams, error: errTeams } = await supabase
    .from('squadre')
    .select('id, nome')
    .eq('societa_id', societaId);

  if (errTeams) { list.innerHTML = msgError(errTeams); return; }
  if (!teams.length) { list.innerHTML = `<p>Nessuna squadra registrata.</p>`; return; }

  const teamIds = teams.map(t => t.id);

  // 2) partite dove gioca una di queste squadre
  // NB: due query (squadra1 e squadra2) e poi merge lato client per semplicità
  const { data: p1, error: e1 } = await supabase
    .from('partite')
    .select('id, data, luogo, squadra1_id, squadra2_id')
    .in('squadra1_id', teamIds)
    .order('data', { ascending: true });

  const { data: p2, error: e2 } = await supabase
    .from('partite')
    .select('id, data, luogo, squadra1_id, squadra2_id')
    .in('squadra2_id', teamIds)
    .order('data', { ascending: true });

  if (e1 || e2) { list.innerHTML = msgError(e1 || e2); return; }

  // 3) map id->nome squadre per mostrare nomi
  const allTeamIds = Array.from(new Set([...teamIds, ...((p1||[]).map(x=>x.squadra2_id)), ...((p2||[]).map(x=>x.squadra1_id))].filter(Boolean)));
  const { data: otherTeams } = await supabase
    .from('squadre')
    .select('id, nome')
    .in('id', allTeamIds);

  const byId = {};
  [...teams, ...(otherTeams || [])].forEach(t => { byId[t.id] = t.nome; });

  const matches = [...(p1||[]), ...(p2||[])].sort((a,b)=>new Date(a.data)-new Date(b.data));

  if (!matches.length) {
    list.innerHTML = `<p>Nessuna partita programmata.</p>`;
  } else {
    list.innerHTML = matches.map(m => {
      const d = new Date(m.data);
      const when = d.toLocaleString('it-IT', { weekday:'short', day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
      const s1 = byId[m.squadra1_id] || 'S1';
      const s2 = byId[m.squadra2_id] || 'S2';
      return `
        <div class="item">
          <span class="badge">${when}</span>
          <div>
            <div class="title">${escapeHtml(s1)} vs ${escapeHtml(s2)}</div>
            <div class="meta">${m.luogo ? escapeHtml(m.luogo) : ''}</div>
          </div>
        </div>`;
    }).join('');
  }

  // 4) sponsors della società (sotto le partite)
  await loadSponsorsBlock(societaId);
}

// ====== SPONSOR DELLA SOCIETÀ ======
async function loadSponsorsBlock(societaId) {
  const { data: links, error } = await supabase
    .from('sponsorizzazioni')
    .select('sponsor_id, dal, al')
    .eq('societa_id', societaId);

  if (error) {
    list.insertAdjacentHTML('beforeend', msgError(error));
    return;
  }

  if (!links.length) {
    list.insertAdjacentHTML('beforeend', `<p style="margin-top:18px;color:#9ca3af">Nessuno sponsor collegato.</p>`);
    return;
  }

  const sponsorIds = links.map(l => l.sponsor_id);
  const { data: sponsors } = await supabase
    .from('sponsors')
    .select('id, nome, logo_url')
    .in('id', sponsorIds);

  list.insertAdjacentHTML('beforeend', `<h3 style="margin-top:22px;">Sponsor</h3>`);
  (sponsors || []).forEach(sp => {
    const logo = sp.logo_url ? `<img src="${sp.logo_url}" alt="${escapeHtml(sp.nome)}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;">` : '';
    list.insertAdjacentHTML('beforeend', `
      <div class="item">
        ${logo}
        <div>
          <div class="title">${escapeHtml(sp.nome)}</div>
          <div class="meta">Partner della società</div>
        </div>
      </div>`);
  });
}

// ====== Helpers ======
function msgError(e) {
  return `<p style="color:#f87171;background:#3b0a0a;padding:10px;border-radius:8px">Errore: ${escapeHtml(e?.message || 'sconosciuto')}</p>`;
}
function escapeHtml(s='') {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// avvio
start();

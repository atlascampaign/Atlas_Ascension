// Vista mobile del talent tree: albero verticale (nodo iniziale in basso) per tablet e smartphone.
// Dati: ../utils/trees.json (disposizione, generato da tools/build_trees.py), ../utils/<personaggio>.json (testi)
// e il database (punti disponibili, nodi sbloccati) tramite lo stesso client usato dalle pagine classiche.

const character = window.ViewMode && ViewMode.character;
const client = createLocalClient();

const ASCENSION = {
  hesperia: 'Astromanzia',
  fedra: 'Primofulmine',
  erevan: 'Circolo della Vanità',
  narkran: "Sentinella dell'Equilibrio",
  yvette: 'Driade Iridescente',
  raziel: 'Sacerdote Cinereo'
};

const LINE_COLOR = {
  narkran: 'rgba(253, 88, 88, 0.9)',
  hesperia: 'rgb(255, 196, 1)',
  fedra: 'rgb(112, 195, 201)',
  erevan: 'rgb(51, 141, 66)',
  raziel: 'rgb(228, 228, 228)',
  yvette: 'rgb(212, 62, 62)'
};

const CAPSTONE = 'p13';          // si apre da solo dopo aver sbloccato 8 nodi (come nelle pagine classiche)
const CAPSTONE_THRESHOLD = 8;

const $ = (id) => document.getElementById(id);

let tree = null;       // disposizione e mappa di sblocco del personaggio
let abilities = {};    // testi dei nodi
let available = 0;     // rimembranze (punti) disponibili
let unlocked = {};     // { pN: true } nodi sbloccati
let selected = null;
let busy = false;

// ---------------------------------------------------------------- stato

function clickedSet() {
  return new Set(Object.keys(unlocked).filter((p) => unlocked[p] === true));
}

// Nodi che si possono sbloccare: p1, i figli dei nodi sbloccati e il nodo finale dopo 8 sblocchi
function reachableSet() {
  const clicked = clickedSet();
  const reach = new Set(['p1']);
  clicked.forEach((p) => (tree.unlock[p] || []).forEach((c) => reach.add(c)));
  if (clicked.size >= CAPSTONE_THRESHOLD && tree.nodes[CAPSTONE]) reach.add(CAPSTONE);
  return reach;
}

// Percorso lineare: dopo aver sbloccato un nodo, gli altri nodi dello stesso livello non sono piu' selezionabili.
// Sono esclusi il nodo finale e i nodi senza livello (depth null in trees.json).
function blockedSet(clicked) {
  const taken = new Set();
  clicked.forEach((p) => { if (p !== CAPSTONE && tree.nodes[p]?.depth != null) taken.add(tree.nodes[p].depth); });
  const blocked = new Set();
  Object.entries(tree.nodes).forEach(([p, n]) => {
    if (p !== CAPSTONE && n.depth != null && !clicked.has(p) && taken.has(n.depth)) blocked.add(p);
  });
  return blocked;
}

function stateOf(pid, clicked, reach, blocked) {
  if (clicked.has(pid)) return 'done';
  if (blocked.has(pid)) return 'blocked';
  return reach.has(pid) ? 'open' : 'locked';
}

function currentState(pid) {
  const clicked = clickedSet();
  return stateOf(pid, clicked, reachableSet(), blockedSet(clicked));
}

// ---------------------------------------------------------------- disegno

function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2400);
}

function buildTree() {
  const rows = $('rows');
  rows.innerHTML = '';
  const byRow = [];
  Object.entries(tree.nodes).forEach(([pid, n]) => {
    (byRow[n.level] = byRow[n.level] || []).push([pid, n]);
  });
  // il livello piu' alto va in cima, p1 in fondo
  for (let level = byRow.length - 1; level >= 0; level--) {
    const row = document.createElement('div');
    row.className = 'row';
    (byRow[level] || []).forEach(([pid, n]) => {
      const node = document.createElement('button');
      node.className = 'node';
      node.dataset.p = pid;
      node.style.left = n.x * 100 + '%';
      node.innerHTML = '<span class="orb"></span>';
      node.querySelector('.orb').style.backgroundImage = `url('../images/${character}/bg_${pid}.png')`;
      node.addEventListener('click', () => openSheet(pid));
      row.appendChild(node);
    });
    rows.appendChild(row);
  }
}

function refresh() {
  const clicked = clickedSet();
  const reach = reachableSet();
  const blocked = blockedSet(clicked);
  $('points-count').textContent = available;

  document.querySelectorAll('.node').forEach((node) => {
    const pid = node.dataset.p;
    const state = stateOf(pid, clicked, reach, blocked);
    // un nodo escluso che non era ancora stato rivelato resta con il lucchetto
    node.classList.toggle('locked', state === 'locked' || (state === 'blocked' && !reach.has(pid)));
    node.classList.toggle('blocked', state === 'blocked');
    node.classList.toggle('done', state === 'done');
    node.classList.toggle('start', pid === 'p1');
    node.classList.toggle('affordable', state === 'open' && available > 0);
    node.classList.toggle('selected', pid === selected);
    // il nome non e' scritto sotto il nodo: si legge aprendo la descrizione (qui solo per i lettori di schermo)
    const showTitle = state === 'done' || state === 'open' || (state === 'blocked' && reach.has(pid));
    if (showTitle && abilities[pid]?.titolo) node.setAttribute('aria-label', abilities[pid].titolo);
    else node.removeAttribute('aria-label');
  });
  drawLines(clicked);
}

function drawLines(clicked) {
  const svg = $('lines');
  const color = LINE_COLOR[character] || LINE_COLOR.hesperia;
  const origin = svg.getBoundingClientRect();
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${origin.width} ${origin.height}`);
  svg.setAttribute('preserveAspectRatio', 'none');

  const center = (pid) => {
    const r = document.querySelector(`.node[data-p="${pid}"] .orb`).getBoundingClientRect();
    return [r.left - origin.left + r.width / 2, r.top - origin.top + r.height / 2];
  };
  const line = (a, b, stroke, width, opacity) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    el.setAttribute('x1', a[0]);
    el.setAttribute('y1', a[1]);
    el.setAttribute('x2', b[0]);
    el.setAttribute('y2', b[1]);
    el.setAttribute('stroke', stroke);
    el.setAttribute('stroke-width', width);
    el.setAttribute('stroke-linecap', 'round');
    if (opacity) el.setAttribute('opacity', opacity);
    svg.appendChild(el);
  };

  const done = [];
  tree.edges.forEach(([a, b]) => {
    const pa = center(a), pb = center(b);
    if (clicked.has(a) && clicked.has(b)) {
      done.push([pa, pb]);
    } else {
      line(pa, pb, 'rgba(6, 71, 99, 0.9)', 2, 0.55);
    }
  });
  // le linee attive sopra quelle spente, con il bordo scuro come nelle pagine classiche
  done.forEach(([pa, pb]) => line(pa, pb, 'rgba(22, 22, 22, 0.8)', 7));
  done.forEach(([pa, pb]) => line(pa, pb, color, 4));
}

// ---------------------------------------------------------------- pannello nodo

function closeSheet() {
  selected = null;
  $('sheet').classList.remove('open');
  document.body.classList.remove('sheet-open');
  document.querySelectorAll('.node.selected').forEach((n) => n.classList.remove('selected'));
  if (tree) drawLines(clickedSet()); // l'albero torna alla sua altezza: le linee vanno ricalcolate
}

function openSheet(pid) {
  if (selected === pid) return closeSheet();
  selected = pid;
  const state = currentState(pid);
  const sheet = $('sheet');

  // Un nodo escluso dalla regola del percorso lineare mostra comunque la descrizione, se era gia' visibile
  const revealed = state === 'done' || state === 'open' || (state === 'blocked' && reachableSet().has(pid));

  if (!revealed) {
    sheet.innerHTML = '<h3>???</h3><p class="hint">Sblocca un nodo collegato per rivelare questo ricordo.</p>';
  } else {
    const a = abilities[pid];
    const body = a
      ? `<div class="text">${a.abilita.replace(/\n/g, '<br>')}<span class="quote">${a.quote}</span></div>`
      : '<p class="hint">Descrizione non ancora disponibile.</p>';
    sheet.innerHTML = `<h3>${a ? a.titolo : 'Nodo'}</h3>${body}`;

    if (state === 'open') {
      const btn = document.createElement('button');
      btn.className = 'action';
      btn.disabled = available <= 0;
      btn.textContent = available > 0 ? 'Sblocca' : 'Nessuna rimembranza disponibile';
      btn.addEventListener('click', () => unlockNode(pid));
      sheet.appendChild(btn);
    } else if (state === 'blocked') {
      sheet.insertAdjacentHTML('beforeend',
        '<p class="hint">Non selezionabile: hai già sbloccato un altro nodo di questo livello.</p>');
    }
  }
  sheet.scrollTop = 0;
  sheet.classList.add('open');
  document.body.classList.add('sheet-open'); // spazio in fondo, per poter scorrere i nodi sopra al pannello
  refresh();
  revealNode(pid);
}

// Porta il nodo scelto sopra al pannello, cosi' non resta coperto
function revealNode(pid) {
  const r = document.querySelector(`.node[data-p="${pid}"] .orb`).getBoundingClientRect();
  const limit = window.innerHeight - $('sheet').offsetHeight - 70; // 70px per l'etichetta del nodo
  const top = 90; // sotto la barra in alto
  if (r.bottom > limit) window.scrollBy({ top: r.bottom - limit, behavior: 'smooth' });
  else if (r.top < top) window.scrollBy({ top: r.top - top, behavior: 'smooth' });
}

// Un tocco fuori dal pannello e dai nodi torna alla vista totale
document.addEventListener('click', (e) => {
  if (selected && !e.target.closest('#sheet, .node, #drawer, #menu-btn')) closeSheet();
});

// ---------------------------------------------------------------- azioni sul database

async function unlockNode(pid) {
  if (busy || available <= 0 || currentState(pid) !== 'open') return;
  busy = true;
  try {
    const spent = await client.rpc('decrement_available_points', { player_name: character });
    if (spent.error) throw new Error(spent.error.message);

    const current = await client.from('points').select('unlocked').eq('player', character).single();
    if (current.error) throw new Error(current.error.message);
    const next = { ...(current.data.unlocked || {}), [pid]: true };
    const saved = await client.from('points').update({ unlocked: next }).eq('player', character);
    if (saved.error) throw new Error(saved.error.message);

    unlocked = next;
    available -= 1;
    closeSheet();
    refresh();
  } catch (e) {
    console.error(e);
    toast('Qualcosa è andato storto, riprova.');
  } finally {
    busy = false;
  }
}

// Oblio: azzera i talenti e restituisce un punto per ogni nodo sbloccato (i punti li assegna il DM)
async function forget() {
  if (busy || !confirm('Dimenticare tutti i talenti sbloccati? Le rimembranze ti verranno restituite.')) return;
  busy = true;
  try {
    const reset = Object.fromEntries(Object.keys(unlocked).map((k) => [k, false]));
    const refund = clickedSet().size;
    const saved = await client.from('points').update({ unlocked: reset, available: available + refund }).eq('player', character);
    if (saved.error) throw new Error(saved.error.message);

    unlocked = reset;
    available += refund;
    closeDrawer();
    closeSheet();
    refresh();
  } catch (e) {
    console.error(e);
    toast('Qualcosa è andato storto, riprova.');
  } finally {
    busy = false;
  }
}

// ---------------------------------------------------------------- menu

function openDrawer() { document.body.classList.add('drawer-open'); }
function closeDrawer() { document.body.classList.remove('drawer-open'); }

$('menu-btn').addEventListener('click', openDrawer);
$('backdrop').addEventListener('click', closeDrawer);
$('forget-btn').addEventListener('click', forget);
$('view-btn').addEventListener('click', () => ViewMode.switchTo('classic'));

// ---------------------------------------------------------------- avvio

async function init() {
  const [trees, texts, row] = await Promise.all([
    fetch('../utils/trees.json').then((r) => r.json()),
    fetch(`../utils/${character}.json`).then((r) => r.json()).catch(() => ({})),
    client.from('points').select('available, unlocked').eq('player', character).single()
  ]);
  tree = trees[character];
  if (!tree) throw new Error(`personaggio sconosciuto: ${character}`);
  if (row.error) throw new Error(row.error.message);

  abilities = texts;
  available = row.data.available || 0;
  unlocked = row.data.unlocked || {};

  document.title = `Atlas - ${ASCENSION[character]}`;
  $('char-name').textContent = character;
  $('asc').textContent = ASCENSION[character];
  document.documentElement.style.setProperty('--line-color', LINE_COLOR[character] || LINE_COLOR.hesperia);
  if (tree.background) $('bg').style.backgroundImage = `url('${tree.background}')`;

  buildTree();
  refresh();
  // si parte dal basso, dove c'e' il nodo iniziale
  window.scrollTo(0, document.documentElement.scrollHeight);
  // Le linee dipendono dalle dimensioni dell'albero (cambiano quando il pannello si apre o si chiude)
  new ResizeObserver(() => drawLines(clickedSet())).observe($('lines'));
}

if (character) {
  init().catch((e) => {
    console.error(e);
    toast('Impossibile caricare i dati. Riprova più tardi.');
  });
}

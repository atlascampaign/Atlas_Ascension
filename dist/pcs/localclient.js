// Client minimale compatibile con la parte di supabase-js usata dal sito,
// che legge e scrive su Firebase Realtime Database tramite la sua API REST.
// Layout del database: /points/{player} = {available, unlocked}
// I punti disponibili (available) vengono assegnati a mano dal DM.
const FIREBASE_URL = 'https://atlas-ascension-default-rtdb.europe-west1.firebasedatabase.app';

function createLocalClient() {
  async function request(path, method = 'GET', body) {
    const res = await fetch(`${FIREBASE_URL}/${path}.json`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Firebase ${res.status}: ${await res.text()}`);
    return res.json();
  }

  // Restituisce le righe di una tabella come array, con la chiave Firebase in _key
  async function readTable(table) {
    const obj = (await request(table)) || {};
    return Object.entries(obj).map(([key, row]) => {
      const out = { ...row, _key: key };
      if (table === 'points') out.player = key;
      return out;
    });
  }

  function matcher(filters) {
    return row => filters.every(({ col, val }) => row[col] === val);
  }

  function project(row, columns) {
    const { _key, ...rest } = row;
    if (!columns || columns === '*') return rest;
    const out = {};
    columns.split(',').map(c => c.trim()).forEach(c => { out[c] = rest[c]; });
    return out;
  }

  async function run(q) {
    const hits = (await readTable(q.table)).filter(matcher(q.filters));
    if (q.op === 'update') {
      await Promise.all(hits.map(r => request(`${q.table}/${r._key}`, 'PATCH', q.values)));
      hits.forEach(r => Object.assign(r, q.values));
    }
    return hits.map(r => project(r, q.columns));
  }

  class Query {
    constructor(table) {
      this.q = { table, op: 'select', columns: '*', filters: [] };
      this.mode = 'many';
      this.wantCount = false;
    }
    select(columns = '*', opts = {}) {
      this.q.columns = columns;
      this.wantCount = opts.count === 'exact';
      return this;
    }
    update(values) { this.q.op = 'update'; this.q.values = values; return this; }
    eq(col, val) { this.q.filters.push({ col, val }); return this; }
    single() { this.mode = 'single'; return this; }
    maybeSingle() { this.mode = 'maybe'; return this; }
    then(resolve, reject) {
      return run(this.q).then(rows => {
        const count = this.wantCount ? rows.length : null;
        if (this.mode === 'many') return { data: rows, error: null, count };
        if (rows.length === 1) return { data: rows[0], error: null, count };
        if (rows.length === 0 && this.mode === 'maybe') return { data: null, error: null, count };
        return { data: null, error: { message: `Attesa 1 riga, trovate ${rows.length}` }, count };
      }).catch(e => ({ data: null, error: { message: e.message }, count: null }))
        .then(resolve, reject);
    }
  }

  async function rpc(name, args) {
    const delta = { increment_available_points: 1, decrement_available_points: -1 }[name];
    if (delta === undefined) return { data: null, error: { message: `rpc sconosciuta: ${name}` } };
    try {
      // Transazione ottimistica con ETag, così due scritture ravvicinate non si perdono
      for (let attempt = 0; attempt < 5; attempt++) {
        const url = `${FIREBASE_URL}/points/${args.player_name}/available.json`;
        const get = await fetch(url, { headers: { 'X-Firebase-ETag': 'true' } });
        const current = await get.json();
        if (current === null) return { data: null, error: { message: `giocatore sconosciuto: ${args.player_name}` } };
        const put = await fetch(url, {
          method: 'PUT',
          headers: { 'if-match': get.headers.get('ETag'), 'Content-Type': 'application/json' },
          body: JSON.stringify(Math.max(current + delta, 0))
        });
        if (put.ok) return { data: null, error: null };
        if (put.status !== 412) throw new Error(`Firebase ${put.status}`);
      }
      throw new Error('troppi conflitti di scrittura');
    } catch (e) {
      return { data: null, error: { message: e.message } };
    }
  }

  return {
    from: table => new Query(table),
    rpc,
    auth: { getSession: async () => ({ data: { session: null }, error: null }) }
  };
}

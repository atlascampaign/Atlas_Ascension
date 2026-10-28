"""Genera dist/utils/trees.json, usato dalla vista mobile (verticale) dei talent tree.

Legge dalle pagine desktop (dist/pcs/<pg>.html, .css, .js) le posizioni dei nodi, le connessioni
disegnate e la mappa di sblocco, e ne ricava una disposizione a righe (p1 in basso).
Rieseguire dopo aver cambiato nodi o connessioni:  python tools/build_trees.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PCS = ROOT / "dist" / "pcs"
CHARACTERS = ["erevan", "fedra", "hesperia", "narkran", "raziel", "yvette"]
MAX_PER_ROW = 4  # nodi per riga al massimo (larghezza di un telefono)
# Nodi fuori dalla regola "un nodo per livello": non bloccano gli altri e non vengono bloccati.
# Fedra: si passa solo per p14, poi p10 e il finale; p15 e p17 sono nodi laterali.
EXEMPT = {"fedra": ["p15", "p17"]}
ROW_GAP = {1: 0, 2: 0.40, 3: 0.32, 4: 0.26}  # distanza tra nodi vicini (frazione della larghezza) per numero di nodi nella riga


def read(path):
    return path.read_text(encoding="utf-8")


def parse_unlockmap(js):
    m = re.search(r"unlockmap\s*=\s*\{\s*\w+\s*:\s*\{(.*?)\}\s*\}", js, re.S)
    return {k: re.findall(r"p\d+", v) for k, v in re.findall(r'"(p\d+)"\s*:\s*\[(.*?)\]', m.group(1))}


def parse_connections(js):
    m = re.search(r"connectionsMap\s*=\s*\{(.*?)\}\s*;?\s*\n", js, re.S)
    return {k: re.findall(r"[\"']([a-z]+)[\"']", v) for k, v in re.findall(r"(\w+)\s*:\s*\[(.*?)\]", m.group(1))}


def parse_positions(css):
    pos = {}
    for name, body in re.findall(r"\.(p\d+)\s*\{(.*?)\}", css, re.S):
        top = re.search(r"top:\s*([\d.]+)%", body)
        left = re.search(r"left:\s*([\d.]+)%", body)
        if top and left:
            pos[name] = (float(left.group(1)), float(top.group(1)))
    return pos


def body_background(css):
    m = re.search(r"body\s*\{[^}]*?background-image:\s*url\(['\"]?([^'\")]+)", css, re.S)
    return m.group(1) if m else None


def build(c):
    html, css, js = read(PCS / f"{c}.html"), read(PCS / f"{c}.css"), read(PCS / f"{c}.js")
    ids = {i: p for i, p in re.findall(r'id="([a-z]+)" class="point (p\d+)', html)}
    nodes = set(ids.values())
    unlock = {k: [x for x in v if x in nodes] for k, v in parse_unlockmap(js).items() if k in nodes}
    conns = parse_connections(js)
    pos = parse_positions(css)

    # linee da disegnare: mappa di sblocco piu' connessioni delle pagine desktop
    edges = {(a, b) for a, targets in unlock.items() for b in targets}
    for word, targets in conns.items():
        for t in targets:
            if word in ids and t in ids:
                edges.add((ids[word], ids[t]))

    # livelli: distanza minima da p1 lungo la mappa di sblocco (la mappa puo' contenere cicli)
    level = {"p1": 0}
    queue = ["p1"]
    while queue:
        a = queue.pop(0)
        for b in unlock.get(a, []):
            if b not in level:
                level[b] = level[a] + 1
                queue.append(b)
    # nodi non raggiungibili dalla mappa di sblocco: sopra ai nodi collegati con una linea
    pending = [n for n in nodes if n not in level]
    top = max(level.values())
    for _ in range(len(nodes) + 1):
        for n in list(pending):
            around = [level[o] for a, b in edges for o in ((b,) if a == n else (a,) if b == n else ()) if o in level]
            if around:
                level[n] = max(around) + 1
                pending.remove(n)
    for n in pending:
        level[n] = top + 1

    by_level = {}
    for n, lv in level.items():
        by_level.setdefault(lv, []).append(n)
    xs = [pos[n][0] for n in nodes if n in pos]
    lo, hi = min(xs), max(xs)

    # righe a video: un livello troppo largo per il telefono viene spezzato in piu' righe
    final_rows = []
    for lv in sorted(by_level):
        members = sorted(by_level[lv], key=lambda n: pos.get(n, (50, 0))[0])
        parts = -(-len(members) // MAX_PER_ROW)
        size = -(-len(members) // parts)
        for i in range(0, len(members), size):
            final_rows.append(members[i:i + size])

    layout = {}
    for row_index, members in enumerate(final_rows):
        x = [0.08 + 0.84 * ((pos.get(n, (50, 0))[0] - lo) / (hi - lo)) for n in members]
        # avvicina ogni nodo ai nodi collegati nelle righe sotto, per avere linee meno oblique
        if row_index == 0:
            x = [0.5]  # il nodo iniziale e' sempre centrato
        for i, n in enumerate(members):
            below = [layout[o]["x"] for a, b in edges for o in ((b,) if a == n else (a,) if b == n else ()) if o in layout]
            if below:
                x[i] = 0.5 * x[i] + 0.5 * sum(below) / len(below)
        order = sorted(range(len(members)), key=lambda i: x[i])
        members = [members[i] for i in order]
        # ogni riga e' centrata e simmetrica: l'ordine viene dalla posizione desktop, le distanze sono fisse
        gap = ROW_GAP.get(len(members), 0.26)
        x = [0.5 + (i - (len(members) - 1) / 2) * gap for i in range(len(members))]
        for n, v in zip(members, x):
            layout[n] = {"level": row_index, "depth": None if n in EXEMPT.get(c, []) else level[n], "x": round(v, 3)}

    return {
        "background": body_background(css),
        "nodes": {n: layout[n] for n in sorted(nodes, key=lambda s: int(s[1:]))},
        "edges": sorted([a, b] for a, b in edges),
        "unlock": unlock,
        "levels": len(final_rows) - 1,
    }


def dead_ends(t):
    """Nodi (escluso il finale) da cui, scelti, non si puo' proseguire al livello successivo
    (direttamente o passando solo da nodi senza livello)."""
    nodes = t["nodes"]
    depth = {n: v["depth"] for n, v in nodes.items()}

    def next_level(n, d, seen):
        for c in t["unlock"].get(n, []):
            if c in seen or c not in depth:
                continue
            if depth[c] == d + 1:
                return True
            if depth[c] is None and next_level(c, d, seen | {c}):
                return True
        return False

    last = max(d for n, d in depth.items() if n != "p13" and d is not None)
    return [n for n, d in depth.items() if n != "p13" and d is not None and d < last and not next_level(n, d, {n})]


trees = {c: build(c) for c in CHARACTERS}
(ROOT / "dist" / "utils" / "trees.json").write_text(json.dumps(trees, ensure_ascii=False, indent=1), encoding="utf-8")
for c, t in trees.items():
    rows = {}
    for n, v in t["nodes"].items():
        rows.setdefault(v["level"], []).append((n, v["x"]))
    print(c, "righe", t["levels"] + 1, "| vicoli ciechi:", dead_ends(t) or "nessuno")
    for k in sorted(rows):
        print("  ", k, rows[k])

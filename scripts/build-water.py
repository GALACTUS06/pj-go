"""Build public/geo/port-jefferson-water.geojson from OSM coastline.

Fetches natural=coastline around the harbor, chains the ways, keeps the run
through the playable bbox, and closes it along the north-west corner (the
coastline keeps land on its left, so the harbor lies north-west of it here).
"""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "geo" / "port-jefferson-water.geojson"
S, W, N, E = 40.9445, -73.0740, 40.9510, -73.0620
PAD = 0.0015

q = f"""[out:json][timeout:90];
way["natural"="coastline"]({S - 0.004},{W - 0.006},{N + 0.005},{E + 0.007});
out body; >; out skel qt;"""
ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
]


def fetch():
    last = None
    for attempt in range(3):
        for url in ENDPOINTS:
            req = urllib.request.Request(
                url,
                data=("data=" + urllib.parse.quote(q)).encode(),
                headers={"User-Agent": "PJ-Go/0.1 build-water", "Accept": "application/json"},
            )
            try:
                return json.load(urllib.request.urlopen(req, timeout=120))
            except Exception as e:  # noqa: BLE001
                last = e
                print(f"{url} failed: {e}")
        time.sleep(5 * (attempt + 1))
    raise SystemExit(f"Overpass unavailable: {last}")


data = fetch()
nodes = {e["id"]: (e["lon"], e["lat"]) for e in data["elements"] if e["type"] == "node"}
ways = [e["nodes"] for e in data["elements"] if e["type"] == "way"]

# Chain ways end-to-start into maximal lines.
chains = [list(w) for w in ways]
merged = True
while merged:
    merged = False
    for i, a in enumerate(chains):
        for j, b in enumerate(chains):
            if i != j and a[-1] == b[0]:
                chains[i] = a + b[1:]
                chains.pop(j)
                merged = True
                break
        if merged:
            break


def inside(p, pad=PAD):
    return S - pad <= p[1] <= N + pad and W - pad <= p[0] <= E + pad


best = max(chains, key=lambda c: sum(1 for n in c if n in nodes and inside(nodes[n])))
pts = [nodes[n] for n in best if n in nodes]
idx = [i for i, p in enumerate(pts) if inside(p)]
line = pts[idx[0] : idx[-1] + 1]

west, north = W - PAD * 2, N + PAD * 2
start, end = line[0], line[-1]
ring = line + [(west, end[1]), (west, north), (start[0], north), start]

geo = {
    "type": "FeatureCollection",
    "properties": {
        "source": "Derived from OpenStreetMap natural=coastline (ODbL)",
        "script": "scripts/build-water.py",
    },
    "features": [
        {
            "type": "Feature",
            "properties": {"id": "pj-harbor", "natural": "water", "name": "Port Jefferson Harbor"},
            "geometry": {"type": "Polygon", "coordinates": [[[round(x, 6), round(y, 6)] for x, y in ring]]},
        }
    ],
}
OUT.write_text(json.dumps(geo), encoding="utf-8")
print(f"coastline points {len(line)} -> {OUT}")

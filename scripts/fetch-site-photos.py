"""Download the chosen Commons photo for each checkpoint.

Writes public/sites/<id>.jpg (960 px wide) and data/site-photos.json with
caption, author, license and source for the in-game credit line.

Usage: python scripts/fetch-site-photos.py
"""

import io
import json
import re
import time
import urllib.parse
import urllib.request

from PIL import Image

API = "https://commons.wikimedia.org/w/api.php"
UA = "PJGo/0.1 (https://github.com/GALACTUS06/pj-go)"
WIDTH = 960

PICKS = {
    "ferry-terminal": ("File:Port Jefferson x DJI Mavic Pro.jpg", "The harbor and ferry slip from above"),
    "shipbuilders-memorial": ("File:Harborfront Park, Port Jefferson, New York - 20221124.jpg", "Harborfront Park on the water"),
    "bayles-shipyard": ("File:Bayles Shipyard 1917 Machine Shop and Mould Loft Dec 07.jpg", "The 1917 machine shop and mould loft"),
    "village-center": ("File:Port Jefferson Village Center2.jpg", "Village Center seen from the harbor"),
    "historical-society": (
        "File:East Main Street decorated for the holidays, Port Jefferson, New York - 20221124.jpg",
        "East Main Street, the walk toward the Mather House",
    ),
    "main-street": ("File:Port Jefferson Main Street 2010.jpg", "Main Street seen from the harbor"),
    "harbourfront-dining": ("File:At Long Island 2023 072.jpg", "Harborfront inn and dining on the water"),
    "drowned-meadow": ("File:At Long Island 2023 096.jpg", "Village Hall on West Broadway, a few steps from the cottage"),
    "harbor-overlook": ("File:Harbor view, Port Jefferson, New York - 20221124.jpg", "Across the harbor toward the Sound"),
}


def api(params):
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json"})
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
        return json.load(r)


def download(url):
    proxy = "https://images.weserv.nl/?url=" + urllib.parse.quote(url.replace("https://", ""), safe="")
    for u in (url, proxy):
        for _ in range(3):
            try:
                req = urllib.request.Request(u, headers={"User-Agent": UA})
                with urllib.request.urlopen(req, timeout=90) as r:
                    return r.read()
            except Exception as e:  # noqa: BLE001
                print("  retry", u[:60], e)
                time.sleep(3)
    raise RuntimeError(f"download failed: {url}")


def text(md, key):
    return re.sub(r"<[^>]+>", "", md.get(key, {}).get("value", "")).strip()


def main():
    out = {}
    for site_id, (title, caption) in PICKS.items():
        info = api({"action": "query", "titles": title, "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 1280})
        page = next(iter(info["query"]["pages"].values()))
        ii = page["imageinfo"][0]
        md = ii["extmetadata"]
        img = Image.open(io.BytesIO(download(ii["thumburl"]))).convert("RGB")
        img.thumbnail((WIDTH, WIDTH))
        img.save(f"public/sites/{site_id}.jpg", quality=78, optimize=True, progressive=True)
        out[site_id] = {
            "file": f"sites/{site_id}.jpg",
            "caption": caption,
            "author": text(md, "Artist") or "Unknown",
            "license": text(md, "LicenseShortName"),
            "source": ii["descriptionurl"],
        }
        print("OK", site_id, img.size, out[site_id]["author"], out[site_id]["license"])
        time.sleep(1)
    with open("data/site-photos.json", "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
        f.write("\n")


if __name__ == "__main__":
    main()

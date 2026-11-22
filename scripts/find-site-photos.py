"""List Wikimedia Commons photos near each checkpoint (for picking site art).

Usage: python scripts/find-site-photos.py [radius_m]
"""

import json
import sys
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "PJGo/0.1 (https://github.com/GALACTUS06/pj-go)"
RADIUS = int(sys.argv[1]) if len(sys.argv) > 1 else 150


def get(params):
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def main():
    with open("data/checkpoints.template.json", encoding="utf-8") as f:
        sites = json.load(f)["checkpoints"]
    for s in sites:
        geo = get(
            {
                "action": "query",
                "list": "geosearch",
                "gscoord": f"{s['lat']}|{s['lng']}",
                "gsradius": RADIUS,
                "gsnamespace": 6,
                "gslimit": 40,
            }
        )
        titles = [g["title"] for g in geo["query"]["geosearch"]]
        print(f"\n## {s['id']} ({len(titles)})")
        for i in range(0, len(titles), 20):
            info = get(
                {
                    "action": "query",
                    "titles": "|".join(titles[i : i + 20]),
                    "prop": "imageinfo",
                    "iiprop": "url|extmetadata|size",
                    "iiurlwidth": 1024,
                }
            )
            for p in info["query"]["pages"].values():
                ii = p.get("imageinfo", [{}])[0]
                md = ii.get("extmetadata", {})
                lic = md.get("LicenseShortName", {}).get("value", "?")
                print(f"- {p['title']} | {lic} | {ii.get('width')}x{ii.get('height')}")


if __name__ == "__main__":
    main()

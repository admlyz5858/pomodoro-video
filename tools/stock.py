#!/usr/bin/env python3
"""Pexels + Pixabay video arama / aday seçimi / indirme.

Kullanım:
  python3 tools/stock.py search "rain window" "fireplace" ...   -> aday listesi (JSON)
  python3 tools/stock.py download <url> <out.mp4>
Anahtarlar: .env.stock (PEXELS_API_KEY, PIXABAY_API_KEY) veya ortam değişkeni.
"""
import json, os, sys, urllib.request, urllib.parse

def load_keys():
    keys = {}
    for path in (".env.stock", os.path.expanduser("~/.env.stock")):
        if os.path.exists(path):
            for line in open(path):
                if "=" in line:
                    k, v = line.strip().split("=", 1)
                    keys[k] = v
    for k in ("PEXELS_API_KEY", "PIXABAY_API_KEY", "UNSPLASH_API_KEY"):
        if os.environ.get(k):
            keys[k] = os.environ[k]
    return keys

KEYS = load_keys()

def _get(url, headers=None, timeout=40):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())

def pexels(query, per_page=15):
    key = KEYS.get("PEXELS_API_KEY")
    if not key:
        return []
    url = "https://api.pexels.com/videos/search?" + urllib.parse.urlencode(
        {"query": query, "per_page": per_page, "orientation": "landscape", "size": "large"})
    try:
        data = _get(url, {"Authorization": key})
    except Exception as e:
        sys.stderr.write(f"pexels hata ({query}): {e}\n"); return []
    out = []
    for v in data.get("videos", []):
        # en iyi 1080p civarı dosyayı seç
        files = [f for f in v.get("video_files", []) if (f.get("width") or 0) >= 1280]
        files.sort(key=lambda f: abs((f.get("width") or 0) - 1920))
        if not files:
            continue
        f = files[0]
        out.append({"source": "pexels", "id": v["id"], "query": query,
                    "duration": v.get("duration", 0), "width": f.get("width"),
                    "height": f.get("height"), "url": f["link"]})
    return out

def pixabay(query, per_page=20):
    key = KEYS.get("PIXABAY_API_KEY")
    if not key:
        return []
    url = "https://pixabay.com/api/videos/?" + urllib.parse.urlencode(
        {"key": key, "q": query, "per_page": per_page, "video_type": "film"})
    try:
        data = _get(url)
    except Exception as e:
        sys.stderr.write(f"pixabay hata ({query}): {e}\n"); return []
    out = []
    for v in data.get("hits", []):
        vids = v.get("videos", {})
        pick = vids.get("large") or vids.get("medium")
        if not pick or not pick.get("url"):
            continue
        out.append({"source": "pixabay", "id": v["id"], "query": query,
                    "duration": v.get("duration", 0), "width": pick.get("width"),
                    "height": pick.get("height"), "url": pick["url"]})
    return out

def score(c):
    s = 0.0
    w = c.get("width") or 0
    s -= abs(w - 1920) / 200.0           # 1920 genişliğe yakınlık
    d = c.get("duration") or 0
    s -= abs(d - 22) / 6.0               # ~15-30 sn ideal (loop için)
    if (c.get("width") or 0) < (c.get("height") or 1):
        s -= 100                          # dikey ele
    if d < 8:
        s -= 50
    return s

def search(queries):
    cand = []
    for q in queries:
        cand += pexels(q)
        cand += pixabay(q)
    # filtre: yatay, makul süre/çözünürlük
    cand = [c for c in cand if (c.get("width") or 0) >= 1280
            and (c.get("width") or 0) >= (c.get("height") or 0)
            and 8 <= (c.get("duration") or 0) <= 60]
    cand.sort(key=score, reverse=True)
    # tekilleştir (id)
    seen, uniq = set(), []
    for c in cand:
        k = (c["source"], c["id"])
        if k in seen:
            continue
        seen.add(k); uniq.append(c)
    return uniq

def download(url, out):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as r, open(out, "wb") as f:
        while True:
            chunk = r.read(1 << 20)
            if not chunk:
                break
            f.write(chunk)
    return os.path.getsize(out)

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "search"
    if cmd == "search":
        qs = sys.argv[2:] or ["rainy window", "fireplace", "cozy coffee shop"]
        print(json.dumps(search(qs), indent=2))
    elif cmd == "download":
        sz = download(sys.argv[2], sys.argv[3])
        print(f"indirildi: {sys.argv[3]} ({sz} bytes)")

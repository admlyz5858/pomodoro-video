#!/usr/bin/env python3
"""Dashboard için status.json üretir: YouTube kuyruğu/yayınları + GitHub Actions pipeline durumu.

Ortam: YT_CLIENT_ID/SECRET/REFRESH_TOKEN, GH_TOKEN (veya GITHUB_TOKEN), GITHUB_REPOSITORY
Kullanım: python3 tools/build_status.py [çıktı_yolu=docs/status.json]
"""
import datetime as dt
import json, os, re, sys, urllib.request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

REPO = os.environ.get("GITHUB_REPOSITORY", "admlyz5858/pomodoro-video")
GH_TOKEN = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
NOW = dt.datetime.now(dt.timezone.utc)

def gh(path):
    req = urllib.request.Request(
        "https://api.github.com/" + path,
        headers={"Authorization": f"Bearer {GH_TOKEN}", "Accept": "application/vnd.github+json",
                 "User-Agent": "pomo-dash"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())

def yt_client():
    creds = Credentials(None, refresh_token=os.environ["YT_REFRESH_TOKEN"],
                        token_uri="https://oauth2.googleapis.com/token",
                        client_id=os.environ["YT_CLIENT_ID"], client_secret=os.environ["YT_CLIENT_SECRET"])
    return build("youtube", "v3", credentials=creds)

def first_emoji(s):
    for ch in s:
        if ord(ch) >= 0x2190:
            return ch
    return "🎬"

def parse_format(t):
    m = re.search(r"(\d+)\s*[×x]\s*(\d+)/(\d+)", t)
    if m:
        return f"{m.group(2)}/{m.group(3)}"
    m = re.search(r"(\d+)/(\d+)", t)
    return f"{m.group(1)}/{m.group(2)}" if m else "—"

def dur_label(t):
    m = re.match(r"\s*(\d+-(?:Min|Hour))", t)
    return m.group(1) if m else ""

def iso(s):
    return dt.datetime.fromisoformat(s.replace("Z", "+00:00")) if s else None

def youtube_data():
    yt = yt_client()
    ch = yt.channels().list(part="contentDetails,snippet,statistics", mine=True).execute()
    item = ch["items"][0]
    uploads = item["contentDetails"]["relatedPlaylists"]["uploads"]
    chan = {"title": item["snippet"]["title"],
            "id": item["id"],
            "url": f"https://youtube.com/channel/{item['id']}",
            "subs": int(item["statistics"].get("subscriberCount", 0)),
            "channel_views": int(item["statistics"].get("viewCount", 0))}
    ids, token = [], None
    while True:
        pl = yt.playlistItems().list(part="contentDetails", playlistId=uploads,
                                     maxResults=50, pageToken=token).execute()
        ids += [it["contentDetails"]["videoId"] for it in pl.get("items", [])]
        token = pl.get("nextPageToken")
        if not token or len(ids) >= 200:
            break
    vids = []
    for i in range(0, len(ids), 50):
        r = yt.videos().list(part="snippet,status,statistics,contentDetails",
                             id=",".join(ids[i:i+50])).execute()
        vids += r["items"]
    queue, published = [], []
    total_views = 0
    for v in vids:
        s, sn = v["status"], v["snippet"]
        title = sn["title"]
        thumb = (sn.get("thumbnails", {}).get("medium") or sn.get("thumbnails", {}).get("default") or {}).get("url", "")
        pub_at = s.get("publishAt")
        rec = {"id": v["id"], "title": title, "thumb": thumb,
               "emoji": first_emoji(title), "format": parse_format(title),
               "dur": dur_label(title), "url": f"https://youtu.be/{v['id']}"}
        if s["privacyStatus"] == "private" and pub_at and iso(pub_at) > NOW:
            rec["publish_at"] = pub_at
            queue.append(rec)
        elif s["privacyStatus"] == "public":
            views = int(v["statistics"].get("viewCount", 0))
            total_views += views
            rec["views"] = views
            rec["published_at"] = sn.get("publishedAt")
            published.append(rec)
    queue.sort(key=lambda r: r["publish_at"])
    published.sort(key=lambda r: r.get("published_at", ""), reverse=True)
    return chan, queue, published, total_views

def github_data():
    runs_data = {"pipeline": [], "runs": [], "latest": None}
    try:
        wr = gh(f"repos/{REPO}/actions/workflows/daily.yml/runs?per_page=8")
        runs = wr.get("workflow_runs", [])
    except Exception as e:
        sys.stderr.write(f"gh runs hata: {e}\n"); return runs_data
    runs_data["runs"] = [{"id": r["id"], "status": r["status"], "conclusion": r["conclusion"],
                          "created_at": r["created_at"], "url": r["html_url"],
                          "title": r.get("display_title", "")} for r in runs]
    if runs:
        r0 = runs[0]
        runs_data["latest"] = {"id": r0["id"], "status": r0["status"], "conclusion": r0["conclusion"],
                               "created_at": r0["created_at"], "url": r0["html_url"]}
        try:
            jobs = gh(f"repos/{REPO}/actions/runs/{r0['id']}/jobs").get("jobs", [])
        except Exception:
            jobs = []
        def state_of(names_pred):
            js = [j for j in jobs if names_pred(j["name"])]
            if not js:
                return "pending", ""
            if any(j["status"] != "completed" for j in js):
                return "active", f"{sum(1 for j in js if j['conclusion']=='success')}/{len(js)}"
            if all(j["conclusion"] == "success" for j in js):
                return "done", f"{len(js)}/{len(js)}" if len(js) > 1 else ""
            return "failed", ""
        ps, pd = state_of(lambda n: n == "prepare")
        rs, rd = state_of(lambda n: n.startswith("render"))
        ms, md = state_of(lambda n: n == "merge")
        us, ud = state_of(lambda n: n == "publish")
        runs_data["pipeline"] = [
            {"key": "prepare", "label": "Klip + Plan", "state": ps, "detail": pd},
            {"key": "render", "label": "Render", "state": rs, "detail": rd},
            {"key": "merge", "label": "Transcode", "state": ms, "detail": md},
            {"key": "publish", "label": "YouTube", "state": us, "detail": ud},
        ]
        # ── canlı üretim durumu ──
        run_status = r0["status"]  # queued | in_progress | completed
        rj = [j for j in jobs if j["name"].startswith("render")]
        rdone = sum(1 for j in rj if j["conclusion"] == "success")
        rtot = len(rj)
        order = [("prepare", ps, 0.05), ("render", rs, 0.70), ("merge", ms, 0.15), ("publish", us, 0.10)]
        pct = 0.0
        for key, stt, w in order:
            if key == "render" and rtot:
                pct += w * (rdone / rtot)
            elif stt == "done":
                pct += w
        cur = next((k for k, stt, _ in order if stt != "done"), None)
        labels = {"prepare": "Klip + Plan", "render": "Render", "merge": "Transcode", "publish": "YouTube"}
        if run_status == "completed" and r0["conclusion"] == "success":
            pct, cur = 1.0, None
        runs_data["production"] = {
            "active": run_status in ("queued", "in_progress"),
            "status": run_status, "conclusion": r0["conclusion"],
            "stage": labels.get(cur, "Tamamlandı"), "stage_key": cur,
            "render_done": rdone, "render_total": rtot,
            "percent": round(pct * 100), "started_at": r0["created_at"], "url": r0["html_url"],
        }
    return runs_data

def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "docs/status.json"
    chan, queue, published, total_views = youtube_data()
    gdata = github_data()
    latest = gdata.get("latest")
    healthy = True
    if latest and latest["status"] == "completed" and latest["conclusion"] not in ("success", None):
        healthy = False
    data = {
        "updated_at": NOW.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "channel": chan,
        "automation": {"healthy": healthy, "cron": "0 5 * * 1,3,5", "cron_label": "yayın · Pzt/Çar/Cum 12:00 TSİ"},
        "stats": {"queue": len(queue), "published": len(published),
                  "buffer_days": len(queue), "total_views": total_views},
        "next": queue[0] if queue else None,
        "queue": queue,
        "published": published[:10],
        "pipeline": gdata["pipeline"],
        "production": gdata.get("production"),
        "latest_run": latest,
        "runs": gdata["runs"],
    }
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    with open(out, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"yazıldı: {out} | kuyruk={len(queue)} yayında={len(published)} izlenme={total_views}")

if __name__ == "__main__":
    main()

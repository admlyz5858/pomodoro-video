#!/usr/bin/env python3
"""CI'dan YouTube'a yükleme (secret'lardan kimlik). Sonraki boş tarihi otomatik bulur.

Kullanım: python3 tools/yt_upload_ci.py <video.mp4> <meta.json> [<thumb.jpg>]
Ortam: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN
meta.json: {title, description, tags[], categoryId, publishAt?}
publishAt verilmezse: kanaldaki en ileri zamanlanmış tarih + 1 gün (09:00Z), en erken yarın.
"""
import datetime as dt
import json, os, sys
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

def creds():
    return Credentials(None,
        refresh_token=os.environ["YT_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ["YT_CLIENT_ID"],
        client_secret=os.environ["YT_CLIENT_SECRET"])

def next_publish_at(yt):
    """Kanaldaki tüm videoların status.publishAt + snippet.publishedAt'ine bakıp
    en ileri tarihi bul, +1 gün 09:00Z döndür (en erken yarın)."""
    ch = yt.channels().list(part="contentDetails", mine=True).execute()
    uploads = ch["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    vids, token = [], None
    while True:
        pl = yt.playlistItems().list(part="contentDetails", playlistId=uploads,
                                     maxResults=50, pageToken=token).execute()
        vids += [it["contentDetails"]["videoId"] for it in pl.get("items", [])]
        token = pl.get("nextPageToken")
        if not token or len(vids) >= 200:
            break
    latest = None
    for i in range(0, len(vids), 50):
        r = yt.videos().list(part="status,snippet", id=",".join(vids[i:i+50])).execute()
        for it in r["items"]:
            s = it["status"].get("publishAt") or it["snippet"].get("publishedAt")
            if not s:
                continue
            d = dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
            if latest is None or d > latest:
                latest = d
    now = dt.datetime.now(dt.timezone.utc)
    base = latest if (latest and latest > now) else now
    nxt = (base + dt.timedelta(days=1)).date()
    tomorrow = (now + dt.timedelta(days=1)).date()
    if nxt < tomorrow:
        nxt = tomorrow
    return dt.datetime(nxt.year, nxt.month, nxt.day, 9, 0, 0,
                       tzinfo=dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def main():
    video, metaf = sys.argv[1], sys.argv[2]
    thumb = sys.argv[3] if len(sys.argv) > 3 else None
    meta = json.load(open(metaf))
    yt = build("youtube", "v3", credentials=creds())

    publish_at = meta.get("publishAt") or next_publish_at(yt)
    body = {
        "snippet": {"title": meta["title"][:100], "description": meta["description"],
                    "tags": meta.get("tags", []), "categoryId": meta.get("categoryId", "27")},
        "status": {"privacyStatus": "private", "publishAt": publish_at,
                   "selfDeclaredMadeForKids": False},
    }
    media = MediaFileUpload(video, chunksize=8 * 1024 * 1024, resumable=True, mimetype="video/mp4")
    req = yt.videos().insert(part="snippet,status", body=body, media_body=media)
    resp = None
    while resp is None:
        status, resp = req.next_chunk()
        if status:
            sys.stderr.write(f"  yükleme %{int(status.progress()*100)}\n")
    vid = resp["id"]
    if thumb and os.path.exists(thumb):
        try:
            yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(thumb)).execute()
        except Exception as e:
            sys.stderr.write(f"thumbnail hata: {e}\n")
    print(f"VIDEO_ID: {vid}")
    print(f"PUBLISH_AT: {publish_at}")
    print(f"URL: https://youtu.be/{vid}")

if __name__ == "__main__":
    main()

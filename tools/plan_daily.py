#!/usr/bin/env python3
"""Günlük video planı: format + sahne preset + klip seçimi + başlık/açıklama.
Çıktı: JSON (GitHub Actions step output / dosya).

Ortam değişkenleri (workflow_dispatch override; boşsa otomatik):
  IN_FOCUS, IN_BREAK, IN_AMBIENT, IN_ACCENT, IN_KIND, IN_QUERY, IN_FORCE_URL
  DAY_INDEX (gün sayacı; verilmezse bugünün yılgünü)
"""
import datetime as dt
import json, os, sys, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))

# query'ler döngüye uygun (yön hareketi az, başa sarması belli olmayan) klipler için "loop/seamless/ambient" odaklı.
PRESETS = [
    {"kind": "Cozy Fireplace",   "emoji": "🔥", "query": "fireplace fire flames loop seamless", "ambient": "fire",   "accent": "#efb56a", "scrim": 0.42},
    {"kind": "Rainy Window",     "emoji": "🌧️", "query": "rain window glass loop seamless",     "ambient": "rain",   "accent": "#8fb8dc", "scrim": 0.40},
    {"kind": "Anime Lofi",       "emoji": "🎴", "query": "anime lofi loop animation",            "ambient": "rain",   "accent": "#c7a3e6", "scrim": 0.40},
    {"kind": "Snowy Night",      "emoji": "❄️", "query": "snow falling loop seamless",           "ambient": "night",  "accent": "#9ecbe0", "scrim": 0.42},
    {"kind": "Forest Rain",      "emoji": "🌲", "query": "rain forest leaves ambient loop",      "ambient": "forest", "accent": "#86b08a", "scrim": 0.40},
    {"kind": "Lofi Night",       "emoji": "🎧", "query": "lofi animation loop background",       "ambient": "night",  "accent": "#84c5ec", "scrim": 0.40},
    {"kind": "Starry Night",     "emoji": "🌙", "query": "night sky stars loop seamless",        "ambient": "night",  "accent": "#9aa7ff", "scrim": 0.40},
    {"kind": "Candle Glow",      "emoji": "🕯️", "query": "candle flame loop seamless dark",      "ambient": "fire",   "accent": "#e6b07a", "scrim": 0.42},
]

FPS = 30
INTRO, CD, OUTRO, CYCLES = 4, 10, 5, 3

def two(n): return f"{n:02d}"
def hms(s):
    h = s // 3600; m = (s % 3600) // 60; sec = s % 60
    return (f"{h}:{two(m)}:{two(sec)}" if h else f"{two(m)}:{two(sec)}")

def env(k, d=""): return os.environ.get(k, "").strip() or d

def main():
    day = int(env("DAY_INDEX") or dt.date.today().timetuple().tm_yday)
    # format: çift gün 25/5, tek gün 50/10
    if env("IN_FOCUS"):
        fmin = int(env("IN_FOCUS")); bmin = int(env("IN_BREAK") or (5 if fmin == 25 else 10))
    else:
        fmin, bmin = (25, 5) if day % 2 == 0 else (50, 10)

    p = dict(PRESETS[day % len(PRESETS)])
    if env("IN_KIND"):    p["kind"] = env("IN_KIND")
    if env("IN_EMOJI"):   p["emoji"] = env("IN_EMOJI")
    if env("IN_QUERY"):   p["query"] = env("IN_QUERY")
    if env("IN_AMBIENT"): p["ambient"] = env("IN_AMBIENT")
    if env("IN_ACCENT"):  p["accent"] = env("IN_ACCENT")

    # klip seç
    force = env("IN_FORCE_URL")
    if force:
        clip_url, clip_src, clip_id = force, "manual", "manual"
    else:
        out = subprocess.run([sys.executable, os.path.join(HERE, "stock.py"), "search", p["query"]],
                             capture_output=True, text=True, timeout=120)
        cands = json.loads(out.stdout or "[]")
        if not cands:
            # yedek sorgu
            out = subprocess.run([sys.executable, os.path.join(HERE, "stock.py"), "search", "rain window cozy"],
                                 capture_output=True, text=True, timeout=120)
            cands = json.loads(out.stdout or "[]")
        if not cands:
            print("KLIP BULUNAMADI", file=sys.stderr); sys.exit(3)
        c = cands[0]
        clip_url, clip_src, clip_id = c["url"], c["source"], str(c["id"])

    focus_s = fmin * 60; brk_s = bmin * 60
    total_s = INTRO + CD + CYCLES * (focus_s + brk_s) + OUTRO
    total_frames = total_s * FPS
    fmt_label = f"3 × {fmin}/{bmin}"
    total_min = total_s / 60
    # <120 dk -> dakika etiketi (90-Min), aksi halde saat etiketi (3-Hour)
    dur_label = f"{round(total_s/3600)}-Hour" if total_min >= 120 else f"{round(total_min)}-Min"

    # zaman damgaları
    lines, t = [], 0
    lines.append(f"{hms(INTRO+0)} — Intro & {CD}-second countdown".replace(hms(INTRO+0), "00:00", 1))
    t = INTRO + CD
    for i in range(CYCLES):
        lines.append(f"{hms(t)} — Session {i+1} · Focus {two(fmin)}:00")
        t += focus_s
        lines.append(f"{hms(t)} — Break {two(bmin)}:00 (music)")
        t += brk_s
    lines.append(f"{hms(t)} — Well done 🎉")
    ts = "\n".join(lines)

    title = f"{dur_label} Study With Me {p['emoji']} {p['kind']} · Pomodoro {fmt_label} (No Music While Studying)"
    description = (
        f"Study with me for a focused session in a {p['kind'].lower()} scene. {p['emoji']} "
        f"A small timer sits quietly in the corner, and gentle motivational messages fade in now and then "
        f"to keep you going. Music plays only in the breaks — while you focus there's just soft ambience.\n\n"
        f"⏱️ FORMAT\n• {fmt_label} (focus / break)\n• {CD}-second countdown to begin\n"
        f"• Minimal corner timer + soft on-screen motivation with a gentle chime\n"
        f"• 🎵 Music ONLY during breaks\n\n🕖 TIMESTAMPS\n{ts}\n\n"
        f"🎧 Best with headphones. Put your phone away and let's get things done.\n"
        f"🌱 Like & subscribe for daily study-with-me timers and deep-focus sessions.\n\n"
        f"Footage & ambience from royalty-free sources (Pexels / Pixabay).\n\n"
        f"#studywithme #pomodoro #deepfocus #studytimer #focus #lofi"
    )
    tags = ["study with me", "pomodoro", f"{fmin}/{bmin}", p["kind"].lower(), "study timer",
            "deep focus", "no music study", "focus timer", "study motivation",
            "motivational study", "pomodoro timer", "lofi study", "studywithme"]

    props = {"focusMinutes": fmin, "breakMinutes": bmin, "videoScrim": p["scrim"],
             "ambientKey": p["ambient"], "accentColor": p["accent"],
             "timerPosition": env("IN_CLOCK_POS") or "tr",
             "timerStyle": env("IN_CLOCK_STYLE") or "digital"}

    # render matrix (16200'lük parçalar)
    chunk = 16200
    include, s, i = [], 0, 0
    while s < total_frames:
        include.append({"idx": i, "frames": f"{s}-{min(s+chunk-1, total_frames-1)}"})
        s += chunk; i += 1

    plan = {"focus": fmin, "break": bmin, "ambient": p["ambient"], "accent": p["accent"],
            "scrim": p["scrim"], "kind": p["kind"], "clip_url": clip_url, "clip_src": clip_src,
            "clip_id": clip_id, "total_frames": total_frames, "duration_s": total_s,
            "title": title, "description": description, "tags": tags, "props": props,
            "matrix": {"include": include}, "chunks": len(include)}
    print(json.dumps(plan))

if __name__ == "__main__":
    main()

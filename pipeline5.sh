#!/usr/bin/env bash
# Repack (küçük) artifact indir -> thumbnail -> YouTube yükle (publishAt'lı).
# Kullanım: bash pipeline5.sh "q1:8:REPACK_RUNID" "q2:9:REPACK_RUNID" "q3:10:REPACK_RUNID"
set -u
cd /storage/emulated/0/dos/pomo
CRED=/data/data/com.termux/files/home/WorldCup/.yt-pomodoro.json
UP=/data/data/com.termux/files/home/WorldCup/scripts/yt-upload.py
RESULTS=/storage/emulated/0/dos/pomo/upload-results.txt

for spec in "$@"; do
  qid=${spec%%:*}; rest=${spec#*:}; clip=${rest%%:*}; rid=${rest##*:}
  art="quote-${qid}-small"
  vid="final-quote-${qid}.mp4"
  echo "=== $art -> clip${clip} (repack run $rid) ==="

  if grep -q "^quote-${qid} -> [A-Za-z0-9_-]\{6,\}$" "$RESULTS" 2>/dev/null; then
    echo "ZATEN YÜKLÜ, atla: quote-${qid}"; continue
  fi

  if [ ! -f "$vid" ]; then
    rm -rf "dl-$art"; mkdir -p "dl-$art"
    for try in 1 2 3; do
      gh run download "$rid" -n "$art" -D "dl-$art" </dev/null 2>/dev/null && break
      echo "indirme denemesi $try başarısız, tekrar..."; sleep 5
    done
    f=$(ls "dl-$art"/*.mp4 2>/dev/null | head -1)
    [ -z "$f" ] && { echo "HATA: $art artifact yok" | tee -a "$RESULTS"; continue; }
    mv "$f" "$vid"; rm -rf "dl-$art"
  fi
  echo "indi: $vid ($(ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$vid" 2>/dev/null)s, $(du -h "$vid" | cut -f1))"

  thumb="meta/thumb-${clip}.jpg"
  ffmpeg -nostdin -y -ss 108 -i "$vid" -frames:v 1 -vf scale=1280:720 -q:v 2 "$thumb" 2>/dev/null
  [ -f "$thumb" ] || { echo "HATA: $art thumbnail" | tee -a "$RESULTS"; continue; }

  for try in 1 2 3; do
    out=$(python3 "$UP" "$vid" "meta/clip${clip}.json" "$CRED" </dev/null 2>&1 | tail -6)
    echo "$out"
    vidid=$(echo "$out" | sed -n 's/^VIDEO_ID: //p')
    [ -n "$vidid" ] && break
    echo "yükleme denemesi $try başarısız, tekrar..."; sleep 8
  done
  echo "quote-${qid} -> ${vidid:-YUKLEME_HATASI}" | tee -a "$RESULTS"
done
echo "=== PIPELINE5 BİTTİ ==="

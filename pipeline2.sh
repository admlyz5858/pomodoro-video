#!/usr/bin/env bash
# Düzeltilmiş geçiş: argüman olarak verilen clipleri işler (stdin bug'ı yok).
# Kullanım: bash pipeline2.sh "2:pomo50:27279483308" "3:pomo50:27279508886" ...
set -u
cd /storage/emulated/0/dos/pomo
CRED=/data/data/com.termux/files/home/WorldCup/.yt-pomodoro.json
UP=/data/data/com.termux/files/home/WorldCup/scripts/yt-upload.py
RESULTS=/storage/emulated/0/dos/pomo/upload-results.txt

for spec in "$@"; do
  clip=${spec%%:*}; rest=${spec#*:}; mode=${rest%%:*}; rid=${rest##*:}
  art="clip${clip}-${mode}"
  vid="final-${art}.mp4"
  echo "=== $art (run $rid) ==="

  if grep -q "^${art} -> [A-Za-z0-9_-]\{6,\}$" "$RESULTS" 2>/dev/null; then
    echo "ZATEN YÜKLÜ, atla: $art"
    continue
  fi

  if [ ! -f "$vid" ]; then
    rm -rf "dl-$art"; mkdir -p "dl-$art"
    gh run download "$rid" -n "$art" -D "dl-$art" </dev/null 2>/dev/null
    f=$(ls "dl-$art"/*.mp4 2>/dev/null | head -1)
    [ -z "$f" ] && { echo "HATA: $art artifact yok" | tee -a "$RESULTS"; continue; }
    mv "$f" "$vid"; rm -rf "dl-$art"
  fi
  echo "indi: $vid ($(ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$vid" 2>/dev/null)s)"

  thumb="meta/thumb-${clip}.jpg"
  ffmpeg -nostdin -y -ss 60 -i "$vid" -frames:v 1 -vf scale=1280:720 -q:v 2 "$thumb" 2>/dev/null
  [ -f "$thumb" ] || { echo "HATA: $art thumbnail" | tee -a "$RESULTS"; continue; }

  out=$(python3 "$UP" "$vid" "meta/clip${clip}.json" "$CRED" </dev/null 2>&1 | tail -4)
  echo "$out"
  vidid=$(echo "$out" | sed -n 's/^VIDEO_ID: //p')
  echo "$art -> ${vidid:-YUKLEME_HATASI}" | tee -a "$RESULTS"
done
echo "=== GEÇİŞ 2 BİTTİ ==="
cat "$RESULTS"

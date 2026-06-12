#!/usr/bin/env bash
# Quote-klip hattı: quoteclip artifact indir -> thumbnail -> YouTube yükle (publishAt'lı).
# Kullanım: bash pipeline3.sh "q1:8:RID" "q2:9:RID" "q3:10:RID"
#   q1->clip8(real6), q2->clip9(real8), q3->clip10(real9)
set -u
cd /storage/emulated/0/dos/pomo
CRED=/data/data/com.termux/files/home/WorldCup/.yt-pomodoro.json
UP=/data/data/com.termux/files/home/WorldCup/scripts/yt-upload.py
RESULTS=/storage/emulated/0/dos/pomo/upload-results.txt

for spec in "$@"; do
  qid=${spec%%:*}; rest=${spec#*:}; clip=${rest%%:*}; rid=${rest##*:}
  art="quote-${qid}"
  vid="final-${art}.mp4"
  echo "=== $art -> clip${clip} (run $rid) ==="

  if grep -q "^${art} -> [A-Za-z0-9_-]\{6,\}$" "$RESULTS" 2>/dev/null; then
    echo "ZATEN YÜKLÜ, atla: $art"; continue
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
  # 108. sn: ilk motivasyon mesajı ekranda (özellik thumbnail'de görünsün)
  ffmpeg -nostdin -y -ss 108 -i "$vid" -frames:v 1 -vf scale=1280:720 -q:v 2 "$thumb" 2>/dev/null
  [ -f "$thumb" ] || { echo "HATA: $art thumbnail" | tee -a "$RESULTS"; continue; }

  out=$(python3 "$UP" "$vid" "meta/clip${clip}.json" "$CRED" </dev/null 2>&1 | tail -4)
  echo "$out"
  vidid=$(echo "$out" | sed -n 's/^VIDEO_ID: //p')
  echo "$art -> ${vidid:-YUKLEME_HATASI}" | tee -a "$RESULTS"
done
echo "=== QUOTE HATTI BİTTİ ==="

#!/usr/bin/env bash
# Render sonrası hat: artifact indir -> thumbnail çıkar -> YouTube'a yükle (publishAt'lı).
# Kullanım: bash pipeline.sh   (fullruns.txt'deki tüm clipler için)
set -u
cd /storage/emulated/0/dos/pomo
CRED=/data/data/com.termux/files/home/WorldCup/.yt-pomodoro.json
UP=/data/data/com.termux/files/home/WorldCup/scripts/yt-upload.py
RESULTS=/storage/emulated/0/dos/pomo/upload-results.txt
: > "$RESULTS"

while read -r line; do
  name=${line%% RID=*}; rid=${line##*RID=}      # clip1-pomo50
  clip=${name%-*}; clip=${clip#clip}            # 1
  mode=${name##*-}                              # pomo50
  art="clip${clip}-${mode}"
  vid="final-${art}.mp4"

  echo "=== $art (run $rid) ==="
  conc=$(gh run view "$rid" --json conclusion -q .conclusion 2>/dev/null)
  if [ "$conc" != "success" ]; then
    echo "ATLA: $art run sonucu=$conc" | tee -a "$RESULTS"
    continue
  fi

  if [ ! -f "$vid" ]; then
    rm -rf "dl-$art"; mkdir -p "dl-$art"
    gh run download "$rid" -n "$art" -D "dl-$art" 2>/dev/null
    f=$(ls "dl-$art"/*.mp4 2>/dev/null | head -1)
    [ -z "$f" ] && { echo "HATA: $art artifact yok" | tee -a "$RESULTS"; continue; }
    mv "$f" "$vid"; rm -rf "dl-$art"
  fi
  dur=$(ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$vid" 2>/dev/null)
  echo "indi: $vid (${dur}s)"

  # Thumbnail: 60. sn (sayaç 49:xx / 24:xx gösterir)
  thumb="meta/thumb-${clip}.jpg"
  ffmpeg -y -ss 60 -i "$vid" -frames:v 1 -vf scale=1280:720 -q:v 2 "$thumb" 2>/dev/null
  [ -f "$thumb" ] || { echo "HATA: $art thumbnail" | tee -a "$RESULTS"; continue; }

  # Yükle (meta publishAt içeriyor -> private + zamanlanmış)
  out=$(python3 "$UP" "$vid" "meta/clip${clip}.json" "$CRED" 2>&1 | tail -4)
  echo "$out"
  vidid=$(echo "$out" | sed -n 's/^VIDEO_ID: //p')
  echo "$art -> ${vidid:-YUKLEME_HATASI}" | tee -a "$RESULTS"
done < /data/data/com.termux/files/home/fullruns.txt

echo "=== ÖZET ==="
cat "$RESULTS"

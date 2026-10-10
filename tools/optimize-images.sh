#!/usr/bin/env bash
# Resize and compress portfolio photos into assets/img/ with macOS sips.
# Usage: tools/optimize-images.sh [source-folder]   (default: ~/Downloads/portfolio-images)
# Source names: hero-wide, hero-mobile, poster, work-presenting, work-whiteboard, work-laptop
# (png/jpg/jpeg/heic), plus an optional transparent cutout.png.
set -euo pipefail

SRC="${1:-$HOME/Downloads/portfolio-images}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/assets/img"
mkdir -p "$OUT"

find_src() {
  for ext in png jpg jpeg heic PNG JPG JPEG HEIC; do
    if [ -f "$SRC/$1.$ext" ]; then echo "$SRC/$1.$ext"; return 0; fi
  done
  return 0
}

# name  max-width  budget-KB
while read -r name max budget; do
  src="$(find_src "$name")"
  if [ -z "$src" ]; then echo "skip  $name (not in $SRC)"; continue; fi
  width=$(sips -g pixelWidth "$src" | awk '/pixelWidth/ {print $2}')
  for q in 80 70 60; do
    if [ "$width" -gt "$max" ]; then
      sips -s format jpeg -s formatOptions "$q" --resampleWidth "$max" "$src" --out "$OUT/$name.jpg" >/dev/null
    else
      sips -s format jpeg -s formatOptions "$q" "$src" --out "$OUT/$name.jpg" >/dev/null
    fi
    kb=$(( $(stat -f%z "$OUT/$name.jpg") / 1024 ))
    [ "$kb" -le "$budget" ] && break
  done
  if [ "$kb" -gt "$budget" ]; then
    echo "WARN  $name over budget (${kb} KB > ${budget} KB)"
  else
    echo "ok    $name → assets/img/$name.jpg (${kb} KB, q$q)"
  fi
done <<'LIST'
hero-wide 2400 350
hero-mobile 1200 200
poster 1200 250
work-presenting 1600 200
work-whiteboard 1600 200
work-laptop 1600 200
LIST

src="$(find_src cutout)"
if [ -n "$src" ]; then
  sips -s format png --resampleHeight 1400 "$src" --out "$OUT/hero-cutout.png" >/dev/null
  echo "ok    cutout → assets/img/hero-cutout.png ($(( $(stat -f%z "$OUT/hero-cutout.png") / 1024 )) KB)"
fi

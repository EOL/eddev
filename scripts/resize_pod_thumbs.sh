#!/usr/bin/env bash

for i in app/assets/images/podcasts_orig/*.jpg; do
  printf "Resize $i\n"
  convert "$i" -resize 127x127 "app/assets/images/podcasts/$(basename $i)"
done

#!/bin/bash

SERVER="http://192.168.128.3:8001"
SIZES=(10 50 100 500 1000 5000)
VUS_LEVELS=(1 10 50)
FORMATS=("json" "xml")

mkdir -p results

for FORMAT in "${FORMATS[@]}"; do
	for SIZE in "${SIZES[@]}"; do
		for VUS in "${VUS_LEVELS[@]}"; do
			OUTFILE="results/${FORMAT}_size${SIZE}_vus${VUS}.json"
			echo ">>> Running: format=$FORMAT size=$SIZE vus=$VUS"
			k6 run \
				-e TARGET_URL="${SERVER}/api/${FORMAT}" \
				-e SIZE="${SIZE}" \
				-e VUS="${VUS}" \
				-e OUTFILE="${OUTFILE}" \
				test.js
			sleep 5
		done
	done
done

echo "Done. Results saved in ./results/"
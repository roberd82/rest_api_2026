#!/bin/bash
SERVER="http://192.168.128.3:8001"
SIZES=(10 50 100 500 1000 5000)

echo "format,size,bytes"
for SIZE in "${SIZES[@]}"; do
	JSON_BYTES=$(curl -s -o /dev/null -w "%{size_download}" \
		"${SERVER}/api/json?size=${SIZE}")
	XML_BYTES=$(curl -s  -o /dev/null -w "%{size_download}" \
		"${SERVER}/api/xml?size=${SIZE}")
	echo "json,${SIZE},${JSON_BYTES}"
	echo "xml,${SIZE},${XML_BYTES}"
done
#!/bin/bash

cd "$(dirname "$0")"

find ./public_html/ -name '*.js' -type f -print0 | while read -d $'\0' file
do
    FILENAME="$file"
    FILEHASH="$(openssl dgst -sha384 -binary $file | openssl base64 -A)"
    echo "$FILENAME = sha384-$FILEHASH"
done
#!/bin/bash

cd "$(dirname "$0")"

mkdir -p certs

openssl req -x509 -nodes -days 1825 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem
#!/bin/bash

# API URL
URL="http://localhost:4000/urls/shorten"

# Inputs (arguments)
USER_ID=$1
ORIGINAL_URL=$2
TOKEN=$3

# Default values (optional)
USER_ID=${USER_ID:-"15"}
ORIGINAL_URL=${ORIGINAL_URL:-"https://youtu.be/-Nm3Z2C_nkg?si=y5wb0RqweovIMwTD"}
TOKEN=${TOKEN:-"your_jwt_token_here"}

# Request
curl -X POST $URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"url\": \"$ORIGINAL_URL\"
  }"

echo -e "\n✅ Shorten request sent"
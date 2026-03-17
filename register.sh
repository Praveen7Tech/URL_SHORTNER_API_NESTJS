#!/bin/bash

URL="http://localhost:4000/auth/register"

# User data
EMAIL="test1@example.com"
PASSWORD="password123"

# Request
curl -X POST $URL \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }"

echo -e "\n✅ User registration request sent"
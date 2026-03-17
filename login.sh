#!/bin/bash

# API URL
URL="http://localhost:4000/auth/login"

# Accept email & password from arguments
EMAIL=$1
PASSWORD=$2

# Default values (if not passed)
EMAIL=${EMAIL:-test1@example.com}
PASSWORD=${PASSWORD:-password123}

# Request
RESPONSE=$(curl -s -X POST $URL \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

# Print response
echo "Response:"
echo $RESPONSE


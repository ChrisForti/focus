#!/bin/bash

# Focus API Test Script

BASE_URL="http://localhost:3000"

echo "=================================="
echo "🚤 Focus API Test Suite"
echo "=================================="
echo ""

# 1. Test Health Endpoint
echo "1️⃣  Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/health")
echo "Response: $HEALTH_RESPONSE"
echo ""

# 2. Test Get Projects
echo "2️⃣  Testing Get Projects..."
PROJECTS=$(curl -s "$BASE_URL/api/projects")
echo "Response: $PROJECTS"
echo ""

# 3. Test Get Todos
echo "3️⃣  Testing Get Todos..."
TODOS=$(curl -s "$BASE_URL/api/todos")
echo "Response: $TODOS"
echo ""

# 4. Test Voice Processing (requires audio file)
if [ -f "$1" ]; then
  echo "4️⃣  Testing Voice Processing with: $1"
  echo "Uploading audio file..."
  VOICE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/process-voice" \
    -F "audio=@$1" \
    -F "projectId=1")
  echo "Response:"
  echo "$VOICE_RESPONSE" | jq . 2>/dev/null || echo "$VOICE_RESPONSE"
  echo ""
else
  echo "4️⃣  Skipping Voice Processing (no audio file provided)"
  echo "Usage: ./test-api.sh <path-to-audio-file.mp3>"
  echo ""
fi

echo "=================================="
echo "✅ Tests Complete"
echo "=================================="

#!/bin/bash

# Quick Audio Recording Script for Mac
# Records audio and tests it with Focus API

OUTPUT_FILE="test-voice-note.m4a"
DURATION=10  # seconds

echo "🎙️  Focus Audio Test Recorder"
echo "=================================="
echo ""
echo "This will record $DURATION seconds of audio."
echo "Speak clearly about boat building tasks!"
echo ""
echo "Example: 'Cut the transom on the CNC with a 5mm offset,"
echo "         then sand it to 220 grit and apply varnish'"
echo ""
read -p "Press ENTER to start recording..."
echo ""
echo "🔴 RECORDING NOW... ($DURATION seconds)"
echo ""

# Record audio using sox (if available) or afplay/afrecord
if command -v sox &> /dev/null; then
    sox -d -r 16000 -c 1 "$OUTPUT_FILE" trim 0 $DURATION
elif command -v ffmpeg &> /dev/null; then
    ffmpeg -f avfoundation -i ":0" -t $DURATION "$OUTPUT_FILE" -y 2>/dev/null
else
    echo "⚠️  sox or ffmpeg not found. Using macOS recording..."
    echo "Please install sox: brew install sox"
    echo "Or ffmpeg: brew install ffmpeg"
    exit 1
fi

echo ""
echo "✅ Recording saved to: $OUTPUT_FILE"
echo ""
echo "🚀 Testing with Focus API..."
echo ""

# Test with API
curl -X POST http://localhost:3000/api/process-voice \
  -F "audio=@$OUTPUT_FILE" \
  -F "projectId=1" | jq . 2>/dev/null || echo "Install jq for pretty output: brew install jq"

echo ""
echo "=================================="
echo "✅ Test Complete!"
echo ""

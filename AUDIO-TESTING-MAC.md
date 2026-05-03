# Testing Audio on Mac

## Option 1: Use Voice Memos (Easiest)

1. **Open Voice Memos app** (built into macOS)
2. **Click the red record button**
3. **Say your task:**
   > "Cut the transom on the CNC with a 5mm offset, then sand it to 220 grit and apply varnish"
4. **Stop recording**
5. **Right-click → Share → Save to Downloads**
6. **Test it:**
   ```bash
   ./test-api.sh ~/Downloads/voice-memo.m4a
   ```

## Option 2: Use QuickTime Player

1. **Open QuickTime Player**
2. **File → New Audio Recording**
3. **Click the red record button**
4. **Speak your tasks**
5. **Click stop, then File → Save**
6. **Test it:**
   ```bash
   ./test-api.sh ~/Downloads/recording.m4a
   ```

## Option 3: Record from Terminal (Requires ffmpeg)

Install ffmpeg first:

```bash
brew install ffmpeg
```

Then use the recording script:

```bash
./record-and-test.sh
```

This will:

- Record 10 seconds of audio
- Save as `test-voice-note.m4a`
- Automatically test it with the API

## Option 4: Use `say` to Generate Speech (For Quick Testing)

macOS has text-to-speech! Create a test audio file:

```bash
# Generate speech and convert to audio file
say -o test-speech.aiff "Cut the transom on the CNC with a five millimeter offset, then sand it to 220 grit and apply varnish"

# Convert to m4a (requires ffmpeg)
ffmpeg -i test-speech.aiff test-speech.m4a

# Test it
./test-api.sh test-speech.m4a
```

## Option 5: Record with Your iPhone/AirPods

1. **Use Voice Memos on iPhone**
2. **Record your task instructions**
3. **AirDrop to your Mac**
4. **Test the file**

## Testing Examples

### Boat Building Tasks to Say:

**CNC Work:**

> "Cut the bulkhead with a 3 millimeter offset on the CNC router, then check the dimensions"

**Assembly:**

> "Fit the transom to the hull, apply epoxy, and clamp for 24 hours"

**Finishing:**

> "Sand the teak deck to 180 grit, vacuum thoroughly, then apply two coats of oil"

**Complex Multi-task:**

> "Need to finish the cold molding on the bow section, CNC cut the hatch covers with proper offsets, sand the coamings to final finish, and order more mahogany for the interior panels"

## Quick Test Command

Once you have an audio file:

```bash
# Basic test
curl -X POST http://localhost:3000/api/process-voice \
  -F "audio=@your-file.m4a" \
  -F "projectId=1"

# Pretty output (with jq)
curl -X POST http://localhost:3000/api/process-voice \
  -F "audio=@your-file.m4a" \
  -F "projectId=1" | jq .
```

## Install Helpful Tools

```bash
# Install jq for pretty JSON output
brew install jq

# Install ffmpeg for audio conversion
brew install ffmpeg

# Install sox for advanced audio recording
brew install sox
```

## Expected Output

You should see something like:

```json
{
  "success": true,
  "transcript": "Cut the transom on the CNC with a 5mm offset, then sand it to 220 grit and apply varnish",
  "logId": 1,
  "tasks": [
    {
      "id": 1,
      "task": "Cut transom on CNC with 5mm offset",
      "priority": "high",
      "category": "CNC",
      "isCompleted": false
    },
    {
      "id": 2,
      "task": "Sand transom to 220 grit",
      "priority": "medium",
      "category": "Finishing",
      "isCompleted": false
    },
    {
      "id": 3,
      "task": "Apply varnish to transom",
      "priority": "medium",
      "category": "Finishing",
      "isCompleted": false
    }
  ]
}
```

## Troubleshooting

**"ffmpeg not found"**

```bash
brew install ffmpeg
```

**"Permission denied"**

```bash
chmod +x ./test-api.sh
chmod +x ./record-and-test.sh
```

**"Connection refused"**

- Make sure the server is running: `npm run dev`

**"No such file"**

- Check the path to your audio file
- Use absolute paths: `~/Downloads/voice-memo.m4a`

**Audio format not supported**

- Convert to mp3/m4a/wav: `ffmpeg -i input.caf output.m4a`

# Testing Focus API

## Quick Test

The API is now running! Here's how to test it:

### 1. Health Check ✅

```bash
curl http://localhost:3000/health
```

### 2. Run Test Suite

```bash
./test-api.sh
```

### 3. Test Voice Processing

You need an audio file (mp3, wav, m4a, etc.) with voice instructions. Here's how:

**Option A: Record on your phone**

1. Record yourself saying something like:
   > "Need to cut the transom on the CNC with a 5mm offset, then sand it down to 220 grit and apply the first coat of varnish"
2. AirDrop or transfer the audio file to your Mac
3. Test it:
   ```bash
   ./test-api.sh ~/Downloads/voice-note.m4a
   ```

**Option B: Use curl directly**

```bash
curl -X POST http://localhost:3000/api/process-voice \
  -F "audio=@/path/to/your/audio.mp3" \
  -F "projectId=1"
```

**Option C: Create a sample project first**

```bash
# First, create a test project in the database
# (You'll need to do this via SQL or add a create-project endpoint)
```

## What the API Does

1. **Transcribes** your audio using OpenAI Whisper (via OpenRouter)
2. **Extracts tasks** using Claude 3.5 Sonnet with nautical carpentry context
3. **Categorizes** tasks as CNC, Assembly, Finishing, or Carpentry
4. **Assigns priority** based on urgency and safety
5. **Saves to database** for tracking

## Expected Response

```json
{
  "success": true,
  "transcript": "Need to cut the transom on the CNC...",
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
      "task": "Apply first coat of varnish to transom",
      "priority": "medium",
      "category": "Finishing",
      "isCompleted": false
    }
  ]
}
```

## Test Phrases

Try recording yourself saying these:

1. **CNC Work:**

   > "Cut the bulkhead with a 3mm offset on the CNC router, then check the dimensions"

2. **Assembly:**

   > "Fit the transom to the hull, apply epoxy, and clamp for 24 hours"

3. **Finishing:**

   > "Sand the teak deck to 180 grit, vacuum, then apply two coats of oil"

4. **Mixed Tasks:**
   > "Need to finish the cold molding on the bow, CNC cut the hatch covers, and order more mahogany"

## Troubleshooting

**"No audio file provided"**

- Make sure you're using `-F "audio=@/path/to/file"`
- Check the file path is correct

**"Failed to transcribe audio"**

- Verify your OpenRouter API key has credits
- Check the audio format is supported (mp3, wav, m4a, etc.)

**"Failed to extract tasks"**

- Check Claude 3.5 Sonnet is available on your OpenRouter account
- Verify the CHAT_MODEL env variable is set correctly

**Empty tasks array**

- The audio might not contain clear task instructions
- Try speaking more clearly about specific actions needed

# Using OpenRouter with Focus

Focus now supports [OpenRouter](https://openrouter.ai/), which gives you access to multiple AI models through a single API.

## Why OpenRouter?

- **Multiple Models**: Access GPT-4, Claude, Llama, Gemini, and more through one API
- **Cost Effective**: Often cheaper than direct OpenAI API
- **Fallback Options**: Switch between models easily
- **Flexible**: Use the best model for each task

## Setup

1. **Get an OpenRouter API Key**
   - Go to [openrouter.ai](https://openrouter.ai/)
   - Sign up or log in
   - Get your API key from the Keys section

2. **Configure Environment Variables**

   In your `.env` file, add:

   ```bash
   # OpenRouter Configuration
   OPENAI_API_KEY=sk-or-v1-your-openrouter-key-here
   OPENAI_BASE_URL=https://openrouter.ai/api/v1

   # Model Selection
   WHISPER_MODEL=openai/whisper-1
   CHAT_MODEL=openai/gpt-4o
   ```

3. **Choose Your Models**

   OpenRouter uses the format `provider/model-name`:

   **For Task Extraction (CHAT_MODEL):**
   - `openai/gpt-4o` - Best overall performance
   - `openai/gpt-4o-mini` - Faster, cheaper
   - `anthropic/claude-3.5-sonnet` - Excellent reasoning
   - `anthropic/claude-3-haiku` - Fast and cheap
   - `meta-llama/llama-3.1-70b-instruct` - Open source alternative
   - `google/gemini-pro-1.5` - Google's best

   **For Speech-to-Text (WHISPER_MODEL):**
   - `openai/whisper-1` - OpenAI's Whisper (recommended)

   Browse all available models at [openrouter.ai/models](https://openrouter.ai/models)

## Example Configurations

### Balanced (GPT-4o via OpenRouter)

```bash
OPENAI_API_KEY=sk-or-v1-your-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
WHISPER_MODEL=openai/whisper-1
CHAT_MODEL=openai/gpt-4o
```

### Budget-Friendly (GPT-4o-mini)

```bash
OPENAI_API_KEY=sk-or-v1-your-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
WHISPER_MODEL=openai/whisper-1
CHAT_MODEL=openai/gpt-4o-mini
```

### Claude Alternative

```bash
OPENAI_API_KEY=sk-or-v1-your-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
WHISPER_MODEL=openai/whisper-1
CHAT_MODEL=anthropic/claude-3.5-sonnet
```

### Open Source (Llama)

```bash
OPENAI_API_KEY=sk-or-v1-your-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
WHISPER_MODEL=openai/whisper-1
CHAT_MODEL=meta-llama/llama-3.1-70b-instruct
```

## Switching Back to OpenAI

To use OpenAI directly instead:

```bash
OPENAI_API_KEY=sk-your-openai-key
# OPENAI_BASE_URL=https://api.openai.com/v1  # Optional, this is the default
# WHISPER_MODEL=whisper-1  # Optional, this is the default
# CHAT_MODEL=gpt-4o  # Optional, this is the default
```

Or simply omit the `OPENAI_BASE_URL` variable - it defaults to OpenAI.

## Testing

After configuration, test the API:

```bash
# Start the server
npm run dev

# Upload a test audio file
curl -X POST http://localhost:3000/api/process-voice \
  -F "audio=@./test.mp3"
```

## Cost Comparison

OpenRouter often provides better pricing:

| Model             | OpenRouter      | Direct API        |
| ----------------- | --------------- | ----------------- |
| GPT-4o            | ~$2.50/M tokens | $2.50-$5/M tokens |
| GPT-4o-mini       | ~$0.15/M tokens | $0.15/M tokens    |
| Claude 3.5 Sonnet | ~$3/M tokens    | $3/M tokens       |
| Llama 3.1 70B     | ~$0.50/M tokens | N/A               |

Check current pricing at [openrouter.ai/models](https://openrouter.ai/models)

## Troubleshooting

**"Invalid API Key"**

- Ensure your OpenRouter key starts with `sk-or-v1-`
- Verify the key is active in your OpenRouter dashboard

**"Model not found"**

- Check model name format: `provider/model-name`
- Verify the model is available on OpenRouter
- Some models require credits or special access

**Whisper transcription fails**

- Whisper must use `openai/whisper-1` on OpenRouter
- Ensure your OpenRouter account has credits
- Check audio file format (mp3, wav, m4a supported)

**Different results from models**

- Each model has different strengths
- GPT-4o is best for complex task extraction
- Claude excels at detailed reasoning
- Llama models are more cost-effective

## Advanced: Model Fallbacks

You can implement fallbacks by catching errors and trying alternate models:

```typescript
// In ai.service.ts
const FALLBACK_MODELS = [
  "openai/gpt-4o",
  "anthropic/claude-3.5-sonnet",
  "openai/gpt-4o-mini",
];
```

This is left as an exercise for production deployments.

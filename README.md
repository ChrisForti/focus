# Focus 🚤

**Voice-first productivity tool for nautical carpentry and yacht interior manufacturing**

Focus allows craftspeople to capture verbal notes hands-free in the workshop and uses AI to extract structured To-Do lists, specifically identifying CNC tasks, assembly, and finishing work.

## ✅ Status

**Fully functional!** The backend is complete with:

- ✅ Voice transcription working (OpenAI Whisper)
- ✅ AI task extraction working (GPT-4o)
- ✅ Database schema deployed to Railway
- ✅ All API endpoints tested and operational
- ✅ GitHub Pages landing page live at [chrisforti.github.io/focus](https://chrisforti.github.io/focus)
- 🚧 React Native mobile app (coming soon)

---

## 🏗️ Technical Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Railway) with Drizzle ORM
- **AI Pipeline**: OpenAI Whisper (STT) + GPT-4o (Task Extraction)
- **AI Providers**: OpenAI or OpenRouter (supports multiple models)
- **Infrastructure**: Railway (Deployment), GitHub (Version Control)

---

## 📋 Features

- 🎤 Voice-to-text transcription using OpenAI Whisper
- 🤖 AI-powered task extraction optimized for boat building
- � Flexible AI provider support (OpenAI or OpenRouter)
- 🎯 Multiple model options (GPT-4o, Claude, Llama, etc.)
- �📊 Structured To-Do lists with priority and categories
- 🏷️ Automatic categorization (CNC, Assembly, Finishing, Carpentry)
- ✅ Task management with completion tracking

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Railway recommended)
- OpenAI API key OR OpenRouter account (see [OPENROUTER.md](OPENROUTER.md))

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:ChrisForti/focus.git
   cd focus
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PORT`: Server port (default: 3000)
   - `CHAT_MODEL`: Model to use (default: gpt-4o)

   **Important:** If you have `OPENAI_API_KEY` set in your shell environment (`.zshrc` or `.bashrc`), it will override the `.env` file. Either unset it or remove it from your shell config.

   ```bash
   # Check if you have it set
   echo $OPENAI_API_KEY

   # If yes, unset before running the server
   unset OPENAI_API_KEY WHISPER_API_KEY
   ```

4. **Generate and push database schema**

   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

---

## 🗄️ Database Schema

### Tables

**projects**

- `id`: Serial primary key
- `name`: Project name
- `created_at`: Timestamp

**voice_logs**

- `id`: Serial primary key
- `project_id`: Foreign key to projects
- `transcript`: Full text transcription
- `created_at`: Timestamp

**todos**

- `id`: Serial primary key
- `log_id`: Foreign key to voice_logs
- `task`: Task description
- `is_completed`: Boolean (default: false)
- `priority`: Enum ('low', 'medium', 'high')
- `category`: Text (CNC, Assembly, Finishing, etc.)

---

## 🔌 API Endpoints

### Health Check

```
GET /health
```

### Process Voice Recording

```
POST /api/process-voice
Content-Type: multipart/form-data

Body:
- audio: Audio file (mp3, wav, m4a, etc.)
- projectId: (optional) Project ID

Response:
{
  "success": true,
  "transcript": "Full transcription...",
  "logId": 123,
  "tasks": [
    {
      "id": 1,
      "task": "Cut transom with CNC router",
      "priority": "high",
      "category": "CNC",
      "isCompleted": false
    }
  ]
}
```

### Get All Projects

```
GET /api/projects
```

### Get All Todos

```
GET /api/todos
```

### Update Todo

```
PATCH /api/todos/:id
Content-Type: application/json

Body:
{
  "isCompleted": true,
  "priority": "high",
  "category": "CNC"
}
```

---

## 🚂 Railway Deployment

### Setup

1. **Create a new Railway project**
   - Go to [railway.app](https://railway.app)
   - Create a new project
   - Add PostgreSQL database

2. **Connect GitHub repository**
   - Link your GitHub repository
   - Railway will auto-detect the Node.js project

3. **Configure environment variables**
   - Add `DATABASE_URL` (auto-populated by Railway)
   - Add `OPENAI_API_KEY`
   - Add `NODE_ENV=production`

4. **Deploy**
   - Push to main branch
   - Railway will automatically build and deploy

### Verify Deployment

Check the health endpoint:

```bash
curl https://your-app.railway.app/health
```

---

## 🛠️ Development

### Build for production

```bash
npm run build
```

### Run production build

```bash
npm start
```

### Database commands

```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio (GUI)
npm run db:studio
```

---

## 📦 Project Structure

```
focus/
├── src/
│   ├── controllers/      # Request handlers
│   ├── db/              # Database configuration & schema
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic (AI, etc.)
│   └── index.ts         # Express app entry point
├── drizzle/             # Generated migration files
├── uploads/             # Temporary audio file storage
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
├── drizzle.config.ts    # Drizzle ORM configuration
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
└── railway.json         # Railway deployment config
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# Upload voice recording
curl -X POST http://localhost:3000/api/process-voice \
  -F "audio=@./sample.mp3" \
  -F "projectId=1"

# Get todos
curl http://localhost:3000/api/todos
```

---

## 🎯 AI Task Extraction

The AI is optimized to recognize:

- **CNC Operations**: cutting, routing, offsets, toolpaths
- **Cold-molding**: lamination techniques
- **Structural Work**: transoms, bulkheads, frames
- **Assembly**: joinery, fitting, installation
- **Finishing**: varnishing, painting, sanding
- **Materials**: wood types, epoxy, hardware specifications

### Example Input

> "Need to cut the transom with a 6mm offset on the CNC, then sand it down to 220 grit before applying the first coat of varnish"

### Example Output

```json
[
  {
    "task": "Cut transom with 6mm offset on CNC",
    "priority": "high",
    "category": "CNC"
  },
  {
    "task": "Sand transom to 220 grit",
    "priority": "medium",
    "category": "Finishing"
  },
  {
    "task": "Apply first coat of varnish to transom",
    "priority": "medium",
    "category": "Finishing"
  }
]
```

---

## 📝 License

ISC

---

## 🤝 Contributing

This is a specialized tool for boat building workflows. Contributions welcome!

---

**Built for craftspeople who work with their hands** 🔨⚓

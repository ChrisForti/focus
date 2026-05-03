import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

// For Whisper transcription - use OpenAI directly (OpenRouter doesn't support file uploads)
const whisperClient = new OpenAI({
  apiKey: process.env.WHISPER_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1",
});

// For text generation - support both OpenAI and OpenRouter
const chatClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

// Model configurations
const WHISPER_MODEL = "whisper-1"; // Always use OpenAI's Whisper
const CHAT_MODEL = process.env.CHAT_MODEL || "gpt-4o";

export interface ExtractedTask {
  task: string;
  priority: "low" | "medium" | "high";
  category: string | null;
}

export async function transcribeAudio(audioFilePath: string): Promise<string> {
  try {
    // Read file as buffer and create a proper File object for OpenAI
    const audioBuffer = fs.readFileSync(audioFilePath);
    const filename = audioFilePath.split("/").pop() || "audio.mp3";

    // Create a File-like object for OpenAI SDK
    const audioFile = new File([audioBuffer], filename, {
      type: getMimeType(filename),
    });

    const transcription = await whisperClient.audio.transcriptions.create({
      file: audioFile,
      model: WHISPER_MODEL,
    });

    return transcription.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error("Failed to transcribe audio");
  }
}

function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop();
  const mimeTypes: { [key: string]: string } = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/m4a",
    mp4: "audio/mp4",
    webm: "audio/webm",
    ogg: "audio/ogg",
    flac: "audio/flac",
  };
  return mimeTypes[ext || "mp3"] || "audio/mpeg";
}

export async function extractTasks(
  transcript: string,
): Promise<ExtractedTask[]> {
  try {
    const systemPrompt = `You are an AI assistant specialized in nautical carpentry and yacht interior manufacturing.
Your task is to extract actionable to-do items from voice transcripts.

Focus on tasks related to:
- CNC operations (cutting, routing, offsets, toolpaths)
- Cold-molding and lamination
- Transoms, bulkheads, and structural components
- Assembly and joinery
- Finishing (varnishing, painting, sanding)
- Measurements and material specifications

Return ONLY a valid JSON array of tasks with this exact structure:
[
  {
    "task": "Brief, clear task description",
    "priority": "low" | "medium" | "high",
    "category": "CNC" | "Assembly" | "Finishing" | "Carpentry" | "Material" | null
  }
]

Rules:
- Each task should be specific and actionable
- Identify priority based on urgency and safety
- CNC tasks are typically high priority
- Ignore casual conversation or filler words
- If no tasks are found, return an empty array []`;

    const completion = await chatClient.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Extract tasks from this transcript:\n\n${transcript}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      return [];
    }

    const parsed = JSON.parse(content);

    // Handle multiple formats: array, object with tasks array, or single task object
    let tasks: any[] = [];
    if (Array.isArray(parsed)) {
      tasks = parsed;
    } else if (parsed.tasks && Array.isArray(parsed.tasks)) {
      tasks = parsed.tasks;
    } else if (parsed.task) {
      // Single task object - convert to array
      tasks = [parsed];
    }

    return tasks.map((task: any) => ({
      task: task.task,
      priority: task.priority || "medium",
      category: task.category || null,
    }));
  } catch (error) {
    console.error("Error extracting tasks:", error);
    throw new Error("Failed to extract tasks from transcript");
  }
}

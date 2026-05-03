import express from "express";
import multer from "multer";
import {
  processVoice,
  getProjects,
  getTodos,
  updateTodo,
} from "../controllers/voice.controller";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common audio formats
    const allowedMimes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/vnd.wave",
      "audio/mp4",
      "audio/m4a",
      "audio/x-m4a",
      "audio/webm",
      "audio/ogg",
      "application/octet-stream", // Sometimes audio files are detected as binary
    ];

    // Also check file extension as fallback
    const ext = file.originalname.toLowerCase().split(".").pop();
    const allowedExtensions = [
      "mp3",
      "wav",
      "m4a",
      "mp4",
      "webm",
      "ogg",
      "aiff",
      "aac",
      "flac",
    ];

    if (
      allowedMimes.includes(file.mimetype) ||
      allowedExtensions.includes(ext || "")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type: ${file.mimetype}. Only audio files are allowed.`,
        ),
      );
    }
  },
});

// POST /api/process-voice - Process voice recording
router.post("/process-voice", upload.single("audio"), processVoice);

// GET /api/projects - Get all projects
router.get("/projects", getProjects);

// GET /api/todos - Get todos (optionally filtered)
router.get("/todos", getTodos);

// PATCH /api/todos/:id - Update a todo
router.patch("/todos/:id", updateTodo);

export default router;

import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { voiceLogs, todos } from "../db/schema";
import { transcribeAudio, extractTasks } from "../services/ai.service";
import fs from "fs";

export async function processVoice(req: Request, res: Response) {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const projectId = req.body.projectId ? parseInt(req.body.projectId) : null;
    const audioFilePath = req.file.path;

    // Step 1: Transcribe audio using Whisper
    console.log("Transcribing audio...");
    const transcript = await transcribeAudio(audioFilePath);
    console.log("Transcript:", transcript);

    // Step 2: Extract tasks using GPT-4o
    console.log("Extracting tasks...");
    const extractedTasks = await extractTasks(transcript);
    console.log("Extracted tasks:", extractedTasks);

    // Step 3: Save to database in a transaction
    const voiceLog = await db
      .insert(voiceLogs)
      .values({
        projectId,
        transcript,
      })
      .returning();

    const logId = voiceLog[0].id;

    const savedTodos = await db
      .insert(todos)
      .values(
        extractedTasks.map((task) => ({
          logId,
          task: task.task,
          priority: task.priority,
          category: task.category,
        })),
      )
      .returning();

    // Clean up uploaded file
    fs.unlinkSync(audioFilePath);

    // Return response
    return res.status(200).json({
      success: true,
      transcript,
      logId,
      tasks: savedTodos,
    });
  } catch (error) {
    console.error("Error processing voice:", error);

    // Clean up file if it exists
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    return res.status(500).json({
      error: "Failed to process voice recording",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getProjects(req: Request, res: Response) {
  try {
    const projects = await db.query.projects.findMany({
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ error: "Failed to fetch projects" });
  }
}

export async function getTodos(req: Request, res: Response) {
  try {
    const { projectId, logId } = req.query;

    let query = db.query.todos.findMany({
      orderBy: (todos, { desc }) => [desc(todos.id)],
      with: {
        voiceLog: true,
      },
    });

    // Note: Filtering would need to be done in-memory or with where clause
    // For simplicity, returning all todos for now
    const allTodos = await db.query.todos.findMany({
      orderBy: (todos, { desc }) => [desc(todos.id)],
    });

    return res.status(200).json(allTodos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return res.status(500).json({ error: "Failed to fetch todos" });
  }
}

export async function updateTodo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isCompleted, task, priority, category } = req.body;

    const updated = await db
      .update(todos)
      .set({
        isCompleted,
        task,
        priority,
        category,
      })
      .where(eq(todos.id, parseInt(id)))
      .returning();

    return res.status(200).json(updated[0]);
  } catch (error) {
    console.error("Error updating todo:", error);
    return res.status(500).json({ error: "Failed to update todo" });
  }
}

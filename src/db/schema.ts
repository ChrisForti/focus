import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const voiceLogs = pgTable("voice_logs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  transcript: text("transcript").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  logId: integer("log_id").references(() => voiceLogs.id),
  task: text("task").notNull(),
  isCompleted: boolean("is_completed").default(false),
  priority: priorityEnum("priority").default("medium"),
  category: text("category"), // e.g., 'CNC', 'Carpentry', 'Finishing'
});

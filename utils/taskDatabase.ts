import { Task } from "@/types/tasks.types";
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync("kite_tasks.db");
  }
  return db;
}

export async function initTasksTable(): Promise<void> {
  const database = getDb();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);
}

export async function dbGetAllTasks(): Promise<Task[]> {
  const database = getDb();
  return await database.getAllAsync<Task>(
    "SELECT * FROM tasks ORDER BY created_at DESC;",
  );
}

export async function dbInsertTask(title: string): Promise<number> {
  const database = getDb();
  const result = await database.runAsync(
    "INSERT INTO tasks (title, completed, created_at) VALUES (?, 0, ?);",
    [title, Date.now()],
  );
  return result.lastInsertRowId;
}

export async function dbUpdateTaskTitle(
  id: number,
  title: string,
): Promise<void> {
  const database = getDb();
  await database.runAsync("UPDATE tasks SET title = ? WHERE id = ?;", [
    title,
    id,
  ]);
}

export async function dbToggleTask(
  id: number,
  completed: number,
): Promise<void> {
  const database = getDb();
  await database.runAsync("UPDATE tasks SET completed = ? WHERE id = ?;", [
    completed,
    id,
  ]);
}

export async function dbDeleteTask(id: number): Promise<void> {
  const database = getDb();
  await database.runAsync("DELETE FROM tasks WHERE id = ?;", [id]);
}

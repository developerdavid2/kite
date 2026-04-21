import type { Task } from "@/types/tasks.types";
import {
  dbDeleteTask,
  dbGetAllTasks,
  dbInsertTask,
  dbToggleTask,
  dbUpdateTaskTitle,
  initTasksTable,
} from "@/utils/taskDatabase";
import { useCallback, useEffect, useState } from "react";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isReady, setIsReady] = useState(false);

  const loadTasks = useCallback(async () => {
    const rows = await dbGetAllTasks();
    setTasks(rows as Task[]);
  }, []);

  useEffect(() => {
    (async () => {
      await initTasksTable();
      await loadTasks();
      setIsReady(true);
    })();
  }, [loadTasks]);

  const addTask = useCallback(async (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const id = await dbInsertTask(trimmed);
    const newTask: Task = {
      id,
      title: trimmed,
      completed: 0,
      created_at: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const editTask = useCallback(async (id: number, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    await dbUpdateTaskTitle(id, trimmed);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t)),
    );
  }, []);

  const toggleTask = useCallback(async (id: number, completed: number) => {
    const next = completed === 1 ? 0 : 1;
    await dbToggleTask(id, next);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: next } : t)),
    );
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    await dbDeleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completedCount = tasks.filter((t) => t.completed === 1).length;
  const totalCount = tasks.length;
  const recentTasks = tasks.slice(0, 3);

  return {
    tasks,
    recentTasks,
    isReady,
    completedCount,
    totalCount,
    loadTasks,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
  };
}

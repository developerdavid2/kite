export interface Task {
  id: number;
  title: string;
  completed: number;
  created_at: number;
}

export type TaskFilter = "all" | "active" | "completed";

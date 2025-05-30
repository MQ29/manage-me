import type { Task } from "../types/Task";
import api from "./api";

export class TaskApi {
  static async getAll(): Promise<Task[]> {
    const res = await api.get<Task[]>("tasks/");
    return res.data;
  }

  static async getById(id: string): Promise<Task | undefined> {
    try {
      const res = await api.get<Task>(`tasks/${id}/`);
      return res.data;
    } catch {
      return undefined;
    }
  }

  static async add(task: Omit<Task, "id" | "createdAt" | "status" | "assigneeId" | "startedAt" | "finishedAt" | "loggedHours">): Promise<Task> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id,
      createdAt,
      status: "todo",
      assigneeId: undefined,
      startedAt: undefined,
      finishedAt: undefined,
      loggedHours: undefined,
    };
    const res = await api.post<Task>("tasks/", newTask);
    return res.data;
  }

  static async update(updated: Task): Promise<Task> {
    const res = await api.put<Task>(`tasks/${updated.id}/`, updated);
    return res.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`tasks/${id}/`);
  }
}
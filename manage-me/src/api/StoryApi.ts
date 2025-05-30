import type { Story } from "../types/Story";
import api from "./api";

export class StoryApi {
  static async getAll(): Promise<Story[]> {
    const res = await api.get<Story[]>("stories/");
    return res.data;
  }

  static async getByProject(projectId: string): Promise<Story[]> {
    const all = await this.getAll();
    return all.filter((s) => s.projectId === projectId);
  }

  static async add(story: Omit<Story, "id" | "createdAt">): Promise<Story> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const res = await api.post<Story>("stories/", { id, createdAt, ...story });
    return res.data;
  }

  static async update(updated: Story): Promise<Story> {
    const res = await api.put<Story>(`stories/${updated.id}/`, updated);
    return res.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`stories/${id}/`);
  }
}
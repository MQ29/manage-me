import type { Project } from "../types/Project";
import api from "./api";

export class ProjectApi {
  static async getAll(): Promise<Project[]> {
    const res = await api.get<Project[]>("projects/");
    return res.data;
  }

  static async getById(id: string): Promise<Project | undefined> {
    try {
      const res = await api.get<Project>(`projects/${id}/`);
      return res.data;
    } catch {
      return undefined;
    }
  }

  static async add(project: Omit<Project, "id">): Promise<Project> {
    const id = crypto.randomUUID();
    const res = await api.post<Project>("projects/", { id, ...project });
    return res.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`projects/${id}/`);
  }

  static async update(project: Project): Promise<Project> {
    const res = await api.put<Project>(`projects/${project.id}/`, project);
    return res.data;
  }
}
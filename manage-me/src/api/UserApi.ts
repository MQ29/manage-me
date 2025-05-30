import type { User } from "../types/User";
import api from "./api";

export class UserApi {
  static async getAll(): Promise<User[]> {
    const res = await api.get<User[]>("/users/");
    return res.data;
  }
  static async getById(id: string): Promise<User | undefined> {
    const users = await this.getAll();
    return users.find(u => u.id === id);
  }
  static async getCurrentUser(): Promise<User> {
    const res = await api.get<User>("/me/");
    return res.data;
  }
}
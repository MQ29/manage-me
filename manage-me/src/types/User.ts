export type UserRole = "admin" | "devops" | "developer";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: "admin" | "developer" | "devops" | "guest";
}

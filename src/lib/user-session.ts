import { AppUserRole, getCurrentUser } from "./auth";

export type UserSession = {
  userId: number;
  userName: string;
  role: AppUserRole;
};

export async function getCurrentUserSession(): Promise<UserSession | null> {
  return getCurrentUser();
}

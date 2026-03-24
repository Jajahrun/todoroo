import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export type AppUserRole = "admin" | "user";

export type AppUserSession = {
  userId: number;
  userName: string;
  role: AppUserRole;
};

function normalizeRole(value: string | undefined): AppUserRole | null {
  if (value === "admin" || value === "user") return value;
  return null;
}

export async function getCurrentUser(): Promise<AppUserSession | null> {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get("todoro_user_id")?.value;
  const rawUserName = cookieStore.get("todoro_user_name")?.value;
  const rawRole = cookieStore.get("todoro_user_role")?.value;

  if (!rawUserId) return null;

  const userId = Number(rawUserId);
  if (!Number.isFinite(userId) || userId <= 0) return null;

  const role = normalizeRole(rawRole);
  if (!role) return null;

  return {
    userId,
    userName: rawUserName ? decodeURIComponent(rawUserName) : "User",
    role,
  };
}

export function getCurrentUserFromRequest(request: NextRequest): AppUserSession | null {
  const rawUserId = request.cookies.get("todoro_user_id")?.value;
  const rawUserName = request.cookies.get("todoro_user_name")?.value;
  const rawRole = request.cookies.get("todoro_user_role")?.value;

  if (!rawUserId) return null;

  const userId = Number(rawUserId);
  if (!Number.isFinite(userId) || userId <= 0) return null;

  const role = normalizeRole(rawRole);
  if (!role) return null;

  return {
    userId,
    userName: rawUserName ? decodeURIComponent(rawUserName) : "User",
    role,
  };
}

export async function requireAdminAuth(): Promise<AppUserSession> {
  const session = await getCurrentUser();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/user/dashboard");
  return session;
}

export async function requireUserAuth(): Promise<AppUserSession> {
  const session = await getCurrentUser();
  if (!session) redirect("/login");
  if (session.role !== "user") redirect("/admin/dashboard");
  return session;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("todoro_user_id");
  cookieStore.delete("todoro_user_name");
  cookieStore.delete("todoro_user_role");
}

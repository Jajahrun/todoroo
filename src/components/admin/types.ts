export type AdminUserRole = "admin" | "user";

export type AdminUserRecord = {
  id: number;
  name: string;
  uniqueCode: string;
  role: AdminUserRole;
  isActive: boolean;
  createdAtLabel: string;
};

export type DashboardUserActivity = {
  userId: number;
  name: string;
  status: "Active Today" | "Low Activity" | "Inactive";
  totalTaskToday: number;
  taskCompletedToday: number;
  focusSessionsToday: number;
  focusMinutesToday: number;
  currentStreak: number;
};

export type AdminActivityItem = {
  userId: number;
  name: string;
  dateLabel: string;
  completedTasks: number;
  focusSessions: number;
  focusMinutes: number;
  currentStreak: number;
};

import { DailyActivity, UserTask } from "./types";

export const mockTasks: UserTask[] = [
  {
    id: 1,
    title: "Review outline presentasi mingguan",
    priority: "high",
    isHabits: "no",
    deadline: "Hari ini, 10:30",
    deadlineIso: null,
    isCompleted: true,
  },
  {
    id: 2,
    title: "Selesaikan draft landing copy untuk campaign",
    priority: "high",
    isHabits: "no",
    deadline: "Hari ini, 13:00",
    deadlineIso: null,
    isCompleted: false,
  },
  {
    id: 3,
    title: "Update backlog task untuk sprint berikutnya",
    priority: "medium",
    isHabits: "no",
    deadline: "Hari ini, 15:00",
    deadlineIso: null,
    isCompleted: true,
  },
  {
    id: 4,
    title: "Riset referensi visual untuk onboarding",
    priority: "medium",
    isHabits: "no",
    deadline: "Hari ini, 17:00",
    deadlineIso: null,
    isCompleted: false,
  },
  {
    id: 5,
    title: "Follow up revisi konten media sosial",
    priority: "low",
    isHabits: "no",
    deadline: "Besok, 09:00",
    deadlineIso: null,
    isCompleted: false,
  },
];

export const mockStats = {
  totalTasksToday: 5,
  completedTasks: 2,
  focusSessions: 3,
  focusMinutes: 75,
  currentStreak: 5,
  longestStreak: 12,
};

export const mockActivity: DailyActivity[] = [
  { date: "Senin, 15 Mar", completedTasks: 3, focusSessions: 3, focusMinutes: 70 },
  { date: "Selasa, 16 Mar", completedTasks: 4, focusSessions: 2, focusMinutes: 60 },
  { date: "Rabu, 17 Mar", completedTasks: 2, focusSessions: 3, focusMinutes: 75 },
  { date: "Kamis, 18 Mar", completedTasks: 5, focusSessions: 4, focusMinutes: 95 },
  { date: "Jumat, 19 Mar", completedTasks: 3, focusSessions: 2, focusMinutes: 50 },
];

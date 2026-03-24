export type TaskPriority = "high" | "medium" | "low";
export type HabitFlag = "yes" | "no";

export type UserTask = {
  id: number;
  title: string;
  priority: TaskPriority;
  isHabits: HabitFlag;
  deadline: string;
  deadlineIso: string | null;
  isCompleted: boolean;
};

export type DailyActivity = {
  date: string;
  completedTasks: number;
  focusSessions: number;
  focusMinutes: number;
};

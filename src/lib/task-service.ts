import { prisma } from "./prisma";
import { HabitFlag, TaskPriority, UserTask } from "../components/user/types";

type TaskRow = {
  id: bigint | number;
  title: string;
  priority: string;
  is_habits: string;
  deadline: Date | string | null;
  is_completed: number | boolean;
  completed_at?: Date | string | null;
  created_at?: Date | string | null;
};

type TaskSummaryRow = {
  totalTasksToday: bigint | number;
  completedTasksToday: bigint | number;
};

function getJakartaTodayDateString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatDeadline(deadline: Date | string | null) {
  if (!deadline) return "Tanpa deadline";

  const dateValue = deadline instanceof Date ? deadline : new Date(deadline);
  if (Number.isNaN(dateValue.getTime())) return "Tanpa deadline";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateValue);
}

function formatDateTimeLocal(deadline: Date | string | null) {
  if (!deadline) return null;

  const dateValue = deadline instanceof Date ? deadline : new Date(deadline);
  if (Number.isNaN(dateValue.getTime())) return null;

  const year = dateValue.getFullYear();
  const month = `${dateValue.getMonth() + 1}`.padStart(2, "0");
  const day = `${dateValue.getDate()}`.padStart(2, "0");
  const hour = `${dateValue.getHours()}`.padStart(2, "0");
  const minute = `${dateValue.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function normalizePriority(priority: string): TaskPriority {
  if (priority === "high" || priority === "low" || priority === "medium") {
    return priority;
  }
  return "medium";
}

function normalizeIsHabits(value: string): HabitFlag {
  return value === "yes" ? "yes" : "no";
}

function getDateKeyInJakarta(value: Date | string | null | undefined) {
  if (!value) return null;

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}

function isTaskCompletedForToday(row: TaskRow, todayDate: string) {
  const isCompleted = row.is_completed === 1 || row.is_completed === true;
  if (!isCompleted) return false;

  const isHabits = normalizeIsHabits(row.is_habits) === "yes";
  if (!isHabits) return true;

  return getDateKeyInJakarta(row.completed_at) === todayDate;
}

function mapTaskRow(row: TaskRow, todayDate: string): UserTask {
  return {
    id: typeof row.id === "bigint" ? Number(row.id) : row.id,
    title: row.title,
    priority: normalizePriority(row.priority),
    isHabits: normalizeIsHabits(row.is_habits),
    deadline: formatDeadline(row.deadline),
    deadlineIso: formatDateTimeLocal(row.deadline),
    isCompleted: isTaskCompletedForToday(row, todayDate),
  };
}

export async function getTodayTaskSummaryByUserId(userId: number) {
  const todayDate = getJakartaTodayDateString();

  const rows = await prisma.$queryRaw<TaskSummaryRow[]>`
    SELECT
      COUNT(*) AS totalTasksToday,
      SUM(
        CASE
          WHEN is_habits = 'yes'
            AND completed_at IS NOT NULL
            AND DATE(completed_at) = ${todayDate}
          THEN 1
          WHEN is_habits = 'no' AND is_completed = 1
          THEN 1
          ELSE 0
        END
      ) AS completedTasksToday
    FROM tasks
    WHERE user_id = ${userId}
      AND (
        is_habits = 'yes'
        OR (
          is_habits = 'no'
          AND (deadline IS NULL OR DATE(deadline) >= ${todayDate})
          AND (DATE(deadline) = ${todayDate} OR DATE(created_at) = ${todayDate})
        )
      )
  `;

  const row = rows[0];
  const totalTasksToday = row ? Number(row.totalTasksToday ?? 0) : 0;
  const completedTasksToday = row ? Number(row.completedTasksToday ?? 0) : 0;

  return {
    totalTasksToday,
    completedTasksToday,
  };
}

export async function getTodayTasksPreviewByUserId(
  userId: number,
  taskType: "task" | "habits" = "task",
  limit = 5
) {
  const todayDate = getJakartaTodayDateString();

  if (taskType === "habits") {
    const habitRows = await prisma.$queryRaw<TaskRow[]>`
      SELECT id, title, priority, is_habits, deadline, is_completed, completed_at, created_at
      FROM tasks
      WHERE user_id = ${userId}
        AND is_habits = 'yes'
      ORDER BY updated_at DESC
      LIMIT ${limit}
    `;
    return habitRows.map((row) => mapTaskRow(row, todayDate));
  }

  const todayRows = await prisma.$queryRaw<TaskRow[]>`
    SELECT id, title, priority, is_habits, deadline, is_completed, completed_at, created_at
    FROM tasks
    WHERE user_id = ${userId}
      AND is_habits = 'no'
      AND (deadline IS NULL OR DATE(deadline) >= ${todayDate})
      AND (DATE(deadline) = ${todayDate} OR DATE(created_at) = ${todayDate})
    ORDER BY COALESCE(deadline, created_at) ASC
    LIMIT ${limit}
  `;

  if (todayRows.length > 0) return todayRows.map((row) => mapTaskRow(row, todayDate));

  const fallbackRows = await prisma.$queryRaw<TaskRow[]>`
    SELECT id, title, priority, is_habits, deadline, is_completed, completed_at, created_at
    FROM tasks
    WHERE user_id = ${userId}
      AND is_habits = 'no'
      AND (deadline IS NULL OR DATE(deadline) >= ${todayDate})
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return fallbackRows.map((row) => mapTaskRow(row, todayDate));
}

export async function getTasksByUserId(
  userId: number,
  taskType: "task" | "habits" = "task"
) {
  const todayDate = getJakartaTodayDateString();
  const habitsFlag = taskType === "habits" ? "yes" : "no";
  const rows = await prisma.$queryRaw<TaskRow[]>`
    SELECT id, title, priority, is_habits, deadline, is_completed, completed_at, created_at
    FROM tasks
    WHERE user_id = ${userId} AND is_habits = ${habitsFlag}
    ORDER BY is_completed ASC, COALESCE(deadline, created_at) ASC
  `;

  return rows
    .map((row) => mapTaskRow(row, todayDate))
    .sort((left, right) => Number(left.isCompleted) - Number(right.isCompleted));
}

export async function createTaskForUser(input: {
  userId: number;
  title: string;
  priority: TaskPriority;
  isHabits: HabitFlag;
  deadline: Date | null;
}) {
  await prisma.$executeRaw`
    INSERT INTO tasks (user_id, title, priority, is_habits, deadline, is_completed, created_at, updated_at)
    VALUES (${input.userId}, ${input.title}, ${input.priority}, ${input.isHabits}, ${input.deadline}, 0, NOW(), NOW())
  `;
}

export async function toggleTaskCompletionForUser(input: {
  userId: number;
  taskId: number;
  isCompleted: boolean;
}) {
  const todayDate = getJakartaTodayDateString();

  await prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<TaskRow[]>`
      SELECT id, is_habits, is_completed, completed_at
      FROM tasks
      WHERE id = ${input.taskId} AND user_id = ${input.userId}
      LIMIT 1
    `;

    const task = rows[0];
    if (!task) {
      throw new Error("Task tidak ditemukan.");
    }

    const wasCompletedToday = isTaskCompletedForToday(task, todayDate);
    const completionDelta = Number(input.isCompleted) - Number(wasCompletedToday);

    await tx.$executeRaw`
      UPDATE tasks
      SET
        is_completed = ${input.isCompleted ? 1 : 0},
        completed_at = ${input.isCompleted ? new Date() : null},
        updated_at = NOW()
      WHERE id = ${input.taskId} AND user_id = ${input.userId}
    `;

    if (completionDelta !== 0) {
      await tx.$executeRaw`
        INSERT INTO daily_stats (user_id, stat_date, total_tasks_completed, created_at, updated_at)
        VALUES (${input.userId}, ${todayDate}, ${Math.max(completionDelta, 0)}, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
          total_tasks_completed = GREATEST(total_tasks_completed + ${completionDelta}, 0),
          updated_at = NOW()
      `;
    }
  });
}

export async function updateTaskForUser(input: {
  userId: number;
  taskId: number;
  title: string;
  priority: TaskPriority;
  isHabits: HabitFlag;
  deadline: Date | null;
}) {
  await prisma.$executeRaw`
    UPDATE tasks
    SET
      title = ${input.title},
      priority = ${input.priority},
      is_habits = ${input.isHabits},
      deadline = ${input.deadline},
      updated_at = NOW()
    WHERE id = ${input.taskId} AND user_id = ${input.userId}
  `;
}

export async function deleteTaskForUser(input: { userId: number; taskId: number }) {
  await prisma.$executeRaw`
    DELETE FROM tasks
    WHERE id = ${input.taskId} AND user_id = ${input.userId}
  `;
}

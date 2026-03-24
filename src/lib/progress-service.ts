import { prisma } from "./prisma";

type WeeklySummaryRow = {
  tasksCompletedWeek: bigint | number | null;
  focusSessionsWeek: bigint | number | null;
  focusMinutesWeek: bigint | number | null;
  totalRows: bigint | number | null;
};

type DailyStatRow = {
  stat_date: Date | string;
  total_tasks_completed: bigint | number;
  total_sessions: bigint | number;
  total_focus_minutes: bigint | number;
};

type StreakRow = {
  current_streak: bigint | number | null;
  longest_streak: bigint | number | null;
};

type TaskAggRow = {
  stat_date: Date | string;
  completed_tasks: bigint | number;
};

type SessionAggRow = {
  stat_date: Date | string;
  total_sessions: bigint | number;
  total_focus_minutes: bigint | number;
};

export type ProgressSummary = {
  tasksCompletedWeek: number;
  focusSessionsWeek: number;
  focusMinutesWeek: number;
  currentStreak: number;
  longestStreak: number;
};

export type ProgressActivityItem = {
  dateLabel: string;
  completedTasks: number;
  focusSessions: number;
  focusMinutes: number;
};

function getJakartaDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getLast7DaysDateRange() {
  const end = new Date(`${getJakartaDateString()}T00:00:00+07:00`);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  return {
    startDate: getJakartaDateString(start),
    endDate: getJakartaDateString(end),
  };
}

function toNumber(value: bigint | number | null | undefined) {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  return 0;
}

function normalizeDate(value: Date | string) {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return new Date();
  return parsed;
}

function formatActivityDate(value: Date | string) {
  const date = normalizeDate(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export async function getProgressSummaryByUserId(userId: number): Promise<ProgressSummary> {
  const { startDate, endDate } = getLast7DaysDateRange();

  const summaryRows = await prisma.$queryRaw<WeeklySummaryRow[]>`
    SELECT
      COALESCE(SUM(total_tasks_completed), 0) AS tasksCompletedWeek,
      COALESCE(SUM(total_sessions), 0) AS focusSessionsWeek,
      COALESCE(SUM(total_focus_minutes), 0) AS focusMinutesWeek,
      COUNT(*) AS totalRows
    FROM daily_stats
    WHERE user_id = ${userId}
      AND stat_date BETWEEN ${startDate} AND ${endDate}
  `;

  const summary = summaryRows[0];
  let tasksCompletedWeek = toNumber(summary?.tasksCompletedWeek);
  let focusSessionsWeek = toNumber(summary?.focusSessionsWeek);
  let focusMinutesWeek = toNumber(summary?.focusMinutesWeek);
  const statsRowCount = toNumber(summary?.totalRows);

  // Fallback when daily_stats is still empty.
  if (statsRowCount === 0) {
    const taskAggRows = await prisma.$queryRaw<TaskAggRow[]>`
      SELECT DATE(completed_at) AS stat_date, COUNT(*) AS completed_tasks
      FROM tasks
      WHERE user_id = ${userId}
        AND is_completed = 1
        AND completed_at IS NOT NULL
        AND DATE(completed_at) BETWEEN ${startDate} AND ${endDate}
      GROUP BY DATE(completed_at)
    `;

    tasksCompletedWeek = taskAggRows.reduce((sum, row) => sum + toNumber(row.completed_tasks), 0);

    try {
      const sessionAggRows = await prisma.$queryRaw<SessionAggRow[]>`
        SELECT
          DATE(COALESCE(ended_at, started_at, created_at)) AS stat_date,
          COUNT(*) AS total_sessions,
          COALESCE(SUM(duration_minutes), 0) AS total_focus_minutes
        FROM focus_sessions
        WHERE user_id = ${userId}
          AND status = 'completed'
          AND DATE(COALESCE(ended_at, started_at, created_at)) BETWEEN ${startDate} AND ${endDate}
        GROUP BY DATE(COALESCE(ended_at, started_at, created_at))
      `;

      focusSessionsWeek = sessionAggRows.reduce((sum, row) => sum + toNumber(row.total_sessions), 0);
      focusMinutesWeek = sessionAggRows.reduce(
        (sum, row) => sum + toNumber(row.total_focus_minutes),
        0
      );
    } catch {
      focusSessionsWeek = 0;
      focusMinutesWeek = 0;
    }
  }

  const streakRows = await prisma.$queryRaw<StreakRow[]>`
    SELECT current_streak, longest_streak
    FROM streaks
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  const streak = streakRows[0];

  return {
    tasksCompletedWeek,
    focusSessionsWeek,
    focusMinutesWeek,
    currentStreak: toNumber(streak?.current_streak),
    longestStreak: toNumber(streak?.longest_streak),
  };
}

export async function getProgressActivityByUserId(
  userId: number,
  limit = 7
): Promise<ProgressActivityItem[]> {
  const dailyRows = await prisma.$queryRaw<DailyStatRow[]>`
    SELECT stat_date, total_tasks_completed, total_sessions, total_focus_minutes
    FROM daily_stats
    WHERE user_id = ${userId}
    ORDER BY stat_date DESC
    LIMIT ${limit}
  `;

  if (dailyRows.length > 0) {
    return dailyRows.map((row) => ({
      dateLabel: formatActivityDate(row.stat_date),
      completedTasks: toNumber(row.total_tasks_completed),
      focusSessions: toNumber(row.total_sessions),
      focusMinutes: toNumber(row.total_focus_minutes),
    }));
  }

  const { startDate, endDate } = getLast7DaysDateRange();

  const taskAggRows = await prisma.$queryRaw<TaskAggRow[]>`
    SELECT DATE(completed_at) AS stat_date, COUNT(*) AS completed_tasks
    FROM tasks
    WHERE user_id = ${userId}
      AND is_completed = 1
      AND completed_at IS NOT NULL
      AND DATE(completed_at) BETWEEN ${startDate} AND ${endDate}
    GROUP BY DATE(completed_at)
  `;

  let sessionAggRows: SessionAggRow[] = [];
  try {
    sessionAggRows = await prisma.$queryRaw<SessionAggRow[]>`
      SELECT
        DATE(COALESCE(ended_at, started_at, created_at)) AS stat_date,
        COUNT(*) AS total_sessions,
        COALESCE(SUM(duration_minutes), 0) AS total_focus_minutes
      FROM focus_sessions
      WHERE user_id = ${userId}
        AND status = 'completed'
        AND DATE(COALESCE(ended_at, started_at, created_at)) BETWEEN ${startDate} AND ${endDate}
      GROUP BY DATE(COALESCE(ended_at, started_at, created_at))
    `;
  } catch {
    sessionAggRows = [];
  }

  const activityMap = new Map<
    string,
    { completedTasks: number; focusSessions: number; focusMinutes: number }
  >();

  for (const row of taskAggRows) {
    const key = getJakartaDateString(normalizeDate(row.stat_date));
    const prev = activityMap.get(key) ?? { completedTasks: 0, focusSessions: 0, focusMinutes: 0 };
    activityMap.set(key, {
      ...prev,
      completedTasks: toNumber(row.completed_tasks),
    });
  }

  for (const row of sessionAggRows) {
    const key = getJakartaDateString(normalizeDate(row.stat_date));
    const prev = activityMap.get(key) ?? { completedTasks: 0, focusSessions: 0, focusMinutes: 0 };
    activityMap.set(key, {
      ...prev,
      focusSessions: toNumber(row.total_sessions),
      focusMinutes: toNumber(row.total_focus_minutes),
    });
  }

  return Array.from(activityMap.entries())
    .sort(([dateA], [dateB]) => (dateA < dateB ? 1 : -1))
    .slice(0, limit)
    .map(([date, value]) => ({
      dateLabel: formatActivityDate(date),
      completedTasks: value.completedTasks,
      focusSessions: value.focusSessions,
      focusMinutes: value.focusMinutes,
    }));
}

import { prisma } from "./prisma";
import { AdminActivityItem, AdminUserRecord, DashboardUserActivity } from "../components/admin/types";

type CountRow = { total: bigint | number };

type SummaryRow = {
  totalTaskSelesai: bigint | number | null;
  totalSesiFokus: bigint | number | null;
  totalWaktuFokus: bigint | number | null;
};

type ActiveTodayRow = { totalActiveToday: bigint | number };

type UserDashboardRow = {
  id: bigint | number;
  name: string | null;
  is_active: number | boolean;
  total_tasks: bigint | number | null;
  total_tasks_completed: bigint | number | null;
  total_sessions: bigint | number | null;
  total_focus_minutes: bigint | number | null;
  current_streak: bigint | number | null;
};

type WeeklyUserRow = {
  user_id: bigint | number;
  weekly_activity: bigint | number | null;
};

type UserRow = {
  id: bigint | number;
  name: string | null;
  unique_code: string;
  role: string;
  is_active: number | boolean;
  created_at: Date | string | null;
};

type ActivityRow = {
  user_id: bigint | number;
  name: string | null;
  stat_date: Date | string;
  total_tasks_completed: bigint | number | null;
  total_sessions: bigint | number | null;
  total_focus_minutes: bigint | number | null;
  current_streak: bigint | number | null;
};

function toNumber(value: bigint | number | null | undefined) {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  return 0;
}

function getJakartaDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getPeriodRange(period: "today" | "week" | "month") {
  const end = new Date(`${getJakartaDateString()}T00:00:00+07:00`);
  const start = new Date(end);

  if (period === "week") start.setDate(start.getDate() - 6);
  if (period === "month") start.setDate(start.getDate() - 29);

  return {
    startDate: getJakartaDateString(start),
    endDate: getJakartaDateString(end),
  };
}

function formatCreatedAt(value: Date | string | null) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatActivityDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export async function getAdminDashboardData() {
  const todayDate = getJakartaDateString();
  const { startDate: weekStart, endDate: weekEnd } = getPeriodRange("week");

  const [totalUsersRows, activeTodayRows, summaryRows, dashboardRows, weeklyRows] =
    await Promise.all([
      prisma.$queryRaw<CountRow[]>`
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'user'
      `,
      prisma.$queryRaw<ActiveTodayRow[]>`
        SELECT COUNT(DISTINCT user_id) AS totalActiveToday
        FROM daily_stats ds
        INNER JOIN users u ON u.id = ds.user_id
        WHERE ds.stat_date = ${todayDate}
          AND u.role = 'user'
          AND (
            ds.total_tasks_completed > 0
            OR ds.total_sessions > 0
            OR ds.total_focus_minutes > 0
          )
      `,
      prisma.$queryRaw<SummaryRow[]>`
        SELECT
          COALESCE(SUM(ds.total_tasks_completed), 0) AS totalTaskSelesai,
          COALESCE(SUM(ds.total_sessions), 0) AS totalSesiFokus,
          COALESCE(SUM(ds.total_focus_minutes), 0) AS totalWaktuFokus
        FROM daily_stats ds
        INNER JOIN users u ON u.id = ds.user_id
        WHERE ds.stat_date = ${todayDate}
          AND u.role = 'user'
      `,
      prisma.$queryRaw<UserDashboardRow[]>`
        SELECT
          u.id,
          u.name,
          u.is_active,
          COALESCE(ds.total_tasks, 0) AS total_tasks,
          COALESCE(ds.total_tasks_completed, 0) AS total_tasks_completed,
          COALESCE(ds.total_sessions, 0) AS total_sessions,
          COALESCE(ds.total_focus_minutes, 0) AS total_focus_minutes,
          COALESCE(st.current_streak, 0) AS current_streak
        FROM users u
        LEFT JOIN daily_stats ds
          ON ds.user_id = u.id
          AND ds.stat_date = ${todayDate}
        LEFT JOIN streaks st
          ON st.user_id = u.id
        WHERE u.role = 'user'
        ORDER BY u.name ASC
      `,
      prisma.$queryRaw<WeeklyUserRow[]>`
        SELECT
          user_id,
          COALESCE(SUM(total_tasks_completed + total_sessions), 0) AS weekly_activity
        FROM daily_stats
        WHERE stat_date BETWEEN ${weekStart} AND ${weekEnd}
        GROUP BY user_id
      `,
    ]);

  const weeklyMap = new Map<number, number>();
  for (const row of weeklyRows) {
    const userId = toNumber(row.user_id);
    weeklyMap.set(userId, toNumber(row.weekly_activity));
  }

  const userActivityRows: DashboardUserActivity[] = dashboardRows.map((row) => {
    const userId = toNumber(row.id);
    const isActive = row.is_active === 1 || row.is_active === true;
    const totalTaskToday = toNumber(row.total_tasks);
    const taskCompletedToday = toNumber(row.total_tasks_completed);
    const focusSessionsToday = toNumber(row.total_sessions);
    const focusMinutesToday = toNumber(row.total_focus_minutes);
    const weeklyActivity = weeklyMap.get(userId) ?? 0;

    const status: DashboardUserActivity["status"] = !isActive
      ? "Inactive"
      : taskCompletedToday > 0 || focusSessionsToday > 0 || focusMinutesToday > 0
      ? "Active Today"
      : weeklyActivity > 0
      ? "Low Activity"
      : "Inactive";

    return {
      userId,
      name: row.name ?? `User #${userId}`,
      status,
      totalTaskToday,
      taskCompletedToday,
      focusSessionsToday,
      focusMinutesToday,
      currentStreak: toNumber(row.current_streak),
    };
  });

  const topPerformers = [...userActivityRows]
    .filter((row) => row.status === "Active Today")
    .sort((a, b) => {
      if (b.taskCompletedToday !== a.taskCompletedToday) {
        return b.taskCompletedToday - a.taskCompletedToday;
      }
      return b.focusMinutesToday - a.focusMinutesToday;
    })
    .slice(0, 5);

  const lowActivityUsers = userActivityRows
    .filter((row) => row.status !== "Active Today")
    .slice(0, 5);

  return {
    summary: {
      totalUsers: toNumber(totalUsersRows[0]?.total),
      activeUsersToday: toNumber(activeTodayRows[0]?.totalActiveToday),
      totalTaskSelesaiToday: toNumber(summaryRows[0]?.totalTaskSelesai),
      totalSesiFokusToday: toNumber(summaryRows[0]?.totalSesiFokus),
      totalWaktuFokusToday: toNumber(summaryRows[0]?.totalWaktuFokus),
    },
    userActivityRows,
    topPerformers,
    lowActivityUsers,
  };
}

export async function getAdminUsers() {
  const rows = await prisma.$queryRaw<UserRow[]>`
    SELECT id, name, unique_code, role, is_active, created_at
    FROM users
    ORDER BY created_at DESC
  `;

  return rows.map<AdminUserRecord>((row) => ({
    id: toNumber(row.id),
    name: row.name ?? "Unnamed",
    uniqueCode: row.unique_code,
    role: row.role === "admin" ? "admin" : "user",
    isActive: row.is_active === 1 || row.is_active === true,
    createdAtLabel: formatCreatedAt(row.created_at),
  }));
}

export async function createAdminUser(input: {
  name: string;
  uniqueCode: string;
  role: "admin" | "user";
  isActive: boolean;
}) {
  await prisma.$executeRaw`
    INSERT INTO users (name, unique_code, role, is_active, created_at, updated_at)
    VALUES (${input.name}, ${input.uniqueCode}, ${input.role}, ${input.isActive ? 1 : 0}, NOW(), NOW())
  `;
}

export async function updateAdminUser(
  userId: number,
  input: {
    name: string;
    uniqueCode: string;
    role: "admin" | "user";
    isActive: boolean;
  }
) {
  await prisma.$executeRaw`
    UPDATE users
    SET
      name = ${input.name},
      unique_code = ${input.uniqueCode},
      role = ${input.role},
      is_active = ${input.isActive ? 1 : 0},
      updated_at = NOW()
    WHERE id = ${userId}
  `;
}

export async function getAdminActivity(period: "today" | "week" | "month") {
  const range =
    period === "today"
      ? { startDate: getJakartaDateString(), endDate: getJakartaDateString() }
      : getPeriodRange(period);

  const rows = await prisma.$queryRaw<ActivityRow[]>`
    SELECT
      u.id AS user_id,
      u.name,
      ds.stat_date,
      COALESCE(ds.total_tasks_completed, 0) AS total_tasks_completed,
      COALESCE(ds.total_sessions, 0) AS total_sessions,
      COALESCE(ds.total_focus_minutes, 0) AS total_focus_minutes,
      COALESCE(st.current_streak, 0) AS current_streak
    FROM daily_stats ds
    INNER JOIN users u
      ON u.id = ds.user_id
    LEFT JOIN streaks st
      ON st.user_id = u.id
    WHERE ds.stat_date BETWEEN ${range.startDate} AND ${range.endDate}
      AND u.role = 'user'
    ORDER BY ds.stat_date DESC, u.name ASC
  `;

  return rows.map<AdminActivityItem>((row) => ({
    userId: toNumber(row.user_id),
    name: row.name ?? `User #${toNumber(row.user_id)}`,
    dateLabel: formatActivityDate(row.stat_date),
    completedTasks: toNumber(row.total_tasks_completed),
    focusSessions: toNumber(row.total_sessions),
    focusMinutes: toNumber(row.total_focus_minutes),
    currentStreak: toNumber(row.current_streak),
  }));
}

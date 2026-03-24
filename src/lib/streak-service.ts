import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

type DbClient = Prisma.TransactionClient | typeof prisma;

type StreakRow = {
  current_streak: bigint | number | null;
  longest_streak: bigint | number | null;
  last_active_date: Date | string | null;
};

type StreakState = {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
};

type DailyCompletionRow = {
  total_tasks_completed: bigint | number | null;
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

function getRelativeJakartaDateString(offsetDays: number) {
  const baseDate = new Date(`${getJakartaDateString()}T00:00:00+07:00`);
  baseDate.setDate(baseDate.getDate() + offsetDays);
  return getJakartaDateString(baseDate);
}

function normalizeDateKey(value: Date | string | null | undefined) {
  if (!value) return null;

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return getJakartaDateString(parsed);
}

async function getRawStreakRow(userId: number, db: DbClient) {
  const rows = await db.$queryRaw<StreakRow[]>`
    SELECT current_streak, longest_streak, last_active_date
    FROM streaks
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

async function upsertStreakRow(
  userId: number,
  values: { currentStreak: number; longestStreak: number; lastActiveDate: string | null },
  db: DbClient
) {
  await db.$executeRaw`
    INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date, created_at, updated_at)
    VALUES (${userId}, ${values.currentStreak}, ${values.longestStreak}, ${values.lastActiveDate}, NOW(), NOW())
    ON DUPLICATE KEY UPDATE
      current_streak = ${values.currentStreak},
      longest_streak = ${values.longestStreak},
      last_active_date = ${values.lastActiveDate},
      updated_at = NOW()
  `;
}

export async function getUserStreakStateByUserId(
  userId: number,
  db: DbClient = prisma
): Promise<StreakState> {
  const todayDate = getJakartaDateString();
  const yesterdayDate = getRelativeJakartaDateString(-1);
  const row = await getRawStreakRow(userId, db);

  if (!row) {
    const initialState = {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: todayDate,
    };

    await upsertStreakRow(userId, initialState, db);

    return {
      currentStreak: initialState.currentStreak,
      longestStreak: initialState.longestStreak,
      isActiveToday: true,
    };
  }

  const storedCurrentStreak = Math.max(toNumber(row.current_streak), 1);
  const storedLongestStreak = Math.max(toNumber(row.longest_streak), 1);
  const lastActiveDate = normalizeDateKey(row.last_active_date);

  if (lastActiveDate === todayDate) {
    return {
      currentStreak: storedCurrentStreak,
      longestStreak: storedLongestStreak,
      isActiveToday: true,
    };
  }

  if (lastActiveDate === yesterdayDate) {
    return {
      currentStreak: storedCurrentStreak,
      longestStreak: storedLongestStreak,
      isActiveToday: false,
    };
  }

  return {
    currentStreak: 1,
    longestStreak: storedLongestStreak,
    isActiveToday: false,
  };
}

export async function syncUserStreakAfterTaskChange(
  userId: number,
  db: DbClient = prisma
) {
  const todayDate = getJakartaDateString();
  const yesterdayDate = getRelativeJakartaDateString(-1);

  let row = await getRawStreakRow(userId, db);
  if (!row) {
    await upsertStreakRow(
      userId,
      {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: todayDate,
      },
      db
    );
    row = await getRawStreakRow(userId, db);
  }

  const todayStatsRows = await db.$queryRaw<DailyCompletionRow[]>`
    SELECT total_tasks_completed
    FROM daily_stats
    WHERE user_id = ${userId}
      AND stat_date = ${todayDate}
    LIMIT 1
  `;

  const totalCompletedToday = toNumber(todayStatsRows[0]?.total_tasks_completed);
  const hasActivityToday = totalCompletedToday > 0;

  const storedCurrentStreak = Math.max(toNumber(row?.current_streak), 1);
  const storedLongestStreak = Math.max(toNumber(row?.longest_streak), 1);
  const lastActiveDate = normalizeDateKey(row?.last_active_date);

  if (hasActivityToday) {
    const nextCurrentStreak =
      lastActiveDate === todayDate
        ? storedCurrentStreak
        : lastActiveDate === yesterdayDate
        ? storedCurrentStreak + 1
        : 1;

    await upsertStreakRow(
      userId,
      {
        currentStreak: nextCurrentStreak,
        longestStreak: Math.max(storedLongestStreak, nextCurrentStreak),
        lastActiveDate: todayDate,
      },
      db
    );
    return;
  }

  if (lastActiveDate !== todayDate) {
    return;
  }

  const fallbackCurrentStreak = storedCurrentStreak > 1 ? storedCurrentStreak - 1 : 1;
  const fallbackLastActiveDate = storedCurrentStreak > 1 ? yesterdayDate : null;

  await upsertStreakRow(
    userId,
    {
      currentStreak: fallbackCurrentStreak,
      longestStreak: storedLongestStreak,
      lastActiveDate: fallbackLastActiveDate,
    },
    db
  );
}

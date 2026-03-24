export const DEFAULT_POMODORO_SECONDS = 25 * 60;
export const POMODORO_STORAGE_KEY = "todoro_pomodoro_state";
export const POMODORO_STORAGE_EVENT = "todoro:pomodoro-updated";

export type PomodoroStorageState = {
  durationSeconds: number;
  todayDate: string;
  totalFocusedSecondsToday: number;
  completedSessionsToday: number;
  sessionElapsedSeconds: number;
  syncedSessionSeconds: number;
  currentRunStartedAt: number | null;
  isRunning: boolean;
};

export type ResolvedPomodoroState = PomodoroStorageState & {
  remainingSeconds: number;
  liveSessionElapsedSeconds: number;
  liveTotalFocusedSecondsToday: number;
};

export function getJakartaDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function clampDurationSeconds(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_POMODORO_SECONDS;
  return Math.min(Math.max(Math.round(value), 1), 180 * 60);
}

export function clampPomodoroInputSeconds(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), 59);
}

export function getDefaultPomodoroState(): PomodoroStorageState {
  return {
    durationSeconds: DEFAULT_POMODORO_SECONDS,
    todayDate: getJakartaDateString(),
    totalFocusedSecondsToday: 0,
    completedSessionsToday: 0,
    sessionElapsedSeconds: 0,
    syncedSessionSeconds: 0,
    currentRunStartedAt: null,
    isRunning: false,
  };
}

export function getResolvedPomodoroState(
  rawState?: Partial<PomodoroStorageState>
): ResolvedPomodoroState {
  const todayDate = getJakartaDateString();
  const durationSeconds = clampDurationSeconds(rawState?.durationSeconds ?? DEFAULT_POMODORO_SECONDS);
  const sessionElapsedSeconds = Math.min(
    Math.max(rawState?.sessionElapsedSeconds ?? 0, 0),
    durationSeconds
  );
  const syncedSessionSeconds = Math.min(
    Math.max(rawState?.syncedSessionSeconds ?? 0, 0),
    durationSeconds
  );
  const currentRunStartedAt =
    typeof rawState?.currentRunStartedAt === "number" ? rawState.currentRunStartedAt : null;
  const isRunning = rawState?.isRunning === true && currentRunStartedAt !== null;

  const baseState: ResolvedPomodoroState = {
    durationSeconds,
    todayDate,
    totalFocusedSecondsToday:
      rawState?.todayDate === todayDate ? Math.max(rawState?.totalFocusedSecondsToday ?? 0, 0) : 0,
    completedSessionsToday:
      rawState?.todayDate === todayDate ? Math.max(rawState?.completedSessionsToday ?? 0, 0) : 0,
    sessionElapsedSeconds,
    syncedSessionSeconds,
    currentRunStartedAt,
    isRunning,
    remainingSeconds: durationSeconds - sessionElapsedSeconds,
    liveSessionElapsedSeconds: sessionElapsedSeconds,
    liveTotalFocusedSecondsToday:
      (rawState?.todayDate === todayDate ? Math.max(rawState?.totalFocusedSecondsToday ?? 0, 0) : 0) +
      Math.max(sessionElapsedSeconds - syncedSessionSeconds, 0),
  };

  if (!isRunning || currentRunStartedAt === null) {
    return {
      ...baseState,
      remainingSeconds: Math.max(durationSeconds - sessionElapsedSeconds, 0),
    };
  }

  const runningSeconds = Math.max(Math.floor((Date.now() - currentRunStartedAt) / 1000), 0);
  const liveSessionElapsedSeconds = Math.min(sessionElapsedSeconds + runningSeconds, durationSeconds);
  const liveTotalFocusedSecondsToday =
    baseState.totalFocusedSecondsToday + Math.max(liveSessionElapsedSeconds - syncedSessionSeconds, 0);
  const remainingSeconds = Math.max(durationSeconds - liveSessionElapsedSeconds, 0);

  if (remainingSeconds === 0) {
    const shouldIncreaseCompletedSessions = syncedSessionSeconds < durationSeconds ? 1 : 0;

    return {
      ...baseState,
      isRunning: false,
      currentRunStartedAt: null,
      completedSessionsToday: baseState.completedSessionsToday + shouldIncreaseCompletedSessions,
      totalFocusedSecondsToday: liveTotalFocusedSecondsToday,
      liveTotalFocusedSecondsToday,
      liveSessionElapsedSeconds: durationSeconds,
      sessionElapsedSeconds: durationSeconds,
      syncedSessionSeconds: durationSeconds,
      remainingSeconds: 0,
    };
  }

  return {
    ...baseState,
    liveSessionElapsedSeconds,
    liveTotalFocusedSecondsToday,
    remainingSeconds,
  };
}

export function readStoredPomodoroState() {
  if (typeof window === "undefined") return getResolvedPomodoroState();

  try {
    const rawValue = window.localStorage.getItem(POMODORO_STORAGE_KEY);
    if (!rawValue) return getResolvedPomodoroState();
    return getResolvedPomodoroState(JSON.parse(rawValue) as Partial<PomodoroStorageState>);
  } catch {
    return getResolvedPomodoroState();
  }
}

export function persistPomodoroState(state: PomodoroStorageState | ResolvedPomodoroState) {
  if (typeof window === "undefined") return;

  const resolved = getResolvedPomodoroState(state);
  const normalizedState: PomodoroStorageState = {
    durationSeconds: resolved.durationSeconds,
    todayDate: resolved.todayDate,
    totalFocusedSecondsToday: resolved.totalFocusedSecondsToday,
    completedSessionsToday: resolved.completedSessionsToday,
    sessionElapsedSeconds: resolved.sessionElapsedSeconds,
    syncedSessionSeconds: resolved.syncedSessionSeconds,
    currentRunStartedAt: resolved.currentRunStartedAt,
    isRunning: resolved.isRunning,
  };

  window.localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(normalizedState));
  window.dispatchEvent(new CustomEvent(POMODORO_STORAGE_EVENT));
}

export function formatPomodoroClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

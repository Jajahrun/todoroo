"use client";

import { useEffect, useMemo, useState } from "react";
import { PencilLine, Pause, Play, RotateCcw, Timer } from "lucide-react";
import {
  clampDurationSeconds,
  clampPomodoroInputSeconds,
  formatPomodoroClock,
  getDefaultPomodoroState,
  getResolvedPomodoroState,
  persistPomodoroState,
  readStoredPomodoroState,
  type ResolvedPomodoroState,
} from "../../lib/pomodoro-storage";

export function PomodoroWidget() {
  const [pomodoroState, setPomodoroState] = useState<ResolvedPomodoroState>(() =>
    getResolvedPomodoroState(getDefaultPomodoroState())
  );
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [durationMinutesInput, setDurationMinutesInput] = useState("25");
  const [durationSecondsInput, setDurationSecondsInput] = useState("00");

  useEffect(() => {
    const storedState = readStoredPomodoroState();
    setPomodoroState(storedState);
    setDurationMinutesInput(String(Math.floor(storedState.durationSeconds / 60)));
    setDurationSecondsInput(String(storedState.durationSeconds % 60).padStart(2, "0"));
  }, []);

  useEffect(() => {
    if (!pomodoroState.isRunning) return;

    const interval = window.setInterval(() => {
      const resolvedState = readStoredPomodoroState();
      setPomodoroState(resolvedState);
      persistPomodoroState(resolvedState);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [pomodoroState.isRunning]);

  const timerLabel = useMemo(
    () => formatPomodoroClock(pomodoroState.remainingSeconds),
    [pomodoroState.remainingSeconds]
  );

  const saveState = (nextState: ResolvedPomodoroState) => {
    setPomodoroState(nextState);
    persistPomodoroState(nextState);
  };

  const handleToggleRunning = () => {
    if (pomodoroState.isRunning) {
      saveState(
        getResolvedPomodoroState({
          ...pomodoroState,
          isRunning: false,
          currentRunStartedAt: null,
          totalFocusedSecondsToday: pomodoroState.liveTotalFocusedSecondsToday,
          sessionElapsedSeconds: pomodoroState.liveSessionElapsedSeconds,
          syncedSessionSeconds: pomodoroState.liveSessionElapsedSeconds,
        })
      );
      return;
    }

    const shouldRestartSession = pomodoroState.remainingSeconds === 0;
    saveState(
      getResolvedPomodoroState({
        ...pomodoroState,
        isRunning: true,
        currentRunStartedAt: Date.now(),
        sessionElapsedSeconds: shouldRestartSession ? 0 : pomodoroState.sessionElapsedSeconds,
        syncedSessionSeconds: shouldRestartSession ? 0 : pomodoroState.syncedSessionSeconds,
      })
    );
  };

  const handleReset = () => {
    saveState(
      getResolvedPomodoroState({
        ...pomodoroState,
        isRunning: false,
        currentRunStartedAt: null,
        totalFocusedSecondsToday: pomodoroState.liveTotalFocusedSecondsToday,
        completedSessionsToday: pomodoroState.completedSessionsToday,
        sessionElapsedSeconds: 0,
        syncedSessionSeconds: 0,
      })
    );
  };

  const handleSaveDuration = () => {
    const minutes = Number(durationMinutesInput);
    const seconds = clampPomodoroInputSeconds(Number(durationSecondsInput));
    if (!Number.isFinite(minutes)) return;

    const nextDurationSeconds = clampDurationSeconds(Math.max(minutes, 0) * 60 + seconds);
    const nextState = getResolvedPomodoroState({
      ...pomodoroState,
      durationSeconds: nextDurationSeconds,
      totalFocusedSecondsToday: pomodoroState.liveTotalFocusedSecondsToday,
      isRunning: false,
      currentRunStartedAt: null,
      sessionElapsedSeconds: 0,
      syncedSessionSeconds: 0,
    });

    saveState(nextState);
    setDurationMinutesInput(String(Math.floor(nextDurationSeconds / 60)));
    setDurationSecondsInput(String(nextDurationSeconds % 60).padStart(2, "0"));
    setIsEditingDuration(false);
  };

  return (
    <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-md shadow-emerald-900/10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">Pomodoro</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditingDuration((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
          >
            <PencilLine className="h-3.5 w-3.5" />
            Edit Waktu
          </button>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <Timer className="h-3.5 w-3.5" />
            Focus Mode
          </span>
        </div>
      </div>

      {isEditingDuration ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Durasi Pomodoro
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              type="number"
              min={0}
              max={180}
              value={durationMinutesInput}
              onChange={(event) => setDurationMinutesInput(event.target.value)}
              className="w-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400"
            />
            <span className="text-sm text-slate-500">menit</span>
            <input
              type="number"
              min={0}
              max={59}
              value={durationSecondsInput}
              onChange={(event) =>
                setDurationSecondsInput(String(clampPomodoroInputSeconds(Number(event.target.value))))
              }
              className="w-20 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400"
            />
            <span className="text-sm text-slate-500">detik</span>
            <button
              type="button"
              onClick={handleSaveDuration}
              className="ml-auto rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Simpan
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Input detik dibatasi maksimal 59. Mengubah durasi akan mereset sesi yang sedang berjalan.
          </p>
        </div>
      ) : null}

      <p className="mt-6 text-center text-5xl font-semibold tracking-tight text-slate-800">
        {timerLabel}
      </p>
      <p className="mt-2 text-center text-sm text-slate-500">
        Durasi aktif: {formatPomodoroClock(pomodoroState.durationSeconds)}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleToggleRunning}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {pomodoroState.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {pomodoroState.isRunning ? "Pause" : "Mulai"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </section>
  );
}

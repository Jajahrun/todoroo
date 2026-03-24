"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";

const INITIAL_SECONDS = 25 * 60;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function PomodoroWidget() {
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const timerLabel = useMemo(() => formatTime(secondsLeft), [secondsLeft]);

  const handleToggleRunning = () => setIsRunning((prev) => !prev);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(INITIAL_SECONDS);
  };

  return (
    <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-md shadow-emerald-900/10">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">Pomodoro</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <Timer className="h-3.5 w-3.5" />
          Focus Mode
        </span>
      </div>

      <p className="mt-6 text-center text-5xl font-semibold tracking-tight text-slate-800">
        {timerLabel}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleToggleRunning}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Pause" : "Mulai"}
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

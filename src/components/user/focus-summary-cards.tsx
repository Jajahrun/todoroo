"use client";

import { useEffect, useState } from "react";
import { Clock3, Timer } from "lucide-react";
import { SummaryCard } from "./summary-card";
import {
  formatPomodoroClock,
  POMODORO_STORAGE_EVENT,
  readStoredPomodoroState,
  type ResolvedPomodoroState,
} from "../../lib/pomodoro-storage";

type FocusSummaryCardsProps = {
  initialSessions?: number;
  initialFocusedSeconds?: number;
};

function getInitialState(initialSessions: number, initialFocusedSeconds: number) {
  return {
    sessions: initialSessions,
    focusedSeconds: initialFocusedSeconds,
  };
}

export function FocusSummaryCards({
  initialSessions = 0,
  initialFocusedSeconds = 0,
}: FocusSummaryCardsProps) {
  const [focusSummary, setFocusSummary] = useState(() =>
    getInitialState(initialSessions, initialFocusedSeconds)
  );

  useEffect(() => {
    const syncFromStorage = () => {
      const state: ResolvedPomodoroState = readStoredPomodoroState();
      setFocusSummary({
        sessions: state.completedSessionsToday,
        focusedSeconds: state.liveTotalFocusedSecondsToday,
      });
    };

    syncFromStorage();

    const handleStorageSync = () => syncFromStorage();
    window.addEventListener(POMODORO_STORAGE_EVENT, handleStorageSync);
    window.addEventListener("storage", handleStorageSync);

    const interval = window.setInterval(syncFromStorage, 1000);

    return () => {
      window.removeEventListener(POMODORO_STORAGE_EVENT, handleStorageSync);
      window.removeEventListener("storage", handleStorageSync);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <SummaryCard
        label="Sesi Fokus"
        value={`${focusSummary.sessions}`}
        hint="Pomodoro selesai hari ini"
        icon={Timer}
      />
      <SummaryCard
        label="Total Waktu Fokus"
        value={formatPomodoroClock(focusSummary.focusedSeconds)}
        hint="Akumulasi pomodoro yang sudah dijalankan"
        icon={Clock3}
      />
    </>
  );
}

import { Flame } from "lucide-react";

type StreakCardProps = {
  currentStreak: number;
  longestStreak?: number;
};

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Streak Konsistensi</p>

      <div className="mt-4 flex items-center gap-3">
        <span className="rounded-full bg-amber-50 p-2 text-amber-500">
          <Flame className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-semibold tracking-tight text-slate-800">
            {currentStreak} hari berturut-turut
          </p>
          <p className="text-sm text-slate-500">
            Kerja bagus. Jaga ritme ini untuk hasil yang lebih konsisten.
          </p>
        </div>
      </div>

      {typeof longestStreak === "number" ? (
        <p className="mt-4 text-xs text-slate-500">Longest streak: {longestStreak} hari</p>
      ) : null}
    </section>
  );
}

import { Flame } from "lucide-react";

type StreakCardProps = {
  currentStreak: number;
  longestStreak?: number;
  isActiveToday?: boolean;
};

export function StreakCard({
  currentStreak,
  longestStreak,
  isActiveToday = false,
}: StreakCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Streak Konsistensi</p>

      <div className="mt-4 flex items-center gap-3">
        <span
          className={`rounded-full p-2 ${
            isActiveToday ? "bg-amber-50 text-amber-500" : "bg-slate-100 text-slate-400"
          }`}
        >
          <Flame className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-semibold tracking-tight text-slate-800">
            {currentStreak} hari berturut-turut
          </p>
          <p className="text-sm text-slate-500">
            {isActiveToday
              ? "Api streak aktif hari ini. Jaga ritme ini untuk hasil yang lebih konsisten."
              : "Api streak belum aktif hari ini. Selesaikan task atau habits untuk menyalakannya."}
          </p>
        </div>
      </div>

      {typeof longestStreak === "number" ? (
        <p className="mt-4 text-xs text-slate-500">Longest streak: {longestStreak} hari</p>
      ) : null}
    </section>
  );
}

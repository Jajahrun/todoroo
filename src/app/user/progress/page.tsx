import { CheckCheck, Clock3, Flame, Timer } from "lucide-react";
import { SummaryCard } from "../../../components/user/summary-card";
import { StreakCard } from "../../../components/user/streak-card";
import { getCurrentUserSession } from "../../../lib/user-session";
import { getProgressActivityByUserId, getProgressSummaryByUserId } from "../../../lib/progress-service";

export default async function UserProgressPage() {
  const session = await getCurrentUserSession();
  const userId = session?.userId ?? 0;

  const [summary, activity] = userId
    ? await Promise.all([getProgressSummaryByUserId(userId), getProgressActivityByUserId(userId, 7)])
    : [
        {
          tasksCompletedWeek: 0,
          focusSessionsWeek: 0,
          focusMinutesWeek: 0,
          currentStreak: 1,
          longestStreak: 1,
          isActiveToday: true,
        },
        [],
      ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Task Selesai Minggu Ini"
          value={`${summary.tasksCompletedWeek}`}
          hint="Meningkat dari minggu lalu"
          icon={CheckCheck}
        />
        <SummaryCard
          label="Sesi Fokus"
          value={`${summary.focusSessionsWeek}`}
          hint="Rata-rata harian"
          icon={Timer}
        />
        <SummaryCard
          label="Total Waktu Fokus"
          value={`${summary.focusMinutesWeek}m`}
          hint="Akumulasi minggu ini"
          icon={Clock3}
        />
        <SummaryCard
          label="Current Streak"
          value={`${summary.currentStreak} hari`}
          hint="Konsisten tiap hari"
          icon={Flame}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Activity Mingguan</h2>
          <p className="mt-1 text-sm text-slate-500">Ringkasan progres harian kamu (MVP tanpa chart).</p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-3 font-semibold">Tanggal</th>
                <th className="px-3 py-3 font-semibold">Task Selesai</th>
                <th className="px-3 py-3 font-semibold">Sesi Fokus</th>
                <th className="px-3 py-3 font-semibold">Menit Fokus</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((item) => (
                <tr key={item.dateLabel} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-3 py-3 text-slate-700">{item.dateLabel}</td>
                  <td className="px-3 py-3 text-slate-700">{item.completedTasks}</td>
                  <td className="px-3 py-3 text-slate-700">{item.focusSessions}</td>
                  <td className="px-3 py-3 text-slate-700">{item.focusMinutes} menit</td>
                </tr>
              ))}

              {activity.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-500">
                    Belum ada data progress harian.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <StreakCard
        currentStreak={summary.currentStreak}
        longestStreak={summary.longestStreak}
        isActiveToday={summary.isActiveToday}
      />
    </div>
  );
}

import Link from "next/link";
import { CheckCheck, Clock3, ListTodo, Plus, Timer, Zap } from "lucide-react";
import { PomodoroWidget } from "../../../components/user/pomodoro-widget";
import { SummaryCard } from "../../../components/user/summary-card";
import { mockStats } from "../../../components/user/mock-data";
import { StreakCard } from "../../../components/user/streak-card";
import { getCurrentUserSession } from "../../../lib/user-session";
import { getTodayTaskSummaryByUserId, getTodayTasksPreviewByUserId } from "../../../lib/task-service";
import { TodayTasksPreview } from "../../../components/user/today-tasks-preview";

export default async function UserDashboardPage() {
  const session = await getCurrentUserSession();
  const userId = session?.userId ?? 0;

  const [todayTaskPreview, habitsPreview, taskSummary] = userId
    ? await Promise.all([
        getTodayTasksPreviewByUserId(userId, "task", 5),
        getTodayTasksPreviewByUserId(userId, "habits", 5),
        getTodayTaskSummaryByUserId(userId),
      ])
    : [[], [], { totalTasksToday: 0, completedTasksToday: 0 }];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Task Hari Ini"
          value={`${taskSummary.totalTasksToday}`}
          hint="Target kerja harian"
          icon={ListTodo}
        />
        <SummaryCard
          label="Task Selesai"
          value={`${taskSummary.completedTasksToday}`}
          hint="Progress hari ini"
          icon={CheckCheck}
        />
        <SummaryCard
          label="Sesi Fokus"
          value={`${mockStats.focusSessions}`}
          hint="Pomodoro aktif"
          icon={Timer}
        />
        <SummaryCard
          label="Total Waktu Fokus"
          value={`${mockStats.focusMinutes}m`}
          hint="Akumulasi hari ini"
          icon={Clock3}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <TodayTasksPreview initialTaskTasks={todayTaskPreview} initialHabitTasks={habitsPreview} />

        <PomodoroWidget />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
        <StreakCard currentStreak={mockStats.currentStreak} />

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
          <p className="mt-1 text-sm text-slate-500">Mulai aksi penting tanpa banyak langkah.</p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/user/tasks"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Task
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
            >
              <Zap className="h-4 w-4" />
              Mulai Fokus
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

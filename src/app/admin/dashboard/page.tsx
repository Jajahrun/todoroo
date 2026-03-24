import { CheckCheck, Clock3, Timer, Users, UserCheck } from "lucide-react";
import { AdminSummaryCard } from "../../../components/admin/summary-card";
import { TopPerformerCard } from "../../../components/admin/top-performer-card";
import { UserStatusBadge } from "../../../components/admin/user-status-badge";
import { AdminEmptyState } from "../../../components/admin/empty-state";
import { getAdminDashboardData } from "../../../lib/admin-service";

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminSummaryCard
          label="Total User"
          value={`${dashboard.summary.totalUsers}`}
          hint="Akun role user"
          icon={Users}
        />
        <AdminSummaryCard
          label="User Aktif Hari Ini"
          value={`${dashboard.summary.activeUsersToday}`}
          hint="Memiliki aktivitas hari ini"
          icon={UserCheck}
        />
        <AdminSummaryCard
          label="Task Selesai Hari Ini"
          value={`${dashboard.summary.totalTaskSelesaiToday}`}
          hint="Akumulasi semua user"
          icon={CheckCheck}
        />
        <AdminSummaryCard
          label="Total Sesi Fokus"
          value={`${dashboard.summary.totalSesiFokusToday}`}
          hint="Pomodoro terselesaikan"
          icon={Timer}
        />
        <AdminSummaryCard
          label="Total Waktu Fokus"
          value={`${dashboard.summary.totalWaktuFokusToday}m`}
          hint="Akumulasi menit fokus"
          icon={Clock3}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr,0.65fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">User Activity</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ringkasan performa produktivitas user hari ini.
              </p>
            </div>
          </div>

          {dashboard.userActivityRows.length === 0 ? (
            <div className="mt-5">
              <AdminEmptyState
                title="Belum ada data user"
                description="Data aktivitas akan tampil setelah user mulai menggunakan aplikasi."
              />
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-semibold">Nama User</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Task Hari Ini</th>
                    <th className="px-3 py-3 font-semibold">Task Selesai</th>
                    <th className="px-3 py-3 font-semibold">Sesi Fokus</th>
                    <th className="px-3 py-3 font-semibold">Waktu Fokus</th>
                    <th className="px-3 py-3 font-semibold">Streak</th>
                    <th className="px-3 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.userActivityRows.map((row) => (
                    <tr key={row.userId} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-3 py-3 text-slate-800">{row.name}</td>
                      <td className="px-3 py-3">
                        <UserStatusBadge status={row.status} />
                      </td>
                      <td className="px-3 py-3 text-slate-700">{row.totalTaskToday}</td>
                      <td className="px-3 py-3 text-slate-700">{row.taskCompletedToday}</td>
                      <td className="px-3 py-3 text-slate-700">{row.focusSessionsToday}</td>
                      <td className="px-3 py-3 text-slate-700">{row.focusMinutesToday} menit</td>
                      <td className="px-3 py-3 text-slate-700">{row.currentStreak} hari</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          Detail
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <div className="space-y-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">Top Performers</h3>
            <p className="mt-1 text-sm text-slate-500">
              User dengan performa terbaik berdasarkan task selesai dan fokus.
            </p>

            {dashboard.topPerformers.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">Belum ada user aktif hari ini.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {dashboard.topPerformers.map((row) => (
                  <TopPerformerCard
                    key={row.userId}
                    name={row.name}
                    tasksCompleted={row.taskCompletedToday}
                    focusMinutes={row.focusMinutesToday}
                  />
                ))}
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">Low Activity Warning</h3>
            <p className="mt-1 text-sm text-slate-500">
              User yang belum menunjukkan aktivitas signifikan hari ini.
            </p>

            {dashboard.lowActivityUsers.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">Semua user aktif hari ini.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {dashboard.lowActivityUsers.map((row) => (
                  <li
                    key={row.userId}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <span className="text-sm font-medium text-slate-700">{row.name}</span>
                    <UserStatusBadge status={row.status} />
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}

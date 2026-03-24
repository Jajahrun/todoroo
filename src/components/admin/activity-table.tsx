import { AdminActivityItem } from "./types";
import { AdminEmptyState } from "./empty-state";

type ActivityTableProps = {
  rows: AdminActivityItem[];
};

export function ActivityTable({ rows }: ActivityTableProps) {
  if (rows.length === 0) {
    return (
      <AdminEmptyState
        title="Belum ada aktivitas user"
        description="Data aktivitas akan muncul ketika user mulai menyelesaikan task dan sesi fokus."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-3 py-3 font-semibold">Nama User</th>
              <th className="px-3 py-3 font-semibold">Tanggal</th>
              <th className="px-3 py-3 font-semibold">Task Selesai</th>
              <th className="px-3 py-3 font-semibold">Sesi Fokus</th>
              <th className="px-3 py-3 font-semibold">Menit Fokus</th>
              <th className="px-3 py-3 font-semibold">Current Streak</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.userId}-${row.dateLabel}`} className="border-b border-slate-100 last:border-b-0">
                <td className="px-3 py-3 text-slate-700">{row.name}</td>
                <td className="px-3 py-3 text-slate-700">{row.dateLabel}</td>
                <td className="px-3 py-3 text-slate-700">{row.completedTasks}</td>
                <td className="px-3 py-3 text-slate-700">{row.focusSessions}</td>
                <td className="px-3 py-3 text-slate-700">{row.focusMinutes} menit</td>
                <td className="px-3 py-3 text-slate-700">{row.currentStreak} hari</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

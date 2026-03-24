type TopPerformerCardProps = {
  name: string;
  tasksCompleted: number;
  focusMinutes: number;
};

export function TopPerformerCard({ name, tasksCompleted, focusMinutes }: TopPerformerCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-800">{name}</p>
      <p className="mt-1 text-xs text-slate-500">Task selesai: {tasksCompleted}</p>
      <p className="text-xs text-slate-500">Fokus: {focusMinutes} menit</p>
    </article>
  );
}

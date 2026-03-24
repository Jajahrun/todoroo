import { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
};

export function SummaryCard({ label, value, hint, icon: Icon }: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-800">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </article>
  );
}

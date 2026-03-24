import Link from "next/link";
import { ClipboardX } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <span className="mx-auto inline-flex rounded-full bg-slate-100 p-3 text-slate-500">
        <ClipboardX className="h-5 w-5" />
      </span>
      <p className="mt-4 text-lg font-semibold text-slate-800">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>

      <Link
        href={actionHref}
        className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

import { ClipboardX } from "lucide-react";

type AdminEmptyStateProps = {
  title: string;
  description: string;
};

export function AdminEmptyState({ title, description }: AdminEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <span className="mx-auto inline-flex rounded-full bg-slate-100 p-3 text-slate-500">
        <ClipboardX className="h-5 w-5" />
      </span>
      <p className="mt-4 text-lg font-semibold text-slate-800">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

type UserStatusBadgeProps = {
  status: "Active Today" | "Low Activity" | "Inactive";
};

const styleMap = {
  "Active Today": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Low Activity": "border-amber-200 bg-amber-50 text-amber-700",
  Inactive: "border-slate-200 bg-slate-100 text-slate-600",
};

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styleMap[status]}`}>
      {status}
    </span>
  );
}

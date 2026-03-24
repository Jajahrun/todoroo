import Link from "next/link";
import { ActivityTable } from "../../../components/admin/activity-table";
import { getAdminActivity } from "../../../lib/admin-service";

type Period = "today" | "week" | "month";

type PageProps = {
  searchParams?: Promise<{ period?: string }> | { period?: string };
};

async function resolveSearchParams(searchParams: PageProps["searchParams"]) {
  if (!searchParams) return {};
  if (typeof (searchParams as Promise<{ period?: string }>).then === "function") {
    return (await searchParams) ?? {};
  }
  return searchParams as { period?: string };
}

function normalizePeriod(value: string | undefined): Period {
  if (value === "week" || value === "month" || value === "today") return value;
  return "today";
}

export default async function AdminActivityPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const period = normalizePeriod(resolvedSearchParams.period);
  const rows = await getAdminActivity(period);

  const tabs: { label: string; value: Period }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">User Activity</h1>
        <p className="mt-1 text-sm text-slate-500">
          Lihat detail aktivitas produktivitas seluruh user.
        </p>

        <div className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
          {tabs.map((tab) => {
            const isActive = period === tab.value;
            return (
              <Link
                key={tab.value}
                href={`/admin/activity?period=${tab.value}`}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  isActive ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-white"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </section>

      <ActivityTable rows={rows} />
    </div>
  );
}

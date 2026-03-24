"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, ListChecks, LogOut } from "lucide-react";

type UserSidebarProps = {
  mobile?: boolean;
};

const menuItems = [
  { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/user/tasks", label: "My Tasks", icon: ListChecks },
  { href: "/user/progress", label: "Progress", icon: BarChart3 },
];

export function UserSidebar({ mobile = false }: UserSidebarProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <div className="overflow-x-auto">
        <nav className="flex min-w-max items-center gap-2 p-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <aside className="flex h-screen flex-col border-r border-slate-200 bg-white p-5">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
        <p className="text-lg font-semibold text-slate-800">Todoro</p>
        <p className="text-xs text-slate-500">Daily Productivity Planner</p>
      </div>

      <nav className="mt-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

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
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 sm:px-6 sm:pb-5 lg:px-8 lg:pb-6">
        <nav className="pointer-events-auto relative flex w-full max-w-md items-end justify-between rounded-[2rem] border border-white/70 bg-white/90 px-3 pb-2 pt-5 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-1 flex-col items-center justify-end gap-1 px-2 pb-1 pt-9"
              >
                {isActive ? (
                  <span className="absolute -top-8 flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-50 bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-[0_16px_32px_-18px_rgba(16,185,129,0.9)] transition-all duration-300 ease-out group-hover:-translate-y-1 group-active:-translate-y-1.5">
                    <item.icon className="h-6 w-6" />
                  </span>
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:text-slate-600 group-active:-translate-y-1.5">
                    <item.icon className="h-5 w-5" />
                  </span>
                )}
                <span
                  className={`mt-0.5 text-[11px] font-semibold transition ${
                    isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <aside className="sticky top-0 flex h-screen flex-col border-r border-slate-200 bg-white p-5">
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

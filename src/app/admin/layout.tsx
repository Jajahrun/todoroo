import { ReactNode } from "react";
import { AdminHeader } from "../../components/admin/header";
import { AdminSidebar } from "../../components/admin/sidebar";
import { requireAdminAuth } from "../../lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <div className="hidden w-64 shrink-0 md:block">
          <AdminSidebar />
        </div>

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="border-b border-slate-200 bg-white md:hidden">
            <AdminSidebar mobile />
          </div>
          <AdminHeader adminName={session.userName} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

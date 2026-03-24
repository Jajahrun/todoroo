import { ReactNode } from "react";
import { AdminHeader } from "../../components/admin/header";
import { AdminSidebar } from "../../components/admin/sidebar";
import { requireAdminAuth } from "../../lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminAuth();

  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="flex h-full">
        <div className="hidden w-64 shrink-0 xl:block">
          <AdminSidebar />
        </div>

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader adminName={session.userName} />

          <main className="flex-1 overflow-y-auto p-4 pb-28 sm:p-6 sm:pb-32 lg:p-8 lg:pb-36 xl:pb-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>

      <div className="xl:hidden">
        <AdminSidebar mobile />
      </div>
    </div>
  );
}

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { UserHeader } from "../../components/user/header";
import { UserSidebar } from "../../components/user/sidebar";
import { getCurrentUserSession } from "../../lib/user-session";

export default async function UserLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentUserSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "user") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <div className="hidden w-64 shrink-0 md:block">
          <UserSidebar />
        </div>

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="border-b border-slate-200 bg-white md:hidden">
            <UserSidebar mobile />
          </div>
          <UserHeader userName={session.userName} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

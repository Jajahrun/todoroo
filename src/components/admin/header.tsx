type AdminHeaderProps = {
  adminName: string;
  subtitle?: string;
};

export function AdminHeader({ adminName, subtitle }: AdminHeaderProps) {
  const initial = adminName.charAt(0).toUpperCase();

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-slate-800">Halo, {adminName}</p>
          <p className="mt-1 text-sm text-slate-500">
            {subtitle ?? "Monitor seluruh aktivitas dan produktivitas user hari ini."}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
          {initial}
        </div>
      </div>
    </header>
  );
}

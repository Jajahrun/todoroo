import {
  AlarmClock,
  CheckCircle2,
  Flame,
  ListTodo,
  Timer,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="section-shell py-16 sm:py-20 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
        <div>
          <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Daily Productivity App
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Fokus tiap hari tanpa drama tugas numpuk.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Todoro bantu kamu atur prioritas, kerja fokus pakai Pomodoro, dan lihat progres
            produktivitas dalam satu dashboard yang simpel.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/35 transition hover:bg-emerald-700"
            >
              Mulai Fokus
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
            >
              Lihat Fitur
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Tanpa setup rumit
            </div>
            <div className="flex items-center gap-2">
              <AlarmClock className="h-4 w-4 text-emerald-600" />
              Siap dipakai harian
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100/70 bg-white p-5 shadow-xl shadow-emerald-900/5 sm:p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Dashboard Hari Ini</p>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                On Track
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <ListTodo className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium">Tugas Selesai</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">8 / 10</p>
              </div>

              <div className="rounded-xl bg-white p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Timer className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium">Pomodoro</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">25:00</p>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-600">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  Produktivitas Minggu Ini
                </span>
                <span className="font-semibold text-emerald-700">+18%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div className="h-full w-3/4 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-white p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Flame className="h-4 w-4 text-amber-500" />
                Streak Konsisten
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">12 Hari Berturut-turut</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

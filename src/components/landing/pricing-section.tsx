import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const pricingItems = [
  "Akses penuh seluruh fitur Todoro",
  "Pomodoro timer tanpa batas",
  "Laporan produktivitas harian",
  "Streak tracking dan reminder",
  "Update fitur premium berikutnya",
];

export function PricingSection() {
  return (
    <section id="pricing" className="section-shell py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-title">Paket sederhana untuk hasil yang serius</h2>
        <p className="section-subtitle mx-auto">
          Satu paket, semua fitur inti untuk bantu kamu lebih fokus dan konsisten setiap hari.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-xl">
        <article className="rounded-3xl border border-emerald-200 bg-white p-7 shadow-xl shadow-emerald-900/10 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-slate-900">Todoro Premium</h3>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Promo Spesial
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <p className="text-4xl font-semibold tracking-tight text-emerald-700">Rp59.000</p>
            <p className="pb-1 text-sm text-slate-400 line-through">Rp120.000</p>
          </div>
          <p className="mt-2 text-sm text-slate-600">Harga promo terbatas untuk early users Todoro.</p>

          <div className="mt-6 space-y-3">
            {pricingItems.map((item) => (
              <p key={item} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {item}
              </p>
            ))}
          </div>

          <Link
            href="/login"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Mulai Sekarang
          </Link>
        </article>
      </div>
    </section>
  );
}

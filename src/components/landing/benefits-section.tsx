import { CheckCircle2, GraduationCap, Laptop2, Sparkles, UserRoundPen } from "lucide-react";

const benefits = [
  "Simple dan cepat dipakai, bahkan di hari yang super sibuk.",
  "Membantu kamu tetap fokus tanpa harus mengubah total cara kerja.",
  "Progress harian jadi terlihat jelas dan lebih terukur.",
  "Mendorong konsistensi kecil yang berdampak besar dalam jangka panjang.",
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="section-shell py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="section-title">Kenapa Todoro cocok buat kamu?</h2>
          <p className="section-subtitle">
            Todoro dirancang untuk mahasiswa, pekerja, freelancer, dan creator yang butuh sistem
            produktivitas harian tanpa kerumitan.
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-7 text-slate-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-7">
          <p className="text-sm font-semibold text-slate-500">Dipakai oleh pengguna aktif dari berbagai role</p>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <GraduationCap className="h-4 w-4 text-emerald-600" /> Mahasiswa
              </span>
              <span className="text-sm font-semibold text-emerald-700">+32%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Laptop2 className="h-4 w-4 text-emerald-600" /> Pekerja & Freelancer
              </span>
              <span className="text-sm font-semibold text-emerald-700">+41%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <UserRoundPen className="h-4 w-4 text-emerald-600" /> Creator
              </span>
              <span className="text-sm font-semibold text-emerald-700">+27%</span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
              <Sparkles className="h-4 w-4" /> Lebih terstruktur. Lebih fokus. Lebih konsisten.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

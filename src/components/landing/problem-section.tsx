import { CircleDashed, Clock3, ListChecks, ZapOff } from "lucide-react";

const painPoints = [
  {
    icon: ListChecks,
    title: "Tugas banyak, mulai dari mana?",
    description:
      "Daftar kerjaan terus nambah, tapi prioritas jadi kabur dan ujungnya semua terasa mendesak.",
  },
  {
    icon: ZapOff,
    title: "Mudah terdistraksi",
    description:
      "Baru kerja sebentar, fokus pecah lagi. Waktu habis tapi progres masih minim.",
  },
  {
    icon: Clock3,
    title: "Sering menunda pekerjaan",
    description:
      "Niat mulai ada, tapi eksekusinya ketunda karena belum punya ritme kerja yang jelas.",
  },
  {
    icon: CircleDashed,
    title: "Tidak punya sistem harian",
    description:
      "Hari berjalan tanpa struktur, jadi susah ukur apa yang sudah benar-benar selesai.",
  },
];

export function ProblemSection() {
  return (
    <section className="section-shell py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-title">Kerjaan terasa numpuk dan fokus gampang buyar?</h2>
        <p className="section-subtitle mx-auto">
          Kalau ini sering kejadian, kamu butuh sistem kerja harian yang simpel dan langsung
          kepakai, bukan aplikasi yang makin bikin ribet.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {painPoints.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5"
          >
            <item.icon className="h-6 w-6 text-emerald-600" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

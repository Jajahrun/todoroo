import { BarChart3, Flame, LayoutDashboard, ListTodo, Timer } from "lucide-react";

const features = [
  {
    icon: ListTodo,
    title: "To-Do List Harian",
    description:
      "Catat prioritas harian dengan struktur yang jelas supaya kamu tahu apa yang harus dikerjakan lebih dulu.",
  },
  {
    icon: Timer,
    title: "Pomodoro Focus Timer",
    description:
      "Bangun ritme kerja fokus dalam sesi singkat agar konsentrasi terjaga tanpa cepat burnout.",
  },
  {
    icon: BarChart3,
    title: "Productivity Tracker",
    description:
      "Pantau progres harian dan mingguan secara visual sehingga peningkatan produktivitas lebih terasa.",
  },
  {
    icon: LayoutDashboard,
    title: "Daily Dashboard",
    description:
      "Lihat ringkasan tugas, fokus, dan performa dalam satu tampilan yang clean dan gampang dipahami.",
  },
  {
    icon: Flame,
    title: "Streak System",
    description:
      "Jaga konsistensi lewat streak harian agar kebiasaan produktif kamu terus terbangun setiap hari.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section-shell py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-title">Semua yang kamu butuhkan untuk produktif tiap hari</h2>
        <p className="section-subtitle mx-auto">
          Lima fitur inti Todoro dirancang untuk bantu kamu mulai cepat, fokus lebih lama, dan
          menyelesaikan lebih banyak hal penting.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-emerald-100/70 bg-white p-6 shadow-sm shadow-emerald-900/5"
          >
            <feature.icon className="h-6 w-6 text-emerald-600" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

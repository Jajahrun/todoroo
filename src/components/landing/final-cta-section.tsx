import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="section-shell py-16 sm:py-20">
      <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-12 text-center sm:px-10">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Saatnya kerja lebih fokus dan hidup lebih terstruktur.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Mulai dari rutinitas kecil hari ini, lalu bangun konsistensi produktif yang terasa hasilnya
          dalam jangka panjang.
        </p>

        <Link
          href="#pricing"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/30 transition hover:bg-emerald-700"
        >
          Mulai Lebih Produktif
        </Link>
      </div>
    </section>
  );
}

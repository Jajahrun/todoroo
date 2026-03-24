import Image from "next/image";
import { LoginForm } from "../../components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-cyan-50 to-slate-100 px-4 py-8 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-200/45 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl rounded-[30px] border border-white/60 bg-white/35 p-3 shadow-[0_25px_70px_-30px_rgba(15,42,118,0.45)] backdrop-blur-2xl sm:p-4">
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/15">
          <div className="grid min-h-[560px] lg:grid-cols-[360px,1fr]">
            <section className="border-r border-white/60 bg-white/70 backdrop-blur-xl">
              <LoginForm />
            </section>

            <section className="relative hidden overflow-hidden lg:block">
              <Image
                src="/images/cover.png"
                alt="Todoro cover"
                fill
                priority
                className="object-cover"
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

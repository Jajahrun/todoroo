import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/80 py-8">
      <div className="section-shell flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-todoroo.png"
            alt="Todoro"
            width={28}
            height={28}
            className="h-7 w-7 rounded-lg object-cover"
          />
          <p className="text-sm text-slate-600">� {new Date().getFullYear()} Todoro. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-5 text-sm text-slate-500">
          <Link href="#features" className="transition hover:text-emerald-700">
            Features
          </Link>
          <Link href="#benefits" className="transition hover:text-emerald-700">
            Benefits
          </Link>
          <Link href="#pricing" className="transition hover:text-emerald-700">
            Pricing
          </Link>
        </div>
      </div>
    </footer>
  );
}

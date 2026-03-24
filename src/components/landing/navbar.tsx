"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#benefits", label: "Benefits" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/60 bg-white/85 backdrop-blur-xl">
      <nav className="section-shell flex h-20 items-center justify-between">
        <Link href="#" className="flex items-center gap-3">
          <Image
            src="/images/logo-todoroo.png"
            alt="Todoro"
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl object-cover"
          />
          <span className="text-lg font-semibold tracking-tight text-slate-900">Todoro</span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/30 transition hover:bg-emerald-700"
          >
            Mulai Sekarang
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Buka menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="section-shell flex flex-col gap-3 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="mt-1 rounded-xl bg-emerald-600 px-5 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setIsOpen(false)}
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

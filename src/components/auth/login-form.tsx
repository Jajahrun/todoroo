"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, XCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [uniqueCode, setUniqueCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessToastOpen, setIsSuccessToastOpen] = useState(false);
  const [successRedirectLabel, setSuccessRedirectLabel] = useState("dashboard");
  const [isChecking, setIsChecking] = useState(false);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = uniqueCode.trim().toUpperCase();

    if (!normalizedCode) {
      setErrorMessage("Unique code wajib diisi.");
      return;
    }

    try {
      setIsChecking(true);
      setErrorMessage("");

      const response = await fetch("/api/auth/verify-unique-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uniqueCode: normalizedCode }),
      });

      const result = (await response.json()) as { success: boolean; message?: string };
      const typedResult = result as {
        success: boolean;
        message?: string;
        redirectTo?: string;
        user?: { role?: "admin" | "user" };
      };

      if (!response.ok || !typedResult.success) {
        setErrorMessage(typedResult.message ?? "Unique code tidak ditemukan. Coba cek lagi.");
        return;
      }

      const nextRoute = typedResult.redirectTo ?? "/user/dashboard";
      setSuccessRedirectLabel(nextRoute.includes("/admin") ? "dashboard admin" : "dashboard user");
      setIsSuccessToastOpen(true);
      redirectTimerRef.current = setTimeout(() => {
        router.push(nextRoute);
      }, 1200);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Terjadi gangguan saat cek login: ${detail}`);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col justify-between bg-white/15 px-6 py-7 backdrop-blur-xl sm:px-8"
      >
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-todoroo.png"
              alt="Todoro"
              width={34}
              height={34}
              className="h-8 w-8 rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">Todoro</p>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">User Login</p>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-slate-200/90 bg-white/55 p-4 shadow-sm backdrop-blur-lg">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              Masuk dengan Unique Code
            </h1>
            <p className="mt-1 text-xs leading-6 text-slate-600">
              Contoh: <span className="font-semibold text-emerald-700">A9X2K1</span>
            </p>
          </div>

          <label
            htmlFor="uniqueCode"
            className="mt-6 block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Unique Code
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-300/90 bg-white/70 px-3 py-2.5 shadow-sm backdrop-blur focus-within:border-emerald-400">
            <KeyRound className="h-4 w-4 text-slate-400" />
            <input
              id="uniqueCode"
              name="uniqueCode"
              type="text"
              value={uniqueCode}
              onChange={(event) => setUniqueCode(event.target.value.toUpperCase())}
              placeholder="A9X2K1"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              autoComplete="off"
            />
          </div>

          {errorMessage ? (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-rose-600">
              <XCircle className="h-3.5 w-3.5" />
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isChecking}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/30 transition hover:bg-emerald-700"
          >
            {isChecking ? "Memeriksa..." : "Login"}
          </button>
        </div>

        <Link
          href="/"
          className="mt-5 inline-flex items-center justify-center text-xs font-semibold text-slate-500 transition hover:text-emerald-700"
        >
          Kembali ke landing page
        </Link>
      </form>

      {isSuccessToastOpen ? (
        <div className="fixed right-4 top-4 z-50 w-full max-w-sm rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl shadow-emerald-900/20">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Login berhasil</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Unique code valid. Mengarahkan ke {successRedirectLabel}...
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

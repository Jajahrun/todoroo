import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { logDatabaseConnectionStatus } from "../lib/db-connection-log";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Todoro | Daily Productivity Planner",
  description:
    "Todoro membantu kamu mengatur tugas harian, fokus dengan Pomodoro, dan membangun konsistensi produktif.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.NODE_ENV === "development") {
    void logDatabaseConnectionStatus();
  }

  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} bg-zinc-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}

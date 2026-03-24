import { prisma } from "./prisma";

const globalForDbLog = globalThis as unknown as {
  __dbConnectionLogged?: boolean;
};

export async function logDatabaseConnectionStatus() {
  if (globalForDbLog.__dbConnectionLogged) {
    return;
  }

  globalForDbLog.__dbConnectionLogged = true;

  if (!process.env.DATABASE_URL) {
    console.warn("[DB] DATABASE_URL belum diset. Koneksi database belum bisa dicek.");
    return;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("[DB] Koneksi database berhasil.");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[DB] Koneksi database gagal: ${detail}`);
  }
}

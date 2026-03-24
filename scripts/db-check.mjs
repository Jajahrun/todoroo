import prismaPkg from "@prisma/client";

const { PrismaClient } = prismaPkg;

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.warn("[DB] DATABASE_URL belum diset.");
    process.exitCode = 1;
    return;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("[DB] Koneksi database berhasil.");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[DB] Koneksi database gagal: ${detail}`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

await main();

import { NextRequest, NextResponse } from "next/server";
import { createAdminUser, getAdminUsers } from "../../../../lib/admin-service";
import { getCurrentUserFromRequest } from "../../../../lib/auth";

type CreateUserBody = {
  name?: string;
  uniqueCode?: string;
  role?: "admin" | "user";
  isActive?: boolean;
};

function ensureAdmin(request: NextRequest) {
  const session = getCurrentUserFromRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Sesi login tidak ditemukan. Silakan login ulang." },
      { status: 401 }
    );
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Akses ditolak. Hanya admin yang diizinkan." },
      { status: 403 }
    );
  }

  return null;
}

function normalizeRole(role: string | undefined): "admin" | "user" {
  return role === "admin" ? "admin" : "user";
}

export async function GET(request: NextRequest) {
  const deniedResponse = ensureAdmin(request);
  if (deniedResponse) return deniedResponse;

  try {
    const users = await getAdminUsers();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[ADMIN USERS] Gagal mengambil daftar user: ${detail}`);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data user." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const deniedResponse = ensureAdmin(request);
  if (deniedResponse) return deniedResponse;

  try {
    const body = (await request.json()) as CreateUserBody;
    const name = body.name?.trim();
    const uniqueCode = body.uniqueCode?.trim().toUpperCase();
    const role = normalizeRole(body.role);
    const isActive = body.isActive ?? true;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Nama user wajib diisi." },
        { status: 400 }
      );
    }

    if (!uniqueCode) {
      return NextResponse.json(
        { success: false, message: "Unique code wajib diisi." },
        { status: 400 }
      );
    }

    await createAdminUser({ name, uniqueCode, role, isActive });
    return NextResponse.json({ success: true, message: "User berhasil ditambahkan." });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const duplicate = detail.toLowerCase().includes("duplicate") || detail.includes("unique_code");
    console.error(`[ADMIN USERS] Gagal menambah user: ${detail}`);

    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "Unique code sudah digunakan. Gunakan kode lain." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Gagal menambah user." },
      { status: 500 }
    );
  }
}

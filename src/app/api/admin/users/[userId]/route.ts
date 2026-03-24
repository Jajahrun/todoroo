import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "../../../../../lib/auth";
import { updateAdminUser } from "../../../../../lib/admin-service";

type UpdateUserBody = {
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

function parseUserId(value: string) {
  const userId = Number(value);
  if (!Number.isFinite(userId) || userId <= 0) return null;
  return userId;
}

function normalizeRole(role: string | undefined): "admin" | "user" {
  return role === "admin" ? "admin" : "user";
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const deniedResponse = ensureAdmin(request);
  if (deniedResponse) return deniedResponse;

  const { userId: userIdParam } = await params;
  const userId = parseUserId(userIdParam);
  if (!userId) {
    return NextResponse.json({ success: false, message: "User ID tidak valid." }, { status: 400 });
  }

  try {
    const body = (await request.json()) as UpdateUserBody;
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

    await updateAdminUser(userId, { name, uniqueCode, role, isActive });
    return NextResponse.json({ success: true, message: "Data user berhasil diperbarui." });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const duplicate = detail.toLowerCase().includes("duplicate") || detail.includes("unique_code");
    console.error(`[ADMIN USERS] Gagal memperbarui user ${userId}: ${detail}`);

    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "Unique code sudah digunakan. Gunakan kode lain." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Gagal memperbarui user." },
      { status: 500 }
    );
  }
}

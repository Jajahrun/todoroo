import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type UserCodeRow = {
  id: bigint | number;
  name: string | null;
  unique_code: string;
  role: string;
  is_active: number | boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { uniqueCode?: string };
    const normalizedCode = body.uniqueCode?.trim().toUpperCase();

    if (!normalizedCode) {
      return NextResponse.json(
        { success: false, message: "Unique code wajib diisi." },
        { status: 400 }
      );
    }

    const rows = await prisma.$queryRaw<UserCodeRow[]>`
      SELECT id, name, unique_code, role, is_active
      FROM users
      WHERE UPPER(unique_code) = ${normalizedCode}
      LIMIT 1
    `;

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: "Unique code tidak ditemukan." },
        { status: 401 }
      );
    }

    if (!(rows[0].is_active === 1 || rows[0].is_active === true)) {
      return NextResponse.json(
        { success: false, message: "Akun kamu nonaktif. Hubungi admin untuk aktivasi." },
        { status: 403 }
      );
    }

    const role = rows[0].role === "admin" ? "admin" : "user";
    const userId = typeof rows[0].id === "bigint" ? rows[0].id.toString() : String(rows[0].id);
    const userName = rows[0].name ?? "User";
    const redirectTo = role === "admin" ? "/admin/dashboard" : "/user/dashboard";

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil.",
      redirectTo,
      user: {
        id: userId,
        name: userName,
        role,
        uniqueCode: rows[0].unique_code,
      },
    });

    response.cookies.set("todoro_user_id", userId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set("todoro_user_name", encodeURIComponent(userName), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set("todoro_user_role", role, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[AUTH] Gagal validasi unique_code: ${detail}`);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghubungkan ke database. Cek DATABASE_URL dan service MySQL.",
      },
      { status: 500 }
    );
  }
}

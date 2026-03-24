import { NextRequest, NextResponse } from "next/server";
import { createTaskForUser, getTasksByUserId } from "../../../../lib/task-service";
import { HabitFlag, TaskPriority } from "../../../../components/user/types";

function getUserIdFromCookie(request: NextRequest) {
  const rawUserId = request.cookies.get("todoro_user_id")?.value;
  if (!rawUserId) return null;

  const userId = Number(rawUserId);
  if (!Number.isFinite(userId) || userId <= 0) return null;
  return userId;
}

function normalizePriority(priority: string | undefined): TaskPriority {
  if (priority === "high" || priority === "medium" || priority === "low") {
    return priority;
  }
  return "medium";
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromCookie(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Sesi login tidak ditemukan. Silakan login ulang." },
      { status: 401 }
    );
  }

  try {
    const typeParam = request.nextUrl.searchParams.get("type");
    const taskType = typeParam === "habits" ? "habits" : "task";

    const tasks = await getTasksByUserId(userId, taskType);

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[TASKS] Gagal mengambil data tasks: ${detail}`);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data task dari database." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromCookie(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Sesi login tidak ditemukan. Silakan login ulang." },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as {
      title?: string;
      priority?: string;
      isHabits?: HabitFlag;
      deadline?: string;
    };

    const title = body.title?.trim();
    if (!title) {
      return NextResponse.json(
        { success: false, message: "Judul task wajib diisi." },
        { status: 400 }
      );
    }

    const priority = normalizePriority(body.priority);
    const isHabits = body.isHabits === "yes" ? "yes" : "no";
    const deadline = body.deadline ? new Date(body.deadline) : null;

    if (deadline && Number.isNaN(deadline.getTime())) {
      return NextResponse.json(
        { success: false, message: "Format deadline tidak valid." },
        { status: 400 }
      );
    }

    await createTaskForUser({
      userId,
      title,
      priority,
      isHabits,
      deadline,
    });

    return NextResponse.json({ success: true, message: "Task berhasil ditambahkan." });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[TASKS] Gagal menambah task: ${detail}`);
    return NextResponse.json(
      { success: false, message: "Gagal menambah task ke database." },
      { status: 500 }
    );
  }
}

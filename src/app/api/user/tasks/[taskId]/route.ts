import { NextRequest, NextResponse } from "next/server";
import {
  deleteTaskForUser,
  toggleTaskCompletionForUser,
  updateTaskForUser,
} from "../../../../../lib/task-service";
import { HabitFlag, TaskPriority } from "../../../../../components/user/types";

function getUserIdFromCookie(request: NextRequest) {
  const rawUserId = request.cookies.get("todoro_user_id")?.value;
  if (!rawUserId) return null;

  const userId = Number(rawUserId);
  if (!Number.isFinite(userId) || userId <= 0) return null;
  return userId;
}

function parseTaskId(taskIdParam: string) {
  const taskId = Number(taskIdParam);
  if (!Number.isFinite(taskId) || taskId <= 0) return null;
  return taskId;
}

function normalizePriority(priority: string | undefined): TaskPriority {
  if (priority === "high" || priority === "medium" || priority === "low") {
    return priority;
  }
  return "medium";
}

function normalizeIsHabits(value: HabitFlag | undefined) {
  return value === "yes" ? "yes" : "no";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const userId = getUserIdFromCookie(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Sesi login tidak ditemukan. Silakan login ulang." },
      { status: 401 }
    );
  }

  const { taskId: taskIdParam } = await params;
  const taskId = parseTaskId(taskIdParam);
  if (!taskId) {
    return NextResponse.json({ success: false, message: "Task ID tidak valid." }, { status: 400 });
  }

  try {
    const body = (await request.json()) as { isCompleted?: boolean };
    if (typeof body.isCompleted !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Field isCompleted wajib boolean." },
        { status: 400 }
      );
    }

    await toggleTaskCompletionForUser({
      userId,
      taskId,
      isCompleted: body.isCompleted,
    });

    return NextResponse.json({ success: true, message: "Status task berhasil diperbarui." });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[TASKS] Gagal checklist task: ${detail}`);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui status task." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const userId = getUserIdFromCookie(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Sesi login tidak ditemukan. Silakan login ulang." },
      { status: 401 }
    );
  }

  const { taskId: taskIdParam } = await params;
  const taskId = parseTaskId(taskIdParam);
  if (!taskId) {
    return NextResponse.json({ success: false, message: "Task ID tidak valid." }, { status: 400 });
  }

  try {
    const body = (await request.json()) as {
      title?: string;
      priority?: string;
      isHabits?: HabitFlag;
      deadline?: string | null;
    };

    const title = body.title?.trim();
    if (!title) {
      return NextResponse.json(
        { success: false, message: "Judul task wajib diisi." },
        { status: 400 }
      );
    }

    const priority = normalizePriority(body.priority);
    const isHabits = normalizeIsHabits(body.isHabits);
    const deadline = body.deadline ? new Date(body.deadline) : null;

    if (deadline && Number.isNaN(deadline.getTime())) {
      return NextResponse.json(
        { success: false, message: "Format deadline tidak valid." },
        { status: 400 }
      );
    }

    await updateTaskForUser({
      userId,
      taskId,
      title,
      priority,
      isHabits,
      deadline,
    });

    return NextResponse.json({ success: true, message: "Task berhasil diperbarui." });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[TASKS] Gagal edit task: ${detail}`);
    return NextResponse.json({ success: false, message: "Gagal mengedit task." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const userId = getUserIdFromCookie(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Sesi login tidak ditemukan. Silakan login ulang." },
      { status: 401 }
    );
  }

  const { taskId: taskIdParam } = await params;
  const taskId = parseTaskId(taskIdParam);
  if (!taskId) {
    return NextResponse.json({ success: false, message: "Task ID tidak valid." }, { status: 400 });
  }

  try {
    await deleteTaskForUser({ userId, taskId });
    return NextResponse.json({ success: true, message: "Task berhasil dihapus." });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[TASKS] Gagal hapus task: ${detail}`);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus task." },
      { status: 500 }
    );
  }
}

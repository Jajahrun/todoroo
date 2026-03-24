"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { TaskList } from "./task-list";
import { UserTask } from "./types";

type TodayTasksPreviewProps = {
  initialTaskTasks: UserTask[];
  initialHabitTasks: UserTask[];
};

type DashboardSection = "habits" | "task";

const sectionMeta: Record<
  DashboardSection,
  { label: string; activeStyle: string; dotStyle: string; emptyTitle: string; emptyDescription: string }
> = {
  habits: {
    label: "Habits",
    activeStyle: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotStyle: "bg-emerald-500",
    emptyTitle: "Belum ada habits",
    emptyDescription: "Tambah habits dari halaman My Tasks agar muncul setiap hari.",
  },
  task: {
    label: "Task",
    activeStyle: "border-blue-200 bg-blue-50 text-blue-700",
    dotStyle: "bg-blue-500",
    emptyTitle: "Belum ada task hari ini",
    emptyDescription: "Task harian kamu belum ada. Tambahkan task baru untuk hari ini.",
  },
};

export function TodayTasksPreview({ initialTaskTasks, initialHabitTasks }: TodayTasksPreviewProps) {
  const router = useRouter();
  const [taskItems, setTaskItems] = useState<UserTask[]>(initialTaskTasks);
  const [habitItems, setHabitItems] = useState<UserTask[]>(initialHabitTasks);
  const [expanded, setExpanded] = useState<Record<DashboardSection, boolean>>({
    habits: true,
    task: true,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggleTask = async (task: UserTask) => {
    const nextCompleted = !task.isCompleted;
    const targetSet = task.isHabits === "yes" ? setHabitItems : setTaskItems;

    targetSet((prev) =>
      prev.map((item) => (item.id === task.id ? { ...item, isCompleted: nextCompleted } : item))
    );
    setErrorMessage("");

    try {
      const response = await fetch(`/api/user/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: nextCompleted }),
      });
      const result = (await response.json()) as { success: boolean; message?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal memperbarui status task.");
      }
      router.refresh();
    } catch (error) {
      targetSet((prev) =>
        prev.map((item) =>
          item.id === task.id ? { ...item, isCompleted: task.isCompleted } : item
        )
      );
      const detail = error instanceof Error ? error.message : String(error);
      setErrorMessage(detail);
    }
  };

  const renderSection = (section: DashboardSection) => {
    const items = section === "habits" ? habitItems : taskItems;
    const meta = sectionMeta[section];
    const isOpen = expanded[section];

    return (
      <div key={section} className="rounded-xl border border-slate-200 p-4">
        <button
          type="button"
          onClick={() => setExpanded((prev) => ({ ...prev, [section]: !prev[section] }))}
          className="flex w-full items-center justify-between"
        >
          <div className="inline-flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold ${meta.activeStyle}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${meta.dotStyle}`} />
              {meta.label}
            </span>
            <span className="text-sm text-slate-400">{items.length}</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen ? (
          <div className="mt-3">
            <TaskList
              tasks={items}
              onToggleTask={handleToggleTask}
              emptyTitle={meta.emptyTitle}
              emptyDescription={meta.emptyDescription}
            />
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Today Tasks</h2>
          <p className="text-sm text-slate-500">Prioritas utama yang perlu kamu selesaikan.</p>
        </div>
        <Link
          href="/user/tasks"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
        >
          Lihat Semua
        </Link>
      </div>

      {errorMessage ? <p className="mb-3 text-sm text-rose-600">{errorMessage}</p> : null}

      <div className="space-y-3">
        {renderSection("habits")}
        {renderSection("task")}
      </div>
    </article>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { EmptyState } from "../../../components/user/empty-state";
import { TaskList } from "../../../components/user/task-list";
import { HabitFlag, TaskPriority, UserTask } from "../../../components/user/types";

type TaskSectionType = "task" | "habits";

type TaskBuckets = {
  task: UserTask[];
  habits: UserTask[];
};

const sectionMeta: Record<
  TaskSectionType,
  {
    label: string;
    activeStyle: string;
    dotStyle: string;
    emptyTitle: string;
    emptyDescription: string;
  }
> = {
  task: {
    label: "Task",
    activeStyle: "border-blue-200 bg-blue-50 text-blue-700",
    dotStyle: "bg-blue-500",
    emptyTitle: "Belum ada task",
    emptyDescription: "Tambahkan task baru agar aktivitas harian lebih terarah.",
  },
  habits: {
    label: "Habits",
    activeStyle: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotStyle: "bg-emerald-500",
    emptyTitle: "Belum ada habits",
    emptyDescription: "Aktifkan toggle habits saat tambah tugas agar muncul di sini.",
  },
};

export default function UserTasksPage() {
  const [taskBuckets, setTaskBuckets] = useState<TaskBuckets>({ task: [], habits: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<TaskSectionType, boolean>>({
    task: true,
    habits: true,
  });
  const [formTitle, setFormTitle] = useState("");
  const [formPriority, setFormPriority] = useState<TaskPriority>("medium");
  const [formDeadline, setFormDeadline] = useState("");
  const [formIsHabits, setFormIsHabits] = useState<HabitFlag>("no");
  const [editingTask, setEditingTask] = useState<UserTask | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<TaskPriority>("medium");
  const [editDeadline, setEditDeadline] = useState("");
  const [editIsHabits, setEditIsHabits] = useState<HabitFlag>("no");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"error" | "success" | "">("");

  const fetchTasksByType = async (type: TaskSectionType) => {
    const response = await fetch(`/api/user/tasks?type=${type}`, {
      method: "GET",
      cache: "no-store",
    });
    const result = (await response.json()) as { success: boolean; message?: string; tasks?: UserTask[] };
    if (!response.ok || !result.success) {
      throw new Error(result.message ?? `Gagal memuat data ${type}.`);
    }
    return result.tasks ?? [];
  };

  const fetchAllBuckets = async () => {
    try {
      setIsLoading(true);
      setFeedbackMessage("");
      setFeedbackType("");

      const [task, habits] = await Promise.all([fetchTasksByType("task"), fetchTasksByType("habits")]);
      setTaskBuckets({ task, habits });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      setTaskBuckets({ task: [], habits: [] });
      setFeedbackType("error");
      setFeedbackMessage(`Gagal memuat task: ${detail}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchAllBuckets();
  }, []);

  const clearAddForm = () => {
    setFormTitle("");
    setFormPriority("medium");
    setFormDeadline("");
    setFormIsHabits("no");
  };

  const handleAddTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = formTitle.trim();
    if (!title) {
      setFeedbackType("error");
      setFeedbackMessage("Judul task wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedbackMessage("");
      setFeedbackType("");

      const response = await fetch("/api/user/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          priority: formPriority,
          isHabits: formIsHabits,
          deadline: formDeadline || null,
        }),
      });

      const result = (await response.json()) as { success: boolean; message?: string };
      if (!response.ok || !result.success) {
        setFeedbackType("error");
        setFeedbackMessage(result.message ?? "Gagal menambah task.");
        return;
      }

      clearAddForm();
      setFeedbackType("success");
      setFeedbackMessage("Task berhasil ditambahkan.");
      setIsAddOpen(false);
      setExpanded((prev) => ({ ...prev, [formIsHabits === "yes" ? "habits" : "task"]: true }));
      await fetchAllBuckets();
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      setFeedbackType("error");
      setFeedbackMessage(`Gagal menambah task: ${detail}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (task: UserTask) => {
    try {
      const response = await fetch(`/api/user/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !task.isCompleted }),
      });
      const result = (await response.json()) as { success: boolean; message?: string };
      if (!response.ok || !result.success) {
        setFeedbackType("error");
        setFeedbackMessage(result.message ?? "Gagal checklist task.");
        return;
      }
      await fetchAllBuckets();
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      setFeedbackType("error");
      setFeedbackMessage(`Gagal checklist task: ${detail}`);
    }
  };

  const handleDeleteTask = async (task: UserTask) => {
    if (!window.confirm(`Hapus task "${task.title}"?`)) return;

    try {
      const response = await fetch(`/api/user/tasks/${task.id}`, { method: "DELETE" });
      const result = (await response.json()) as { success: boolean; message?: string };
      if (!response.ok || !result.success) {
        setFeedbackType("error");
        setFeedbackMessage(result.message ?? "Gagal menghapus task.");
        return;
      }
      setFeedbackType("success");
      setFeedbackMessage("Task berhasil dihapus.");
      await fetchAllBuckets();
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      setFeedbackType("error");
      setFeedbackMessage(`Gagal hapus task: ${detail}`);
    }
  };

  const openEditTask = (task: UserTask) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDeadline(task.deadlineIso ?? "");
    setEditIsHabits(task.isHabits);
  };

  const handleEditTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingTask) return;

    const title = editTitle.trim();
    if (!title) {
      setFeedbackType("error");
      setFeedbackMessage("Judul task wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/user/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          priority: editPriority,
          isHabits: editIsHabits,
          deadline: editDeadline || null,
        }),
      });
      const result = (await response.json()) as { success: boolean; message?: string };
      if (!response.ok || !result.success) {
        setFeedbackType("error");
        setFeedbackMessage(result.message ?? "Gagal mengedit task.");
        return;
      }

      setEditingTask(null);
      setFeedbackType("success");
      setFeedbackMessage("Task berhasil diperbarui.");
      await fetchAllBuckets();
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      setFeedbackType("error");
      setFeedbackMessage(`Gagal edit task: ${detail}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSection = (type: TaskSectionType) => {
    const meta = sectionMeta[type];
    const items = taskBuckets[type];
    const isOpen = expanded[type];

    return (
      <section key={type} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <button
          type="button"
          onClick={() => setExpanded((prev) => ({ ...prev, [type]: !prev[type] }))}
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
          <div className="mt-4">
            {items.length === 0 ? (
              <EmptyState
                title={meta.emptyTitle}
                description={meta.emptyDescription}
                actionLabel="+ Tambah Task"
                actionHref="#"
              />
            ) : (
              <TaskList
                tasks={items}
                showActions
                onToggleTask={handleToggleTask}
                onEditTask={openEditTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </div>
        ) : null}
      </section>
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">My Tasks</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola semua task kamu dengan cepat.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>

        {isAddOpen ? (
          <form
            onSubmit={handleAddTask}
            className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <input
              type="text"
              value={formTitle}
              onChange={(event) => setFormTitle(event.target.value)}
              placeholder="Judul task"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400"
            />
            <select
              value={formPriority}
              onChange={(event) => setFormPriority(event.target.value as TaskPriority)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input
              type="datetime-local"
              value={formDeadline}
              onChange={(event) => setFormDeadline(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Task"}
            </button>

            <div className="sm:col-span-2 lg:col-span-4">
              <button
                type="button"
                onClick={() => setFormIsHabits((prev) => (prev === "yes" ? "no" : "yes"))}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  formIsHabits === "yes"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-600"
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${formIsHabits === "yes" ? "bg-emerald-600" : "bg-slate-400"}`} />
                Is habits: {formIsHabits === "yes" ? "Yes" : "No"}
              </button>
            </div>
          </form>
        ) : null}

        {feedbackMessage ? (
          <p className={`mt-4 text-sm ${feedbackType === "error" ? "text-rose-600" : "text-emerald-700"}`}>
            {feedbackMessage}
          </p>
        ) : null}
      </section>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
          Memuat task...
        </div>
      ) : (
        <div className="space-y-4">
          {renderSection("task")}
          {renderSection("habits")}
        </div>
      )}

      {editingTask ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4">
          <form
            onSubmit={handleEditTask}
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-slate-800">Edit Task</h2>
            <p className="mt-1 text-sm text-slate-500">Perbarui detail task yang dipilih.</p>

            <div className="mt-4 grid gap-3">
              <input
                type="text"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400"
              />
              <select
                value={editPriority}
                onChange={(event) => setEditPriority(event.target.value as TaskPriority)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                type="datetime-local"
                value={editDeadline}
                onChange={(event) => setEditDeadline(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={() => setEditIsHabits((prev) => (prev === "yes" ? "no" : "yes"))}
                className={`inline-flex w-fit items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  editIsHabits === "yes"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-600"
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${editIsHabits === "yes" ? "bg-emerald-600" : "bg-slate-400"}`} />
                Is habits: {editIsHabits === "yes" ? "Yes" : "No"}
              </button>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

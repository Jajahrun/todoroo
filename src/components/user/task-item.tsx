"use client";

import { CalendarClock, Check, PencilLine, Trash2 } from "lucide-react";
import { TaskPriority, UserTask } from "./types";

type TaskItemProps = {
  task: UserTask;
  showActions?: boolean;
  onToggle?: (task: UserTask) => void;
  onEdit?: (task: UserTask) => void;
  onDelete?: (task: UserTask) => void;
};

const priorityStyles: Record<TaskPriority, string> = {
  high: "bg-rose-50 text-rose-700 border-rose-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

const priorityLabel: Record<TaskPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const TASK_CHECK_SOUND_PATH = "/sounds/task-check.mp3";

export function TaskItem({
  task,
  showActions = false,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const handleToggle = () => {
    const nextCompleted = !task.isCompleted;

    if (nextCompleted) {
      const audio = new Audio(TASK_CHECK_SOUND_PATH);
      audio.volume = 0.9;
      void audio.play().catch(() => {
        // Ignore autoplay/playback errors and keep task toggle responsive.
      });
    }

    onToggle?.(task);
  };

  return (
    <article className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-emerald-100">
      <div className="relative flex h-5 w-5 items-center justify-center">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={handleToggle}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-slate-300 bg-white transition checked:border-emerald-600 checked:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />
        <Check
          className={`pointer-events-none absolute h-3.5 w-3.5 text-white transition ${
            task.isCompleted ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            task.isCompleted ? "text-slate-400 line-through" : "text-slate-800"
          }`}
        >
          {task.title}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[task.priority]}`}
          >
            {priorityLabel[task.priority]}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <CalendarClock className="h-3.5 w-3.5" />
            {task.deadline}
          </span>
        </div>
      </div>

      {showActions ? (
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Edit task"
          >
            <PencilLine className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(task)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </article>
  );
}

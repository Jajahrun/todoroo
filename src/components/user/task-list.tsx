"use client";

import { UserTask } from "./types";
import { EmptyState } from "./empty-state";
import { TaskItem } from "./task-item";

type TaskListProps = {
  tasks: UserTask[];
  showActions?: boolean;
  onToggleTask?: (task: UserTask) => void;
  onEditTask?: (task: UserTask) => void;
  onDeleteTask?: (task: UserTask) => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function TaskList({
  tasks,
  showActions = false,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  emptyTitle = "Belum ada tugas",
  emptyDescription = "Mulai tambah task pertama kamu untuk menjaga ritme produktif.",
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="+ Tambah Task"
        actionHref="#"
      />
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          showActions={showActions}
          onToggle={onToggleTask}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
}

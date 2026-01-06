"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskPriority } from "@/src/types";
import { Calendar, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useTaskStore } from "@/src/store";

interface TaskCardProps {
  task: Task;
}

const priorityConfig: Record<TaskPriority, { color: string; label: string }> = {
  LOW: { color: "bg-slate-400", label: "Low" },
  MEDIUM: { color: "bg-blue-500", label: "Medium" },
  HIGH: { color: "bg-orange-500", label: "High" },
  URGENT: { color: "bg-red-500", label: "Urgent" },
};

export function TaskCard({ task }: TaskCardProps) {
  const { openModal, deleteTask } = useTaskStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority];

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("edit", task);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task.id);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[120px] rounded-xl border-2 border-dashed border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-zinc-400" />
      </button>

      {/* Actions */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={handleEdit}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="ml-4">
        {/* Priority Badge */}
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${priority.color}`}
          >
            {priority.label}
          </span>
        </div>

        {/* Title */}
        <h4 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
          {task.title}
        </h4>

        {/* Description */}
        {task.description && (
          <p className="mb-3 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="text-xs text-zinc-400">
                  +{task.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <Calendar className="h-3 w-3" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


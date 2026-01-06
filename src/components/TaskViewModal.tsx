"use client";

import { useTaskStore } from "@/src/store";
import { TaskPriority, TaskStatus } from "@/src/types";
import {
  X,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  Timer,
  XCircle,
} from "lucide-react";

const priorityConfig: Record<
  TaskPriority,
  { color: string; bgColor: string; label: string }
> = {
  LOW: { color: "text-slate-600", bgColor: "bg-slate-100", label: "Low" },
  MEDIUM: { color: "text-blue-600", bgColor: "bg-blue-100", label: "Medium" },
  HIGH: { color: "text-orange-600", bgColor: "bg-orange-100", label: "High" },
  URGENT: { color: "text-red-600", bgColor: "bg-red-100", label: "Urgent" },
};

const statusConfig: Record<
  TaskStatus,
  { color: string; bgColor: string; label: string; icon: React.ReactNode }
> = {
  TODO: {
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    label: "To Do",
    icon: <Circle className="h-4 w-4" />,
  },
  IN_PROGRESS: {
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    label: "In Progress",
    icon: <Timer className="h-4 w-4" />,
  },
  COMPLETED: {
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    label: "Completed",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  CANCELLED: {
    color: "text-red-600",
    bgColor: "bg-red-100",
    label: "Cancelled",
    icon: <XCircle className="h-4 w-4" />,
  },
};

export function TaskViewModal() {
  const { viewingTask, closeViewModal, openModal, deleteTask } = useTaskStore();

  if (!viewingTask) return null;

  const priority = priorityConfig[viewingTask.priority];
  const status = statusConfig[viewingTask.status];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = () => {
    closeViewModal();
    openModal("edit", viewingTask);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(viewingTask.id);
      closeViewModal();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeViewModal();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-800">
        {/* Header */}
        <div className="relative border-b border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
          {/* Status & Priority Badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${status.bgColor} ${status.color}`}
            >
              {status.icon}
              {status.label}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${priority.bgColor} ${priority.color}`}
            >
              <AlertCircle className="h-3.5 w-3.5" />
              {priority.label} Priority
            </span>
          </div>

          {/* Title */}
          <h2 className="pr-12 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {viewingTask.title}
          </h2>

          {/* Close Button */}
          <button
            onClick={closeViewModal}
            className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Description
            </h3>
            {viewingTask.description ? (
              <p className="whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
                {viewingTask.description}
              </p>
            ) : (
              <p className="italic text-zinc-400 dark:text-zinc-500">
                No description provided
              </p>
            )}
          </div>

          {/* Details Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Due Date */}
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <Calendar className="h-4 w-4" />
                Due Date
              </div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {viewingTask.dueDate
                  ? formatDate(viewingTask.dueDate)
                  : "No due date"}
              </p>
            </div>

            {/* Created At */}
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <Clock className="h-4 w-4" />
                Created
              </div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {formatDateTime(viewingTask.createdAt)}
              </p>
            </div>
          </div>

          {/* Tags */}
          {viewingTask.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {viewingTask.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Last updated:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {formatDateTime(viewingTask.updatedAt)}
              </span>
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={closeViewModal}
              className="rounded-lg border border-zinc-200 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Close
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-600"
            >
              <Pencil className="h-4 w-4" />
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { Task, KANBAN_COLUMNS, TaskStatus } from "@/src/types";
import { useTaskStore } from "@/src/store";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { TaskViewModal } from "./TaskViewModal";
import { Loader2, Plus, RefreshCw, ChevronDown } from "lucide-react";

export function KanbanBoard() {
  const {
    tasks,
    isLoading,
    isLoadingMore,
    error,
    fetchTasks,
    loadMoreTasks,
    updateTaskStatus,
    openModal,
    isModalOpen,
    isViewModalOpen,
    pagination,
    hasMoreTasks,
  } = useTaskStore();

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if we're over a column
    const overColumn = KANBAN_COLUMNS.find((col) => col.id === overId);
    if (overColumn && activeTask.status !== overColumn.id) {
      // Update immediately for smooth UX
      updateTaskStatus(activeTask.id, overColumn.id);
    }

    // Check if we're over another task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      updateTaskStatus(activeTask.id, overTask.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Final status update if dropped on column
    const overColumn = KANBAN_COLUMNS.find((col) => col.id === over.id);
    if (overColumn && activeTask.status !== overColumn.id) {
      updateTaskStatus(activeTask.id, overColumn.id);
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-zinc-500">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => fetchTasks()}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Task Board
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Drag and drop tasks to update their status
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Task Count */}
          <div className="hidden items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 sm:flex">
            <span className="font-medium">{tasks.length}</span>
            <span>of</span>
            <span className="font-medium">{pagination.total}</span>
            <span>tasks</span>
          </div>
          <button
            onClick={() => fetchTasks()}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => openModal("create")}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-600"
          >
            <Plus className="h-5 w-5" />
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 gap-6 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
            />
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
        </DragOverlay>
      </DndContext>

      {/* Load More Section */}
      {hasMoreTasks() && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing {tasks.length} of {pagination.total} tasks (Page{" "}
            {pagination.page} of {pagination.totalPages})
          </p>
          <button
            onClick={loadMoreTasks}
            disabled={isLoadingMore}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-2.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Load More Tasks
              </>
            )}
          </button>
        </div>
      )}

      {/* All Tasks Loaded Message */}
      {!hasMoreTasks() && tasks.length > 0 && pagination.total > TASKS_PER_PAGE && (
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            ✓ All {pagination.total} tasks loaded
          </p>
        </div>
      )}

      {/* Task Modal */}
      {isModalOpen && <TaskModal />}

      {/* Task View Modal */}
      {isViewModalOpen && <TaskViewModal />}
    </div>
  );
}

const TASKS_PER_PAGE = 12;

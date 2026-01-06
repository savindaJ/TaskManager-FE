"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, KanbanColumn as ColumnType } from "@/src/types";
import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";
import { useTaskStore } from "@/src/store";

interface KanbanColumnProps {
  column: ColumnType;
  tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { openModal } = useTaskStore();

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  const handleAddTask = () => {
    openModal("create", { status: column.id } as Task);
  };

  return (
    <div className="flex h-full w-80 flex-col rounded-2xl bg-zinc-50 dark:bg-zinc-900">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {column.title}
          </h3>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={handleAddTask}
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Task List */}
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-3 overflow-y-auto p-4 pt-0 transition-colors ${
          isOver ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 p-8 dark:border-zinc-700">
            <p className="text-center text-sm text-zinc-400">
              No tasks yet.
              <br />
              <button
                onClick={handleAddTask}
                className="mt-2 text-indigo-500 hover:underline"
              >
                Add a task
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


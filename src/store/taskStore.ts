import { create } from "zustand";
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from "@/src/types";
import { taskService } from "@/src/service";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  selectedTask: Task | null;
  isModalOpen: boolean;
  modalMode: "create" | "edit";

  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskInput) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;
  openModal: (mode: "create" | "edit", task?: Task) => void;
  closeModal: () => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  selectedTask: null,
  isModalOpen: false,
  modalMode: "create",

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getAllTasks({ limit: 100 , page: 1 });
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch tasks", isLoading: false });
      console.error(error);
    }
  },

  createTask: async (data: CreateTaskInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.createTask(data);
      set((state) => ({
        tasks: [...state.tasks, response.data],
        isLoading: false,
        isModalOpen: false,
      }));
    } catch (error) {
      set({ error: "Failed to create task", isLoading: false });
      console.error(error);
    }
  },

  updateTask: async (id: string, data: UpdateTaskInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.updateTask(id, data);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? response.data : task
        ),
        isLoading: false,
        isModalOpen: false,
        selectedTask: null,
      }));
    } catch (error) {
      set({ error: "Failed to update task", isLoading: false });
      console.error(error);
    }
  },

  updateTaskStatus: async (id: string, status: TaskStatus) => {
    // Optimistic update
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      ),
    }));

    try {
      await taskService.updateTask(id, { status });
    } catch (error) {
      // Rollback on error
      set({ tasks: previousTasks, error: "Failed to update task status" });
      console.error(error);
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete task", isLoading: false });
      console.error(error);
    }
  },

  setSelectedTask: (task: Task | null) => set({ selectedTask: task }),

  openModal: (mode: "create" | "edit", task?: Task) =>
    set({
      isModalOpen: true,
      modalMode: mode,
      selectedTask: task || null,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedTask: null,
    }),

  getTasksByStatus: (status: TaskStatus) =>
    get().tasks.filter((task) => task.status === status),
}));


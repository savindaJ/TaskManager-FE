import { create } from "zustand";
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from "@/src/types";
import { taskService } from "@/src/service";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  selectedTask: Task | null;
  isModalOpen: boolean;
  modalMode: "create" | "edit";
  pagination: PaginationMeta;
  // View Modal State
  viewingTask: Task | null;
  isViewModalOpen: boolean;

  // Actions
  fetchTasks: (reset?: boolean) => Promise<void>;
  loadMoreTasks: () => Promise<void>;
  createTask: (data: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskInput) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;
  openModal: (mode: "create" | "edit", task?: Task) => void;
  closeModal: () => void;
  openViewModal: (task: Task) => void;
  closeViewModal: () => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  hasMoreTasks: () => boolean;
}

const TASKS_PER_PAGE = 12;

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  selectedTask: null,
  isModalOpen: false,
  modalMode: "create",
  pagination: {
    total: 0,
    page: 1,
    limit: TASKS_PER_PAGE,
    totalPages: 1,
  },
  viewingTask: null,
  isViewModalOpen: false,

  fetchTasks: async (reset = true) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getAllTasks({
        limit: TASKS_PER_PAGE,
        page: 1,
      });
      set({
        tasks: response.data,
        pagination: response.meta,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch tasks", isLoading: false });
      console.error(error);
    }
  },

  loadMoreTasks: async () => {
    const { pagination, tasks } = get();
    if (pagination.page >= pagination.totalPages) return;

    set({ isLoadingMore: true, error: null });
    try {
      const nextPage = pagination.page + 1;
      const response = await taskService.getAllTasks({
        limit: TASKS_PER_PAGE,
        page: nextPage,
      });
      set({
        tasks: [...tasks, ...response.data],
        pagination: response.meta,
        isLoadingMore: false,
      });
    } catch (error) {
      set({ error: "Failed to load more tasks", isLoadingMore: false });
      console.error(error);
    }
  },

  hasMoreTasks: () => {
    const { pagination } = get();
    return pagination.page < pagination.totalPages;
  },

  createTask: async (data: CreateTaskInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.createTask(data);
      set((state) => ({
        tasks: [response.data, ...state.tasks],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
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
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
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

  openViewModal: (task: Task) =>
    set({
      viewingTask: task,
      isViewModalOpen: true,
    }),

  closeViewModal: () =>
    set({
      viewingTask: null,
      isViewModalOpen: false,
    }),

  getTasksByStatus: (status: TaskStatus) =>
    get().tasks.filter((task) => task.status === status),
}));

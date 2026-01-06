import { apiClient } from "@/src/config/axios";
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryParams,
  PaginatedResponse,
  ApiResponse,
} from "@/src/types";

class TaskService {
  private readonly basePath = "/tasks";

  async getAllTasks(params?: TaskQueryParams): Promise<PaginatedResponse<Task>> {
    const response = await apiClient.get<PaginatedResponse<Task>>(this.basePath, {
      params,
    });
    return response.data;
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const response = await apiClient.get<ApiResponse<Task>>(`${this.basePath}/${id}`);
    return response.data;
  }

  async createTask(data: CreateTaskInput): Promise<ApiResponse<Task>> {
    const response = await apiClient.post<ApiResponse<Task>>(this.basePath, data);
    return response.data;
  }

  async updateTask(id: string, data: UpdateTaskInput): Promise<ApiResponse<Task>> {
    const response = await apiClient.put<ApiResponse<Task>>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async deleteTask(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`${this.basePath}/${id}`);
    return response.data;
  }

  async getTaskStats(): Promise<ApiResponse<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  }>> {
    const response = await apiClient.get(`${this.basePath}/stats`);
    return response.data;
  }
}

export const taskService = new TaskService();
export default taskService;


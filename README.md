# 🎯 Task Manager Frontend

A **modern, responsive Task Management Dashboard** built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Zustand**.  
Features a beautiful **Kanban board** with **drag-and-drop** functionality for seamless task management.

👨‍💻 **Author:** Savinda Jayasekara  
🔗 **GitHub:** [github.com/savindaJ](https://github.com/savindaJ)

---

## ✨ Features

- 🎨 **Beautiful Kanban Board** - 4 columns: To Do, In Progress, Completed, Cancelled
- 🖱️ **Drag & Drop** - Seamlessly move tasks between columns
- ⚡ **Optimistic Updates** - Instant UI feedback with background sync
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Mode** - Automatic system preference detection
- 📄 **Pagination** - Load more tasks as needed
- 🔍 **Task Details Modal** - View full task information
- ✏️ **Create/Edit Tasks** - Full CRUD operations
- 🏷️ **Tags Support** - Organize tasks with tags
- 📅 **Due Dates** - Track task deadlines
- 🎯 **Priority Levels** - Low, Medium, High, Urgent

---

## 🛠 Tech Stack

| Technology | Description |
|------------|-------------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Zustand** | Lightweight state management |
| **@dnd-kit** | Drag and drop toolkit |
| **Axios** | HTTP client |
| **Lucide React** | Beautiful icons |

---

## 📂 Project Structure

```bash
taskmanager-fe/
├── app/
│   ├── favicon.ico
│   ├── globals.css        # Global styles & Tailwind imports
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page with Kanban board
├── src/
│   ├── components/        # React components
│   │   ├── index.ts
│   │   ├── KanbanBoard.tsx    # Main board component
│   │   ├── KanbanColumn.tsx   # Column component
│   │   ├── TaskCard.tsx       # Draggable task card
│   │   ├── TaskModal.tsx      # Create/Edit modal
│   │   └── TaskViewModal.tsx  # View task details modal
│   ├── config/            # Configuration
│   │   ├── index.ts
│   │   └── axios.ts       # Axios instance & interceptors
│   ├── service/           # API services
│   │   ├── index.ts
│   │   └── task.service.ts    # Task API calls
│   ├── store/             # State management
│   │   ├── index.ts
│   │   └── taskStore.ts   # Zustand store
│   └── types/             # TypeScript types
│       ├── index.ts
│       └── task.types.ts  # Task interfaces & types
├── public/                # Static assets
├── .env.local             # Environment variables (create this)
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Backend API** running (see [taskmanager-be](../taskmanager-be/README.md))

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/savindaJ/task-manager-frontend.git
cd task-manager-frontend
```

---

### 3️⃣ Install Dependencies

```bash
npm install
```

---

### 4️⃣ Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add the following environment variables:

```env
# =================================
# API Configuration
# =================================
# Backend API URL (without trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

#### 🔑 Environment Variables Explained

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | **Yes** | `http://localhost:5000/api` |

> ⚠️ **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put sensitive data here.

---

### 5️⃣ Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 6️⃣ Build for Production

```bash
npm run build
npm start
```

---

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🎨 Component Overview

### KanbanBoard
The main container that renders all columns and handles drag-and-drop context.

```tsx
<KanbanBoard />
```

### KanbanColumn
Individual column representing a task status (TODO, IN_PROGRESS, etc.).

```tsx
<KanbanColumn column={column} tasks={tasks} />
```

### TaskCard
Draggable card displaying task summary. Click to view details.

```tsx
<TaskCard task={task} />
```

### TaskModal
Modal for creating or editing tasks.

```tsx
<TaskModal /> // Controlled by Zustand store
```

### TaskViewModal
Modal displaying full task details with edit/delete actions.

```tsx
<TaskViewModal /> // Controlled by Zustand store
```

---

## 🗃️ State Management (Zustand)

The app uses **Zustand** for state management with the following store:

```typescript
interface TaskState {
  // State
  tasks: Task[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  pagination: PaginationMeta;
  isModalOpen: boolean;
  isViewModalOpen: boolean;
  selectedTask: Task | null;
  viewingTask: Task | null;

  // Actions
  fetchTasks: () => Promise<void>;
  loadMoreTasks: () => Promise<void>;
  createTask: (data: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskInput) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  openModal: (mode: "create" | "edit", task?: Task) => void;
  closeModal: () => void;
  openViewModal: (task: Task) => void;
  closeViewModal: () => void;
}
```

### Usage Example

```tsx
import { useTaskStore } from "@/src/store";

function MyComponent() {
  const { tasks, fetchTasks, createTask } = useTaskStore();
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return <div>{tasks.map(task => ...)}</div>;
}
```

---

## 🌐 API Service

The API service layer handles all HTTP requests:

```typescript
import { taskService } from "@/src/service";

// Get all tasks with pagination
const response = await taskService.getAllTasks({ page: 1, limit: 10 });

// Create a task
await taskService.createTask({ title: "New Task", priority: "HIGH" });

// Update a task
await taskService.updateTask(taskId, { status: "COMPLETED" });

// Delete a task
await taskService.deleteTask(taskId);

// Get task statistics
const stats = await taskService.getTaskStats();
```

---

## 📝 Task Types

```typescript
type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
}
```

---

## 🖼️ Screenshots

<img width="736" height="398" alt="Screenshot 2026-01-06 at 23 47 42" src="https://github.com/user-attachments/assets/3e63a049-d161-4274-97f6-7d336b419760" />

**Savinda Jayasekara**

- GitHub: [@savindaJ](https://github.com/savindaJ)
- LinkedIn: [Savinda Jayasekara]([https://linkedin.com/in/savindajayasekara](https://www.linkedin.com/in/savinda-jayasekara-b81446191/))

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [dnd-kit](https://dndkit.com/) - Drag and drop toolkit
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Lucide](https://lucide.dev/) - Beautiful icons

---

⭐ **If you found this project helpful, please give it a star!**

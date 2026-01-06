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

### Kanban Board (Light Mode)
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   To Do     │ In Progress │  Completed  │  Cancelled  │
│     (3)     │     (2)     │     (5)     │     (1)     │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │
│ │ Task 1  │ │ │ Task 4  │ │ │ Task 6  │ │ │ Task 11 │ │
│ │ HIGH    │ │ │ MEDIUM  │ │ │ LOW     │ │ │ LOW     │ │
│ └─────────┘ │ └─────────┘ │ └─────────┘ │ └─────────┘ │
│ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │             │
│ │ Task 2  │ │ │ Task 5  │ │ │ Task 7  │ │             │
│ │ URGENT  │ │ │ HIGH    │ │ │ MEDIUM  │ │             │
│ └─────────┘ │ └─────────┘ │ └─────────┘ │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## 🐛 Troubleshooting

### Common Issues

**1. API Connection Error**
```
Network Error / Failed to fetch tasks
```
→ Make sure the backend is running on the correct port
→ Check `NEXT_PUBLIC_API_URL` in `.env.local`
→ Restart the Next.js dev server after changing env variables

**2. CORS Error**
```
Access-Control-Allow-Origin
```
→ Ensure backend has CORS enabled for `http://localhost:3000`

**3. Environment Variables Not Loading**
→ Restart the dev server after creating/modifying `.env.local`
→ Make sure variable starts with `NEXT_PUBLIC_`

**4. Drag and Drop Not Working**
→ Clear browser cache
→ Check for JavaScript errors in console

**5. Dark Mode Not Working**
→ Check system preferences
→ Try refreshing the page

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = Your production API URL
5. Deploy!

### Deploy with Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t taskmanager-fe .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://api:8080/api taskmanager-fe
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Contact

**Savinda Jayasekara**

- GitHub: [@savindaJ](https://github.com/savindaJ)
- LinkedIn: [Savinda Jayasekara](https://linkedin.com/in/savindajayasekara)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [dnd-kit](https://dndkit.com/) - Drag and drop toolkit
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Lucide](https://lucide.dev/) - Beautiful icons

---

⭐ **If you found this project helpful, please give it a star!**

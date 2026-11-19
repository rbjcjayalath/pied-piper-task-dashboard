import { Task, TaskFormData } from '@/types/task';

const API_URL = 'http://localhost:5000/tasks';
const STORAGE_KEY = 'pied_piper_tasks_v1';

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design System & UI Wireframes',
    description: 'Create responsive wireframes and reusable component tokens in Figma for the main task dashboard.',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-11-18',
    createdAt: '2026-11-10T09:00:00Z',
  },
  {
    id: '2',
    title: 'Set Up Next.js & TypeScript Architecture',
    description: 'Initialize Next.js App Router project with strict TypeScript configuration, Tailwind CSS, and modular folder structure.',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-11-19',
    createdAt: '2026-11-11T10:30:00Z',
  },
  {
    id: '3',
    title: 'Implement Task CRUD API Service Layer',
    description: 'Build a clean service abstraction to handle GET, POST, PUT, and DELETE operations with proper error handling.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-11-21',
    createdAt: '2026-11-12T11:15:00Z',
  },
  {
    id: '4',
    title: 'Build Search, Filter, and Sort Controls',
    description: 'Add search input, status/priority dropdown filters, and multi-field sorting for the task list.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-11-22',
    createdAt: '2026-11-13T14:00:00Z',
  },
  {
    id: '5',
    title: 'Client-Side Form Validation',
    description: 'Validate task title length, description requirements, and due date constraints before submitting forms.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-11-23',
    createdAt: '2026-11-14T08:45:00Z',
  },
  {
    id: '6',
    title: 'Mobile & Tablet Responsive Audit',
    description: 'Test dashboard layout across 375px, 768px, and 1280px viewports to ensure zero horizontal overflow.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-11-24',
    createdAt: '2026-11-15T16:20:00Z',
  },
  {
    id: '7',
    title: 'Add Loading Skeletons & Empty States',
    description: 'Create accessible loading skeletons, empty search result screens, and retry error banners.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-11-25',
    createdAt: '2026-11-16T09:10:00Z',
  },
  {
    id: '8',
    title: 'Write Project Documentation & README',
    description: 'Document setup instructions, architectural decisions, and capture UI screenshots for submission.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-11-26',
    createdAt: '2026-11-17T12:00:00Z',
  },
];

function getLocalTasks(): Task[] {
  if (typeof window === 'undefined') return DEFAULT_TASKS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
    return DEFAULT_TASKS;
  }
  return JSON.parse(raw);
}

function saveLocalTasks(tasks: Task[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('API unavailable');
      return await res.json();
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return getLocalTasks();
    }
  },

  async createTask(data: TaskFormData): Promise<Task> {
    const newTask: Task = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error('API unavailable');
      return await res.json();
    } catch {
      const current = getLocalTasks();
      const updated = [newTask, ...current];
      saveLocalTasks(updated);
      return newTask;
    }
  },

  async updateTask(id: string, data: TaskFormData): Promise<Task> {
    try {
      const existingRes = await fetch(`${API_URL}/${id}`);
      if (!existingRes.ok) throw new Error('API unavailable');
      const existing: Task = await existingRes.json();

      const updatedTask: Task = { ...existing, ...data };
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error('API update failed');
      return await res.json();
    } catch {
      const current = getLocalTasks();
      let updatedItem: Task | null = null;
      const updated = current.map((t) => {
        if (t.id === id) {
          updatedItem = { ...t, ...data };
          return updatedItem;
        }
        return t;
      });
      saveLocalTasks(updated);
      if (!updatedItem) throw new Error('Task not found');
      return updatedItem;
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('API unavailable');
    } catch {
      const current = getLocalTasks();
      saveLocalTasks(current.filter((t) => t.id !== id));
    }
  },
};
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Calendar,
  Pencil,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Task, TaskFormData, TaskPriority, TaskStatus } from '@/types/task';
import { taskService } from '@/services/taskService';
import { StatsOverview } from '@/components/StatsOverview';
import { SortOption, TaskFilters } from '@/components/TaskFilters';
import { TaskFormModal } from '@/components/TaskFormModal';
import { TaskDetailsModal } from '@/components/TaskDetailsModal';

const ITEMS_PER_PAGE = 5;

const STATUS_STYLES: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-700 border-slate-200',
  'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: 'bg-sky-50 text-sky-700 border-sky-200',
  medium: 'bg-purple-50 text-purple-700 border-purple-200',
  high: 'bg-rose-50 text-rose-700 border-rose-200',
};

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters, search, sort, pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch {
      setError('Failed to load tasks. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter, sortBy]);

  const filteredAndSortedTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate-asc':
          return a.dueDate.localeCompare(b.dueDate);
        case 'dueDate-desc':
          return b.dueDate.localeCompare(a.dueDate);
        case 'priority-desc':
          return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTasks.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTasks = filteredAndSortedTasks.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handleCreateOrUpdate = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask.id, data);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        showToast('Task updated successfully.');
      } else {
        const created = await taskService.createTask(data);
        setTasks((prev) => [created, ...prev]);
        showToast('New task created successfully.');
      }
      setEditingTask(null);
    } catch {
      setError('Unable to save task. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Task deleted.');
    } catch {
      setError('Unable to delete task. Please try again.');
    }
  };

  const handleQuickStatusToggle = async (task: Task) => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      todo: 'in-progress',
      'in-progress': 'completed',
      completed: 'todo',
    };
    const updatedData: TaskFormData = {
      title: task.title,
      description: task.description,
      status: nextStatus[task.status],
      priority: task.priority,
      dueDate: task.dueDate,
    };
    try {
      const updated = await taskService.updateTask(task.id, updatedData);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      showToast(`Status changed to "${updated.status.replace('-', ' ')}".`);
    } catch {
      setError('Failed to update task status.');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-xs">
              PP
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                TaskFlow Dashboard
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Pied Piper Innovation • Engineering Task Manager
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Success Toast */}
        {toastMessage && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-xs font-medium text-emerald-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <StatsOverview tasks={tasks} loading={loading} />

        {/* Search, Filter, Sort */}
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onReset={resetFilters}
        />

        {/* Error State */}
        {error && (
          <div
            role="alert"
            className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3 text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold">Something went wrong</h3>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchTasks}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse flex items-center justify-between gap-4 py-2">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
                <div className="h-6 w-20 bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedTasks.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No tasks found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              {tasks.length === 0
                ? 'Get started by creating your first task for the team.'
                : 'No tasks match your current search or filter criteria.'}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {tasks.length > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditingTask(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
                Create Task
              </button>
            </div>
          </div>
        )}

        {/* Task List (Desktop Table + Mobile Cards) */}
        {!loading && !error && paginatedTasks.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-5">Task</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {paginatedTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5 max-w-md">
                        <button
                          type="button"
                          onClick={() => setSelectedTask(task)}
                          className="text-left group"
                        >
                          <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {task.description}
                          </p>
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleQuickStatusToggle(task)}
                          title="Click to cycle status"
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize transition-opacity hover:opacity-80 ${
                            STATUS_STYLES[task.status]
                          }`}
                        >
                          {task.status.replace('-', ' ')}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${
                            PRIORITY_STYLES[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {task.dueDate}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedTask(task)}
                            title="View details"
                            aria-label="View details"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTask(task);
                              setIsFormOpen(true);
                            }}
                            title="Edit task"
                            aria-label="Edit task"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-amber-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(task.id)}
                            title="Delete task"
                            aria-label="Delete task"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-200">
              {paginatedTasks.map((task) => (
                <div key={task.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTask(task)}
                      className="text-left"
                    >
                      <h3 className="font-semibold text-slate-900 text-sm">{task.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{task.description}</p>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickStatusToggle(task)}
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${
                        STATUS_STYLES[task.status]
                      }`}
                    >
                      {task.status.replace('-', ' ')}
                    </button>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${
                        PRIORITY_STYLES[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto">
                      <Calendar className="w-3.5 h-3.5" />
                      {task.dueDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedTask(task)}
                      className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 text-slate-700"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTask(task);
                        setIsFormOpen(true);
                      }}
                      className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="px-2.5 py-1 text-xs font-medium rounded-md border border-rose-200 text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <p>
                Showing{' '}
                <span className="font-semibold text-slate-900">
                  {(safePage - 1) * ITEMS_PER_PAGE + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-slate-900">
                  {Math.min(safePage * ITEMS_PER_PAGE, filteredAndSortedTasks.length)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-900">
                  {filteredAndSortedTasks.length}
                </span>{' '}
                tasks
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev
                </button>
                <span className="px-2.5 py-1.5 font-semibold text-slate-800">
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create / Edit Modal */}
      <TaskFormModal
        isOpen={isFormOpen}
        editingTask={editingTask}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={(task) => {
          setEditingTask(task);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
'use client';

import React from 'react';
import { Search, ArrowUpDown, RotateCcw } from 'lucide-react';
import { TaskPriority, TaskStatus } from '@/types/task';

export type SortOption = 'newest' | 'dueDate-asc' | 'dueDate-desc' | 'priority-desc' | 'title-asc';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: 'all' | TaskStatus;
  onStatusChange: (val: 'all' | TaskStatus) => void;
  priorityFilter: 'all' | TaskPriority;
  onPriorityChange: (val: 'all' | TaskPriority) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  onReset: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    sortBy !== 'newest';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            aria-label="Search tasks"
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as 'all' | TaskStatus)}
            aria-label="Filter by status"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="md:col-span-2">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as 'all' | TaskPriority)}
            aria-label="Filter by priority"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Sort */}
        <div className="md:col-span-3 flex items-center gap-1.5">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            aria-label="Sort tasks"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="dueDate-asc">Due Date: Earliest First</option>
            <option value="dueDate-desc">Due Date: Latest First</option>
            <option value="priority-desc">Priority: High to Low</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>

        {/* Reset */}
        <div className="md:col-span-1 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilters}
            title="Reset filters"
            className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="md:hidden">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
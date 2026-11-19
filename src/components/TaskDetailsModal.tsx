'use client';

import React from 'react';
import { X, Calendar, Clock, Pencil, Trash2 } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const STATUS_BADGE: Record<Task['status'], string> = {
  todo: 'bg-slate-100 text-slate-700 border-slate-200',
  'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const PRIORITY_BADGE: Record<Task['priority'], string> = {
  low: 'bg-sky-50 text-sky-700 border-sky-200',
  medium: 'bg-purple-50 text-purple-700 border-purple-200',
  high: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg shadow-xl overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-medium text-slate-400">Task #{task.id}</span>
            <h2 className="text-lg font-semibold text-slate-900 mt-0.5">{task.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${
                STATUS_BADGE[task.status]
              }`}
            >
              {task.status.replace('-', ' ')}
            </span>
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${
                PRIORITY_BADGE[task.priority]
              }`}
            >
              {task.priority} Priority
            </span>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {task.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-500">
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>
                Due Date: <strong className="text-slate-700">{task.dueDate}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>
                Created:{' '}
                <strong className="text-slate-700">
                  {new Date(task.createdAt).toLocaleDateString()}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(task);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Pencil className="w-4 h-4" />
                Edit Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
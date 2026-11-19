'use client';

import React from 'react';
import { CheckCircle2, Clock, ListTodo, Layers } from 'lucide-react';
import { Task } from '@/types/task';

interface StatsOverviewProps {
  tasks: Task[];
  loading: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ tasks, loading }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;

  const cards = [
    {
      label: 'Total Tasks',
      value: total,
      icon: Layers,
      badgeClass: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      label: 'To Do',
      value: todo,
      icon: ListTodo,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Clock,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                {loading ? (
                  <div className="h-8 w-14 bg-slate-200 animate-pulse rounded mt-2" />
                ) : (
                  <p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg border ${card.badgeClass}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
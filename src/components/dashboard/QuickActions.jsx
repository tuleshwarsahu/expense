import React from 'react';
import { PlusCircle, MinusCircle, History, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions({ onOpenAddModal }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
      <button
        onClick={onOpenAddModal}
        className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all text-rose-700 dark:text-rose-300 active:scale-95 group"
      >
        <div className="p-2 rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/30 group-hover:scale-105 transition-transform shrink-0">
          <MinusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="text-left min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-600/80 dark:text-rose-400/80 truncate">
            Quick Add
          </span>
          <span className="text-xs sm:text-sm font-bold truncate block">Expense</span>
        </div>
      </button>

      <button
        onClick={onOpenAddModal}
        className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all text-emerald-700 dark:text-emerald-300 active:scale-95 group"
      >
        <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform shrink-0">
          <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="text-left min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/80 truncate">
            Quick Add
          </span>
          <span className="text-xs sm:text-sm font-bold truncate block">Income</span>
        </div>
      </button>

      <button
        onClick={() => navigate('/transactions')}
        className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all text-indigo-700 dark:text-indigo-300 active:scale-95 group"
      >
        <div className="p-2 rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform shrink-0">
          <History className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="text-left min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600/80 dark:text-indigo-400/80 truncate">
            History
          </span>
          <span className="text-xs sm:text-sm font-bold truncate block">Records</span>
        </div>
      </button>

      <button
        onClick={() => navigate('/reports/monthly')}
        className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-violet-50 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-900/60 rounded-2xl hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-all text-violet-700 dark:text-violet-300 active:scale-95 group"
      >
        <div className="p-2 rounded-xl bg-violet-500 text-white shadow-md shadow-violet-500/30 group-hover:scale-105 transition-transform shrink-0">
          <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="text-left min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-violet-600/80 dark:text-violet-400/80 truncate">
            Analytics
          </span>
          <span className="text-xs sm:text-sm font-bold truncate block">Reports</span>
        </div>
      </button>
    </div>
  );
}

import React from 'react';
import { formatCurrency } from '../../lib/utils';
import { Target, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BudgetProgress({
  monthlyBudget = 0,
  currentExpense = 0,
  currency = 'INR'
}) {
  const budget = Number(monthlyBudget) || 0;
  const expense = Number(currentExpense) || 0;

  if (budget === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Set a Monthly Budget
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track your spending limit and receive visual alerts when reaching your limit.
            </p>
          </div>
        </div>
        <Link
          to="/profile"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shrink-0"
        >
          <span>Set Budget</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const percent = Math.min(100, Math.round((expense / budget) * 100));
  const remaining = Math.max(0, budget - expense);
  const isOverBudget = expense > budget;
  const isWarning = percent >= 80 && percent < 100;

  let progressColor = 'bg-emerald-500';
  let badgeColor = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400';
  let statusText = 'On Track';

  if (isOverBudget) {
    progressColor = 'bg-rose-500';
    badgeColor = 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400';
    statusText = 'Budget Exceeded';
  } else if (isWarning) {
    progressColor = 'bg-amber-500';
    badgeColor = 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400';
    statusText = 'Near Limit (80%+)';
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Monthly Budget
          </span>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${badgeColor}`}>
          {(isOverBudget || isWarning) && <AlertCircle className="w-3.5 h-3.5" />}
          <span>{statusText}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Spent: </span>
          <span className="text-base font-bold text-slate-900 dark:text-white">
            {formatCurrency(expense, currency)}
          </span>
          <span className="text-xs text-slate-400"> / {formatCurrency(budget, currency)}</span>
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {percent}% Used
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span>Remaining: <strong className="text-slate-700 dark:text-slate-200">{formatCurrency(remaining, currency)}</strong></span>
        <Link to="/profile" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          Edit Budget
        </Link>
      </div>
    </div>
  );
}

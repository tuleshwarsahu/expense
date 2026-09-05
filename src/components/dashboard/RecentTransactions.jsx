import React from 'react';
import { Link } from 'react-router-dom';
import { ICON_MAP } from '../../lib/constants';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ArrowRight, Tag } from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function RecentTransactions({
  transactions = [],
  currency = 'INR',
  onOpenAddModal
}) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <EmptyState
          title="No recent transactions"
          description="Add an expense or income transaction to see your financial activity here."
          onAction={onOpenAddModal}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Recent Activity
        </h3>
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {transactions.map((tx) => {
          const IconComponent = ICON_MAP[tx.category_icon] || ICON_MAP[tx.category] || Tag;
          const isExpense = tx.type === 'expense';

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isExpense
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {tx.category}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {tx.description || formatDate(tx.transaction_date)}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-sm font-bold block ${
                    isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isExpense ? '-' : '+'} {formatCurrency(tx.amount, currency)}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {formatDate(tx.transaction_date)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

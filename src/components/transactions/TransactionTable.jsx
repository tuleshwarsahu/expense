import React, { useState } from 'react';
import { ICON_MAP } from '../../lib/constants';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Edit2, Trash2, Tag } from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';
import EmptyState from '../common/EmptyState';

export default function TransactionTable({
  transactions = [],
  currency = 'INR',
  onEdit,
  onDelete,
  onOpenAddModal
}) {
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await onDelete(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        description="No matching records found. Try adjusting your search filters or add a new transaction."
        onAction={onOpenAddModal}
      />
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
                <th className="py-3.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {transactions.map((tx) => {
                const IconComp = ICON_MAP[tx.category] || Tag;
                const isExpense = tx.type === 'expense';

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
                      {formatDate(tx.transaction_date)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isExpense
                              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {tx.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          isExpense
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {tx.description || '-'}
                    </td>
                    <td
                      className={`py-4 px-6 text-right font-bold ${
                        isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'} {formatCurrency(tx.amount, currency)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(tx.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pure Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => {
          const IconComp = ICON_MAP[tx.category] || Tag;
          const isExpense = tx.type === 'expense';

          return (
            <div
              key={tx.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isExpense
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {tx.category}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-400 block">
                      {formatDate(tx.transaction_date)}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-base font-extrabold block ${
                      isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isExpense ? '-' : '+'} {formatCurrency(tx.amount, currency)}
                  </span>
                  <span
                    className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isExpense
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {tx.type}
                  </span>
                </div>
              </div>

              {tx.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  {tx.description}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => onEdit(tx)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 active:bg-slate-200 dark:active:bg-slate-700"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(tx.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 active:bg-rose-100 dark:active:bg-rose-900"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction record? This action cannot be undone."
        confirmText="Delete Record"
        isLoading={isDeleting}
      />
    </>
  );
}

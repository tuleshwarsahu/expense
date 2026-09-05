import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import CategoryModal from '../components/categories/CategoryModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useCategories } from '../hooks/useCategories';
import { ICON_MAP } from '../lib/constants';
import { Tag, Plus, Trash2 } from 'lucide-react';
import Toast from '../components/common/Toast';

export default function Categories() {
  const { categories, loading, addCategory, deleteCategory } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCatId, setDeleteCatId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  const handleAddCategory = async (newCat) => {
    await addCategory(newCat);
    setToastMessage('Category created successfully!');
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCatId) return;
    try {
      await deleteCategory(deleteCatId);
      setToastMessage('Category removed successfully!');
      setDeleteCatId(null);
    } catch (err) {
      console.error('Delete category error:', err);
    }
  };

  return (
    <AppLayout title="Categories Manager">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your spending and income categories
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Category</span>
          </button>
        </div>

        {/* Expense Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Expense Categories ({expenseCategories.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {expenseCategories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || ICON_MAP[cat.name] || Tag;
              const isCustom = Boolean(cat.id);

              return (
                <div
                  key={cat.id || cat.name}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {isCustom ? 'Custom' : 'System Default'}
                      </span>
                    </div>
                  </div>

                  {isCustom && (
                    <button
                      onClick={() => setDeleteCatId(cat.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Income Categories */}
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Income Categories ({incomeCategories.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {incomeCategories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || ICON_MAP[cat.name] || Tag;
              const isCustom = Boolean(cat.id);

              return (
                <div
                  key={cat.id || cat.name}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {isCustom ? 'Custom' : 'System Default'}
                      </span>
                    </div>
                  </div>

                  {isCustom && (
                    <button
                      onClick={() => setDeleteCatId(cat.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCategory={handleAddCategory}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteCatId)}
        onClose={() => setDeleteCatId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Category"
        message="Are you sure you want to remove this category?"
        confirmText="Remove"
      />

      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage(null)}
      />
    </AppLayout>
  );
}

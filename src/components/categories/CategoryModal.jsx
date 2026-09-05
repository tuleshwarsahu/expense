import React, { useState } from 'react';
import Modal from '../common/Modal';
import { ICON_MAP } from '../../lib/constants';
import { Tag } from 'lucide-react';

export default function CategoryModal({ isOpen, onClose, onAddCategory }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [selectedIcon, setSelectedIcon] = useState('Tag');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableIcons = Object.keys(ICON_MAP);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onAddCategory({
        name: name.trim(),
        type,
        icon: selectedIcon
      });
      setName('');
      setSelectedIcon('Tag');
      onClose();
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Custom Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
            {error}
          </div>
        )}

        {/* Category Type */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              if (error) setError(null);
            }}
            className={`py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Expense Category
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              if (error) setError(null);
            }}
            className={`py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Income Category
          </button>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Category Name
          </label>
          <input
            type="text"
            placeholder="e.g. Subscriptions, Side Hustle..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Icon Grid */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Select Icon
          </label>
          <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-200 dark:border-slate-800 rounded-xl">
            {availableIcons.map((iconKey) => {
              const IconComp = ICON_MAP[iconKey] || Tag;
              const isSelected = selectedIcon === iconKey;
              return (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() => setSelectedIcon(iconKey)}
                  className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-600 ring-offset-1 dark:ring-offset-slate-900'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  title={iconKey}
                >
                  <IconComp className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

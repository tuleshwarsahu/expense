import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { useAuth } from '../../context/AuthContext';
import { CURRENCIES } from '../../lib/constants';
import { Tag, Calendar, FileText } from 'lucide-react';

export default function TransactionFormModal({
  isOpen,
  onClose,
  onSuccess,
  transactionToEdit = null
}) {
  const { profile } = useAuth();
  const { categories } = useCategories();
  const { addTransaction, updateTransaction } = useTransactions();

  const userCurrency = CURRENCIES.find((c) => c.code === (profile?.currency || 'INR')) || { symbol: '₹' };

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Filter categories by selected type
  const availableCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type || 'expense');
      setAmount(transactionToEdit.amount ? String(transactionToEdit.amount) : '');
      setCategory(transactionToEdit.category || '');
      setDescription(transactionToEdit.description || '');
      setDate(transactionToEdit.transaction_date || new Date().toISOString().split('T')[0]);
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setErrors({});
  }, [transactionToEdit, isOpen]);

  // Set default category when type changes
  useEffect(() => {
    if (!transactionToEdit && availableCategories.length > 0 && !category) {
      setCategory(availableCategories[0].name);
    }
  }, [type, availableCategories, category, transactionToEdit]);

  const validate = () => {
    const errs = {};
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    }
    if (!category) {
      errs.category = 'Please select a category';
    }
    if (!date) {
      errs.date = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        type,
        amount: parseFloat(amount),
        category,
        description,
        transaction_date: date
      };

      if (transactionToEdit) {
        await updateTransaction(transactionToEdit.id, payload);
        if (onSuccess) onSuccess('Transaction updated successfully!');
      } else {
        await addTransaction(payload);
        if (onSuccess) onSuccess('Transaction added successfully!');
      }

      onClose();
    } catch (err) {
      console.error('Submit transaction error:', err);
      setErrors({ submit: err.message || 'Failed to save transaction' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
            {errors.submit}
          </div>
        )}

        {/* Type Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              const expenseCats = categories.filter((c) => c.type === 'expense');
              if (expenseCats.length > 0) setCategory(expenseCats[0].name);
            }}
            className={`py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              const incomeCats = categories.filter((c) => c.type === 'income');
              if (incomeCats.length > 0) setCategory(incomeCats[0].name);
            }}
            className={`py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Amount ({userCurrency.symbol})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
              {userCurrency.symbol}
            </span>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                errors.amount ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Category Picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Category
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors appearance-none"
            >
              {!availableCategories.some((cat) => cat.name === category) && category && (
                <option value={category}>{category} (Archived/Deleted)</option>
              )}
              {availableCategories.map((cat) => (
                <option key={cat.id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="text-xs text-rose-500 mt-1">{errors.category}</p>
          )}
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
            />
          </div>
          {errors.date && (
            <p className="text-xs text-rose-500 mt-1">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Description (Optional)
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <textarea
              rows={2}
              maxLength={200}
              placeholder="e.g. Dinner with friends, Grocery store..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
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
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium text-sm transition-all shadow-lg ${
              type === 'expense'
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            } disabled:opacity-50`}
          >
            {loading ? 'Saving...' : transactionToEdit ? 'Update Record' : 'Add Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

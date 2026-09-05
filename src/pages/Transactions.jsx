import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../context/AuthContext';
import { exportToPDF } from '../lib/utils';
import { TableSkeleton } from '../components/common/Skeleton';
import Toast from '../components/common/Toast';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Transactions() {
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const { categories } = useCategories();

  const userCurrency = profile?.currency || 'INR';

  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: searchParams.get('category') || 'all',
    datePreset: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'newest'
  });

  const {
    transactions,
    loading,
    refetchTransactions,
    deleteTransaction
  } = useTransactions(filters);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [searchParams]);

  const handleFilterChange = (updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleExport = () => {
    exportToPDF(transactions, userCurrency, `transactions_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleEdit = (tx) => {
    setEditingTransaction(tx);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    setToastMessage('Transaction deleted successfully!');
  };

  return (
    <AppLayout title="Transaction History" onTransactionAdded={refetchTransactions}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              All Records
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your expenses and income
            </p>
          </div>
          {/* Add Record Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>

        {/* Filter Controls */}
        <TransactionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
          onExportPDF={handleExport}
        />

        {/* Transaction Table / Cards */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <TransactionTable
            transactions={transactions}
            currency={userCurrency}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}
      </div>

      {/* Add Modal */}
      <TransactionFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(msg) => {
          setToastMessage(msg || 'Transaction added successfully!');
          refetchTransactions();
        }}
      />

      {/* Edit Modal */}
      {editingTransaction && (
        <TransactionFormModal
          isOpen={Boolean(editingTransaction)}
          onClose={() => setEditingTransaction(null)}
          onSuccess={(msg) => {
            setToastMessage(msg);
            refetchTransactions();
          }}
          transactionToEdit={editingTransaction}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage(null)}
      />
    </AppLayout>
  );
}

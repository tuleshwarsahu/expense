import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../context/AuthContext';
import { exportToCSV } from '../lib/utils';
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
    exportToCSV(transactions, `transactions_${new Date().toISOString().split('T')[0]}.csv`);
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
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              All Records
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage, filter, and export your expense and income records
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <TransactionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
          onExportCSV={handleExport}
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
            onOpenAddModal={() => {}}
          />
        )}
      </div>

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

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import TransactionFormModal from '../transactions/TransactionFormModal';
import Toast from '../common/Toast';

export default function AppLayout({ children, title = 'Dashboard', onTransactionAdded }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSuccess = (msg) => {
    setToastMessage(msg || 'Transaction added successfully!');
    setToastType('success');
    if (onTransactionAdded) {
      onTransactionAdded();
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors select-none md:select-auto">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8">
        <Navbar onOpenAddModal={handleOpenAddModal} title={title} />
        
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenAddModal={handleOpenAddModal} />

      {/* Global Add Transaction Modal */}
      <TransactionFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleSuccess}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

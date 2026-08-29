import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { ExpenseFiltersBar } from './components/ExpenseFiltersBar';
import { ExpenseTable } from './components/ExpenseTable';
import { ExpenseCharts } from './components/ExpenseCharts';
import { ExpenseFormModal } from './components/ExpenseFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { DatabaseModal } from './components/DatabaseModal';
import { ExportModal } from './components/ExportModal';
import { Expense, Category, ExpenseStats, DbStatus, ExpenseFilters, ExpenseListResponse } from './types';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  // State: Data
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);

  // State: Loading & Pagination
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const limit = 25;

  // State: Filters
  const [filters, setFilters] = useState<ExpenseFilters>({
    search: '',
    category: '',
    payment_method: '',
    status: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    order: 'desc',
    page: 1,
    limit: 25,
  });

  // State: Modals & Editing
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // State: Toast Alerts
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Fetch Database Status
  const fetchDbStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/db/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (e) {
      console.warn('DB Status check note:', e);
    }
  }, []);

  // 2. Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.warn('Categories load note:', e);
    }
  }, []);

  // 3. Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.warn('Stats load note:', e);
    }
  }, []);

  // 4. Fetch Expenses with active filters & pagination
  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.category) queryParams.set('category', filters.category);
      if (filters.payment_method) queryParams.set('payment_method', filters.payment_method);
      if (filters.status) queryParams.set('status', filters.status);
      if (filters.startDate) queryParams.set('startDate', filters.startDate);
      if (filters.endDate) queryParams.set('endDate', filters.endDate);
      if (filters.minAmount) queryParams.set('minAmount', filters.minAmount);
      if (filters.maxAmount) queryParams.set('maxAmount', filters.maxAmount);
      queryParams.set('sortBy', filters.sortBy);
      queryParams.set('order', filters.order);
      queryParams.set('page', String(filters.page));
      queryParams.set('limit', String(limit));

      const res = await fetch(`/api/expenses?${queryParams.toString()}`);
      if (res.ok) {
        const data: ExpenseListResponse = await res.json();
        setExpenses(data.expenses);
        setTotalResults(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setPage(data.pagination.page);
      }
    } catch (e: any) {
      console.error('Error fetching expenses:', e);
      showToast('Could not load expenses from server', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters, limit]);

  // Initial Load
  useEffect(() => {
    fetchDbStatus();
    fetchCategories();
    fetchStats();
  }, [fetchDbStatus, fetchCategories, fetchStats]);

  // Refetch expenses when filters change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchExpenses();
    }, 200);
    return () => clearTimeout(handler);
  }, [fetchExpenses]);

  // Refresh All Data
  const handleRefreshAll = () => {
    fetchDbStatus();
    fetchStats();
    fetchExpenses();
    showToast('Data synchronized with database tier');
  };

  // Filter Updates
  const handleFilterChange = (updated: Partial<ExpenseFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      payment_method: '',
      status: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date',
      order: 'desc',
      page: 1,
      limit: 25,
    });
  };

  // CRUD Handler: Create or Update Expense
  const handleSaveExpense = async (expenseData: Partial<Expense>): Promise<boolean> => {
    try {
      const isEditing = Boolean(expenseData.id);
      const url = isEditing ? `/api/expenses/${expenseData.id}` : '/api/expenses';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save expense');
      }

      showToast(isEditing ? 'Expense updated in PostgreSQL database' : 'New expense recorded successfully');
      fetchExpenses();
      fetchStats();
      fetchDbStatus();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
      return false;
    }
  };

  // CRUD Handler: Delete Expense
  const handleDeleteExpense = async (id: number) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete expense');
      }

      showToast('Expense removed from database');
      fetchExpenses();
      fetchStats();
      fetchDbStatus();
    } catch (err: any) {
      showToast(err.message || 'Could not delete expense', 'error');
    }
  };

  // Quick Status Update directly from table row dropdown
  const handleQuickStatusChange = async (id: number, newStatus: 'Paid' | 'Pending' | 'Reimbursed') => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setExpenses((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        fetchStats();
        showToast(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#00FF41] selection:text-[#0F0F0F]">
      {/* 1. Presentation Navigation Bar */}
      <Navbar
        dbStatus={dbStatus}
        isLoading={isLoading}
        onRefresh={handleRefreshAll}
        onOpenAddModal={() => {
          setEditingExpense(null);
          setIsAddModalOpen(true);
        }}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Notification Toast */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 border-2 font-mono text-xs uppercase font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-[#141414] text-[#00FF41] border-[#00FF41]'
                : 'bg-[#141414] text-[#FF3333] border-[#FF3333]'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#FF3333] shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Overview Stats Cards */}
        <StatsCards stats={stats} isLoading={isLoading} />

        {/* Visual Charts & Category Share */}
        <ExpenseCharts stats={stats} />

        {/* Search & Filter Toolbar */}
        <ExpenseFiltersBar
          filters={filters}
          categories={categories}
          totalResults={totalResults}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Expenses Data Table (CRUD Presentation) */}
        <ExpenseTable
          expenses={expenses}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          totalResults={totalResults}
          limit={limit}
          onPageChange={(newPage) => handleFilterChange({ page: newPage })}
          onEdit={(exp) => {
            setEditingExpense(exp);
            setIsAddModalOpen(true);
          }}
          onDelete={(exp) => setDeletingExpense(exp)}
          onQuickStatusChange={handleQuickStatusChange}
          onOpenAddModal={() => {
            setEditingExpense(null);
            setIsAddModalOpen(true);
          }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#F5F5F5]/20 bg-[#141414] py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#F5F5F5]/60 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F5F5F5] uppercase tracking-wider">LOCAL 3-TIER EXPENSE ENGINE</span>
            <span>&bull;</span>
            <span className="text-[#00FF41] font-black uppercase">POSTGRESQL + NODE/EXPRESS + REACT 19</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDbModalOpen(true)}
              className="text-[#F5F5F5]/80 hover:text-[#00FF41] font-bold uppercase tracking-wider transition-colors"
            >
              [INSPECT DATA TIER &amp; DDL SCHEMA]
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExpenseFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSaveExpense}
        editingExpense={editingExpense}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingExpense)}
        expense={deletingExpense}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleDeleteExpense}
      />

      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        dbStatus={dbStatus}
        onRefreshStatus={fetchDbStatus}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        expenses={expenses}
      />
    </div>
  );
}

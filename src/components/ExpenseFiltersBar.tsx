import React from 'react';
import { Search, Calendar, ArrowUpDown, X } from 'lucide-react';
import { Category, ExpenseFilters } from '../types';

interface ExpenseFiltersBarProps {
  filters: ExpenseFilters;
  categories: Category[];
  totalResults: number;
  onFilterChange: (updated: Partial<ExpenseFilters>) => void;
  onResetFilters: () => void;
}

export const ExpenseFiltersBar: React.FC<ExpenseFiltersBarProps> = ({
  filters,
  categories,
  totalResults,
  onFilterChange,
  onResetFilters,
}) => {
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category ||
    filters.payment_method ||
    filters.status ||
    filters.startDate ||
    filters.endDate ||
    filters.minAmount ||
    filters.maxAmount ||
    filters.sortBy !== 'date' ||
    filters.order !== 'desc'
  );

  return (
    <div className="bg-[#141414] p-5 border-2 border-[#F5F5F5]/20 mb-6 space-y-4">
      {/* Top row: Search input & primary dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-[#00FF41] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="expense-search-input"
            type="text"
            placeholder="SEARCH ENTRY OR KEYWORD..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="w-full pl-9 pr-8 py-2.5 text-xs font-bold bg-[#0F0F0F] border-2 border-[#F5F5F5]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/30 focus:border-[#00FF41] outline-none uppercase tracking-wider transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '', page: 1 })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F5F5F5]/50 hover:text-[#00FF41]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="lg:col-span-3">
          <select
            id="category-filter-select"
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
            className="w-full py-2.5 px-3 text-xs font-bold bg-[#0F0F0F] border-2 border-[#F5F5F5]/30 text-[#F5F5F5] focus:border-[#00FF41] outline-none uppercase tracking-wider transition-all cursor-pointer"
          >
            <option value="" className="bg-[#0F0F0F] text-[#F5F5F5]">ALL CATEGORIES</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name} className="bg-[#0F0F0F] text-[#F5F5F5]">
                {cat.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div className="lg:col-span-2">
          <select
            id="payment-method-select"
            value={filters.payment_method}
            onChange={(e) => onFilterChange({ payment_method: e.target.value, page: 1 })}
            className="w-full py-2.5 px-3 text-xs font-bold bg-[#0F0F0F] border-2 border-[#F5F5F5]/30 text-[#F5F5F5] focus:border-[#00FF41] outline-none uppercase tracking-wider transition-all cursor-pointer"
          >
            <option value="" className="bg-[#0F0F0F] text-[#F5F5F5]">ALL PAYMENT MODES</option>
            <option value="Credit Card" className="bg-[#0F0F0F] text-[#F5F5F5]">CREDIT CARD</option>
            <option value="Debit Card" className="bg-[#0F0F0F] text-[#F5F5F5]">DEBIT CARD</option>
            <option value="Bank Transfer" className="bg-[#0F0F0F] text-[#F5F5F5]">BANK TRANSFER</option>
            <option value="Cash" className="bg-[#0F0F0F] text-[#F5F5F5]">CASH</option>
            <option value="Apple Pay / UPI" className="bg-[#0F0F0F] text-[#F5F5F5]">APPLE PAY / UPI</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-2">
          <select
            id="status-filter-select"
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
            className="w-full py-2.5 px-3 text-xs font-bold bg-[#0F0F0F] border-2 border-[#F5F5F5]/30 text-[#F5F5F5] focus:border-[#00FF41] outline-none uppercase tracking-wider transition-all cursor-pointer"
          >
            <option value="" className="bg-[#0F0F0F] text-[#F5F5F5]">ALL STATUSES</option>
            <option value="Paid" className="bg-[#0F0F0F] text-[#F5F5F5]">PAID</option>
            <option value="Pending" className="bg-[#0F0F0F] text-[#F5F5F5]">PENDING</option>
            <option value="Reimbursed" className="bg-[#0F0F0F] text-[#F5F5F5]">REIMBURSED</option>
          </select>
        </div>

        {/* Sort Order Toggle */}
        <div className="lg:col-span-1 flex items-center justify-end">
          <button
            id="sort-toggle-btn"
            onClick={() =>
              onFilterChange({
                order: filters.order === 'desc' ? 'asc' : 'desc',
              })
            }
            className="p-2.5 text-[#F5F5F5] bg-[#0F0F0F] hover:bg-[#262626] border-2 border-[#F5F5F5]/30 hover:border-[#00FF41] hover:text-[#00FF41] transition-all flex items-center justify-center gap-1.5 w-full text-xs font-mono font-bold uppercase"
            title={`Sorted by ${filters.sortBy} (${filters.order.toUpperCase()}) - Click to toggle order`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="lg:hidden">{filters.order.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Date Filters, Sort column, & Results count */}
      <div className="pt-3 border-t-2 border-[#F5F5F5]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <div className="flex items-center gap-1.5 bg-[#0F0F0F] px-3 py-1.5 border border-[#F5F5F5]/20">
            <Calendar className="w-3.5 h-3.5 text-[#00FF41]" />
            <span className="text-[#F5F5F5]/50 text-[10px] uppercase font-bold">FROM:</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange({ startDate: e.target.value, page: 1 })}
              className="bg-transparent text-[#F5F5F5] focus:outline-none text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#0F0F0F] px-3 py-1.5 border border-[#F5F5F5]/20">
            <Calendar className="w-3.5 h-3.5 text-[#00FF41]" />
            <span className="text-[#F5F5F5]/50 text-[10px] uppercase font-bold">TO:</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange({ endDate: e.target.value, page: 1 })}
              className="bg-transparent text-[#F5F5F5] focus:outline-none text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#0F0F0F] px-3 py-1.5 border border-[#F5F5F5]/20">
            <span className="text-[#F5F5F5]/50 text-[10px] uppercase font-bold">SORT:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any, page: 1 })}
              className="bg-transparent text-[#F5F5F5] focus:outline-none text-xs font-bold uppercase cursor-pointer"
            >
              <option value="date" className="bg-[#0F0F0F] text-[#F5F5F5]">DATE</option>
              <option value="amount" className="bg-[#0F0F0F] text-[#F5F5F5]">AMOUNT</option>
              <option value="title" className="bg-[#0F0F0F] text-[#F5F5F5]">TITLE</option>
            </select>
          </div>
        </div>

        {/* Results & Reset */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs uppercase text-[#F5F5F5]/60">
            MATCHED: <strong className="text-[#00FF41] font-black">{totalResults}</strong>
          </span>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-[#00FF41] hover:text-white font-black uppercase text-xs tracking-wider transition-colors"
            >
              <X className="w-3 h-3" />
              <span>RESET FILTERS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

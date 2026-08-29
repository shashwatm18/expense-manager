import React from 'react';
import { Plus, Database, Download, RefreshCw, Layers, CheckCircle2, Radio } from 'lucide-react';
import { DbStatus } from '../types';

interface NavbarProps {
  dbStatus: DbStatus | null;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenAddModal: () => void;
  onOpenDbModal: () => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  dbStatus,
  isLoading,
  onRefresh,
  onOpenAddModal,
  onOpenDbModal,
  onOpenExportModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0F0F0F] text-[#F5F5F5] border-b-4 border-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 sm:py-6">
          {/* Logo & 3-Tier Badge */}
          <div className="flex items-baseline gap-4 sm:gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none select-none">
                EXPENSES<span className="text-[#00FF41]">.</span>
              </h1>
              <div className="flex items-center gap-3 mt-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#F5F5F5]/60">
                <span className="text-[#00FF41] font-bold">3-TIER ARCHITECTURE</span>
                <span className="hidden md:inline">&bull;</span>
                <span className="hidden md:inline">REACT &bull; NODE.JS &bull; POSTGRESQL</span>
              </div>
            </div>
          </div>

          {/* Action Controls & DB Status Badge */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Live Database Status Indicator Button */}
            <button
              id="db-status-btn"
              onClick={onOpenDbModal}
              title="Click to inspect 3-Tier Database Connection & Schema"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 border-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                dbStatus?.isPostgres
                  ? 'border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41] hover:bg-[#00FF41] hover:text-[#0F0F0F]'
                  : 'border-[#F5F5F5]/40 bg-[#1A1A1A] text-[#F5F5F5] hover:border-[#00FF41]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${dbStatus?.isPostgres ? 'bg-[#00FF41] animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden lg:inline text-[10px] opacity-70">PG_DB:</span>
              <span>{dbStatus?.isPostgres ? 'CONNECTED' : 'LOCAL'}</span>
            </button>

            {/* Refresh Data Button */}
            <button
              id="refresh-btn"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2.5 border-2 border-[#F5F5F5]/30 bg-[#1A1A1A] text-[#F5F5F5] hover:border-[#00FF41] hover:text-[#00FF41] transition-all disabled:opacity-50"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#00FF41]' : ''}`} />
            </button>

            {/* Export Button */}
            <button
              id="export-btn"
              onClick={onOpenExportModal}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 border-2 border-[#F5F5F5]/30 bg-[#1A1A1A] hover:bg-[#262626] hover:border-[#F5F5F5] text-[#F5F5F5] text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#00FF41]" />
              <span>EXPORT</span>
            </button>

            {/* Add Expense CTA */}
            <button
              id="add-expense-nav-btn"
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-[#00FF41] hover:bg-[#F5F5F5] text-[#0F0F0F] text-xs sm:text-sm font-black uppercase tracking-tight transition-all active:scale-95 shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ADD ENTRY</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

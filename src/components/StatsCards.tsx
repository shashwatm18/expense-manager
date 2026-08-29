import React, { useState } from 'react';
import { DollarSign, TrendingUp, Clock, PieChart, Target, Edit2, Check } from 'lucide-react';
import { ExpenseStats } from '../types';

interface StatsCardsProps {
  stats: ExpenseStats | null;
  isLoading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const [monthlyBudget, setMonthlyBudget] = useState<number>(3000);
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const [tempBudget, setTempBudget] = useState<string>('3000');

  const totalSpent = stats?.totalSpent ?? 0;
  const expenseCount = stats?.expenseCount ?? 0;
  const averageExpense = stats?.averageExpense ?? 0;
  const pendingTotal = stats?.pendingTotal ?? 0;
  const topCategory = stats?.byCategory && stats.byCategory.length > 0 ? stats.byCategory[0] : null;

  const budgetUsagePercent = monthlyBudget > 0 ? Math.min(Math.round((totalSpent / monthlyBudget) * 100), 100) : 0;
  const isBudgetExceeded = totalSpent > monthlyBudget;

  const handleSaveBudget = () => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
    }
    setIsEditingBudget(false);
  };

  const totalSpentInt = Math.floor(totalSpent);
  const totalSpentDec = (totalSpent % 1).toFixed(2).substring(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Expenses Card */}
      <div id="stat-card-total" className="bg-[#141414] p-6 border-2 border-[#F5F5F5]/20 hover:border-[#00FF41] transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] font-black text-[#00FF41]">
              Total Outbound
            </span>
            <div className="w-7 h-7 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 flex items-center justify-center font-mono text-xs font-bold">
              $
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-4xl sm:text-5xl font-black text-[#F5F5F5] tracking-tighter leading-none">
              ${totalSpentInt.toLocaleString()}
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#F5F5F5]/40 tracking-tight ml-0.5">
              {totalSpentDec}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#F5F5F5]/10 flex items-center justify-between text-[11px] font-mono text-[#F5F5F5]/60 uppercase">
          <span>Logged Records</span>
          <span className="font-black text-[#F5F5F5]">{expenseCount} TXNS</span>
        </div>
      </div>

      {/* 2. Monthly Budget Progress Card */}
      <div id="stat-card-budget" className="bg-[#141414] p-6 border-2 border-[#F5F5F5]/20 hover:border-[#00FF41] transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.25em] font-black text-[#00FF41]">
                Monthly Cap
              </span>
              {!isEditingBudget ? (
                <button
                  onClick={() => {
                    setTempBudget(monthlyBudget.toString());
                    setIsEditingBudget(true);
                  }}
                  className="text-[#F5F5F5]/40 hover:text-[#00FF41] transition-colors"
                  title="Edit monthly budget cap"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={handleSaveBudget}
                  className="text-[#00FF41] hover:text-white transition-colors"
                  title="Save budget"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="w-7 h-7 bg-[#1E1E1E] text-[#F5F5F5] border border-[#F5F5F5]/20 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-[#00FF41]" />
            </div>
          </div>

          {isEditingBudget ? (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-black text-[#00FF41]">$</span>
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveBudget()}
                className="w-full px-2 py-1 text-2xl font-black bg-[#0F0F0F] border-2 border-[#00FF41] text-[#F5F5F5] focus:outline-none"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl sm:text-4xl font-black text-[#F5F5F5] tracking-tighter">
                ${monthlyBudget.toLocaleString()}
              </span>
              <span className={`text-xs font-mono font-black uppercase ${isBudgetExceeded ? 'text-[#FF3333]' : 'text-[#00FF41]'}`}>
                {budgetUsagePercent}% USED
              </span>
            </div>
          )}

          {/* Bold Progress Bar */}
          <div className="w-full bg-[#262626] h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isBudgetExceeded ? 'bg-[#FF3333]' : budgetUsagePercent > 80 ? 'bg-amber-400' : 'bg-[#00FF41]'
              }`}
              style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F5F5F5]/10 flex justify-between text-[11px] font-mono text-[#F5F5F5]/60 uppercase">
          <span>Remaining Cap:</span>
          <span className={`font-bold ${isBudgetExceeded ? 'text-[#FF3333]' : 'text-[#00FF41]'}`}>
            ${Math.max(0, monthlyBudget - totalSpent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* 3. Average Expense & Velocity */}
      <div id="stat-card-avg" className="bg-[#141414] p-6 border-2 border-[#F5F5F5]/20 hover:border-[#00FF41] transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] font-black text-[#00FF41]">
              Average Ticket
            </span>
            <div className="w-7 h-7 bg-[#1E1E1E] text-[#F5F5F5] border border-[#F5F5F5]/20 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-[#00FF41]" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-4xl sm:text-5xl font-black text-[#F5F5F5] tracking-tighter leading-none">
              ${Math.floor(averageExpense).toLocaleString()}
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#F5F5F5]/40 tracking-tight ml-0.5">
              {(averageExpense % 1).toFixed(2).substring(1)}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#F5F5F5]/10 text-[11px] font-mono text-[#F5F5F5]/60 uppercase flex justify-between">
          <span>Mean Outlay</span>
          <span className="font-bold text-[#F5F5F5]">PER TRANSACTION</span>
        </div>
      </div>

      {/* 4. Top Category & Pending Status */}
      <div id="stat-card-top-cat" className="bg-[#141414] p-6 border-2 border-[#F5F5F5]/20 hover:border-[#00FF41] transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] font-black text-[#00FF41]">
              Top Sector
            </span>
            <div className="w-7 h-7 bg-[#1E1E1E] text-[#F5F5F5] border border-[#F5F5F5]/20 flex items-center justify-center">
              <PieChart className="w-3.5 h-3.5 text-[#00FF41]" />
            </div>
          </div>
          {topCategory ? (
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#F5F5F5] tracking-tighter uppercase truncate">
                  {topCategory.category}
                </span>
                <span className="text-xs font-mono font-black text-[#0F0F0F] bg-[#00FF41] px-2 py-0.5 uppercase tracking-wider shrink-0">
                  {topCategory.percentage}%
                </span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-[#F5F5F5]/60 uppercase">
                ${topCategory.total.toLocaleString('en-US', { minimumFractionDigits: 2 })} &bull; {topCategory.count} ITEMS
              </div>
            </div>
          ) : (
            <div className="text-xs font-mono text-[#F5F5F5]/40 py-2 uppercase">NO CATEGORY DATA</div>
          )}
        </div>

        {pendingTotal > 0 ? (
          <div className="mt-4 pt-3 border-t border-[#F5F5F5]/10 flex items-center justify-between text-[11px] font-mono text-amber-400 uppercase">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> PENDING:
            </span>
            <span className="font-bold">${pendingTotal.toFixed(2)}</span>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-[#F5F5F5]/10 text-[11px] font-mono text-[#00FF41] uppercase">
            ALL SETTLED
          </div>
        )}
      </div>
    </div>
  );
};

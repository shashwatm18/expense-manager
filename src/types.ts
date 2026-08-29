export interface Expense {
  id: number;
  title: string;
  amount: number;
  category_id?: number | null;
  category_name: string;
  date: string; // ISO format 'YYYY-MM-DD'
  payment_method: string;
  status: 'Paid' | 'Pending' | 'Reimbursed';
  notes?: string | null;
  receipt_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  created_at?: string;
}

export interface CategoryStat {
  category: string;
  total: number;
  count: number;
  percentage: number;
  color: string;
}

export interface PaymentMethodStat {
  payment_method: string;
  total: number;
  count: number;
}

export interface MonthlyStat {
  month: string; // 'YYYY-MM'
  month_name: string; // 'Jan 2025'
  total: number;
  count: number;
}

export interface ExpenseStats {
  totalSpent: number;
  expenseCount: number;
  averageExpense: number;
  pendingTotal: number;
  highestExpense: { title: string; amount: number; category: string } | null;
  byCategory: CategoryStat[];
  byPaymentMethod: PaymentMethodStat[];
  byMonth: MonthlyStat[];
}

export interface DbStatus {
  isConnected: boolean;
  isPostgres: boolean;
  mode: 'PostgreSQL (Live Data Tier)' | 'Local In-Memory / Dev Emulation';
  host: string;
  port: number | string;
  database: string;
  user: string;
  rowCount: number;
  categoriesCount: number;
  latencyMs: number;
  serverTime: string;
  message: string;
}

export interface ExpenseFilters {
  search: string;
  category: string;
  payment_method: string;
  status: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  sortBy: 'date' | 'amount' | 'title' | 'id';
  order: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface ExpenseListResponse {
  expenses: Expense[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: Partial<ExpenseFilters>;
}

export interface Expense {
  id: string;
  amount: number;
  date: string; // ISO Date string YYYY-MM-DD
  category: string;
  subcategory: string;
  description: string;
  timestamp: number;
}

export interface RecurringExpense {
  id: string;
  amount: number;
  category: string;
  subcategory: string;
  description: string;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  subcategories: string[];
  color: string;
  icon: string;
}

export type ViewState = 'dashboard' | 'add' | 'list' | 'settings';

export interface MonthlyStats {
  total: number;
  byCategory: Record<string, number>;
  expenses: Expense[];
}

export interface AppData {
  expenses: Expense[];
  categories: CategoryDefinition[];
  recurringExpenses: RecurringExpense[];
  version: number;
  exportedAt: string;
}
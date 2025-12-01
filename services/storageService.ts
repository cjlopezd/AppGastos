import { Expense, CategoryDefinition, RecurringExpense, AppData } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

const EXPENSES_KEY = 'gastos_app_data';
const CATEGORIES_KEY = 'gastos_app_categories';
const RECURRING_KEY = 'gastos_app_recurring';

// Expenses
export const getExpenses = (): Expense[] => {
  try {
    const data = localStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading expenses', error);
    return [];
  }
};

export const saveExpense = (expense: Expense): Expense[] => {
  const expenses = getExpenses();
  const newExpenses = [expense, ...expenses]; // Add to top
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(newExpenses));
  return newExpenses;
};

export const saveExpensesBatch = (newExpensesList: Expense[]): Expense[] => {
    const currentExpenses = getExpenses();
    const updated = [...newExpensesList, ...currentExpenses];
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
    return updated;
};

export const deleteExpense = (id: string): Expense[] => {
  const expenses = getExpenses();
  const newExpenses = expenses.filter(e => e.id !== id);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(newExpenses));
  return newExpenses;
};

// Categories
export const getCategories = (): CategoryDefinition[] => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Error reading categories', error);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: CategoryDefinition[]): CategoryDefinition[] => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  return categories;
};

// Recurring Expenses
export const getRecurringExpenses = (): RecurringExpense[] => {
    try {
      const data = localStorage.getItem(RECURRING_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading recurring expenses', error);
      return [];
    }
};
  
export const saveRecurringExpenses = (recurring: RecurringExpense[]): RecurringExpense[] => {
    localStorage.setItem(RECURRING_KEY, JSON.stringify(recurring));
    return recurring;
};

// Backup & Restore
export const getFullBackup = (): AppData => {
    return {
        expenses: getExpenses(),
        categories: getCategories(),
        recurringExpenses: getRecurringExpenses(),
        version: 1,
        exportedAt: new Date().toISOString()
    };
};

export const restoreBackup = (data: AppData): void => {
    if (data.expenses) localStorage.setItem(EXPENSES_KEY, JSON.stringify(data.expenses));
    if (data.categories) localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data.categories));
    if (data.recurringExpenses) localStorage.setItem(RECURRING_KEY, JSON.stringify(data.recurringExpenses));
};
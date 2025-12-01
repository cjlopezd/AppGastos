import React, { useState, useEffect } from 'react';
import { ViewState, Expense, CategoryDefinition, RecurringExpense, AppData } from './types';
import { 
  getExpenses, 
  saveExpense, 
  deleteExpense, 
  getCategories, 
  saveCategories,
  getRecurringExpenses,
  saveRecurringExpenses,
  saveExpensesBatch,
  restoreBackup
} from './services/storageService';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import { LayoutDashboard, PlusCircle, List, Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<CategoryDefinition[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);

  useEffect(() => {
    setExpenses(getExpenses());
    setCategories(getCategories());
    setRecurringExpenses(getRecurringExpenses());
  }, []);

  const handleSaveExpense = (expense: Expense) => {
    const updated = saveExpense(expense);
    setExpenses(updated);
    setView('list');
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
        const updated = deleteExpense(id);
        setExpenses(updated);
    }
  };

  const handleUpdateCategories = (updatedCategories: CategoryDefinition[]) => {
    const saved = saveCategories(updatedCategories);
    setCategories(saved);
  };

  const handleUpdateRecurring = (updatedRecurring: RecurringExpense[]) => {
    const saved = saveRecurringExpenses(updatedRecurring);
    setRecurringExpenses(saved);
  };

  const handleGenerateRecurring = (newExpenses: Expense[]) => {
    const saved = saveExpensesBatch(newExpenses);
    setExpenses(saved);
    setView('list');
  };

  const handleImportData = (data: AppData) => {
      restoreBackup(data);
      // Refresh state from storage
      setExpenses(getExpenses());
      setCategories(getCategories());
      setRecurringExpenses(getRecurringExpenses());
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-700 px-4 py-4 flex justify-between items-center max-w-md mx-auto w-full">
        <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            GastosApp
            </h1>
            <p className="text-xs text-slate-200">Familia & Cristopher</p>
        </div>
        <button 
            onClick={() => setView('settings')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${view === 'settings' ? 'bg-blue-600 text-white' : 'bg-slate-800 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500'}`}
        >
            <SettingsIcon className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="p-4 max-w-md mx-auto w-full min-h-[calc(100vh-80px)]">
        {view === 'dashboard' && <Dashboard expenses={expenses} categories={categories} />}
        {view === 'add' && (
            <ExpenseForm 
                onSave={handleSaveExpense} 
                onCancel={() => setView('dashboard')}
                categories={categories}
            />
        )}
        {view === 'list' && <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} categories={categories} />}
        {view === 'settings' && (
            <Settings 
                categories={categories} 
                recurringExpenses={recurringExpenses}
                onUpdateCategories={handleUpdateCategories}
                onUpdateRecurring={handleUpdateRecurring}
                onGenerateRecurring={handleGenerateRecurring}
                onImportData={handleImportData}
                onClose={() => setView('dashboard')}
            />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-700 pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
            <button 
                onClick={() => setView('dashboard')}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${view === 'dashboard' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
                <LayoutDashboard className="w-6 h-6" />
                <span className="text-[10px] font-medium">Resumen</span>
            </button>
            
            <button 
                onClick={() => setView('add')}
                className="flex flex-col items-center justify-center w-full h-full -mt-6"
            >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${view === 'add' ? 'bg-blue-500 scale-110 text-white' : 'bg-blue-600 text-white hover:scale-105'}`}>
                    <PlusCircle className="w-8 h-8" />
                </div>
            </button>

            <button 
                onClick={() => setView('list')}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${view === 'list' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
                <List className="w-6 h-6" />
                <span className="text-[10px] font-medium">Historial</span>
            </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
import React from 'react';
import { Expense, CategoryDefinition } from '../types';
import { getIconComponent } from '../constants';
import { Trash2, Calendar, Tag } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  categories: CategoryDefinition[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, categories }) => {
  // Sort by date descending
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedExpenses.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-300">
            <Tag className="w-12 h-12 mb-2 opacity-50" />
            <p>No hay gastos registrados aún.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {sortedExpenses.map((expense) => {
        // Find category by name to support backward compatibility or by ID logic if we switched to IDs
        // Assuming expense.category stores the Name string based on current ExpenseForm logic.
        const categoryDef = categories.find(c => c.name === expense.category);
        const Icon = categoryDef ? getIconComponent(categoryDef.icon) : getIconComponent('HelpCircle');
        const color = categoryDef?.color || '#64748b';
        
        return (
          <div key={expense.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm flex justify-between items-center group">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: color }}
              >
                {Icon}
              </div>
              <div>
                <p className="text-white font-semibold text-lg">${expense.amount.toLocaleString()}</p>
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: color }}>{expense.category}</span>
                    <span className="text-white text-sm">{expense.subcategory}</span>
                    {expense.description && <span className="text-slate-300 text-xs italic mt-0.5 truncate max-w-[150px]">{expense.description}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
                <div className="flex items-center text-slate-300 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {expense.date}
                </div>
                <button 
                    onClick={() => onDelete(expense.id)}
                    className="text-white hover:text-red-400 p-2 rounded-full hover:bg-slate-700/50 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
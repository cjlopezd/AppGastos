import React, { useState, useEffect } from 'react';
import { CategoryDefinition, Expense } from '../types';
import { Plus, Save, X } from 'lucide-react';

interface ExpenseFormProps {
  onSave: (expense: Expense) => void;
  onCancel: () => void;
  categories: CategoryDefinition[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSave, onCancel, categories }) => {
  // Safe default if categories are empty for some reason
  const defaultCategory = categories[0] || { id: '', name: '', subcategories: [] };
  
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState<string>(defaultCategory.id);
  const [subcategory, setSubcategory] = useState<string>(defaultCategory.subcategories[0] || '');
  const [description, setDescription] = useState<string>('');

  const selectedCategory = categories.find(c => c.id === categoryId) || defaultCategory;

  useEffect(() => {
    if (selectedCategory && selectedCategory.subcategories.length > 0) {
      setSubcategory(selectedCategory.subcategories[0]);
    } else {
      setSubcategory('');
    }
  }, [categoryId, selectedCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !categoryId) return;

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      date,
      category: selectedCategory?.name || categoryId,
      subcategory,
      description,
      timestamp: Date.now()
    };

    onSave(newExpense);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 animate-fade-in mb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Plus className="w-6 h-6 text-blue-400" />
          Registrar Gasto
        </h2>
        <button onClick={onCancel} className="text-white hover:text-blue-400 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Monto ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-slate-500"
            placeholder="0.00"
            required
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Categoría</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors text-left truncate ${
                  categoryId === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600'
                }`}
                style={{
                    backgroundColor: categoryId === cat.id ? cat.color : undefined,
                    borderColor: categoryId === cat.id ? cat.color : undefined
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Subcategoría</label>
          {selectedCategory.subcategories.length > 0 ? (
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              {selectedCategory.subcategories.map((sub) => (
                <option key={sub} value={sub} className="bg-slate-900 text-white">{sub}</option>
              ))}
            </select>
          ) : (
            <input 
               type="text"
               value={subcategory}
               onChange={(e) => setSubcategory(e.target.value)}
               placeholder="Escribe la subcategoría"
               className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
               required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Nota (Opcional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-500"
            placeholder="Detalle extra..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-95 flex justify-center items-center gap-2 mt-4"
        >
          <Save className="w-5 h-5" />
          Guardar Gasto
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
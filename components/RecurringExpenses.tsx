import React, { useState, useEffect } from 'react';
import { CategoryDefinition, RecurringExpense, Expense } from '../types';
import { Plus, Trash2, Save, X, CalendarCheck, Zap } from 'lucide-react';

interface RecurringExpensesProps {
  recurringExpenses: RecurringExpense[];
  categories: CategoryDefinition[];
  onUpdate: (recurring: RecurringExpense[]) => void;
  onGenerate: (expenses: Expense[]) => void;
}

const RecurringExpenses: React.FC<RecurringExpensesProps> = ({ 
  recurringExpenses, 
  categories, 
  onUpdate,
  onGenerate 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const defaultCategory = categories[0] || { id: '', name: '', subcategories: [] };

  // Form State
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(defaultCategory.id);
  const [subcategory, setSubcategory] = useState(defaultCategory.subcategories[0] || '');
  const [description, setDescription] = useState('');

  const selectedCategory = categories.find(c => c.id === categoryId) || defaultCategory;

  useEffect(() => {
    if (selectedCategory && selectedCategory.subcategories.length > 0) {
       // Only reset subcategory if the current one isn't valid for the new category
       if (!selectedCategory.subcategories.includes(subcategory)) {
           setSubcategory(selectedCategory.subcategories[0]);
       }
    } else {
      setSubcategory('');
    }
  }, [categoryId, selectedCategory]);

  const handleAdd = () => {
    if (!amount || !categoryId) return;
    
    const newRecurring: RecurringExpense = {
        id: crypto.randomUUID(),
        amount: parseFloat(amount),
        category: selectedCategory.name,
        subcategory,
        description
    };

    onUpdate([...recurringExpenses, newRecurring]);
    setIsAdding(false);
    setAmount('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
      onUpdate(recurringExpenses.filter(r => r.id !== id));
  };

  const handleGenerateToMonth = () => {
    if (recurringExpenses.length === 0) return;
    if (!confirm('¿Deseas agregar todos estos gastos fijos a tu historial con fecha de hoy?')) return;

    const today = new Date().toISOString().split('T')[0];
    const newExpenses: Expense[] = recurringExpenses.map(r => ({
        id: crypto.randomUUID(),
        amount: r.amount,
        date: today,
        category: r.category,
        subcategory: r.subcategory,
        description: r.description || 'Gasto Fijo Mensual',
        timestamp: Date.now()
    }));

    onGenerate(newExpenses);
    alert('Gastos agregados correctamente al historial.');
  };

  return (
    <div className="pb-20 animate-fade-in">
       {/* Header Action */}
       <div className="bg-gradient-to-r from-indigo-900 to-slate-800 p-6 rounded-2xl border border-indigo-500/30 mb-6 shadow-lg">
           <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Generación Rápida
                    </h3>
                    <p className="text-indigo-200 text-xs mt-1">
                        Carga todos tus gastos fijos al mes actual con un solo clic.
                    </p>
                </div>
           </div>
           <button 
                onClick={handleGenerateToMonth}
                disabled={recurringExpenses.length === 0}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2"
           >
                <CalendarCheck className="w-5 h-5" />
                Cargar al Mes Actual
           </button>
       </div>

       <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg">Configuración de Gastos</h3>
       </div>

       {/* Add Form */}
       {isAdding ? (
           <div className="bg-slate-800 p-5 rounded-2xl border border-slate-600 mb-4 shadow-xl">
               <div className="flex justify-between items-center mb-4">
                   <h4 className="text-white font-semibold">Nuevo Gasto Fijo</h4>
                   <button onClick={() => setIsAdding(false)}><X className="text-slate-400 w-5 h-5" /></button>
               </div>
               
               <div className="space-y-3">
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Monto</label>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Categoría</label>
                            <select 
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm outline-none"
                            >
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Subcategoría</label>
                             {selectedCategory.subcategories.length > 0 ? (
                                <select
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm outline-none"
                                >
                                {selectedCategory.subcategories.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                                </select>
                            ) : (
                                <input 
                                type="text"
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm outline-none"
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Descripción (Opcional)</label>
                        <input 
                            type="text" 
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Ej: Colegio Mensual"
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>
                    <button 
                        onClick={handleAdd}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl mt-2 flex justify-center items-center gap-2"
                    >
                        <Save className="w-5 h-5" /> Guardar
                    </button>
               </div>
           </div>
       ) : (
           <button 
                onClick={() => setIsAdding(true)}
                className="w-full py-4 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-blue-500 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mb-6"
           >
                <Plus className="w-5 h-5" />
                <span>Agregar Gasto Fijo</span>
           </button>
       )}

       {/* List */}
       <div className="space-y-3">
            {recurringExpenses.map(item => (
                <div key={item.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex justify-between items-center group">
                    <div>
                        <p className="text-white font-bold text-lg">${item.amount.toLocaleString()}</p>
                        <p className="text-blue-400 text-xs font-bold uppercase">{item.category} <span className="text-slate-400">• {item.subcategory}</span></p>
                        {item.description && <p className="text-slate-400 text-xs italic">{item.description}</p>}
                    </div>
                    <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-slate-700/50 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
            {recurringExpenses.length === 0 && !isAdding && (
                <p className="text-center text-slate-500 text-sm py-4">No tienes gastos fijos configurados.</p>
            )}
       </div>
    </div>
  );
};

export default RecurringExpenses;
import React, { useState } from 'react';
import { CategoryDefinition } from '../types';
import { getIconComponent, AVAILABLE_ICONS } from '../constants';
import { Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronUp, Check, AlertTriangle } from 'lucide-react';

interface CategoryManagerProps {
  categories: CategoryDefinition[];
  onUpdate: (categories: CategoryDefinition[]) => void;
  onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onUpdate, onClose }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<CategoryDefinition>({
    id: '',
    name: '',
    subcategories: [],
    color: '#3b82f6',
    icon: 'HelpCircle'
  });
  const [newSubcat, setNewSubcat] = useState('');

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      subcategories: [],
      color: '#3b82f6',
      icon: 'HelpCircle'
    });
    setNewSubcat('');
    setEditingId(null);
    setIsAddingNew(false);
  };

  const startEdit = (cat: CategoryDefinition) => {
    setEditingId(cat.id);
    setFormData({ ...cat });
    setIsAddingNew(false);
    setNewSubcat('');
  };

  const startAdd = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({
      id: crypto.randomUUID(),
      name: '',
      subcategories: [],
      color: '#3b82f6',
      icon: 'HelpCircle'
    });
    setNewSubcat('');
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('¿Estás seguro de borrar esta categoría? Los gastos existentes perderán su asociación.')) {
      onUpdate(categories.filter(c => c.id !== id));
      if (editingId === id) resetForm();
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (isAddingNew) {
      onUpdate([...categories, formData]);
    } else {
      onUpdate(categories.map(c => c.id === formData.id ? formData : c));
    }
    resetForm();
  };

  const addSubcategory = () => {
    if (newSubcat.trim()) {
      setFormData(prev => ({
        ...prev,
        subcategories: [...prev.subcategories, newSubcat.trim()]
      }));
      setNewSubcat('');
    }
  };

  const removeSubcategory = (sub: string) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(s => s !== sub)
    }));
  };

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold text-white">Categorías</h2>
        {/* If this component is used inside Settings tabs, the parent handles closing, but we keep the header structure */}
      </div>

      <div className="space-y-4">
        {/* Add New Button */}
        {!isAddingNew && !editingId && (
          <button 
            onClick={startAdd}
            className="w-full py-4 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-blue-500 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Categoría</span>
          </button>
        )}

        {/* Editor Form */}
        {(isAddingNew || editingId) && (
          <div className="bg-slate-800 p-6 rounded-2xl border border-blue-500 shadow-xl animate-fade-in">
             <div className="flex justify-between items-start mb-4">
               <h3 className="text-lg font-semibold text-white">
                 {isAddingNew ? 'Crear Categoría' : 'Editar Categoría'}
               </h3>
               <button onClick={resetForm} className="text-slate-400 hover:text-white">
                 <X className="w-5 h-5" />
               </button>
             </div>

             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Nombre</label>
                 <input 
                   type="text" 
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                   placeholder="Ej: Educación"
                 />
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Color</label>
                  <div className="flex items-center gap-2">
                      <input 
                          type="color" 
                          value={formData.color}
                          onChange={e => setFormData({...formData, color: e.target.value})}
                          className="h-10 w-full bg-slate-900 border border-slate-600 rounded-lg p-1 cursor-pointer"
                      />
                  </div>
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Icono</label>
                  <div className="grid grid-cols-6 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-600 max-h-40 overflow-y-auto custom-scrollbar">
                      {AVAILABLE_ICONS.map(iconName => (
                          <button
                              key={iconName}
                              type="button"
                              onClick={() => setFormData({...formData, icon: iconName})}
                              className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                                  formData.icon === iconName 
                                  ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-lg scale-105' 
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                              }`}
                          >
                              {React.cloneElement(getIconComponent(iconName) as React.ReactElement<any>, { className: "w-5 h-5" })}
                          </button>
                      ))}
                  </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Subcategorías</label>
                 <div className="flex flex-wrap gap-2 mb-3">
                    {formData.subcategories.map(sub => (
                        <div key={sub} className="bg-slate-700 px-3 py-1 rounded-full text-sm text-white flex items-center gap-1">
                            {sub}
                            <button onClick={() => removeSubcategory(sub)} className="hover:text-red-400">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {formData.subcategories.length === 0 && <span className="text-slate-500 text-sm italic">Sin subcategorías</span>}
                 </div>
                 <div className="flex gap-2">
                    <input 
                        type="text"
                        value={newSubcat}
                        onChange={e => setNewSubcat(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-2 text-white text-sm outline-none"
                        placeholder="Nueva subcategoría..."
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubcategory())}
                    />
                    <button onClick={addSubcategory} className="bg-slate-700 p-2 rounded-lg text-white hover:bg-slate-600">
                        <Plus className="w-5 h-5" />
                    </button>
                 </div>
               </div>

               <div className="pt-4 flex gap-3">
                 <button 
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2"
                 >
                    <Save className="w-4 h-4" /> Guardar
                 </button>
                 {!isAddingNew && (
                     <button 
                        onClick={() => handleDeleteCategory(formData.id)}
                        className="px-4 bg-red-900/50 border border-red-800 text-red-400 rounded-xl hover:bg-red-900"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                 )}
               </div>
             </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
            {categories.map(cat => (
                <div key={cat.id} className={`bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between ${editingId === cat.id ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{backgroundColor: cat.color}}>
                            {getIconComponent(cat.icon)}
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">{cat.name}</h4>
                            <p className="text-xs text-slate-400">{cat.subcategories.length} subcategorías</p>
                        </div>
                    </div>
                    <button onClick={() => startEdit(cat)} className="p-2 text-slate-400 hover:text-white bg-slate-700/50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
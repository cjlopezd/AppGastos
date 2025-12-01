import React, { useState, useRef } from 'react';
import { CategoryDefinition, RecurringExpense, Expense, AppData } from '../types';
import CategoryManager from './CategoryManager';
import RecurringExpenses from './RecurringExpenses';
import { getFullBackup } from '../services/storageService';
import { X, List, Repeat, Database, Download, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SettingsProps {
  categories: CategoryDefinition[];
  recurringExpenses: RecurringExpense[];
  onUpdateCategories: (categories: CategoryDefinition[]) => void;
  onUpdateRecurring: (recurring: RecurringExpense[]) => void;
  onGenerateRecurring: (expenses: Expense[]) => void;
  onImportData: (data: AppData) => void;
  onClose: () => void;
}

type Tab = 'categories' | 'recurring' | 'data';

const Settings: React.FC<SettingsProps> = ({
  categories,
  recurringExpenses,
  onUpdateCategories,
  onUpdateRecurring,
  onGenerateRecurring,
  onImportData,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('recurring');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = getFullBackup();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `GastosApp_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const json = event.target?.result as string;
              const data = JSON.parse(json) as AppData;
              
              if (!data.expenses || !data.categories) {
                  throw new Error("Formato de archivo inválido");
              }

              if (confirm('ADVERTENCIA: Al importar se reemplazarán todos los datos actuales por los del archivo. ¿Deseas continuar?')) {
                  onImportData(data);
                  alert('Datos restaurados correctamente.');
              }
          } catch (error) {
              alert('Error al leer el archivo. Asegúrate de que sea un backup válido de esta aplicación.');
              console.error(error);
          }
      };
      reader.readAsText(file);
      // Reset input
      e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold text-white">Configuración</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-800 rounded-xl mb-6 border border-slate-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('recurring')}
          className={`flex-1 py-2 px-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all min-w-[100px] ${
            activeTab === 'recurring' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span className="truncate">Fijos</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-2 px-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all min-w-[100px] ${
            activeTab === 'categories' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <List className="w-4 h-4" />
          <span className="truncate">Categorías</span>
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`flex-1 py-2 px-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all min-w-[100px] ${
            activeTab === 'data' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span className="truncate">Datos</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 animate-fade-in">
        {activeTab === 'recurring' && (
          <RecurringExpenses 
            recurringExpenses={recurringExpenses}
            categories={categories}
            onUpdate={onUpdateRecurring}
            onGenerate={onGenerateRecurring}
          />
        )}
        
        {activeTab === 'categories' && (
          <CategoryManager 
            categories={categories}
            onUpdate={onUpdateCategories}
            onClose={() => {}} 
          />
        )}

        {activeTab === 'data' && (
            <div className="space-y-6">
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-400"/>
                        Base de Datos Local
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                        Todos tus datos están almacenados únicamente en este dispositivo. No utilizamos servidores en la nube para guardar tus gastos.
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                                <Download className="w-4 h-4 text-green-400"/>
                                Exportar Copia de Seguridad
                            </h4>
                            <p className="text-xs text-slate-500 mb-3">
                                Descarga un archivo JSON con todos tus gastos, categorías y configuraciones. Guárdalo en un lugar seguro.
                            </p>
                            <button 
                                onClick={handleExport}
                                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium py-2 rounded-lg transition-colors text-sm"
                            >
                                Descargar Archivo (.json)
                            </button>
                        </div>

                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                                <Upload className="w-4 h-4 text-orange-400"/>
                                Importar / Restaurar
                            </h4>
                            <p className="text-xs text-slate-500 mb-3">
                                Recupera tus datos desde un archivo previamente exportado. <span className="text-orange-400 font-bold">¡Cuidado! Esto borrará los datos actuales.</span>
                            </p>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".json"
                                className="hidden"
                            />
                            <button 
                                onClick={handleImportClick}
                                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium py-2 rounded-lg transition-colors text-sm"
                            >
                                Seleccionar Archivo
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-3 bg-blue-900/20 p-4 rounded-xl border border-blue-800/50">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-blue-200">Privacidad Total</h4>
                        <p className="text-xs text-blue-300/80 mt-1">
                            Esta aplicación funciona sin internet (excepto para generar informes con IA). Tu información financiera nunca sale de tu teléfono a menos que tú exportes el archivo.
                        </p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
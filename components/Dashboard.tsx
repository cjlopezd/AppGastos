import React, { useState } from 'react';
import { Expense, CategoryDefinition } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { generateMonthlyReport } from '../services/geminiService';
import { Sparkles, Loader2, FileText, TrendingUp, DollarSign } from 'lucide-react';

interface DashboardProps {
  expenses: Expense[];
  categories: CategoryDefinition[];
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, categories }) => {
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  // Filter for current month by default or allow selection (simplification: current month view)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const [selectedMonth, setSelectedMonth] = useState(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`);

  const filteredExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));
  
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const dataByCategory = categories.map(cat => {
    const amount = filteredExpenses
      .filter(e => e.category === cat.name)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      name: cat.name,
      value: amount,
      color: cat.color
    };
  }).filter(d => d.value > 0);

  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReport(null);
    const monthName = new Date(selectedMonth + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const result = await generateMonthlyReport(filteredExpenses, monthName, totalAmount);
    setReport(result);
    setReportLoading(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Date Filter */}
      <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2">
           <TrendingUp className="text-green-400 w-5 h-5"/>
           <span className="font-semibold text-white">Periodo:</span>
        </div>
        <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-900 text-white border border-slate-600 rounded-lg p-2 outline-none focus:border-blue-500"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-5 rounded-2xl shadow-lg text-white">
            <p className="text-white text-sm font-medium mb-1 opacity-90">Total Gastado</p>
            <h3 className="text-3xl font-bold flex items-center">
                <DollarSign className="w-6 h-6 mr-1 opacity-75"/>
                {totalAmount.toLocaleString()}
            </h3>
        </div>
        <div className="bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-700 flex flex-col justify-center">
             <p className="text-white text-sm font-medium mb-1">Registros</p>
             <h3 className="text-3xl font-bold text-white">{filteredExpenses.length}</h3>
        </div>
      </div>

      {/* Charts */}
      {dataByCategory.length > 0 ? (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Distribución por Categoría</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`$${value}`, '']}
                />
                <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#ffffff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center text-white">
            <p>No hay gastos registrados en este mes.</p>
        </div>
      )}

      {/* AI Report Section */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Informe Inteligente
            </h3>
            <button 
                onClick={handleGenerateReport}
                disabled={reportLoading || filteredExpenses.length === 0}
                className="text-sm bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-400 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
                {reportLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <FileText className="w-4 h-4"/>}
                {report ? 'Regenerar' : 'Generar Informe'}
            </button>
        </div>

        {report && (
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-white text-sm leading-relaxed whitespace-pre-line animate-fade-in">
                {report}
            </div>
        )}
        {!report && !reportLoading && (
            <p className="text-slate-200 text-sm">
                Utiliza la IA para analizar tus patrones de gasto del mes y obtener recomendaciones personalizadas para Cristopher y el hogar.
            </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
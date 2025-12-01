import { GoogleGenAI } from "@google/genai";
import { Expense } from '../types';

// Initialize Gemini
// NOTE: API Key must be provided in the environment variable API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMonthlyReport = async (
  expenses: Expense[], 
  monthName: string, 
  total: number
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key no configurada. Por favor configura tu clave de API de Gemini.";
  }

  // Filter sensitive data or unnecessary fields to save tokens
  const simplifiedExpenses = expenses.map(e => ({
    fecha: e.date,
    categoria: e.category,
    subcategoria: e.subcategory,
    monto: e.amount,
    descripcion: e.description
  }));

  const prompt = `
    Actúa como un asistente financiero personal experto.
    
    Analiza los siguientes gastos familiares del mes de ${monthName}.
    El total gastado fue: $${total}.
    
    Datos de gastos (JSON):
    ${JSON.stringify(simplifiedExpenses)}
    
    Por favor genera un informe conciso pero perspicaz en español que incluya:
    1. Un resumen general del comportamiento de gasto.
    2. Categorías donde se gastó más de lo inusual o destacan.
    3. Recomendaciones breves para ahorro basadas en estos patrones.
    4. Menciona específicamente gastos relacionados con "Cristopher" si existen.
    
    Usa formato Markdown para resaltar puntos clave. Sé amable y motivador.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "No se pudo generar el reporte.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Ocurrió un error al conectar con Gemini para generar el reporte. Inténtalo más tarde.";
  }
};

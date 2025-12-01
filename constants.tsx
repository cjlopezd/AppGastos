import { CategoryDefinition } from './types';
import { 
  Baby, 
  ShoppingCart, 
  Activity, 
  Gamepad2, 
  IceCream, 
  Car, 
  Sparkles, 
  HelpCircle,
  Briefcase,
  Home,
  Utensils,
  Smartphone,
  Gift
} from 'lucide-react';
import React from 'react';

export const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'cristopher',
    name: 'Cristopher',
    subcategories: ['Colegio', 'Terapias', 'Ropa', 'Juguetes', 'Médico', 'Pañales'],
    color: '#3b82f6', // blue-500
    icon: 'Baby'
  },
  {
    id: 'mercado',
    name: 'Mercado',
    subcategories: ['Comida', 'Aseo Personal', 'Aseo Hogar', 'Varios'],
    color: '#22c55e', // green-500
    icon: 'ShoppingCart'
  },
  {
    id: 'terapias',
    name: 'Terapias Extra',
    subcategories: ['Física', 'Lenguaje', 'Ocupacional', 'Psicología'],
    color: '#a855f7', // purple-500
    icon: 'Activity'
  },
  {
    id: 'entretenimiento',
    name: 'Entretenimiento',
    subcategories: ['Cine', 'Parques', 'Streaming', 'Suscripciones', 'Juegos'],
    color: '#f97316', // orange-500
    icon: 'Gamepad2'
  },
  {
    id: 'gustos',
    name: 'Gustos',
    subcategories: ['Restaurantes', 'Postres', 'Snacks', 'Regalos'],
    color: '#ec4899', // pink-500
    icon: 'IceCream'
  },
  {
    id: 'movilidad',
    name: 'Movilidad',
    subcategories: ['Taxis', 'Gasolina', 'Transporte Público', 'Mantenimiento'],
    color: '#eab308', // yellow-500
    icon: 'Car'
  },
  {
    id: 'limpieza',
    name: 'Limpieza',
    subcategories: ['Servicio Doméstico', 'Artículos Especiales', 'Lavandería'],
    color: '#06b6d4', // cyan-500
    icon: 'Sparkles'
  }
];

export const AVAILABLE_ICONS = [
  'Baby', 'ShoppingCart', 'Activity', 'Gamepad2', 'IceCream', 
  'Car', 'Sparkles', 'HelpCircle', 'Briefcase', 'Home', 
  'Utensils', 'Smartphone', 'Gift'
];

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Baby': return <Baby />;
    case 'ShoppingCart': return <ShoppingCart />;
    case 'Activity': return <Activity />;
    case 'Gamepad2': return <Gamepad2 />;
    case 'IceCream': return <IceCream />;
    case 'Car': return <Car />;
    case 'Sparkles': return <Sparkles />;
    case 'Briefcase': return <Briefcase />;
    case 'Home': return <Home />;
    case 'Utensils': return <Utensils />;
    case 'Smartphone': return <Smartphone />;
    case 'Gift': return <Gift />;
    default: return <HelpCircle />;
  }
};
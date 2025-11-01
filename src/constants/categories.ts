import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'baches',
    name: 'Baches',
    description: 'Huecos y calles dañadas',
    icon: '🕳️',
  },
  {
    id: 'infraestructura',
    name: 'Infraestructura',
    description: 'Banquetas rotas, puentes peatonales dañados',
    icon: '🚧',
  },
  {
    id: 'alcantarillado',
    name: 'Alcantarillado',
    description: 'Tapas faltantes, drenajes obstruidos, fugas de agua',
    icon: '🔴',
  },
  {
    id: 'basura',
    name: 'Basura',
    description: 'Acumulación de basura, vertederos ilegales',
    icon: '🗑️',
  },
  {
    id: 'arboles',
    name: 'Árboles',
    description: 'Árboles caídos, ramas peligrosas',
    icon: '🌳',
  },
  {
    id: 'infraestructura_electrica',
    name: 'Infraestructura Eléctrica',
    description: 'Postes dañados, luces fundidas, cables peligrosos',
    icon: '💡⚡',
  },
  {
    id: 'propiedades_peligrosas',
    name: 'Propiedades Peligrosas',
    description: 'Tejas, muros u otros elementos que se pueden caer y representan un riesgo',
    icon: '🏚️⚠️',
  },
  {
    id: 'otro',
    name: 'Otro',
    description: 'Descripción libre',
    icon: '📝',
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find((cat) => cat.id === id);
};

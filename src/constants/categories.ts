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
    description: 'Banquetas rotas, puentes dañados',
    icon: '🚧',
  },
  {
    id: 'alcantarillado',
    name: 'Alcantarillado',
    description: 'Tapas faltantes, drenajes obstruidos',
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
    id: 'alumbrado_publico',
    name: 'Alumbrado Público',
    description: 'Postes dañados, luces fundidas',
    icon: '💡',
  },
  {
    id: 'propiedades_abandonadas',
    name: 'Propiedades Abandonadas',
    description: 'Edificios en mal estado',
    icon: '🏚️',
  },
  {
    id: 'servicios_electricos',
    name: 'Servicios Eléctricos',
    description: 'Cables caídos, transformadores dañados',
    icon: '⚡',
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

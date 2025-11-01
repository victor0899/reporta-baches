export type CategoryType =
  | 'baches'
  | 'infraestructura'
  | 'alcantarillado'
  | 'basura'
  | 'arboles'
  | 'alumbrado_publico'
  | 'propiedades_abandonadas'
  | 'servicios_electricos'
  | 'otro';

export interface Category {
  id: CategoryType;
  name: string;
  description: string;
  icon: string; // emoji or icon name
}

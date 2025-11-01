export type CategoryType =
  | 'baches'
  | 'infraestructura'
  | 'alcantarillado'
  | 'basura'
  | 'arboles'
  | 'infraestructura_electrica'
  | 'propiedades_peligrosas'
  | 'otro';

export interface Category {
  id: CategoryType;
  name: string;
  description: string;
  icon: string; // emoji or icon name
}

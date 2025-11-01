import { Location } from '../types';

// San Miguel, El Salvador coordinates
export const DEFAULT_LOCATION: Location = {
  latitude: 13.4833,
  longitude: -88.1833,
};

export const MAP_CONFIG = {
  defaultZoom: 13,
  defaultLocation: DEFAULT_LOCATION,
  // Radius in meters to check for duplicate reports
  duplicateDetectionRadius: 20,
};

export const APP_CONFIG = {
  name: 'Reporta Baches',
  version: '1.0.0',
  supportEmail: 'victormanuelrodriguez0899@gmail.com',
};

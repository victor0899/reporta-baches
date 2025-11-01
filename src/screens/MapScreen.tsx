import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { DEFAULT_LOCATION } from '../constants';

export const MapScreen: React.FC = () => {
  const [region, setRegion] = useState<Region>({
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permiso de ubicación',
          'La app necesita acceso a tu ubicación para mostrar reportes cercanos.',
          [{ text: 'OK' }]
        );
        setHasLocationPermission(false);
        setLoading(false);
        return;
      }

      setHasLocationPermission(true);
      getCurrentLocation();
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      // Keep default location (San Miguel)
    } finally {
      setLoading(false);
    }
  };

  const handleRecenterMap = () => {
    if (userLocation) {
      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      getCurrentLocation();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
      >
        {/* TODO: Add report markers here */}
      </MapView>

      {/* Recenter button */}
      {hasLocationPermission && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={handleRecenterMap}
        >
          <Text style={styles.recenterButtonText}>📍</Text>
        </TouchableOpacity>
      )}

      {/* New Report button */}
      <TouchableOpacity
        style={styles.newReportButton}
        onPress={() => {
          // TODO: Navigate to new report screen
          Alert.alert('Nuevo Reporte', 'Funcionalidad próximamente');
        }}
      >
        <Text style={styles.newReportButtonText}>+ Nuevo Reporte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  map: {
    flex: 1,
  },
  recenterButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recenterButtonText: {
    fontSize: 24,
  },
  newReportButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newReportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

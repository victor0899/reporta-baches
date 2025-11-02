import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { DEFAULT_LOCATION, getCategoryById } from '../constants';
import { darkMapStyle, lightMapStyle } from '../constants/mapStyles';
import { useReports } from '../hooks/useReports';
import { ReportDetailModal } from '../components/ReportDetailModal';
import { Report } from '../types';
import { useTheme } from '../contexts';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const MapScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();
  const { reports, loading: reportsLoading } = useReports();
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
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleMarkerPress = (report: Report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

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

  const styles = getStyles(colors);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
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
        customMapStyle={isDark ? darkMapStyle : lightMapStyle}
      >
        {/* Report Markers */}
        {reports.map((report) => {
          const category = getCategoryById(report.category);
          return (
            <Marker
              key={report.id}
              coordinate={{
                latitude: report.location.latitude,
                longitude: report.location.longitude,
              }}
              title={category?.name}
              description={report.description || 'Sin descripción'}
              onPress={() => handleMarkerPress(report)}
            >
              <View style={styles.markerContainer}>
                <Text style={styles.markerEmoji}>{category?.icon}</Text>
              </View>
            </Marker>
          );
        })}
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
        onPress={() => navigation.navigate('NewReport')}
      >
        <Text style={styles.newReportButtonText}>+ Nuevo Reporte</Text>
      </TouchableOpacity>

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  map: {
    flex: 1,
  },
  recenterButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: colors.card,
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
    backgroundColor: colors.primary,
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
  markerContainer: {
    backgroundColor: colors.card,
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerEmoji: {
    fontSize: 20,
  },
});

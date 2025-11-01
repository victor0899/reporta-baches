import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { MainStackParamList } from '../types/navigation';
import { CategoryType } from '../types';
import { CATEGORIES } from '../constants';
import { useAuth } from '../contexts';
import { createReport, checkForDuplicates } from '../services/reports';

type Props = NativeStackScreenProps<MainStackParamList, 'NewReport'>;

export const NewReportScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isGuest } = useAuth();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso de ubicación para crear un reporte');
        navigation.goBack();
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(loc);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
      navigation.goBack();
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'Se necesita acceso a la cámara para tomar fotos'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'Se necesita acceso a la galería para seleccionar fotos'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!photoUri) {
      Alert.alert('Error', 'Debes tomar una foto del problema');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Debes seleccionar una categoría');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Esperando ubicación...');
      return;
    }

    setLoading(true);

    try {
      // Check for duplicates
      const duplicates = await checkForDuplicates(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        category
      );

      if (duplicates.length > 0) {
        Alert.alert(
          'Reporte Similar Encontrado',
          'Ya existe un reporte de este tipo cerca de esta ubicación. ¿Quieres confirmarlo en lugar de crear uno nuevo?',
          [
            {
              text: 'Ver Reporte',
              onPress: () => {
                // TODO: Navigate to report detail
                navigation.goBack();
              },
            },
            {
              text: 'Crear Nuevo',
              onPress: () => submitReport(),
            },
            { text: 'Cancelar', style: 'cancel' },
          ]
        );
        setLoading(false);
        return;
      }

      await submitReport();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear el reporte');
      setLoading(false);
    }
  };

  const submitReport = async () => {
    if (!photoUri || !category || !location || !user) return;

    try {
      const reportId = await createReport(
        {
          category,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          photo: photoUri,
          description,
          address,
        },
        user.uid,
        user.displayName || 'Usuario',
        isGuest
      );

      Alert.alert('¡Éxito!', 'Tu reporte ha sido creado', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear el reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>
            Foto del problema <Text style={styles.required}>*</Text>
          </Text>

          {photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={handleTakePhoto}
              >
                <Text style={styles.changePhotoText}>Cambiar foto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={handleTakePhoto}
              >
                <Text style={styles.photoButtonText}>📷 Tomar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={handlePickImage}
              >
                <Text style={styles.photoButtonText}>🖼️ Galería</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Category Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Categoría <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  category === cat.id && styles.categoryButtonSelected,
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción (opcional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe el problema..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Punto de referencia (opcional)
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: Frente a la iglesia..."
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Crear Reporte</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  photoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  required: {
    color: '#FF3B30',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 12,
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  changePhotoText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    backgroundColor: '#E3F2FF',
    borderColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

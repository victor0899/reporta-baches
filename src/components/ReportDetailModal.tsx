import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Report } from '../types';
import { getCategoryById } from '../constants';
import { useAuth, useTheme } from '../contexts';
import { confirmReport, markReportResolved } from '../services/reports';

interface Props {
  report: Report | null;
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export const ReportDetailModal: React.FC<Props> = ({ report, visible, onClose }) => {
  const { user, isGuest } = useAuth();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  if (!report) return null;

  const category = getCategoryById(report.category);
  const createdDate = report.createdAt?.toDate?.();
  const styles = getStyles(colors);

  const handleConfirm = async () => {
    // Check if user is logged in
    if (!user && !isGuest) {
      Alert.alert('Error', 'Debes iniciar sesión para confirmar reportes');
      return;
    }

    // Ask if user wants to add a photo
    Alert.alert(
      'Confirmar Reporte',
      '¿Quieres agregar una foto actualizada del problema?',
      [
        {
          text: 'Sin Foto',
          onPress: () => submitConfirmation(),
        },
        {
          text: 'Agregar Foto',
          onPress: () => handleAddPhoto(),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handleAddPhoto = async () => {
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
      submitConfirmation(result.assets[0].uri);
    }
  };

  const submitConfirmation = async (photoUri?: string) => {
    if (!report) return;

    setLoading(true);

    try {
      const userId = user?.uid || 'guest-' + Date.now();
      const userName = user?.displayName || 'Usuario anónimo';

      await confirmReport(report.id, userId, userName, photoUri);

      Alert.alert('¡Éxito!', 'Tu confirmación ha sido registrada', [
        {
          text: 'OK',
          onPress: () => onClose(),
        },
      ]);
    } catch (error: any) {
      console.error('Error confirming report:', error);
      Alert.alert('Error', error.message || 'No se pudo confirmar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    // Only registered users can resolve reports
    if (!user || isGuest) {
      Alert.alert(
        'Acción no permitida',
        'Solo usuarios registrados pueden marcar reportes como resueltos'
      );
      return;
    }

    Alert.alert(
      'Marcar como Resuelto',
      'Debes tomar una foto que demuestre que el problema fue solucionado.',
      [
        {
          text: 'Tomar Foto',
          onPress: () => handleResolutionPhoto(),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handleResolutionPhoto = async () => {
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
      submitResolution(result.assets[0].uri);
    }
  };

  const submitResolution = async (photoUri: string) => {
    if (!report || !user) return;

    setLoading(true);

    try {
      await markReportResolved(
        report.id,
        user.uid,
        user.displayName || 'Usuario',
        photoUri
      );

      Alert.alert('¡Éxito!', 'El reporte ha sido marcado como resuelto', [
        {
          text: 'OK',
          onPress: () => onClose(),
        },
      ]);
    } catch (error: any) {
      console.error('Error resolving report:', error);
      Alert.alert('Error', error.message || 'No se pudo marcar el reporte como resuelto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryIcon}>{category?.icon}</Text>
                <Text style={styles.categoryName}>{category?.name}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Photo */}
            {report.photos && report.photos.length > 0 && (
              <Image source={{ uri: report.photos[0] }} style={styles.photo} />
            )}

            {/* Info */}
            <View style={styles.content}>
              {/* Creator */}
              <View style={styles.infoRow}>
                <Text style={styles.label}>Reportado por:</Text>
                <Text style={styles.value}>
                  {report.createdBy.isAnonymous
                    ? 'Usuario anónimo'
                    : report.createdBy.name}
                </Text>
              </View>

              {/* Date */}
              {createdDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Fecha:</Text>
                  <Text style={styles.value}>
                    {createdDate.toLocaleDateString('es-SV', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              )}

              {/* Confirmations */}
              <View style={styles.infoRow}>
                <Text style={styles.label}>Confirmaciones:</Text>
                <Text style={styles.value}>{report.confirmationCount}</Text>
              </View>

              {/* Status */}
              <View style={styles.infoRow}>
                <Text style={styles.label}>Estado:</Text>
                <View
                  style={[
                    styles.statusBadge,
                    report.status === 'resolved' && styles.statusResolved,
                    report.status === 'in_progress' && styles.statusInProgress,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {report.status === 'pending'
                      ? 'Pendiente'
                      : report.status === 'in_progress'
                      ? 'En proceso'
                      : 'Resuelto'}
                  </Text>
                </View>
              </View>

              {/* Description */}
              {report.description && (
                <View style={styles.section}>
                  <Text style={styles.label}>Descripción:</Text>
                  <Text style={styles.description}>{report.description}</Text>
                </View>
              )}

              {/* Address */}
              {report.address && (
                <View style={styles.section}>
                  <Text style={styles.label}>Punto de referencia:</Text>
                  <Text style={styles.description}>{report.address}</Text>
                </View>
              )}

              {/* Confirmations List */}
              {report.confirmations && report.confirmations.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.label}>
                    Usuarios que confirmaron ({report.confirmations.length}):
                  </Text>
                  {report.confirmations.map((confirmation, index) => (
                    <View key={index} style={styles.confirmationItem}>
                      <View style={styles.confirmationHeader}>
                        <Text style={styles.confirmationName}>
                          {confirmation.userName}
                        </Text>
                        <Text style={styles.confirmationDate}>
                          {confirmation.timestamp?.toDate?.()?.toLocaleDateString('es-SV', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </View>
                      {confirmation.photoUrl && (
                        <Image
                          source={{ uri: confirmation.photoUrl }}
                          style={styles.confirmationPhoto}
                        />
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Resolution Evidence */}
              {report.status === 'resolved' && report.resolutionEvidence && (
                <View style={styles.section}>
                  <View style={styles.resolvedBanner}>
                    <Text style={styles.resolvedBannerText}>
                      ✓ Problema Resuelto
                    </Text>
                  </View>
                  <View style={styles.resolutionInfo}>
                    <Text style={styles.label}>Resuelto por:</Text>
                    <Text style={styles.value}>
                      {report.resolutionEvidence.resolvedBy.userName}
                    </Text>
                  </View>
                  {report.resolvedAt && (
                    <View style={styles.resolutionInfo}>
                      <Text style={styles.label}>Fecha de resolución:</Text>
                      <Text style={styles.value}>
                        {report.resolvedAt.toDate?.()?.toLocaleDateString('es-SV', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  )}
                  {report.resolutionEvidence.photoUrl && (
                    <View style={styles.resolutionPhotoContainer}>
                      <Text style={styles.label}>Evidencia de resolución:</Text>
                      <Image
                        source={{ uri: report.resolutionEvidence.photoUrl }}
                        style={styles.resolutionPhoto}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          {report.status !== 'resolved' && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.actionButton, loading && styles.actionButtonDisabled]}
                onPress={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>
                    Confirmar que sigue aquí
                  </Text>
                )}
              </TouchableOpacity>

              {/* Mark as Resolved button - only for registered users */}
              {user && !isGuest && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.resolveButton,
                    loading && styles.actionButtonDisabled,
                  ]}
                  onPress={handleResolve}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.actionButtonText}>
                      Marcar como Resuelto
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  photo: {
    width: width,
    height: width * 0.75,
    backgroundColor: colors.backgroundTertiary,
  },
  content: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.warning,
  },
  statusResolved: {
    backgroundColor: colors.success,
  },
  statusInProgress: {
    backgroundColor: colors.info,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
    lineHeight: 20,
  },
  confirmationItem: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  confirmationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmationName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  confirmationDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  confirmationPhoto: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: colors.backgroundTertiary,
  },
  resolvedBanner: {
    backgroundColor: colors.success,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  resolvedBannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  resolutionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resolutionPhotoContainer: {
    marginTop: 12,
  },
  resolutionPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: colors.backgroundTertiary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  resolveButton: {
    backgroundColor: colors.success,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

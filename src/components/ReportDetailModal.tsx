import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Report } from '../types';
import { getCategoryById } from '../constants';

interface Props {
  report: Report | null;
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export const ReportDetailModal: React.FC<Props> = ({ report, visible, onClose }) => {
  if (!report) return null;

  const category = getCategoryById(report.category);
  const createdDate = report.createdAt?.toDate?.();

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
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>
                Confirmar que sigue aquí
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
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
    borderBottomColor: '#f0f0f0',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
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
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  photo: {
    width: width,
    height: width * 0.75,
    backgroundColor: '#f0f0f0',
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
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFA500',
  },
  statusResolved: {
    backgroundColor: '#34C759',
  },
  statusInProgress: {
    backgroundColor: '#007AFF',
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
    color: '#333',
    marginTop: 8,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

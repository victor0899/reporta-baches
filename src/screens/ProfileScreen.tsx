import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuth } from '../contexts';
import { getReportsByIds } from '../services/reports';
import { Report } from '../types';
import { getCategoryById } from '../constants';
import { ReportDetailModal } from '../components';

export const ProfileScreen: React.FC = () => {
  const { user, userData, signOut, isGuest } = useAuth();
  const [createdReports, setCreatedReports] = useState<Report[]>([]);
  const [confirmedReports, setConfirmedReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreated, setShowCreated] = useState(false);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadUserReports();
  }, [userData]);

  const loadUserReports = async () => {
    if (!userData || isGuest) return;

    setLoading(true);
    try {
      const [created, confirmed] = await Promise.all([
        getReportsByIds(userData.reportsCreated || []),
        getReportsByIds(userData.reportsConfirmed || []),
      ]);

      setCreatedReports(created);
      setConfirmedReports(confirmed);
    } catch (error) {
      console.error('Error loading user reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportPress = (report: Report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  const handleSignOut = async () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo cerrar sesión');
          }
        },
      },
    ]);
  };

  const renderReportItem = (report: Report) => {
    const category = getCategoryById(report.category);
    const createdDate = report.createdAt?.toDate?.();

    return (
      <TouchableOpacity
        key={report.id}
        style={styles.reportItem}
        onPress={() => handleReportPress(report)}
      >
        {report.photos && report.photos.length > 0 && (
          <Image source={{ uri: report.photos[0] }} style={styles.reportImage} />
        )}
        <View style={styles.reportInfo}>
          <View style={styles.reportHeader}>
            <Text style={styles.categoryIcon}>{category?.icon}</Text>
            <Text style={styles.reportCategory}>{category?.name}</Text>
          </View>
          {createdDate && (
            <Text style={styles.reportDate}>
              {createdDate.toLocaleDateString('es-SV', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          )}
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          {isGuest ? (
            <>
              <Text style={styles.guestText}>Modo Invitado</Text>
              <Text style={styles.guestSubtext}>
                Crea una cuenta para guardar tus reportes
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.name}>{userData?.name || user?.displayName}</Text>
              <Text style={styles.email}>{user?.email}</Text>

              {userData?.isVerified && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>✓ Cuenta Verificada</Text>
                </View>
              )}

              <View style={styles.stats}>
                <TouchableOpacity
                  style={styles.statItem}
                  onPress={() => setShowCreated(!showCreated)}
                >
                  <Text style={styles.statNumber}>
                    {userData?.reportsCreated.length || 0}
                  </Text>
                  <Text style={styles.statLabel}>Reportes creados</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.statItem}
                  onPress={() => setShowConfirmed(!showConfirmed)}
                >
                  <Text style={styles.statNumber}>
                    {userData?.reportsConfirmed.length || 0}
                  </Text>
                  <Text style={styles.statLabel}>Reportes confirmados</Text>
                </TouchableOpacity>
              </View>

              {/* Created Reports Section */}
              {showCreated && (
                <View style={styles.reportsSection}>
                  <Text style={styles.sectionTitle}>Mis Reportes</Text>
                  {loading ? (
                    <ActivityIndicator color="#007AFF" style={styles.loader} />
                  ) : createdReports.length > 0 ? (
                    createdReports.map(renderReportItem)
                  ) : (
                    <Text style={styles.emptyText}>No has creado reportes aún</Text>
                  )}
                </View>
              )}

              {/* Confirmed Reports Section */}
              {showConfirmed && (
                <View style={styles.reportsSection}>
                  <Text style={styles.sectionTitle}>Reportes Confirmados</Text>
                  {loading ? (
                    <ActivityIndicator color="#007AFF" style={styles.loader} />
                  ) : confirmedReports.length > 0 ? (
                    confirmedReports.map(renderReportItem)
                  ) : (
                    <Text style={styles.emptyText}>
                      No has confirmado reportes aún
                    </Text>
                  )}
                </View>
              )}
            </>
          )}

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>
              {isGuest ? 'Volver a inicio' : 'Cerrar sesión'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  badge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  reportsSection: {
    width: '100%',
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  reportItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  reportImage: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
  },
  reportInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  reportCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reportDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFA500',
    marginTop: 4,
  },
  statusResolved: {
    backgroundColor: '#34C759',
  },
  statusInProgress: {
    backgroundColor: '#007AFF',
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  guestText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 40,
  },
  guestSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  signOutButton: {
    marginTop: 40,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    width: '100%',
    alignItems: 'center',
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});

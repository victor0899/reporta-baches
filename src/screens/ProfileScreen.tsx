import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts';

export const ProfileScreen: React.FC = () => {
  const { user, userData, signOut, isGuest } = useAuth();

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

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
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {userData?.reportsCreated.length || 0}
                </Text>
                <Text style={styles.statLabel}>Reportes creados</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {userData?.reportsConfirmed.length || 0}
                </Text>
                <Text style={styles.statLabel}>Reportes confirmados</Text>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>
            {isGuest ? 'Volver a inicio' : 'Cerrar sesión'}
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
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
    marginTop: 'auto',
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

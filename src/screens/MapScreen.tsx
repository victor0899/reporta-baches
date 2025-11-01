import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MapScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mapa de Reportes</Text>
      <Text style={styles.subtext}>Aquí irá el mapa con los reportes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
});

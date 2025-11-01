import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import './src/services/firebase'; // Initialize Firebase

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Reporta Baches</Text>
      <Text style={styles.subtitle}>Configuración inicial completada ✓</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

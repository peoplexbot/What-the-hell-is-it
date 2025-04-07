import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Puzzle Game! 🧩</Text>
      <Text style={styles.subtitle}>Choose a tab to get started.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb'
  },
  title: {
    fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 10
  },
  subtitle: {
    fontSize: 16, color: '#64748b'
  }
});

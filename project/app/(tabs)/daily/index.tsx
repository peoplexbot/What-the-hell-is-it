import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

export default function DailyPuzzleScreen() {
  const [puzzle, setPuzzle] = useState<any>(null);
  const [guess, setGuess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPuzzle({
      clue: "This is a test clue.",
      imageUrl: "https://images.pexels.com/photos/4058225/pexels-photo-4058225.jpeg",
      fullImageUrl: "https://images.pexels.com/photos/4058225/pexels-photo-4058225.jpeg",
      answer: "pineapple",
      acceptable_answers: ["pineapple", "fruit"],
    });
    setLoading(false);
  }, []);

  if (loading || !puzzle) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 22, color: 'red', textAlign: 'center', marginBottom: 20 }}>
        ✅ Screen is Rendering!
      </Text>

      <Text style={styles.title}>What The Hell Is It?</Text>
      <Text style={styles.clue}>Clue: {puzzle.clue}</Text>

      <Image
        source={{ uri: puzzle.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <TextInput
        style={styles.input}
        placeholder="Your guess"
        value={guess}
        onChangeText={setGuess}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#0f172a',
  },
  clue: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

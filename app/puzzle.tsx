import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const imageSize = Dimensions.get('window').width * 0.9;
const MAX_ATTEMPTS = 3;

const PuzzleScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<any>(null);
  const [guess, setGuess] = useState('');
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [guessesLeft, setGuessesLeft] = useState(MAX_ATTEMPTS);
  const [hintUsed, setHintUsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const scaleAnim = useRef(new Animated.Value(5)).current; // even more zoomed in!

  useEffect(() => {
    loadUsername();
    if (params && params.answer) {
      const incomingPuzzle = {
        answer: params.answer,
        acceptable_answers: JSON.parse(params.acceptable_answers as string),
        imageUrl: params.imageUrl,
        fullImageUrl: params.fullImageUrl || params.imageUrl,
        clue: params.hint,
        category: params.category,
        photographer: params.photographer,
        photographerUrl: params.photographerUrl,
      };
      setPuzzle(incomingPuzzle);
      setLoading(false);
      setGameOver(false);
      setGuess('');
      setGuessesLeft(MAX_ATTEMPTS);
      setHintUsed(false);
      setFeedback('');
      scaleAnim.setValue(5);
    } else {
      setError('Puzzle not found.');
    }
  }, [params]);

  const loadUsername = async () => {
    const stored = await AsyncStorage.getItem('username');
    if (stored) setUsername(stored);
  };

  const handleSubmit = () => {
    const normalized = guess.trim().toLowerCase();
    const accepted = [puzzle?.answer?.toLowerCase(), ...(puzzle?.acceptable_answers || [])];

    if (accepted.includes(normalized)) {
      setFeedback('🎉 You got it!');
      setGameOver(true);
      setStreak((prev) => prev + 1);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      const newGuesses = guessesLeft - 1;
      setGuessesLeft(newGuesses);
      if (newGuesses <= 0) {
        setFeedback(`❌ It was a ${puzzle.answer}`);
        setGameOver(true);
        setStreak(0); // reset streak on fail
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      } else {
        const zoom = Math.max(1, 5 - newGuesses * (4 / MAX_ATTEMPTS));
        Animated.spring(scaleAnim, {
          toValue: zoom,
          useNativeDriver: true,
        }).start();
        setFeedback('❌ Try again...');
      }
    }
    setGuess('');
  };

  const handleHint = () => {
    if (!hintUsed && guessesLeft > 1) {
      setHintUsed(true);
      setGuessesLeft((g) => g - 1);
    }
  };

  const handleNextPuzzle = async () => {
    try {
      if (!puzzle?.category) return;

      const url = new URL('https://script.google.com/macros/s/AKfycbwhDxXzrdYbWKtue59ATIqIs7-jWXU5_Z-6VaSo_d3eCCEiZ_52Nmg3QCmYPc46tpFu1g/exec');
      url.searchParams.append('category', puzzle.category);
      url.searchParams.append('difficulty', 'easy');

      const response = await fetch(url.toString());
      const puzzleData = await response.json();

      if (!puzzleData?.Answer) throw new Error('No puzzle data received');

      router.replace({
        pathname: '/puzzle',
        params: {
          answer: puzzleData.Answer,
          imageUrl: puzzleData['Image URL'],
          fullImageUrl: puzzleData['Zoomed Image URL'] || puzzleData['Image URL'],
          acceptable_answers: JSON.stringify(
            puzzleData['Acceptable Answers']?.split(',').map((s) => s.trim()) || []
          ),
          hint: puzzleData.Clue,
          category: puzzleData.Category,
          photographer: puzzleData['Photographer Name'],
          photographerUrl: puzzleData['Photo Source'],
          isDaily: 'false',
        },
      });
    } catch (error) {
      console.error('Failed to load next puzzle:', error);
      router.replace('/endless');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}> 
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.streak}>🔥 Streak: {streak}</Text>
        <Text style={styles.clue}>Clue: {puzzle.clue}</Text>

        <View style={styles.imageWrapper}>
          <Animated.Image
            source={{ uri: gameOver ? puzzle.fullImageUrl : puzzle.imageUrl }}
            style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.dotsContainer}>
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i < guessesLeft ? 'green' : 'red' },
              ]}
            />
          ))}
        </View>

        {feedback && <Text style={styles.feedback}>{feedback}</Text>}

        {!hintUsed && !gameOver && guessesLeft > 1 && (
          <TouchableOpacity onPress={handleHint}>
            <Text style={styles.hintText}>💡 Use Hint (-1 guess)</Text>
          </TouchableOpacity>
        )}

        <TextInput
          placeholder="Your guess..."
          style={styles.input}
          value={guess}
          onChangeText={setGuess}
        />

        {!gameOver ? (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Guess</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleNextPuzzle}>
            <Text style={styles.buttonText}>Next Puzzle</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  imageWrapper: {
    width: '100%',
    height: imageSize,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  streak: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0f172a',
  },
  clue: {
    fontSize: 16,
    marginBottom: 10,
    color: '#475569',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  feedback: {
    fontSize: 16,
    color: '#2563eb',
    marginBottom: 12,
    textAlign: 'center',
  },
  hintText: {
    color: 'orange',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default PuzzleScreen;
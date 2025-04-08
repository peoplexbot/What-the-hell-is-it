import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CategoryPuzzleScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();

  const [puzzle, setPuzzle] = useState<any | null>(null);
  const [guess, setGuess] = useState('');
  const [guessesLeft, setGuessesLeft] = useState(3);
  const [hintUsed, setHintUsed] = useState(false);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [perfectSolve, setPerfectSolve] = useState(false);

  useEffect(() => {
    if (category) {
      loadBestStreak();
      loadPuzzle(category as string);
    }
  }, [category]);

  const loadBestStreak = async () => {
    const stored = await AsyncStorage.getItem('endlessHighScore');
    if (stored) setBestStreak(parseInt(stored));
  };

  const saveBestStreak = async (newStreak: number) => {
    const stored = await AsyncStorage.getItem('endlessHighScore');
    const prev = parseInt(stored || '0');
    if (newStreak > prev) {
      await AsyncStorage.setItem('endlessHighScore', String(newStreak));
      setBestStreak(newStreak);
    }
  };

  const loadPuzzle = async (cat: string) => {
    setStatus('playing');
    setGuessesLeft(3);
    setHintUsed(false);
    setGuess('');
    setPerfectSolve(false);
    const newPuzzle = await fetchPuzzle(cat);
    setPuzzle(newPuzzle);
  };

  const normalize = (text: string) =>
    text.trim().toLowerCase().replace(/[^\w\s]/gi, '');

  const checkAnswer = () => {
    if (!puzzle) return;
    const cleanedGuess = normalize(guess);
    const accepted = [puzzle.Answer, ...(puzzle.AcceptableAnswers || [])].map(normalize);

    if (accepted.includes(cleanedGuess)) {
      setStatus('won');
      setStreak(prev => {
        const newStreak = prev + 1;
        if (!hintUsed && guessesLeft === 3) setPerfectSolve(true);
        return newStreak;
      });
    } else {
      const newGuesses = guessesLeft - 1;
      setGuessesLeft(newGuesses);
      if (newGuesses <= 0) {
        setStatus('lost');
        saveBestStreak(streak); // Save best if streak ends
      }
    }
    setGuess('');
  };

  const useHint = () => {
    if (!hintUsed && guessesLeft > 1) {
      setHintUsed(true);
      setGuessesLeft(guessesLeft - 1);
    }
  };

  const imageZoomLevel = 1 + (3 - guessesLeft) * 0.3;

  if (!puzzle) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-gray-500">Loading puzzle...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 items-center bg-white">
      <Text className="text-xl font-bold mb-2">🌀 Category: {category}</Text>
      <Text className="text-md text-gray-600 mb-2">
        🔢 Streak: {streak}  | 🏆 Best: {bestStreak}
      </Text>

      <Image
        source={{ uri: puzzle['Zoomed Image URL'] }}
        resizeMode="cover"
        style={{
          width: 300,
          height: 300,
          transform: [{ scale: imageZoomLevel }],
          borderRadius: 16,
        }}
      />

      <View className="flex-row space-x-2 justify-center my-2">
        {[...Array(3)].map((_, i) => (
          <View
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < guessesLeft ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>

      {hintUsed && (
        <Text className="text-center text-lg my-2 text-blue-700 italic">
          Hint: {puzzle.Clue}
        </Text>
      )}

      {status === 'playing' && (
        <>
          <TextInput
            value={guess}
            onChangeText={setGuess}
            placeholder="Your guess..."
            className="border w-full mt-4 p-2 rounded-lg text-center"
            onSubmitEditing={checkAnswer}
            returnKeyType="done"
          />

          <View className="flex-row justify-between mt-3 space-x-4">
            <TouchableOpacity
              className="bg-blue-600 px-4 py-2 rounded-xl"
              onPress={checkAnswer}
            >
              <Text className="text-white text-lg">Submit</Text>
            </TouchableOpacity>

            {!hintUsed && guessesLeft > 1 && (
              <TouchableOpacity
                className="bg-yellow-400 px-4 py-2 rounded-xl"
                onPress={useHint}
              >
                <Text className="text-black text-lg">Use Hint (-1)</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {status !== 'playing' && (
        <View className="mt-6 items-center">
          <Text className="text-2xl font-bold mb-2 text-center">
            {status === 'won'
              ? perfectSolve
                ? '🎯 Perfect Solve!'
                : '🎉 You got it!'
              : `❌ Nope! It was ${puzzle.Answer}`}
          </Text>
          <Image
            source={{ uri: puzzle['Full Image URL'] }}
            style={{ width: 300, height: 300, borderRadius: 16 }}
          />
          <Text className="mt-2 text-xs text-gray-500">
            Photo by {puzzle.Photographer} ({puzzle.Source})
          </Text>

          <View className="flex-row space-x-4 mt-4">
            {status === 'won' ? (
              <TouchableOpacity
                className="bg-green-600 px-4 py-2 rounded-xl"
                onPress={() => loadPuzzle(category as string)}
              >
                <Text className="text-white text-lg">Next Puzzle</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-blue-600 px-4 py-2 rounded-xl"
                onPress={() => {
                  setStreak(0);
                  loadPuzzle(category as string);
                }}
              >
                <Text className="text-white text-lg">Play Again</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="bg-gray-600 px-4 py-2 rounded-xl"
              onPress={() => router.replace('/endless')}
            >
              <Text className="text-white text-lg">Back to Categories</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPuzzle } from './lib/getPuzzle';

export default function PuzzleScreen() {
  const [puzzle, setPuzzle] = useState<any | null>(null);
  const [guess, setGuess] = useState('');
  const [guessesLeft, setGuessesLeft] = useState(3);
  const [hintUsed, setHintUsed] = useState(false);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadPuzzle();
  }, []);

  useEffect(() => {
    if (status === 'lost' && streak > 0) {
      AsyncStorage.setItem('pendingStreak', String(streak));
      setStreak(0); // reset streak after storing
    }
  }, [status]);

  const loadPuzzle = async () => {
    setStatus('playing');
    setGuessesLeft(3);
    setHintUsed(false);
    setGuess('');
    const newPuzzle = await getPuzzle();
    setPuzzle(newPuzzle);
  };

  const normalize = (text: string) =>
    text.trim().toLowerCase().replace(/[^\w\s]/gi, '');

  const checkAnswer = () => {
    if (!puzzle) return;
    const cleanedGuess = normalize(guess);
    const accepted = [puzzle.Answer, ...(puzzle.AcceptableAnswers || [])].map(
      normalize
    );

    if (accepted.includes(cleanedGuess)) {
      setStatus('won');
      setStreak(prev => prev + 1);
    } else {
      const newGuesses = guessesLeft - 1;
      setGuessesLeft(newGuesses);
      if (newGuesses <= 0) {
        setStatus('lost');
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

  const renderDots = () => {
    return (
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
    );
  };

  if (!puzzle) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-gray-500">Loading puzzle...</Text>
      </View>
    );
  }

  const imageZoomLevel = 1 + (3 - guessesLeft) * 0.3;

  return (
    <View className="flex-1 p-4 items-center bg-white">
      <Text className="text-2xl font-bold mb-4">What The Hell Is It?</Text>

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

      {renderDots()}

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

      {status === 'won' && (
        <View className="mt-6 items-center">
          <Text className="text-2xl font-bold text-green-600 mb-2">
            You got it!
          </Text>
          <Image
            source={{ uri: puzzle['Full Image URL'] }}
            style={{ width: 300, height: 300, borderRadius: 16 }}
          />
          <Text className="mt-2 text-xs text-gray-500">
            Photo by {puzzle.Photographer} ({puzzle.Source})
          </Text>

          <TouchableOpacity
            className="bg-green-600 px-4 py-2 mt-4 rounded-xl"
            onPress={loadPuzzle}
          >
            <Text className="text-white text-lg">Next Puzzle</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'lost' && (
        <View className="mt-6 items-center">
          <Text className="text-2xl font-bold text-red-600 mb-2">
            Nope! It was:
          </Text>
          <Text className="text-xl italic mb-2">{puzzle.Answer}</Text>
          <Image
            source={{ uri: puzzle['Full Image URL'] }}
            style={{ width: 300, height: 300, borderRadius: 16 }}
          />
          <Text className="mt-2 text-xs text-gray-500">
            Photo by {puzzle.Photographer} ({puzzle.Source})
          </Text>

          <TouchableOpacity
            className="bg-red-600 px-4 py-2 mt-4 rounded-xl"
            onPress={loadPuzzle}
          >
            <Text className="text-white text-lg">Try Another</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

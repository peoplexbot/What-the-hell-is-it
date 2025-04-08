import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchPuzzle } from '../../lib/fetchPuzzle';

export default function CalendarDayScreen() {
  const { date } = useLocalSearchParams();
  const [puzzle, setPuzzle] = useState<any | null>(null);
  const [guess, setGuess] = useState('');
  const [guessesLeft, setGuessesLeft] = useState(3);
  const [hintUsed, setHintUsed] = useState(false);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const router = useRouter();

  useEffect(() => {
    if (date) {
      loadPuzzleFromDate(date as string);
    }
  }, [date]);

  const loadPuzzleFromDate = async (selectedDate: string) => {
    // Convert the date to a fake seed number to consistently pick a puzzle
    const dateSeed = selectedDate.split('-').join('');
    const puzzle = await fetchPuzzle(); // You could use category/difficulty here
    setPuzzle(puzzle);
    setStatus('playing');
    setGuessesLeft(3);
    setHintUsed(false);
    setGuess('');
  };

  const normalize = (text: string) =>
    text.trim().toLowerCase().replace(/[^\w\s]/gi, '');

  const checkAnswer = () => {
    if (!puzzle) return;
    const cleanedGuess = normalize(guess);
    const accepted = [puzzle.Answer, ...(puzzle.AcceptableAnswers || [])].map(normalize);

    if (accepted.includes(cleanedGuess)) {
      setStatus('won');
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

  const imageZoomLevel = 1 + (3 - guessesLeft) * 0.3;

  if (!puzzle) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-gray-500">Loading puzzle for {date}...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 items-center bg-white">
      <Text className="text-xl font-bold mb-2">🧩 Puzzle for {date}</Text>

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
            {status === 'won' ? '🎉 You got it!' : `❌ Nope! It was ${puzzle.Answer}`}
          </Text>
          <Image
            source={{ uri: puzzle['Full Image URL'] }}
            style={{ width: 300, height: 300, borderRadius: 16 }}
          />
          <Text className="mt-2 text-xs text-gray-500">
            Photo by {puzzle.Photographer} ({puzzle.Source})
          </Text>

          <TouchableOpacity
            className="bg-gray-600 px-4 py-2 mt-4 rounded-xl"
            onPress={() => router.replace('/calendar')}
          >
            <Text className="text-white text-lg">Back to Calendar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}


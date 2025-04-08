import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Button, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Entry = {
  name: string;
  streak: number;
  date: string;
};

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [pendingStreak, setPendingStreak] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
    checkPendingStreak();
  }, []);

  const checkPendingStreak = async () => {
    const stored = await AsyncStorage.getItem('pendingStreak');
    if (stored) {
      setPendingStreak(Number(stored));
    }
  };

  const loadLeaderboard = async () => {
    const raw = await AsyncStorage.getItem('leaderboard');
    if (raw) {
      setEntries(JSON.parse(raw));
    }
  };

  const saveEntry = async () => {
    if (!name || pendingStreak === null) return;

    const newEntry: Entry = {
      name,
      streak: pendingStreak,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [...entries, newEntry]
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 10); // Top 10 only

    await AsyncStorage.setItem('leaderboard', JSON.stringify(updated));
    await AsyncStorage.removeItem('pendingStreak');
    setEntries(updated);
    setPendingStreak(null);
    setName('');
  };

  const clearLeaderboard = async () => {
    await AsyncStorage.removeItem('leaderboard');
    setEntries([]);
  };

  return (
    <KeyboardAvoidingView className="flex-1 p-4 bg-white" behavior="padding">
      <Text className="text-2xl font-bold text-center mb-4">🏆 Leaderboard</Text>

      {pendingStreak !== null && (
        <View className="mb-6">
          <Text className="text-lg mb-2">You got a streak of {pendingStreak}!</Text>
          <TextInput
            className="border px-3 py-2 rounded mb-2"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <Button title="Save My Score" onPress={saveEntry} />
        </View>
      )}

      <FlatList
        data={entries}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        ListEmptyComponent={<Text className="text-center text-gray-500">No scores yet.</Text>}
        renderItem={({ item, index }) => (
          <View className="flex-row justify-between py-2 border-b">
            <Text>{index + 1}. {item.name}</Text>
            <Text>{item.streak}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        className="mt-8 bg-gray-200 px-4 py-2 rounded"
        onPress={clearLeaderboard}
      >
        <Text className="text-center text-gray-700 text-sm">Clear Leaderboard</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}


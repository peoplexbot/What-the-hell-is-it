import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Entry = {
  name: string;
  streak: number;
  date: string;
};

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [streak, setStreak] = useState<number | null>(null);
  const [showEntry, setShowEntry] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const stored = await AsyncStorage.getItem('leaderboard');
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  };

  const saveEntry = async () => {
    if (!name || streak === null) return;

    const newEntry = { name, streak, date: new Date().toISOString().split('T')[0] };
    const updated = [...entries, newEntry].sort((a, b) => b.streak - a.streak).slice(0, 10); // top 10
    setEntries(updated);
    await AsyncStorage.setItem('leaderboard', JSON.stringify(updated));
    setName('');
    setStreak(null);
    setShowEntry(false);
  };

  const clearLeaderboard = async () => {
    await AsyncStorage.removeItem('leaderboard');
    setEntries([]);
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4 text-center">🏆 Leaderboard</Text>

      {showEntry && (
        <View className="mb-4">
          <Text className="mb-1">Enter your name for a streak of {streak}:</Text>
          <TextInput
            className="border px-2 py-1 rounded mb-2"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
          <Button title="Save Score" onPress={saveEntry} />
        </View>
      )}

      <FlatList
        data={entries}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item, index }) => (
          <View className="flex-row justify-between border-b py-2">
            <Text>{index + 1}. {item.name}</Text>
            <Text>{item.streak}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        className="bg-gray-300 rounded-lg px-4 py-2 mt-6"
        onPress={clearLeaderboard}
      >
        <Text className="text-center text-sm">Clear Leaderboard</Text>
      </TouchableOpacity>
    </View>
  );
}


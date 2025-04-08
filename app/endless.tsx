import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  'Food',
  'Animals',
  'Sports',
  'Nature',
  'Surprise Me!',
];

export default function EndlessModeScreen() {
  const router = useRouter();

  const handleSelect = (category: string) => {
    router.push({
      pathname: '/category-play',
      params: { category },
    });
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">
        🎯 Pick a Category
      </Text>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-blue-100 border border-blue-400 px-4 py-3 rounded-xl mb-3"
            onPress={() => handleSelect(item)}
          >
            <Text className="text-lg text-center text-blue-800 font-semibold">
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}


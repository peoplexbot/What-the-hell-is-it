import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

// 🔄 Replace this with actual dynamic data later
const puzzle = {
  imageUrl: '', // Try an empty string to test the fallback
};

const safeImage = (url?: string) =>
  url ? { uri: url } : require('../../../assets/images/placeholder.jpg');

export default function GameScreen() {
  return (
    <View className="flex-1 bg-white pt-12 px-4">
      {/* Game Title */}
      <Text className="text-3xl font-bold text-center mb-6 text-indigo-600">
        What The Hell Is It?
      </Text>

      {/* Puzzle Image Card */}
      <View className="bg-gray-100 rounded-2xl shadow-md p-4 mb-4">
        <Image
          source={safeImage(puzzle?.imageUrl)}
          className="w-full h-60 rounded-xl"
          resizeMode="cover"
        />
      </View>

      {/* Clue / Hint Area */}
      <Text className="text-lg text-gray-800 text-center mb-2">
        🔍 Guess what you’re looking at!
      </Text>

      {/* Input Area */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity className="flex-1 bg-indigo-600 py-3 rounded-xl mx-2">
          <Text className="text-white text-center text-lg font-semibold">Submit Guess</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-yellow-500 px-4 py-3 rounded-xl">
          <Text className="text-white text-lg font-semibold">Hint</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Dots */}
      <View className="flex-row justify-center space-x-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <View key={i} className="w-4 h-4 rounded-full bg-gray-300" />
        ))}
      </View>

      {/* Reveal Button or Result */}
      <TouchableOpacity className="bg-green-600 py-3 rounded-xl">
        <Text className="text-white text-center text-lg font-semibold">Reveal Answer</Text>
      </TouchableOpacity>
    </View>
  );
}

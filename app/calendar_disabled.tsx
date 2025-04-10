import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDayPress = (day: { dateString: string }) => {
    const today = new Date().toISOString().split('T')[0];
    if (day.dateString > today) {
      Alert.alert("Slow down!", "You can't play puzzles from the future!");
      return;
    }

    setSelectedDate(day.dateString);
    router.push(`/calendar/${day.dateString}`); // later we’ll build this route
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-4">📅 Puzzle Archive</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={
          selectedDate
            ? {
                [selectedDate]: {
                  selected: true,
                  selectedColor: '#00BFA6',
                },
              }
            : undefined
        }
        theme={{
          todayTextColor: '#00BFA6',
          selectedDayBackgroundColor: '#00BFA6',
          arrowColor: '#00BFA6',
        }}
      />
    </View>
  );
}


import React from 'react';
import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 24 }}>👋 Hello World from Expo!</Text>
    </View>
  );
}

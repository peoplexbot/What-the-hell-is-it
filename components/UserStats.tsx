import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy, Flame } from 'lucide-react-native';

interface UserStatsProps {
  currentStreak: number;
  maxStreak: number;
}

export default function UserStats({ currentStreak, maxStreak }: UserStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Flame size={24} color="#ef4444" />
        <Text style={styles.statValue}>{currentStreak}</Text>
        <Text style={styles.statLabel}>Current Streak</Text>
      </View>
      
      <View style={styles.statItem}>
        <Trophy size={24} color="#f59e0b" />
        <Text style={styles.statValue}>{maxStreak}</Text>
        <Text style={styles.statLabel}>Best Streak</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});
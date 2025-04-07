import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type ScoreEntry = {
  id: string;
  username: string;
  score: number;
  date: string;
};

export default function LeaderboardScreen() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const today = new Date().toISOString().split('T')[0];
  const PAGE_SIZE = 10;

  useEffect(() => {
    const init = async () => {
      const storedName = await AsyncStorage.getItem('username');
      if (storedName) setUsername(storedName);
      await fetchScores(1);
      if (storedName) fetchPersonalBest(storedName);
    };

    init();
  }, []);

  const fetchScores = async (pageNum: number) => {
    const from = (pageNum - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('daily_scores')
      .select('*')
      .eq('date', today)
      .order('score', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error loading scores:', error);
    } else {
      setScores(prev => [...prev, ...(data || [])]);
      if (!data || data.length < PAGE_SIZE) setHasMore(false);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  const fetchPersonalBest = async (name: string) => {
    const { data, error } = await supabase
      .from('daily_scores')
      .select('score')
      .eq('username', name)
      .order('score', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      setPersonalBest(data[0].score);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchScores(nextPage);
    setPage(nextPage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🏆 Daily Leaderboard</Text>
      <Text style={styles.subtitle}>Scores for {today}</Text>

      {username && personalBest !== null && (
        <Text style={styles.personalBest}>
          🧠 {username}'s Personal Best: {personalBest}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <>
          <FlatList
            data={scores}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.scoreRow}>
                <Text style={styles.rank}>{index + 1}.</Text>
                <Text style={styles.name}>{item.username}</Text>
                <Text style={styles.score}>{item.score}</Text>
              </View>
            )}
          />
          {hasMore && !loadingMore && (
            <TouchableOpacity style={styles.loadMore} onPress={handleLoadMore}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          )}
          {loadingMore && (
            <ActivityIndicator size="small" color="#3b82f6" style={{ marginTop: 10 }} />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 12 },
  personalBest: {
    fontSize: 16,
    color: '#0f766e',
    fontWeight: '600',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
  },
  rank: { fontSize: 16, fontWeight: 'bold', color: '#1e40af' },
  name: { fontSize: 16, flex: 1, paddingLeft: 10 },
  score: { fontSize: 16, fontWeight: 'bold', color: '#0ea5e9' },
  loadMore: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  loadMoreText: {
    fontWeight: '600',
    color: '#0284c7',
  },
});

import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import CategoryCard from '../../components/CategoryCard';

const categories = [
  { label: 'Animals & Nature', iconName: 'nature' },
  { label: 'Movies & TV Shows', iconName: 'movies' },
  { label: 'Places & Landmarks', iconName: 'places' },
  { label: 'Famous People', iconName: 'people' },
  { label: 'Surprise Me!', iconName: 'random' },
];

type ScreenState = 'idle' | 'loading';

const EndlessScreen = () => {
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const handleCategorySelect = async (categoryLabel: string) => {
    try {
      setScreenState('loading');

      // Handle "Surprise Me!"
      const realCategories = categories.filter(c => c.label !== 'Surprise Me!');
      const categoryParam =
        categoryLabel !== 'Surprise Me!'
          ? categoryLabel
          : realCategories[Math.floor(Math.random() * realCategories.length)].label;

      const difficultyParam = 'easy';

      const baseUrl =
        'https://script.google.com/macros/s/AKfycbwhDxXzrdYbWKtue59ATIqIs7-jWXU5_Z-6VaSo_d3eCCEiZ_52Nmg3QCmYPc46tpFu1g/exec';
      const url = new URL(baseUrl);
      url.searchParams.append('category', categoryParam);
      url.searchParams.append('difficulty', difficultyParam);

      const response = await fetch(url.toString());

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Fetch error (${response.status}): ${text}`);
      }

      const puzzleData = await response.json();
      console.log('Loaded puzzle:', puzzleData);

      if (!puzzleData || !puzzleData.Answer) {
        throw new Error('Invalid puzzle data received.');
      }

      // ✅ Correct route to puzzle screen
      router.push({
        pathname: '/puzzle',
        params: {
          answer: puzzleData.Answer,
          imageUrl: puzzleData['Image URL'],
          fullImageUrl: puzzleData['Zoomed Image URL'] || puzzleData['Image URL'],
          acceptable_answers: JSON.stringify(
            puzzleData['Acceptable Answers']?.split(',').map(s => s.trim()) || []
          ),
          hint: puzzleData.Clue,
          category: puzzleData.Category,
          photographer: puzzleData['Photographer Name'],
          photographerUrl: puzzleData['Photo Source'],
          isDaily: 'false',
        },
      });
    } catch (error: any) {
      console.error('Error in handleCategorySelect:', error);
      Alert.alert(
        'Error Loading Puzzle',
        error?.message || 'Could not fetch puzzle. Please try again.'
      );
    } finally {
      setScreenState('idle');
    }
  };

  const renderCategoryCard = ({ item }: { item: typeof categories[0] }) => (
    <View style={styles.cardWrapper}>
      <CategoryCard
        label={item.label}
        iconName={item.iconName}
        onPress={() => handleCategorySelect(item.label)}
      />
    </View>
  );

  if (screenState === 'loading') {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading puzzle...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose a Category</Text>
        <Text style={styles.subtitle}>Select a category for unlimited puzzles!</Text>
      </View>
      <FlatList
        data={categories}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item.label}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  listContainer: {
    padding: 10,
  },
  cardWrapper: {
    flex: 1,
    padding: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
});

export default EndlessScreen;

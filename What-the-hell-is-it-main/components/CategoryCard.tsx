import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Chrome, Map, User as User2, Film, Shuffle } from 'lucide-react-native';

const cardWidth = Dimensions.get('window').width / 2 - 20;

type IconName = 'nature' | 'movies' | 'places' | 'people' | 'random';

interface CategoryCardProps {
  label: string;
  iconName: IconName;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ label, iconName, onPress }) => {
  const getIcon = () => {
    switch (iconName) {
      case 'nature':
        return <Chrome size={48} color="#2563eb" />;
      case 'movies':
        return <Film size={48} color="#7c3aed" />;
      case 'places':
        return <Map size={48} color="#16a34a" />;
      case 'people':
        return <User2 size={48} color="#dc2626" />;
      case 'random':
        return <Shuffle size={48} color="#6b7280" />;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <View style={styles.innerContainer}>
        {getIcon()}
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default CategoryCard;
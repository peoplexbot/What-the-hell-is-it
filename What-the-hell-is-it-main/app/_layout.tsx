import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { getPuzzle } from '../lib/getPuzzle'; // Adjust this if needed

export default function Layout() {
  const [puzzle, setPuzzle] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getPuzzle()
      .then(setPuzzle)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <View style={{ padding: 50 }}>
      {error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : puzzle ? (
        <Text>{JSON.stringify(puzzle, null, 2)}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

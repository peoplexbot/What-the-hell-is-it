// app/lib/fetchPuzzle.ts
import { API_URL } from '../constants/api';

export async function fetchPuzzle(category?: string, difficulty?: string) {
  let url = API_URL;
  const params = new URLSearchParams();

  if (category && category !== 'Surprise Me!') {
    params.append('category', category);
  }

  if (difficulty) {
    params.append('difficulty', difficulty);
  }

  if (params.toString()) {
    url += '?' + params.toString();
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch puzzle: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

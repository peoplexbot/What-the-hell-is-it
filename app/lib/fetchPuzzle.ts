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
  const data = await res.json();
  return data;
}


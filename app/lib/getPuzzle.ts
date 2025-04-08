import { PUZZLE_API_URL } from '../constants/api';

export async function fetchPuzzle(category?: string, difficulty?: string) {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);

    const res = await fetch(`${PUZZLE_API_URL}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch puzzle');

    const puzzle = await res.json();
    return puzzle;
  } catch (e) {
    console.warn('Falling back to local puzzle due to fetch error:', e);
    return getLocalFallbackPuzzle();
  }
}

function getLocalFallbackPuzzle() {
  return {
    Category: "Food",
    Difficulty: "Easy",
    Answer: "banana",
    AcceptableAnswers: ["banana", "bananas"],
    Clue: "You peel it before you eat it.",
    FunnyHint: "Minions approve.",
    "Zoomed Image URL": "https://images.pexels.com/photos/208450/pexels-photo-208450.jpeg",
    "Full Image URL": "https://images.pexels.com/photos/208450/pexels-photo-208450.jpeg",
    Photographer: "Pixabay",
    Source: "https://www.pexels.com/photo/banana-fruit-208450/"
  };
}

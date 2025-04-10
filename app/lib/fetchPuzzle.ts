// app/lib/fetchPuzzle.ts
export async function fetchPuzzle(category?: string, difficulty?: string) {
  const response = await fetch('https://omewpciftgobcpgnyoec.supabase.co/functions/v1/generate-puzzle', {
    method: 'POST',
    body: JSON.stringify({ category, difficulty }),
  });

  if (!response.ok) throw new Error('Failed to fetch puzzle');
  return await response.json();
}

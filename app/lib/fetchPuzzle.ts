export async function fetchPuzzle(category?: string) {
  const baseUrl = 'https://omewpciftgobcpgnyoec.supabase.co/functions/v1/generate-puzzle';

  const url = category
    ? `${baseUrl}?category=${encodeURIComponent(category)}`
    : baseUrl;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Optional: Add an anon/public API key if your Supabase Edge Function requires it
        // 'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const puzzle = await response.json();
    return puzzle;
  } catch (error) {
    console.error('❌ fetchPuzzle failed:', error);
    throw error;
  }
}

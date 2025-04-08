export async function fetchPuzzle(category?: string, difficulty?: string) {
  const baseUrl =
    'https://script.google.com/macros/s/AKfycbzOa9ETv1K3tozEtBuGfR_vND5uAWXuVcVMM1kb-ggH-iUhNeLcSaT97D910rxGqFi1sQ/exec';

  let url = baseUrl;
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

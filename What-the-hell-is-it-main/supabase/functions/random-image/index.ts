import { Hono } from 'npm:hono@4.0.5';
import { cors } from 'npm:hono@4.0.5/cors';

const app = new Hono();
app.use('/*', cors());

const UNSPLASH_ACCESS_KEY = Deno.env.get('UNSPLASH_ACCESS_KEY');
const categories = [
  'cat', 'dog', 'bird', 'coffee', 'pizza', 'guitar', 'keyboard', 'computer',
  'flower', 'tree', 'mountain', 'beach', 'car', 'bicycle', 'book', 'clock',
  'lamp', 'chair', 'table', 'phone', 'camera', 'painting', 'sculpture'
];

app.get('/', async (c) => {
  try {
    // Get a random category
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // Fetch a random image from Unsplash
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${category}&orientation=squarish`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash');
    }

    const data = await response.json();
    
    return c.json({
      imageUrl: data.urls.regular + '&w=800',
      answer: category,
      photographer: data.user.name,
      photographerUrl: data.user.links.html,
    });
  } catch (error) {
    console.error('Error:', error);
    return c.json({ error: 'Failed to fetch image' }, 500);
  }
});

Deno.serve(app.fetch);
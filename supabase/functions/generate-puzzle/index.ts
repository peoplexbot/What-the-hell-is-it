import { Hono } from 'npm:hono@4.0.5';
import { cors } from 'npm:hono@4.0.5/cors';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const app = new Hono();
app.use('/*', cors());

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const UNSPLASH_ACCESS_KEY = Deno.env.get('UNSPLASH_ACCESS_KEY');

// Easy mode: Super simple, everyday objects that are immediately recognizable
const easyModeTerms = {
  'Animals & Nature': [
    'monkey', 'elephant', 'giraffe', 'lion', 'tiger',
    'zebra', 'penguin', 'panda', 'koala', 'kangaroo'
  ],
  'Movies & TV Shows': [
    'popcorn', 'movie theater', 'television', 'camera', 'microphone',
    'headphones', 'remote control', 'screen', 'speaker', 'projector'
  ],
  'Places & Landmarks': [
    'beach', 'mountain', 'castle', 'bridge', 'tower',
    'waterfall', 'desert', 'forest', 'island', 'lake'
  ],
  'Famous People': [
    'singer', 'actor', 'athlete', 'musician', 'dancer',
    'artist', 'chef', 'teacher', 'doctor', 'firefighter'
  ]
};

// Regular mode: More varied and challenging objects
const regularModeTerms = {
  'Animals & Nature': [
    'dog', 'cat', 'bird', 'horse', 'fish',
    'elephant', 'giraffe', 'lion', 'tiger', 'penguin',
    'panda', 'koala', 'monkey', 'zebra', 'bear'
  ],
  'Food & Drinks': [
    'pizza', 'hamburger', 'ice cream', 'coffee', 'cake',
    'donut', 'cookie', 'sandwich', 'apple', 'banana',
    'orange', 'french fries', 'sushi', 'chocolate', 'pasta'
  ],
  'Everyday Objects': [
    'chair', 'table', 'bed', 'lamp', 'phone',
    'computer', 'tv', 'car', 'bicycle', 'book',
    'pen', 'cup', 'bottle', 'glasses', 'watch'
  ],
  'Places & Landmarks': [
    'beach', 'mountain', 'park', 'house', 'building',
    'bridge', 'road', 'garden', 'pool', 'playground',
    'school', 'store', 'restaurant', 'stadium', 'mall'
  ]
};

function cleanAndNormalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function generateAcceptableAnswers(mainAnswer: string, description: string, tags: string[]): string[] {
  const answers = new Set<string>();
  const cleanMainAnswer = cleanAndNormalizeText(mainAnswer);
  
  // Add the main answer
  answers.add(cleanMainAnswer);
  
  // Add common variations
  const variations: { [key: string]: string[] } = {
    'dog': ['puppy', 'doggy', 'pup'],
    'cat': ['kitty', 'kitten'],
    'bird': ['birdie'],
    'hamburger': ['burger'],
    'television': ['tv'],
    'automobile': ['car'],
    'telephone': ['phone'],
    'bicycle': ['bike'],
    'computer': ['laptop', 'pc'],
    'coffee': ['coffee cup', 'cup of coffee'],
    'mountain': ['mountains', 'hill'],
    'building': ['tower', 'skyscraper'],
    'monkey': ['ape', 'primate', 'chimp', 'chimpanzee'],
    'elephant': ['elephants'],
    'giraffe': ['giraffes'],
    'lion': ['lions', 'big cat'],
    'tiger': ['tigers', 'big cat'],
    'penguin': ['penguins'],
    'panda': ['pandas', 'bear'],
    'koala': ['koalas', 'bear'],
    'beach': ['seashore', 'seaside', 'coast'],
    'castle': ['palace', 'fortress'],
    'bridge': ['bridges', 'overpass'],
    'tower': ['towers', 'skyscraper'],
    'waterfall': ['falls', 'cascade'],
    'forest': ['woods', 'woodland'],
    'island': ['isle', 'islet'],
    'lake': ['pond', 'lagoon']
  };
  
  if (variations[cleanMainAnswer]) {
    variations[cleanMainAnswer].forEach(v => answers.add(v));
  }
  
  // Add relevant words from description and tags
  const allWords = [
    ...description.toLowerCase().split(/\s+/),
    ...tags.map(tag => tag.toLowerCase())
  ];
  
  allWords.forEach(word => {
    const cleaned = cleanAndNormalizeText(word);
    if (cleaned === cleanMainAnswer || variations[cleanMainAnswer]?.includes(cleaned)) {
      answers.add(cleaned);
    }
  });
  
  return Array.from(answers);
}

function generateHint(category: string, answer: string, isEasyMode: boolean): string {
  if (isEasyMode) {
    return "Look at the whole picture. What do you see?";
  }

  const hints: { [key: string]: string[] } = {
    'Animals & Nature': [
      'A common animal that many people love',
      'You might see this creature every day',
      'A popular pet in many homes',
      'This animal is known worldwide'
    ],
    'Food & Drinks': [
      'A popular food that most people enjoy',
      'You might eat this for a meal or snack',
      'A common dish found in many places',
      'This is a favorite food for many people'
    ],
    'Everyday Objects': [
      'You probably use this every day',
      'Found in most homes',
      'A common item you see regularly',
      'This helps people in their daily life'
    ],
    'Places & Landmarks': [
      'A place you might visit often',
      'You can find this in most cities',
      'Many people go here regularly',
      'A common location in our daily lives'
    ]
  };

  const categoryHints = hints[category] || hints['Everyday Objects'];
  return categoryHints[Math.floor(Math.random() * categoryHints.length)];
}

async function generatePuzzle(category: string | null, isEasyMode: boolean = false) {
  try {
    const searchTerms = isEasyMode ? easyModeTerms : regularModeTerms;
    
    if (!category || !searchTerms[category as keyof typeof searchTerms]) {
      category = isEasyMode ? 'Animals & Nature' : 'Everyday Objects';
    }

    const availableTerms = searchTerms[category as keyof typeof searchTerms];
    const searchTerm = availableTerms[Math.floor(Math.random() * availableTerms.length)];

    console.log(`Generating ${isEasyMode ? 'easy' : 'regular'} puzzle for category: ${category}, search term: ${searchTerm}`);

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchTerm)}&orientation=squarish`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch from Unsplash: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    const timestamp = Date.now();
    const randomParam = Math.random().toString(36).substring(7);
    
    const imageUrl = new URL(data.urls.regular);
    imageUrl.searchParams.set('w', '800');
    imageUrl.searchParams.set('t', timestamp.toString());
    imageUrl.searchParams.set('r', randomParam);
    
    const fullImageUrl = new URL(data.urls.regular);
    fullImageUrl.searchParams.set('w', '1200');
    fullImageUrl.searchParams.set('t', timestamp.toString());
    fullImageUrl.searchParams.set('r', randomParam);

    const tags = data.tags?.map((tag: any) => tag.title) || [];
    const description = data.description || data.alt_description || '';
    
    const acceptableAnswers = generateAcceptableAnswers(searchTerm, description, tags);
    const hint = generateHint(category, searchTerm, isEasyMode);

    return {
      imageUrl: imageUrl.toString(),
      fullImageUrl: fullImageUrl.toString(),
      answer: searchTerm,
      hint,
      category,
      photographer: data.user.name,
      photographerUrl: data.user.links.html,
      acceptable_answers: acceptableAnswers,
      difficulty: isEasyMode ? 'easy' : 'regular'
    };
  } catch (error) {
    console.error('Error generating puzzle:', error);
    throw error;
  }
}

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const category = body.category || null;
    const isEasyMode = body.difficulty === 'easy';
    
    let attempts = 0;
    const maxAttempts = 5;
    let puzzle = null;
    let lastError = null;
    
    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1}/${maxAttempts} to generate puzzle`);
        puzzle = await generatePuzzle(category, isEasyMode);
        
        if (!puzzle.answer) {
          console.log('Generated puzzle has no answer, retrying...');
          attempts++;
          continue;
        }

        const { error: dbError } = await supabase
          .from('images')
          .insert({
            zoomed_image_url: puzzle.imageUrl,
            full_image_url: puzzle.fullImageUrl,
            correct_answer: puzzle.answer,
            acceptable_answers: JSON.stringify(puzzle.acceptable_answers),
            hint: puzzle.hint,
            category: puzzle.category,
            photographer: puzzle.photographer,
            photographer_url: puzzle.photographerUrl
          });

        if (dbError) {
          console.error('Database error:', dbError);
          throw new Error('Failed to save puzzle to database');
        }
        
        console.log('Successfully generated and saved puzzle');
        return c.json(puzzle);
        
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
        lastError = error;
        attempts++;
      }
    }
    
    throw new Error(`Failed to generate puzzle after ${maxAttempts} attempts. Last error: ${lastError?.message}`);
  } catch (error) {
    console.error('Error:', error);
    return c.json({ 
      error: 'Failed to generate puzzle',
      details: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);
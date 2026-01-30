/**
 * Recipe Service
 *
 * Supports two backends:
 * 1. Spoonacular API (structured recipe database)
 * 2. OpenAI GPT API (creative AI-generated recipes)
 *
 * Set the appropriate API keys below.
 */

const SPOONACULAR_API_KEY = 'YOUR_SPOONACULAR_API_KEY';
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

// ---------- Spoonacular ----------

async function searchByIngredientsSpoonacular(ingredients) {
  const query = ingredients.join(',+');
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(query)}&number=5&ranking=1&apiKey=${SPOONACULAR_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error('Spoonacular returned unexpected data');
  }

  // Fetch details for each recipe
  const detailed = await Promise.all(
    data.map(async (r) => {
      const detailUrl = `https://api.spoonacular.com/recipes/${r.id}/information?includeNutrition=false&apiKey=${SPOONACULAR_API_KEY}`;
      const detailRes = await fetch(detailUrl);
      const detail = await detailRes.json();
      return {
        id: String(r.id),
        title: detail.title,
        image: detail.image,
        readyInMinutes: detail.readyInMinutes,
        servings: detail.servings,
        ingredients: (detail.extendedIngredients || []).map((i) => i.original),
        steps: (detail.analyzedInstructions?.[0]?.steps || []).map(
          (s) => s.step
        ),
        source: 'spoonacular',
      };
    })
  );

  return detailed;
}

// ---------- OpenAI GPT ----------

async function generateRecipesWithGPT(ingredients) {
  const prompt = `You are a creative chef. Based on these ingredients I have: [${ingredients.join(', ')}], plus common seasonings (oil, salt, soy sauce, pepper), suggest 4 simple recipes.

Return ONLY a valid JSON array. Each element must have:
- "title": recipe name (string)
- "readyInMinutes": estimated cook time (number)
- "servings": number of servings (number)
- "ingredients": array of ingredient strings with amounts
- "steps": array of step strings in order

No extra text, just the JSON array.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '[]';

  // Extract JSON from the response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('GPT did not return valid JSON');

  const recipes = JSON.parse(jsonMatch[0]);
  return recipes.map((r, i) => ({
    id: `gpt-${Date.now()}-${i}`,
    title: r.title,
    image: null,
    readyInMinutes: r.readyInMinutes || 30,
    servings: r.servings || 2,
    ingredients: r.ingredients || [],
    steps: r.steps || [],
    source: 'gpt',
  }));
}

// ---------- Mock recipes for demo ----------

function getMockRecipes(ingredients) {
  const ingStr = ingredients.join(', ');
  return [
    {
      id: 'mock-1',
      title: 'Stir-Fried ' + ingredients.slice(0, 2).join(' & '),
      image: null,
      readyInMinutes: 15,
      servings: 2,
      ingredients: [
        ...ingredients.map((i) => `${i} - appropriate amount`),
        'Oil - 2 tbsp',
        'Salt - to taste',
        'Soy sauce - 1 tbsp',
      ],
      steps: [
        `Wash and prepare all ingredients: ${ingStr}.`,
        'Heat oil in a wok or large pan over high heat.',
        `Add ${ingredients[0] || 'main ingredient'} and stir-fry for 2 minutes.`,
        `Add remaining ingredients and stir-fry for 3-4 minutes.`,
        'Season with salt and soy sauce. Serve hot.',
      ],
      source: 'mock',
    },
    {
      id: 'mock-2',
      title: ingredients[0] + ' Soup',
      image: null,
      readyInMinutes: 25,
      servings: 2,
      ingredients: [
        ...ingredients.map((i) => `${i} - appropriate amount`),
        'Water - 4 cups',
        'Salt - to taste',
        'Sesame oil - a drizzle',
      ],
      steps: [
        `Dice all ingredients: ${ingStr}.`,
        'Bring 4 cups of water to a boil in a pot.',
        `Add ${ingredients[0] || 'main ingredient'} first, cook for 5 minutes.`,
        'Add remaining ingredients, simmer for 15 minutes.',
        'Season with salt and drizzle sesame oil before serving.',
      ],
      source: 'mock',
    },
    {
      id: 'mock-3',
      title: 'Braised ' + ingredients.slice(0, 2).join(' with '),
      image: null,
      readyInMinutes: 35,
      servings: 3,
      ingredients: [
        ...ingredients.map((i) => `${i} - appropriate amount`),
        'Soy sauce - 2 tbsp',
        'Sugar - 1 tsp',
        'Ginger - 3 slices',
        'Water - 1 cup',
      ],
      steps: [
        `Prepare all ingredients: ${ingStr}. Cut into even pieces.`,
        'Heat oil in a pan, add ginger slices and fry until fragrant.',
        `Add ${ingredients[0]} and sear on both sides.`,
        'Add soy sauce, sugar, and water. Bring to a boil.',
        'Reduce heat, cover, and braise for 20 minutes.',
        'Add remaining ingredients in the last 5 minutes.',
        'Serve when sauce has thickened.',
      ],
      source: 'mock',
    },
    {
      id: 'mock-4',
      title: 'Quick ' + ingredients[0] + ' Salad',
      image: null,
      readyInMinutes: 10,
      servings: 2,
      ingredients: [
        ...ingredients.map((i) => `${i} - appropriate amount`),
        'Olive oil - 2 tbsp',
        'Lemon juice - 1 tbsp',
        'Salt & pepper - to taste',
      ],
      steps: [
        `Wash and prepare all ingredients: ${ingStr}.`,
        'Cut ingredients into bite-sized pieces.',
        'Toss everything together in a large bowl.',
        'Drizzle with olive oil and lemon juice.',
        'Season with salt and pepper. Mix well and serve.',
      ],
      source: 'mock',
    },
  ];
}

// ---------- Public API ----------

/**
 * Fetch recipes based on ingredient list.
 * Tries Spoonacular first, falls back to GPT, then mock data.
 */
export async function getRecipes(ingredients) {
  // Try Spoonacular
  if (SPOONACULAR_API_KEY !== 'YOUR_SPOONACULAR_API_KEY') {
    try {
      return await searchByIngredientsSpoonacular(ingredients);
    } catch (e) {
      console.warn('Spoonacular failed:', e);
    }
  }

  // Try GPT
  if (OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY') {
    try {
      return await generateRecipesWithGPT(ingredients);
    } catch (e) {
      console.warn('GPT failed:', e);
    }
  }

  // Fallback to mock
  return getMockRecipes(ingredients);
}

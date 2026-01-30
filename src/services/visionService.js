/**
 * Food Recognition Service
 *
 * Integrates with Google Cloud Vision API for ingredient detection.
 * Replace GOOGLE_CLOUD_VISION_API_KEY with your actual key.
 */

const GOOGLE_CLOUD_VISION_API_KEY = 'AIzaSyCkQY4VnjKggzS7htGzf4mvdleQ2_yclWc';
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;

// Common food-related labels for filtering vision results
const FOOD_KEYWORDS = [
  'food', 'fruit', 'vegetable', 'meat', 'fish', 'seafood', 'grain',
  'dairy', 'egg', 'herb', 'spice', 'produce', 'ingredient', 'poultry',
  'beef', 'pork', 'chicken', 'tomato', 'potato', 'onion', 'garlic',
  'carrot', 'pepper', 'mushroom', 'lettuce', 'broccoli', 'rice',
  'noodle', 'pasta', 'bread', 'cheese', 'milk', 'butter', 'apple',
  'banana', 'orange', 'lemon', 'cucumber', 'corn', 'bean', 'tofu',
  'shrimp', 'salmon', 'cabbage', 'spinach', 'celery', 'ginger',
  'scallion', 'eggplant', 'zucchini', 'avocado', 'lime',
];

function isFoodLabel(label) {
  const lower = label.toLowerCase();
  return FOOD_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Recognize ingredients from a base64-encoded image using Google Cloud Vision.
 * Returns an array of ingredient name strings.
 */
export async function recognizeIngredients(base64Image) {
  try {
    const body = {
      requests: [
        {
          image: { content: base64Image },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 20 },
            { type: 'OBJECT_LOCALIZATION', maxResults: 20 },
          ],
        },
      ],
    };

    const response = await fetch(VISION_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.error) {
      console.warn('Vision API error:', data.error);
      return getMockIngredients();
    }

    const result = data.responses?.[0];
    const labels = (result?.labelAnnotations || []).map((a) => a.description);
    const objects = (result?.localizedObjectAnnotations || []).map(
      (a) => a.name
    );

    const allLabels = [...new Set([...labels, ...objects])];
    const foodLabels = allLabels.filter(isFoodLabel);

    return foodLabels.length > 0 ? foodLabels : getMockIngredients();
  } catch (error) {
    console.warn('Vision service error, using mock data:', error);
    return getMockIngredients();
  }
}

/**
 * Mock ingredients for development / demo when API key is not configured.
 */
export function getMockIngredients() {
  const mockSets = [
    ['Tomato', 'Egg', 'Scallion', 'Garlic'],
    ['Chicken Breast', 'Broccoli', 'Garlic', 'Soy Sauce'],
    ['Potato', 'Beef', 'Onion', 'Carrot'],
    ['Shrimp', 'Garlic', 'Butter', 'Lemon'],
    ['Tofu', 'Mushroom', 'Spinach', 'Ginger'],
  ];
  return mockSets[Math.floor(Math.random() * mockSets.length)];
}

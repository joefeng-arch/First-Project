# CLAUDE.md — Magic Food App (食材魔法师)

This file provides guidance for AI assistants working in this codebase.

## Project Overview

**Magic Food App** (食材魔法师, "Food Magician") is a React Native + Expo mobile application that helps users turn ingredients into recipes. Users can photograph ingredients, pick from their photo library, or type them manually — the app then detects what's in the image and suggests matching recipes.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81.5 + Expo ~54.0.32 |
| Language | JavaScript (JSX, no TypeScript) |
| Navigation | React Navigation 7 (native stack) |
| Camera / Gallery | expo-camera, expo-image-picker |
| Vision API | Google Cloud Vision (image → ingredients) |
| Recipe APIs | Spoonacular (primary), OpenAI GPT-3.5 (secondary), mock data (fallback) |
| Web support | react-native-web |

## Repository Structure

```
First-Project/
├── App.js                          # Root component — navigation stack definition
├── index.js                        # Expo entry point
├── app.json                        # Expo project config (name, icons, orientation)
├── package.json                    # Dependencies and npm scripts
├── assets/                         # App icons and splash screens (PNG)
└── src/
    ├── screens/
    │   ├── HomeScreen.js           # Entry screen: camera / album / manual input
    │   ├── IngredientConfirmScreen.js  # Review & edit detected ingredients
    │   ├── RecipeListScreen.js     # Scrollable list of matching recipes
    │   └── RecipeDetailScreen.js   # Full recipe: ingredients + steps
    └── services/
        ├── visionService.js        # Google Cloud Vision API + food-label filtering
        └── recipeService.js        # Recipe fetching: Spoonacular → GPT → mock
```

## Development Commands

```bash
npm start            # Start Expo dev server (choose platform interactively)
npm run android      # Open on Android emulator / device
npm run ios          # Open on iOS simulator / device
npm run web          # Open in browser (react-native-web)
```

No build step is required; Metro bundler compiles on the fly.

## Architecture & Key Patterns

### Screen-based navigation with prop drilling
All UI lives in discrete screen components under `src/screens/`. Screens communicate exclusively through React Navigation route params (`navigation.navigate('ScreenName', { key: value })` and `route.params`).

### Service layer
Business logic is isolated in `src/services/`:
- `visionService.js` — sends base64 images to Google Cloud Vision and filters labels against a hard-coded `FOOD_KEYWORDS` list; falls back to `getMockIngredients()`.
- `recipeService.js` — tries Spoonacular first, then OpenAI GPT, then returns `getMockRecipes()` when neither API key is configured.

### Graceful API degradation
```
Primary (Spoonacular) → Secondary (OpenAI GPT) → Mock data
```
API keys are stored as module-level constants with `'YOUR_..._API_KEY'` placeholders. The services check for these placeholders before attempting real network calls.

### State management
Local `useState` + `useEffect` only; no global state (no Redux, Context, Zustand). Inter-screen data flows through `route.params`.

## Code Conventions

### Naming
- **Components / screens**: `PascalCase` (`HomeScreen`, `RecipeDetailScreen`)
- **Functions / variables**: `camelCase` (`recognizeIngredients`, `imageBase64`)
- **Constants**: `UPPER_SNAKE_CASE` (`SPOONACULAR_API_KEY`, `FOOD_KEYWORDS`)
- **Files**: match their default export name (`HomeScreen.js` exports `HomeScreen`)

### Component structure
All components are functional (no class components). Each screen file follows this order:
1. Imports
2. API key constants (if any)
3. Component function with hooks at the top
4. Return JSX
5. `StyleSheet.create({})` at the bottom

### Styling
- Every component uses `StyleSheet.create()` — no inline style objects except minor one-offs.
- Consistent dark-theme palette:
  ```
  Background:   #1a1a2e
  Surface:      #16213e / #0f3460
  Accent/CTA:   #e94560  (red)
  Text primary: #f5f5f5
  Text muted:   #888 / #aaa
  ```
- Navigation header: `{ backgroundColor: '#1a1a2e', headerTintColor: '#f5f5f5' }` (set globally in `App.js`).
- Emojis are used intentionally for visual polish (buttons, placeholders, headings).

### Error handling
Use `try/catch` with `Alert.alert()` for user-visible errors. Services always return a safe fallback value so screens never crash on API failure.

## API Key Setup

To enable live API features, replace the placeholder strings in the service files:

| File | Constant | Where to get it |
|------|----------|----------------|
| `src/services/visionService.js` | `GOOGLE_CLOUD_VISION_API_KEY` | Google Cloud Console → Vision API |
| `src/services/recipeService.js` | `SPOONACULAR_API_KEY` | spoonacular.com |
| `src/services/recipeService.js` | `OPENAI_API_KEY` | platform.openai.com |

**Never commit real API keys.** Add them to a `.env` file (already in `.gitignore`) and load them with `expo-constants` or a similar approach.

## Testing

There is currently **no test suite**. When adding tests:
- Install Jest + React Native Testing Library: `npm install --save-dev jest @testing-library/react-native`
- Place test files next to the code they test: `src/screens/HomeScreen.test.js`
- Use `jest-expo` preset for Expo compatibility

## Git Conventions

This project uses **Conventional Commits**:
```
feat:   new feature
fix:    bug fix
chore:  tooling / config / dependency updates
docs:   documentation only
refactor: code restructure without behavior change
```

The remote is `origin` at `http://local_proxy@127.0.0.1:51033/git/joefeng-arch/First-Project`.

Feature branches should follow the pattern `claude/<description>-<session-id>`.

## What Does Not Exist (Yet)

- TypeScript — all files are plain `.js`
- Automated tests
- CI/CD pipeline
- Environment variable loading (API keys are hardcoded placeholders)
- Global state management
- Authentication
- Persistent storage (AsyncStorage, SQLite, etc.)

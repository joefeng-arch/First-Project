import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import IngredientConfirmScreen from './src/screens/IngredientConfirmScreen';
import RecipeListScreen from './src/screens/RecipeListScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#1a1a2e' },
  headerTintColor: '#f5f5f5',
  headerTitleStyle: { fontWeight: '700' },
  contentStyle: { backgroundColor: '#1a1a2e' },
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="IngredientConfirm"
          component={IngredientConfirmScreen}
          options={{ title: 'Confirm Ingredients' }}
        />
        <Stack.Screen
          name="RecipeList"
          component={RecipeListScreen}
          options={{ title: 'Recipes' }}
        />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{ title: 'Recipe Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

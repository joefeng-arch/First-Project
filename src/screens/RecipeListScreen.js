import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { getRecipes } from '../services/recipeService';

const PLACEHOLDER_IMAGES = [
  '🍳', '🥘', '🍲', '🥗', '🍜',
];

export default function RecipeListScreen({ route, navigation }) {
  const { ingredients } = route.params;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const results = await getRecipes(ingredients);
      setRecipes(results);
    } catch (error) {
      console.warn('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRecipeCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      activeOpacity={0.8}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      ) : (
        <View style={styles.cardImagePlaceholder}>
          <Text style={styles.cardEmoji}>
            {PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]}
          </Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardMetaText}>⏱ {item.readyInMinutes} min</Text>
          <Text style={styles.cardMetaText}>👥 {item.servings} servings</Text>
        </View>
        <Text style={styles.cardIngredients} numberOfLines={1}>
          {item.ingredients?.slice(0, 3).join(' · ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Finding recipes for you...</Text>
        <Text style={styles.loadingIngredients}>
          Using: {ingredients.join(', ')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {recipes.length} Recipes Found
      </Text>
      <Text style={styles.subheader}>
        Based on: {ingredients.join(', ')}
      </Text>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#f5f5f5',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  loadingIngredients: {
    color: '#888',
    fontSize: 13,
    marginTop: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f5f5f5',
    paddingHorizontal: 20,
  },
  subheader: {
    fontSize: 13,
    color: '#888',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 16,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#0f3460',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 48,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f5f5f5',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 6,
  },
  cardMetaText: {
    fontSize: 13,
    color: '#aaa',
  },
  cardIngredients: {
    fontSize: 12,
    color: '#666',
  },
});

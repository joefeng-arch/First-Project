import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

export default function RecipeDetailScreen({ route }) {
  const { recipe } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderEmoji}>🍽️</Text>
        </View>
      )}

      <Text style={styles.title}>{recipe.title}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaBadge}>
          <Text style={styles.metaIcon}>⏱</Text>
          <Text style={styles.metaValue}>{recipe.readyInMinutes} min</Text>
        </View>
        <View style={styles.metaBadge}>
          <Text style={styles.metaIcon}>👥</Text>
          <Text style={styles.metaValue}>{recipe.servings} servings</Text>
        </View>
        <View style={styles.metaBadge}>
          <Text style={styles.metaIcon}>📋</Text>
          <Text style={styles.metaValue}>{recipe.steps?.length || 0} steps</Text>
        </View>
      </View>

      {/* Ingredients Section */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <View style={styles.ingredientsList}>
        {(recipe.ingredients || []).map((item, index) => (
          <View key={index} style={styles.ingredientRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.ingredientText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Steps Section */}
      <Text style={styles.sectionTitle}>Cooking Steps</Text>
      <View style={styles.stepsList}>
        {(recipe.steps || []).map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 240,
    backgroundColor: '#16213e',
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f5f5f5',
    padding: 20,
    paddingBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaValue: {
    fontSize: 13,
    color: '#ccc',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e94560',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  ingredientsList: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    color: '#e94560',
    fontSize: 16,
    lineHeight: 22,
  },
  ingredientText: {
    color: '#ddd',
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  stepsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    color: '#ddd',
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
  },
});

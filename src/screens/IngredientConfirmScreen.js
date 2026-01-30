import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { recognizeIngredients } from '../services/visionService';

export default function IngredientConfirmScreen({ route, navigation }) {
  const { imageUri, imageBase64 } = route.params;
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (imageBase64) {
      detectIngredients();
    }
  }, []);

  const detectIngredients = async () => {
    setLoading(true);
    try {
      const detected = await recognizeIngredients(imageBase64);
      setIngredients(detected);
    } catch (error) {
      Alert.alert('Detection Error', 'Could not identify ingredients. Please add them manually.');
    } finally {
      setLoading(false);
    }
  };

  const removeIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    const trimmed = newIngredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients((prev) => [...prev, trimmed]);
      setNewIngredient('');
    }
  };

  const generateRecipes = () => {
    if (ingredients.length === 0) {
      Alert.alert('No Ingredients', 'Please add at least one ingredient.');
      return;
    }
    navigation.navigate('RecipeList', { ingredients });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <Text style={styles.sectionTitle}>
        {loading ? 'Identifying ingredients...' : 'Detected Ingredients'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e94560" style={{ marginVertical: 24 }} />
      ) : (
        <>
          <View style={styles.tagContainer}>
            {ingredients.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onPress={() => removeIngredient(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.tagText}>{item}</Text>
                <Text style={styles.tagRemove}>✕</Text>
              </TouchableOpacity>
            ))}
            {ingredients.length === 0 && !loading && (
              <Text style={styles.emptyText}>
                No ingredients yet. Add them below!
              </Text>
            )}
          </View>

          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              placeholder="Add ingredient..."
              placeholderTextColor="#666"
              value={newIngredient}
              onChangeText={setNewIngredient}
              onSubmitEditing={addIngredient}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.generateButton,
              ingredients.length === 0 && styles.generateButtonDisabled,
            ]}
            onPress={generateRecipes}
            activeOpacity={0.8}
            disabled={ingredients.length === 0}
          >
            <Text style={styles.generateButtonText}>
              ✨ Generate Recipes ({ingredients.length} ingredients)
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#16213e',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f5f5f5',
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    minHeight: 40,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  tagText: {
    color: '#f5f5f5',
    fontSize: 14,
    marginRight: 6,
  },
  tagRemove: {
    color: '#e94560',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  addRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f5f5f5',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  addButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: '#e94560',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    opacity: 0.4,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

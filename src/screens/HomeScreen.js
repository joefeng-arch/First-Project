import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen({ navigation }) {
  const pickImage = async (useCamera) => {
    let result;

    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required to take photos.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: true,
      });
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Photo library permission is required to select images.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: true,
      });
    }

    if (!result.canceled && result.assets?.[0]) {
      navigation.navigate('IngredientConfirm', {
        imageUri: result.assets[0].uri,
        imageBase64: result.assets[0].base64,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.emoji}>🧙‍♂️</Text>
        <Text style={styles.title}>Magic Food</Text>
        <Text style={styles.subtitle}>食材魔法师</Text>
        <Text style={styles.tagline}>
          Turn your ingredients into delicious recipes
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => pickImage(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonIcon}>📸</Text>
          <Text style={styles.buttonText}>Take Photo</Text>
          <Text style={styles.buttonHint}>Snap your ingredients</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => pickImage(false)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonIcon}>🖼️</Text>
          <Text style={styles.buttonText}>Choose from Album</Text>
          <Text style={styles.buttonHint}>Pick an existing photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={() =>
            navigation.navigate('IngredientConfirm', {
              imageUri: null,
              imageBase64: null,
            })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.buttonIcon}>✏️</Text>
          <Text style={styles.buttonTextAlt}>Enter ingredients manually</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Let no ingredient go to waste ✨
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#e94560',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#f5f5f5',
    marginTop: 4,
    opacity: 0.9,
  },
  tagline: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 12,
    textAlign: 'center',
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#e94560',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e94560',
  },
  tertiaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  buttonTextAlt: {
    fontSize: 15,
    color: '#e94560',
    textDecorationLine: 'underline',
  },
  buttonHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  footer: {
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
  },
});

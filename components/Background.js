// components/Background.js

import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export default function Background({ children }) {
  return (
    <ImageBackground
      source={require('../assets/sustainability_minimalism.webp')}
      style={styles.background}
      imageStyle={styles.image}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  image: {
    opacity: 0.2, // Adjust opacity for subtlety
    resizeMode: 'cover',
  },
});

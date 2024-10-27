// screens/WelcomeScreen.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Background from '../components/Background';

export default function WelcomeScreen({ navigation }) {
  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to FutureFootprint!</Text>
        <Text style={styles.message}>
          Thank you for signing up. Explore sustainable choices and start making a positive impact!
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.replace('Home')}
          style={styles.button}
        >
          Go to Home
        </Button>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});

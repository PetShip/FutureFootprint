import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, RadioButton, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Background from '../components/Background';

export default function OnboardingScreen({ navigation }) {
  const theme = useTheme(); // Use theme for colors

  const [age, setAge] = useState('');
  const [sex, setSex] = useState('male');

  const handleGetStarted = async () => {
    if (!age || isNaN(age)) {
      alert('Please enter a valid age.');
      return;
    }

    const userProfile = {
      age: parseInt(age),
      sex,
    };

    await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
    navigation.replace('Main');
  };

  return (
    <Background>
      <View style={styles.overlay}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Welcome to Underconsumption Core
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Transform your lifestyle towards sustainability and minimalism.
        </Text>
        <TextInput
          label="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={[styles.input, { backgroundColor: theme.colors.background }]}
        />
        <Text style={[styles.label, { color: theme.colors.text }]}>Sex</Text>
        <RadioButton.Group onValueChange={setSex} value={sex}>
          <View style={styles.radioRow}>
            <RadioButton value="male" />
            <Text style={[styles.radioText, { color: theme.colors.text }]}>Male</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="female" />
            <Text style={[styles.radioText, { color: theme.colors.text }]}>Female</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="other" />
            <Text style={[styles.radioText, { color: theme.colors.text }]}>Other</Text>
          </View>
        </RadioButton.Group>
        <Button
          mode="contained"
          onPress={handleGetStarted}
          icon="arrow-right"
          style={styles.button}
        >
          Get Started
        </Button>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
  },
});

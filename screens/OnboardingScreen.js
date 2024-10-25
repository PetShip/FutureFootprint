import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, RadioButton, useTheme } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import Background from '../components/Background';
import { supabase } from '../supabase';
import { SessionContext } from '../contexts/SessionContext';

export default function OnboardingScreen({ navigation }) {
  const theme = useTheme();
  const { session } = useContext(SessionContext);

  const [age, setAge] = useState('');
  const [sex, setSex] = useState('male');

  const handleGetStarted = async () => {
    if (!age) {
      Alert.alert('Please select a valid age range.');
      return;
    }

    if (!session || !session.user) {
      Alert.alert('Session error', 'User session is not available.');
      console.error('No session found. Make sure the user is logged in.');
      return;
    }

    const userProfile = {
      id: session.user.id,
      age,
      sex,
      username: session.user.email,
      profile_img: null,
    };

    try {
      const { error } = await supabase.from('users').upsert(userProfile);

      if (error) {
        Alert.alert('Error saving profile', error.message);
        console.error('Supabase error:', error);  // Log the exact error details
      } else {
        console.log('Profile saved successfully:', userProfile);  // Log success for debugging
        navigation.replace('Main');  // Navigate to the main app after successful submission
      }
    } catch (err) {
      console.error('Unexpected error occurred:', err.message);  // Catch any unexpected errors
      Alert.alert('Unexpected error', 'An error occurred. Please try again.');
    }
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

        <Text style={[styles.label, { color: theme.colors.text }]}>Age Range</Text>
        <RNPickerSelect
          onValueChange={setAge}
          items={[
            { label: '18-24', value: '18-24' },
            { label: '25-34', value: '25-34' },
            { label: '35-44', value: '35-44' },
            { label: '45-54', value: '45-54' },
            { label: '55-64', value: '55-64' },
            { label: '65+', value: '65+' },
          ]}
          placeholder={{ label: 'Select your age range...', value: null }}
          value={age}
          style={pickerSelectStyles}
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
          <Text>Get Started</Text> {/* Wrapped text inside the Button */}
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
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
};

// screens/LogActionScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Background from '../components/Background';

export default function LogActionScreen({ navigation }) {
  const [activityCategory, setActivityCategory] = useState('Transport');
  const [activityType, setActivityType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const activityCategories = ['Transport', 'Energy Use', 'Waste Management', 'Food Consumption', 'Purchases'];

  const transportActivities = ['Driving (Petrol Car)', 'Driving (Diesel Car)', 'Driving (Electric Car)', 'Bus', 'Train', 'Cycling', 'Walking'];
  // Add more activity categories as required.

  const getActivitiesByCategory = (category) => {
    switch (category) {
      case 'Transport':
        return transportActivities;
      // Add other cases for other categories like Energy Use, Waste Management, etc.
      default:
        return [];
    }
  };

  const saveAction = async () => {
    if (!activityType || !quantity) {
      alert('Please complete all fields');
      return;
    }

    const newAction = {
      id: Date.now().toString(),
      activityCategory,
      activityType,
      quantity: parseFloat(quantity),
      unit,
      impactValue: calculateImpact(activityType, quantity),
      date: new Date().toISOString(),
    };

    try {
      const existingActions = await AsyncStorage.getItem('userActions');
      const actions = existingActions ? JSON.parse(existingActions) : [];
      actions.push(newAction);
      await AsyncStorage.setItem('userActions', JSON.stringify(actions));
      alert('Action logged successfully!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Error logging action');
    }
  };

  const calculateImpact = (activityType, quantity) => {
    // Implement logic to calculate the impact of the activity
    // For example purposes, assign arbitrary values
    const impactMapping = {
      'Driving (Petrol Car)': 0.2, // kg CO₂ per mile
      'Driving (Diesel Car)': 0.25,
      'Driving (Electric Car)': 0.1,
      'Bus': 0.15,
      'Train': 0.1,
      'Cycling': 0.0,
      'Walking': 0.0,
      // Add more mappings for other activities
    };

    return (impactMapping[activityType] || 0) * quantity;
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Log an Activity</Text>

        <Text style={styles.label}>Category</Text>
        <RadioButton.Group onValueChange={setActivityCategory} value={activityCategory}>
          {activityCategories.map(category => (
            <View key={category} style={styles.radioContainer}>
              <RadioButton value={category} />
              <Text>{category}</Text>
            </View>
          ))}
        </RadioButton.Group>

        <Text style={styles.label}>Activity</Text>
        <RadioButton.Group onValueChange={setActivityType} value={activityType}>
          {getActivitiesByCategory(activityCategory).map(activity => (
            <View key={activity} style={styles.radioContainer}>
              <RadioButton value={activity} />
              <Text>{activity}</Text>
            </View>
          ))}
        </RadioButton.Group>

        <TextInput
          label={`Quantity (${unit || 'units'})`}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Optionally, allow users to select units based on activity type */}
        {/* For simplicity, units are inferred or set as default */}
        {/* You can expand this based on your app's requirements */}

        <Button mode="contained" onPress={saveAction} style={styles.button}>
          Log Action
        </Button>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
});

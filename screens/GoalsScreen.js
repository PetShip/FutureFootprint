// screens/GoalsScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { TextInput, Button, Text, ProgressBar, Card } from 'react-native-paper';
import Background from '../components/Background';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GoalsScreen() {
  const [metricType, setMetricType] = useState('Waste Reduction');
  const [targetValue, setTargetValue] = useState('');
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const existingGoals = await AsyncStorage.getItem('userGoals');
      const parsedGoals = existingGoals ? JSON.parse(existingGoals) : [];
      setGoals(parsedGoals);
    } catch (error) {
      console.error(error);
    }
  };

  const saveGoal = async () => {
    if (!targetValue) {
      Alert.alert('Please enter a target value');
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      metricType,
      targetValue: parseFloat(targetValue),
      currentValue: 0,
      startDate: new Date().toISOString(),
    };

    try {
      const existingGoals = await AsyncStorage.getItem('userGoals');
      const goalsArray = existingGoals ? JSON.parse(existingGoals) : [];
      goalsArray.push(newGoal);
      await AsyncStorage.setItem('userGoals', JSON.stringify(goalsArray));
      Alert.alert('Goal saved successfully!');
      setTargetValue('');
      loadGoals();
    } catch (error) {
      console.error(error);
      Alert.alert('Error saving goal');
    }
  };

  const renderGoal = ({ item }) => {
    const progress = item.currentValue / item.targetValue;
    return (
      <Card style={styles.card}>
        <Card.Title title={item.metricType} subtitle={`Target: ${item.targetValue}`} />
        <Card.Content>
          <ProgressBar progress={progress} />
          <Text>{`Progress: ${item.currentValue} / ${item.targetValue}`}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Your Goals</Text>
        <FlatList
          data={goals}
          renderItem={renderGoal}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />

        <Text style={styles.subtitle}>Add a New Goal</Text>
        {/* For simplicity, metricType is fixed */}
        <TextInput
          label="Metric Type"
          value={metricType}
          disabled
          style={styles.input}
        />
        <TextInput
          label="Target Value"
          value={targetValue}
          onChangeText={setTargetValue}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button mode="contained" onPress={saveGoal} style={styles.button}>
          Save Goal
        </Button>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 10,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
  },
  list: {
    marginTop: 10,
  },
  card: {
    marginVertical: 5,
  },
});

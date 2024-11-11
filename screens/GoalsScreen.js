// screens/GoalsScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { TextInput, Button, Text, ProgressBar, Card, Modal, Portal, Provider as PaperProvider } from 'react-native-paper';
import Background from '../components/Background';
import { supabase } from '../supabase';
import MetricTypeSelector from '../components/MetricTypeSelector';

export default function GoalsScreen() {
  const [metricType, setMetricType] = useState('Waste Reduction');
  const [targetValue, setTargetValue] = useState('');
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGoals(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveGoal = async () => {
    if (!targetValue) {
      Alert.alert('Please enter a target value');
      return;
    }

    try {
      const { data, error } = await supabase.from('goals').insert([
        {
          metric_type: metricType,
          target_value: parseFloat(targetValue),
          current_value: 0,
          start_date: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      Alert.alert('Goal saved successfully!');
      setTargetValue('');
      loadGoals();
    } catch (error) {
      console.error(error);
      Alert.alert('Error saving goal', error.message);
    }
  };

  const renderGoal = ({ item }) => {
    const progress = item.current_value / item.target_value;
    return (
      <Card style={styles.card}>
        <Card.Title title={item.metric_type} subtitle={`Target: ${item.target_value}`} />
        <Card.Content>
          <ProgressBar progress={progress} />
          <Text>{`Progress: ${item.current_value} / ${item.target_value}`}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <PaperProvider>
      <Background>
        <View style={styles.container}>
          <Text style={styles.title}>Your Goals</Text>
          <FlatList
            data={goals}
            renderItem={renderGoal}
            keyExtractor={(item) => item.id}
            style={styles.list}
            refreshing={loading}
            onRefresh={loadGoals}
          />

          <Text style={styles.subtitle}>Add a New Goal</Text>
          <MetricTypeSelector
            metricType={metricType}
            setMetricType={setMetricType}
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
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  // ... same styles as before
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

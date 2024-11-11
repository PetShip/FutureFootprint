// screens/LogActionScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { TextInput, Button, RadioButton, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import Background from '../components/Background';
import { supabase } from '../supabase';

export default function LogActionScreen({ navigation }) {
  const [activityCategory, setActivityCategory] = useState('Transport');
  const [activityType, setActivityType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const activityCategories = ['Transport', 'Energy Use', 'Waste Management', 'Food Consumption', 'Purchases'];

  useEffect(() => {
    fetchActivities();
  }, [activityCategory]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('emission_factors')
        .select('*')
        .eq('activity_category', activityCategory);

      if (error) throw error;

      setActivities(data);
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error fetching activities: ' + error.message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const saveAction = async () => {
    if (!activityType || !quantity) {
      setSnackbarMessage('Please complete all fields');
      setSnackbarVisible(true);
      return;
    }

    const impactValue = await calculateImpact(activityType, quantity);

    try {
      const { data, error } = await supabase.from('actions').insert([
        {
          user_id: supabase.auth.user().id,
          activity_category: activityCategory,
          activity_type: activityType,
          quantity: parseFloat(quantity),
          unit,
          impact_value: impactValue,
          date: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSnackbarMessage('Action logged successfully!');
      setSnackbarVisible(true);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error logging action: ' + error.message);
      setSnackbarVisible(true);
    }
  };

  const calculateImpact = async (activityType, quantity) => {
    try {
      const { data, error } = await supabase
        .from('emission_factors')
        .select('factor, unit')
        .eq('activity_type', activityType)
        .single();

      if (error) throw error;

      setUnit(data.unit);
      return data.factor * quantity;
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error calculating impact: ' + error.message);
      setSnackbarVisible(true);
      return 0;
    }
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Log an Activity</Text>

        <Text style={styles.label}>Category</Text>
        <RadioButton.Group onValueChange={setActivityCategory} value={activityCategory}>
          {activityCategories.map((category) => (
            <View key={category} style={styles.radioContainer}>
              <RadioButton value={category} />
              <Text>{category}</Text>
            </View>
          ))}
        </RadioButton.Group>

        <Text style={styles.label}>Activity</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <RadioButton.Group onValueChange={setActivityType} value={activityType}>
            {activities.map((activity) => (
              <View key={activity.id} style={styles.radioContainer}>
                <RadioButton value={activity.activity_type} />
                <Text>{activity.activity_type}</Text>
              </View>
            ))}
          </RadioButton.Group>
        )}

        <TextInput
          label={`Quantity (${unit || 'units'})`}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={styles.input}
        />

        <Button mode="contained" onPress={saveAction} style={styles.button}>
          Log Action
        </Button>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>
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
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', // Replace shadow props
    marginVertical: 5,
  },
  input: {
    marginVertical: 10,
    backgroundColor: '#ffffff',
    verticalAlign: 'middle', // Replace textAlignVertical
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', // Replace shadow props
  },
});

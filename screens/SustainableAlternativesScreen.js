// screens/SustainableAlternativesScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Background from '../components/Background';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SustainableAlternativesScreen() {
  const [personalizedTips, setPersonalizedTips] = useState([]);

  useEffect(() => {
    loadPersonalizedTips();
  }, []);

  const loadPersonalizedTips = async () => {
    try {
      const existingActions = await AsyncStorage.getItem('userActions');
      const actions = existingActions ? JSON.parse(existingActions) : [];
      
      console.log('User Actions:', actions); // Log to inspect retrieved actions

      // Analyze user activities
      let totalDrivingEmissions = 0;
      let totalMeatConsumption = 0;

      actions.forEach(action => {
        if (action.activityType.includes('Driving')) {
          totalDrivingEmissions += action.impactValue;
        } else if (action.activityType === 'Meat Consumption') {
          totalMeatConsumption += action.impactValue;
        }
      });

      console.log('Total Driving Emissions:', totalDrivingEmissions);
      console.log('Total Meat Consumption:', totalMeatConsumption);

      const generatedTips = [];

      if (totalDrivingEmissions > 100) { // Threshold for demonstration
        console.log('Adding driving emissions tip');
        generatedTips.push({
          id: 'p1',
          title: 'Reduce Driving Emissions',
          content: 'Consider using public transport or carpooling to reduce your carbon footprint.',
          link: 'https://example.com/reduce-driving-emissions',
          isPersonalized: true,
        });
      }

      if (totalMeatConsumption > 50) { // Threshold for demonstration
        console.log('Adding meat consumption tip');
        generatedTips.push({
          id: 'p2',
          title: 'Reduce Meat Consumption',
          content: 'Try incorporating more plant-based meals into your diet.',
          link: 'https://example.com/plant-based-diet',
          isPersonalized: true,
        });
      }

      setPersonalizedTips(generatedTips);
      console.log('Generated Personalized Tips:', generatedTips); // Log to inspect generated tips

    } catch (error) {
      console.error('Error loading personalized tips:', error);
    }
  };

  const generalRecommendations = [
    {
      id: 'g1',
      title: 'Switch to LED Bulbs',
      content: 'LED bulbs use up to 85% less energy than traditional bulbs.',
      link: 'https://example.com/led-bulbs',
      isPersonalized: false,
    },
    {
      id: 'g2',
      title: 'Use Reusable Water Bottles',
      content: 'Reduce plastic waste by using reusable bottles.',
      link: 'https://example.com/reusable-bottles',
      isPersonalized: false,
    },
    // Add more general recommendations as needed
  ];

  const renderItem = (item) => (
    <Card style={styles.card} key={item.id}>
      <Card.Title
        title={item.title}
        subtitle={item.isPersonalized ? 'Personalized Tip' : 'General Recommendation'}
      />
      <Card.Content>
        <Text>{item.content}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => Linking.openURL(item.link)}>Learn More</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sustainable Alternatives</Text>

        {/* Personalized Tips Section */}
        {personalizedTips.length > 0 && (
          <>
            <Text style={styles.subtitle}>Personalized Tips</Text>
            {personalizedTips.map((item) => renderItem(item))}
          </>
        )}

        {/* General Recommendations Section */}
        <Text style={styles.subtitle}>General Recommendations</Text>
        {generalRecommendations.map((item) => renderItem(item))}
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
  },
  card: {
    marginVertical: 5,
  },
});

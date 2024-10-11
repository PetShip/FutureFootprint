// screens/ProfileScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import ImpactChart from '../components/ImpactChart';
import Background from '../components/Background';
import BadgeComponent from '../components/BadgeComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const user = {
  name: 'John Smith',
  profilePicture: 'https://placekitten.com/200/200',
};

export default function ProfileScreen() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = () => {
    // For now, use hard-coded badges
    const earnedBadges = [
      {
        id: '1',
        name: 'First Action',
        description: 'Logged your first sustainable action!',
        icon: require('../assets/badge.png'),
      },
      // Add more badges based on criteria
    ];
    setBadges(earnedBadges);
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
        <Text style={styles.name}>{user.name}</Text>

        <Text style={styles.subtitle}>Your Badges</Text>
        <ScrollView horizontal contentContainerStyle={styles.badgesContainer}>
          {badges.map(badge => (
            <BadgeComponent key={badge.id} badge={badge} />
          ))}
        </ScrollView>

        <Button mode="outlined" onPress={() => {}} style={styles.button}>
          Edit Profile
        </Button>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
  },
  name: {
    fontSize: 24,
    marginVertical: 10,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  badgesContainer: {
    paddingVertical: 10,
  },
  button: {
    marginTop: 20,
  },
});

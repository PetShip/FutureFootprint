// components/BadgeComponent.js

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';

export default function BadgeComponent({ badge }) {
  return (
    <View style={styles.container}>
      <Image source={badge.icon} style={styles.icon} />
      <Text style={styles.name}>{badge.name}</Text>
      <Text style={styles.description}>{badge.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
  },
  icon: {
    width: 64,
    height: 64,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  description: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
  },
});

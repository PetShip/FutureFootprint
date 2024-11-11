// components/BadgeComponent.js

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';

export default function BadgeComponent({ badge }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: badge.icon_url }} style={styles.image} />
      <Text style={styles.name}>{badge.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    width: 60,
    height: 60,
  },
  name: {
    marginTop: 5,
    textAlign: 'center',
  },
});

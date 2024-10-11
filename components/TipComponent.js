// components/TipComponent.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function TipComponent({ tip }) {
  return (
    <View style={styles.container}>
      <Text style={styles.tipText}>{tip.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#c8e6c9',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  tipText: {
    fontSize: 16,
  },
});

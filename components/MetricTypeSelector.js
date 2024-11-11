// components/MetricTypeSelector.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';

const metricTypes = ['Waste Reduction', 'Energy Savings', 'Water Conservation', 'CO₂ Reduction'];

export default function MetricTypeSelector({ metricType, setMetricType }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Metric Type</Text>
      <RadioButton.Group onValueChange={setMetricType} value={metricType}>
        {metricTypes.map((type) => (
          <View key={type} style={styles.radioContainer}>
            <RadioButton value={type} />
            <Text>{type}</Text>
          </View>
        ))}
      </RadioButton.Group>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

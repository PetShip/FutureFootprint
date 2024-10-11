import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ImpactChart({ chartData, metric }) {
  return (
    <LineChart
      data={{
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            data: chartData.length ? chartData : [0, 0, 0, 0, 0, 0, 0],
          },
        ],
      }}
      width={screenWidth - 40}
      height={220}
      yAxisSuffix={metric === 'CO₂' ? ' kg' : metric === 'Miles Driven' ? ' mi' : ' trees'}
      chartConfig={{
        backgroundColor: '#4CAF50',
        backgroundGradientFrom: '#66BB6A',
        backgroundGradientTo: '#81C784',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
          borderRadius: 16,
        },
      }}
      style={styles.chart}
    />
  );
}

const styles = StyleSheet.create({
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
});

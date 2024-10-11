// screens/TipsScreen.js

import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Text } from 'react-native-paper';
import Background from '../components/Background';

export default function TipsScreen() {
  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Daily Eco-Friendly Tips</Text>
        <FlatList
          data={tips}
          renderItem={({ item }) => (
            <List.Item
              title={item.tip}
              left={(props) => <List.Icon {...props} icon="lightbulb-on-outline" />}
            />
          )}
          keyExtractor={(item) => item.id}
        />
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
    marginBottom: 10,
  },
});

// navigation/ImpactStackNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ImpactTrackerScreen from '../screens/ImpactTrackerScreen';
import LogActionScreen from '../screens/LogActionScreen';
import GoalsScreen from '../screens/GoalsScreen';

const Stack = createStackNavigator();

export default function ImpactStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="ImpactTracker" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ImpactTracker" component={ImpactTrackerScreen} />
      <Stack.Screen name="LogAction" component={LogActionScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
    </Stack.Navigator>
  );
}

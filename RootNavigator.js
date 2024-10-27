// RootNavigator.js
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SessionContext } from './contexts/SessionContext';
import AuthStackNavigator from './navigation/AuthStackNavigator';
import MainTabNavigator from './navigation/MainTabNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { session } = useContext(SessionContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session && session.user ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </Stack.Navigator>
  );
}

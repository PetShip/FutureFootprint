// navigation/StackNavigator.js

import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen'; // Import Privacy Policy Screen
import MainTabNavigator from './MainTabNavigator';
import { SessionContext } from '../contexts/SessionContext';

const Stack = createStackNavigator();

export default function StackNavigator() {
  const { session } = useContext(SessionContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session && session.user ? (
        // Main app when user is authenticated
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        // Auth flow with all screens listed
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} /> {/* Add PrivacyPolicyScreen here */}
        </>
      )}
    </Stack.Navigator>
  );
}

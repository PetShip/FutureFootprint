// RootNavigator.js

import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import EmailConfirmationScreen from './screens/EmailConfirmationScreen';
import ConfirmationCompleteScreen from './screens/ConfirmationCompleteScreen';
import ProfileCompletionScreen from './screens/ProfileCompletionScreen';
import MainTabNavigator from './navigation/MainTabNavigator';
import { SessionContext } from './contexts/SessionContext';
import { Alert } from 'react-native';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { session, profile, isEmailVerified } = useContext(SessionContext);

  const isProfileComplete =
    profile &&
    profile.first_name &&
    profile.last_name &&
    profile.birthday &&
    profile.terms_accepted === true;

  useEffect(() => {
    console.log('Navigation Decision - Session:', session);
    console.log('Navigation Decision - Email Verified:', isEmailVerified);
    console.log('Navigation Decision - Profile:', profile);
    console.log('Navigation Decision - Is Profile Complete:', isProfileComplete);
  }, [session, isEmailVerified, profile, isProfileComplete]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!session || !session.user ? (
        // User is not logged in
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen
            name="EmailConfirmation"
            component={EmailConfirmationScreen}
          />
          <Stack.Screen
            name="ConfirmationComplete"
            component={ConfirmationCompleteScreen}
          />
        </>
      ) : !isEmailVerified ? (
        // User is logged in but email is not verified
        <>
          <Stack.Screen
            name="EmailConfirmation"
            component={EmailConfirmationScreen}
          />
        </>
      ) : !isProfileComplete ? (
        // User is logged in and email is verified but profile is incomplete
        <>
          <Stack.Screen
            name="ProfileCompletion"
            component={ProfileCompletionScreen}
          />
        </>
      ) : (
        // User is fully authenticated and profile is complete
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
}

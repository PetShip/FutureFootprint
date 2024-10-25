// LoginScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../supabase';
import Background from '../components/Background';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);  // Start the loading indicator

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred. Please try again.');
    } else {
      // Navigate to HomeScreen in MainTabNavigator after login
      navigation.navigate('MainTabNavigator', { screen: 'Home' });
    }

    setLoading(false);  // Stop the loading indicator after login attempt
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          disabled={loading || !email || !password}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text>Login</Text>}
        </Button>
        <Text
          style={styles.signupText}
          onPress={() => navigation.navigate('SignUp')}
        >
          Don't have an account? <Text style={styles.linkText}>Sign up here.</Text>
        </Text>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  linkText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

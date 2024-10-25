// screens/SignUpScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Background from '../components/Background';
import { supabase } from '../supabase';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert('Sign Up Successful', 'Please check your email to confirm your account.');
      navigation.replace('Login');
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSignUp} style={styles.button}>
          Sign Up
        </Button>
        <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
          Already have an account? Log In
        </Text>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  // (Same styles as before)
});

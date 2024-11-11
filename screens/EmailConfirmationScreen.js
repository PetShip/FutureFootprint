// screens/EmailConfirmationScreen.js

import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Background from '../components/Background';
import { supabase } from '../supabase';
import { SessionContext } from '../contexts/SessionContext';

export default function EmailConfirmationScreen({ navigation }) {
  const [checking, setChecking] = useState(false);
  const { setSession, setProfile } = useContext(SessionContext);

  const checkEmailVerification = async () => {
    setChecking(true);

    const { data, error } = await supabase.auth.getUser();
    setChecking(false);

    if (error) {
      console.error("Error fetching user:", error.message);
      Alert.alert("Error", "Unable to verify email status. Please try again.");
      return;
    }

    if (data.user?.email_confirmed_at) {
      Alert.alert("Email Verified", "Your email is confirmed! Redirecting...");
      navigation.replace('ConfirmationComplete');
    } else {
      Alert.alert(
        "Email Not Verified",
        "It looks like your email is not verified yet. Please check your inbox and click on the confirmation link."
      );
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', 'Failed to log out.');
      console.error('Logout Error:', error.message);
    } else {
      setSession(null);
      setProfile(null);
      navigation.replace('Login');
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Confirm Your Email</Text>
        <Text style={styles.message}>
          A confirmation email has been sent. Please check your inbox and click on the link to confirm your email.
        </Text>
        <Button
          mode="contained"
          onPress={checkEmailVerification}
          disabled={checking}
          style={styles.button}
        >
          {checking ? <ActivityIndicator color="white" /> : "I Have Confirmed My Email"}
        </Button>
        {/* Zurück-Button zum Abmelden */}
        <View style={styles.logoutButton}>
          <Button mode="outlined" onPress={handleLogout} color="#F44336">
            Back to Login & Logout
          </Button>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  message: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  button: { marginTop: 20, paddingVertical: 10 },
  logoutButton: { marginTop: 20 },
});

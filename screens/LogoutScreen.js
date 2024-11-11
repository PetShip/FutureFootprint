// screens/LogoutScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../supabase';

export default function LogoutScreen({ navigation }) {
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      // Navigieren Sie zur Login-Seite nach dem Logout
      navigation.replace('Login');
    };

    logout();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
});

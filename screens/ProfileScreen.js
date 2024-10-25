// screens/ProfileScreen.js

import React, { useContext } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { supabase } from '../supabase';
import { SessionContext } from '../contexts/SessionContext';
import Background from '../components/Background';

export default function ProfileScreen() {
  const { session } = useContext(SessionContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: session?.user?.profile_img }} style={styles.profileImage} />
        <Text style={styles.name}>{session?.user?.username || 'User'}</Text>

        <Text style={styles.subtitle}>Your Badges</Text>
        <ScrollView horizontal contentContainerStyle={styles.badgesContainer}>
          {/* Display badges here */}
        </ScrollView>

        <Button mode="outlined" onPress={handleLogout} style={styles.button}>
          Logout
        </Button>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    // Replace shadow properties with boxShadow
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
  },
  name: {
    fontSize: 24,
    marginVertical: 10,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  badgesContainer: {
    paddingVertical: 10,
  },
  button: {
    marginTop: 20,
  },
});

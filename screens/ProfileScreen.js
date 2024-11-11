// screens/ProfileScreen.js

import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { supabase } from '../supabase';
import { SessionContext } from '../contexts/SessionContext';
import Background from '../components/Background';

export default function ProfileScreen({ navigation }) {
  const { session } = useContext(SessionContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      console.log('Loading profile for user ID:', session.user.id);
      const { data, error } = await supabase
        .from('users') // Verwenden Sie 'users' statt 'profiles'
        .select('*')
        .eq('id', session.user.id)
        .single();

      console.log('Profile Data:', data);
      console.log('Profile Error:', error);

      if (error) throw error;

      setProfile(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error loading profile', error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        {profile?.profile_img ? (
          <Image source={{ uri: profile.profile_img }} style={styles.profileImage} />
        ) : (
          <Image source={require('../assets/default-avatar.png')} style={styles.profileImage} />
        )}
        <Text style={styles.name}>{profile?.username || 'User'}</Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.button}
        >
          Edit Profile
        </Button>

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
    // Ersetzen Sie Schatten-Eigenschaften durch elevation für Android
    elevation: 5,
    // Für iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
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

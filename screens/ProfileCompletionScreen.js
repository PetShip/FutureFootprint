// screens/ProfileCompletionScreen.js

import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../supabase';
import { SessionContext } from '../contexts/SessionContext';

const ProfileCompletionScreen = ({ navigation }) => {
  const { session, fetchProfile, setSession, setProfile } = useContext(SessionContext);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [username, setUsername] = useState('');
  const [sex, setSex] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompleteProfile = async () => {
    if (!firstName || !lastName || !birthday || !username || !sex) {
      Alert.alert('Validation Error', 'Please fill out all required fields.');
      return;
    }

    setLoading(true);

    try {
      if (!session || !session.user) {
        console.error('No user session found.');
        Alert.alert('Error', 'No user session found.');
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      console.log('Updating profile for user ID:', userId);

      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          birthday: birthday,
          username: username,
          sex: sex,
          profile_img: profileImg || '',
          terms_accepted: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      console.log('Update Response Data:', data);
      console.log('Update Response Error:', error);

      if (error) {
        console.error('Error updating profile:', error.message);
        Alert.alert('Error', 'Failed to complete profile.');
      } else {
        console.log('Profile updated:', data);
        Alert.alert('Success', 'Profile completed successfully!');
        await fetchProfile(userId);
        // Navigation wird automatisch durch RootNavigator gehandhabt
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
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
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <TextInput
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        label="Birthday (YYYY-MM-DD)"
        value={birthday}
        onChangeText={setBirthday}
        style={styles.input}
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        label="Sex"
        value={sex}
        onChangeText={setSex}
        style={styles.input}
      />
      <TextInput
        label="Profile Image URL"
        value={profileImg}
        onChangeText={setProfileImg}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator animating={true} />
      ) : (
        <Button mode="contained" onPress={handleCompleteProfile} style={styles.button}>
          Complete Profile
        </Button>
      )}
      {/* Zurück-Button zum Abmelden */}
      <View style={styles.logoutButton}>
        <Button mode="outlined" onPress={handleLogout} color="#F44336">
          Back to Login & Logout
        </Button>
      </View>
    </View>
  );
};

export default ProfileCompletionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 20,
  },
});

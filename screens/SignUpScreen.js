// screens/SignUpScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text, RadioButton, Checkbox } from 'react-native-paper';
import Background from '../components/Background';
import { supabase } from '../supabase';
import * as ImagePicker from 'expo-image-picker';

const DEFAULT_AVATAR_URL = 'https://example.com/path/to/default-avatar.png';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('male');
  const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR_URL);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !fullName || !username || !birthday || !acceptedTerms) {
      Alert.alert('Missing Fields', 'Please fill in all fields and accept the terms.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please ensure both passwords are the same.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      const user = data.user;
      if (user) {
        const { error: profileError } = await supabase.from('users').upsert({
          id: user.id, // Ensure the auth `id` is used as the primary key
          username: username,
          full_name: fullName,
          profile_img: profileImage || DEFAULT_AVATAR_URL,
          birthday: birthday,
          sex: gender,
          terms_accepted: acceptedTerms
        });

        if (profileError) {
          console.error('Error updating profile:', profileError.message);
        } else {
          Alert.alert('Sign Up Successful', 'Please check your email to confirm your account.');
          navigation.replace('Welcome'); // Navigate to Welcome screen
        }
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.cancelled) setProfileImage(result.uri);
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
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
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="Birthday (YYYY-MM-DD)"
          value={birthday}
          onChangeText={setBirthday}
          style={styles.input}
          placeholder="e.g., 1990-01-01"
        />
        <Text style={styles.label}>Gender</Text>
        <RadioButton.Group onValueChange={setGender} value={gender}>
          <View style={styles.radioRow}>
            <RadioButton value="male" />
            <Text>Male</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="female" />
            <Text>Female</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="other" />
            <Text>Other</Text>
          </View>
        </RadioButton.Group>

        {/* Profile Picture Selection */}
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <Text style={styles.imageText}>Choose Profile Picture</Text>
        </TouchableOpacity>

        {/* Agreement Checkbox and Link to Policy */}
        <View style={styles.termsRow}>
          <Checkbox status={acceptedTerms ? 'checked' : 'unchecked'} onPress={() => setAcceptedTerms(!acceptedTerms)} />
          <Text onPress={() => navigation.navigate('PrivacyPolicy')} style={styles.linkText}>
            I agree to the <Text style={{ fontWeight: 'bold' }}>Terms & Privacy Policy</Text>
          </Text>
        </View>

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
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 12 },
  label: { fontSize: 16, marginVertical: 10 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginVertical: 10 },
  imageText: { textAlign: 'center', color: '#4CAF50', marginBottom: 10 },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  button: { marginTop: 10, paddingVertical: 5 },
  linkText: { color: '#4CAF50', textDecorationLine: 'underline' },
});

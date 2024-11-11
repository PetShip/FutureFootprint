// screens/EditProfileScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabase';
import Background from '../components/Background';

const EditProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Holen Sie sich den aktuellen Benutzer
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }

      const user = userData.user;

      if (!user) {
        Alert.alert('Error', 'No authenticated user found.');
        setLoading(false);
        return;
      }

      console.log('Loading profile for user ID:', user.id);
      
      const { data, error } = await supabase
        .from('users') // Verwenden Sie 'users' statt 'profiles'
        .select('username, profile_img')
        .eq('id', user.id)
        .single();

      console.log('Profile Data:', data);
      console.log('Profile Error:', error);

      if (error) throw error;

      setUsername(data.username);
      setProfileImg(data.profile_img);
    } catch (error) {
      console.error(error);
      Alert.alert('Error loading profile', error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImg(result.uri);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    let imageUrl = profileImg;

    try {
      // Holen Sie sich den aktuellen Benutzer
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }

      const user = userData.user;

      if (!user) {
        Alert.alert('Error', 'No authenticated user found.');
        setLoading(false);
        return;
      }

      if (profileImg && !profileImg.startsWith('https://')) {
        // Upload new image
        const response = await fetch(profileImg);
        const blob = await response.blob();

        const fileExt = profileImg.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `profiles/${fileName}`;

        let { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, blob, {
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData, error: publicUrlError } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        if (publicUrlError) {
          throw publicUrlError;
        }

        imageUrl = publicUrlData.publicUrl;
      }

      console.log('Saving profile with:', {
        username,
        profile_img: imageUrl,
        updated_at: new Date(),
      });

      const updates = {
        id: user.id,
        username,
        profile_img: imageUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('users').upsert(updates);

      console.log('Upsert Response Error:', error);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error updating profile', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />
      <Button icon="image" mode="outlined" onPress={pickImage} style={styles.button}>
        {profileImg ? 'Change Profile Image' : 'Add Profile Image'}
      </Button>
      {profileImg && <Image source={{ uri: profileImg }} style={styles.image} />}
      <Button
        mode="contained"
        onPress={saveProfile}
        loading={loading}
        disabled={loading}
        style={styles.saveButton}
      >
        Save Profile
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
  },
  saveButton: {
    marginTop: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
  },
});

export default EditProfileScreen; // Nur eine `export default`-Anweisung

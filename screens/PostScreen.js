// screens/PostScreen.js

import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabase';
import Background from '../components/Background';
import { SessionContext } from '../contexts/SessionContext';

export default function PostScreen() {
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const { session } = useContext(SessionContext);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPostImage(result.uri);
    }
  };

  const submitPost = async () => {
    let imageUrl = null;

    if (postImage) {
      const response = await fetch(postImage);
      const blob = await response.blob();

      const fileExt = postImage.split('.').pop();
      const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        Alert.alert('Error uploading image:', uploadError.message);
        return;
      } else {
        const { data } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
    }

    const { error } = await supabase
      .from('posts')
      .insert([
        {
          post: postText,
          postimg: imageUrl,
          user_id: session.user.id,
          posttime: new Date(),
        },
      ]);

    if (error) {
      Alert.alert('Error creating post:', error.message);
    } else {
      Alert.alert('Post created successfully!');
      setPostText('');
      setPostImage(null);
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <TextInput
          label="Share your repurposed item..."
          value={postText}
          onChangeText={(text) => setPostText(text)}
          multiline
          style={styles.input}
        />
        <Button icon="image" mode="outlined" onPress={pickImage} style={styles.button}>
          {postImage ? 'Change Image' : 'Add Image'}
        </Button>
        {/* Move resizeMode to props */}
        {postImage && <Image source={{ uri: postImage }} resizeMode="cover" style={styles.image} />}
        <Button mode="contained" onPress={submitPost} style={styles.submitButton}>
          Post
        </Button>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  input: {
    height: 150,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  button: {
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    // Replace shadow properties with boxShadow
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
});

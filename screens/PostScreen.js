// screens/PostScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Background from '../components/Background';

export default function PostScreen() {
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);

  const pickImage = async () => {
    // Image picker logic remains the same
  };

  const submitPost = () => {
    // Submission logic remains the same
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
        {postImage && <Image source={{ uri: postImage }} style={styles.image} />}
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
    backgroundColor: '#ffffff', // Ensure input is readable
  },
  button: {
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
});

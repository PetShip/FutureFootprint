// components/PostCard.js

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';

export default function PostCard({ post }) {
  return (
    <Card style={styles.card}>
      <Card.Title
        title={post.userName}
        subtitle={post.postTime}
        left={(props) => <Avatar.Image {...props} source={{ uri: post.userImg }} />}
        right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
      />
      <Card.Content>
        {/* Change the text color */}
        <Text style={styles.postText}>{post.post}</Text>
      </Card.Content>
      {post.postImg != null ? (
        <Card.Cover source={{ uri: post.postImg }} style={styles.postImage} />
      ) : null}
      <Card.Actions>
        <IconButton icon="heart-outline" onPress={() => {}} />
        <IconButton icon="comment-outline" onPress={() => {}} />
        <IconButton icon="share-outline" onPress={() => {}} />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
  },
  postText: {
    color: '#ffffff',  // Updated text color to white (or another preferred color)
    fontSize: 16,      // Optional: Adjust font size if needed
    lineHeight: 22,    // Optional: Adjust line height for better spacing
  },
  postImage: {
    height: 200,
  },
});

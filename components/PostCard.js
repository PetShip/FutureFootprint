import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';

export default function PostCard({ post }) {
  // Function to format the posttime to dd.mm.yyyy and hh.mm
  const formatDateTime = (posttime) => {
    const date = new Date(posttime);
    
    // Format the date to dd.mm.yyyy
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    // Format the time to hh.mm
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Combine the date and time
    return `${day}.${month}.${year} ${hours}.${minutes}`;
  };

  return (
    <Card style={styles.card}>
      <View style={styles.headerContainer}>
        <Avatar.Image source={{ uri: post.userimg }} size={40} />
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.userName}>{post.username ? post.username : 'Unknown User'}</Text>
          {/* Display the formatted post time */}
          <Text style={styles.postTime}>{formatDateTime(post.posttime)}</Text>
        </View>

        <IconButton icon="dots-vertical" onPress={() => {}} />
      </View>

      <Card.Content>
        <Text style={styles.postText}>{post.post}</Text>
      </Card.Content>

      {post.postimg != null ? (
        <Card.Cover source={{ uri: post.postimg }} style={styles.postImage} />
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
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  postTime: {
    fontSize: 12,
    color: '#888',
  },
  postText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 22,
    marginVertical: 5,
  },
  postImage: {
    height: 200,
    marginVertical: 10,
  },
});

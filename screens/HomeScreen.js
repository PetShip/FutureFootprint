// screens/HomeScreen.js

import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import PostCard from '../components/PostCard';
import Background from '../components/Background';

// Define the posts array
const posts = [
  {
    id: '1',
    userName: 'Jane Doe',
    userImg: 'https://placekitten.com/200/200',
    postTime: '2 mins ago',
    post: 'Just repurposed my old jeans into a tote bag!',
    postImg: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493',
  },
  {
    id: '2',
    userName: 'John Smith',
    userImg: 'https://placekitten.com/201/201',
    postTime: '5 mins ago',
    post: 'Built a table from recycled wood!',
    postImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c5d',
  },
  {
    id: '3',
    userName: 'Emily Green',
    userImg: 'https://placekitten.com/202/202',
    postTime: '10 mins ago',
    post: 'DIY eco-friendly home decor made from old bottles.',
    postImg: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4',
  },
  {
    id: '4',
    userName: 'Michael Brown',
    userImg: 'https://placekitten.com/203/203',
    postTime: '15 mins ago',
    post: 'Refurbished my old chair!',
    postImg: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
  },
  {
    id: '5',
    userName: 'Sophia Wilson',
    userImg: 'https://placekitten.com/204/204',
    postTime: '20 mins ago',
    post: 'Made a plant stand from an old ladder.',
    postImg: 'https://images.unsplash.com/photo-1547658716-da2b511691b6',
  },
];

export default function HomeScreen() {
  return (
    <Background>
      <View style={styles.container}>
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'transparent', // Ensure transparency to show background
  },
});

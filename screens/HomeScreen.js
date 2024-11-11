// screens/HomeScreen.js

import React, { useEffect, useState, useContext } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  Image,
  Button,
} from 'react-native';
import { supabase } from '../supabase';
import { SessionContext } from '../contexts/SessionContext';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Zugriff auf setSession und setProfile aus SessionContext
  const { setSession, setProfile } = useContext(SessionContext);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, users(username, profile_img)')
      .order('posttime', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message || 'Error fetching posts.');
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout Failed', error.message);
    } else {
      // Reset session und profile im SessionContext
      setSession(null);
      setProfile(null);
      // Optional: Bestätigung anzeigen oder auf den Login-Bildschirm verweisen
      console.log('User signed out successfully');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.userInfo}>
              <Image source={{ uri: item.users?.profile_img }} style={styles.userImage} />
              <Text style={styles.username}>{item.users?.username || 'Unknown User'}</Text>
            </View>
            <Text style={styles.postTime}>{new Date(item.posttime).toLocaleDateString()}</Text>
            <Text style={styles.postContent}>{item.post}</Text>
            {item.postimg ? (
              <Image source={{ uri: item.postimg }} style={styles.postImage} />
            ) : null}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postTime: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});

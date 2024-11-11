// screens/ConfirmationCompleteScreen.js
import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import Background from '../components/Background';

export default function ConfirmationCompleteScreen({ navigation }) {
  const handleClose = () => {
    navigation.navigate('Login'); // Redirect back to Login
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Email Confirmed</Text>
        <Text style={styles.message}>Your email has been successfully confirmed. You can now close this window.</Text>
        <Button title="Close" onPress={handleClose} />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 10 },
  message: { fontSize: 16, textAlign: 'center', color: '#333', marginBottom: 20 },
});

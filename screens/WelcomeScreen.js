import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Background from '../components/Background';
import { SessionContext } from '../contexts/SessionContext';
import { supabase } from '../supabase';

export default function WelcomeScreen({ navigation }) {
  const { session } = useContext(SessionContext);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setIsVerified(true);
      }
    };

    checkEmailVerification();

    const interval = setInterval(() => {
      if (!isVerified) {
        checkEmailVerification();
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isVerified]);

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to FutureFootprint!</Text>
        <Text style={styles.message}>
          Thank you for signing up. Explore sustainable choices and start making a positive impact!
        </Text>
        {isVerified ? (
          <Button
            mode="contained"
            onPress={() => navigation.replace('Home')}
            style={styles.button}
          >
            Go to Home
          </Button>
        ) : (
          <Text style={styles.message}>Please verify your email to continue.</Text>
        )}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});

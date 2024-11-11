// screens/SignUpScreen.js

import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Background from '../components/Background';
import { supabase } from '../supabase';
import { SessionContext } from '../contexts/SessionContext';

export default function SignUpScreen({ navigation }) {
  const { setSession } = useContext(SessionContext);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!displayName || !email || !password || !confirmPassword) {
      Alert.alert('Fehlende Felder', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwörter stimmen nicht überein', 'Bitte stellen Sie sicher, dass beide Passwörter gleich sind.');
      return;
    }

    setLoading(true);
    console.log("Versuche, sich anzumelden...");

    try {
      // Benutzerregistrierung
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        },
        {
          emailRedirectTo: "https://yourapp.com/ConfirmationCompleteScreen",
          data: { display_name: displayName },
        }
      );

      if (signUpError) {
        console.error("Registrierung fehlgeschlagen:", signUpError.message);
        Alert.alert('Registrierung fehlgeschlagen', signUpError.message);
      } else {
        console.log("Benutzer registriert:", signUpData);

        const user = signUpData.user;

        if (user) {
          Alert.alert(
            'Registrierung erfolgreich',
            'Bitte überprüfen Sie Ihre E-Mails, um Ihr Konto zu bestätigen.'
          );

          // Profil in der eigenen 'users'-Tabelle erstellen
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                display_name: displayName,
                email: email,
                // Fügen Sie weitere Felder hinzu, falls erforderlich
              },
            ]);

          if (profileError) {
            console.error("Profil Erstellung fehlgeschlagen:", profileError.message);
            Alert.alert('Profil Erstellung fehlgeschlagen', profileError.message);
          } else {
            console.log("Profil erstellt:", profileData);
            // Navigation zur EmailConfirmation oder einer anderen Seite
            navigation.replace('EmailConfirmation', { userId: user.id, displayName });
          }
        }
      }
    } catch (error) {
      console.error("Unerwarteter Fehler bei der Registrierung:", error);
      Alert.alert('Registrierung fehlgeschlagen', 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Registrierung</Text>
        <TextInput
          label="Anzeigename"
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
        />
        <TextInput
          label="E-Mail"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Passwort"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="Passwort bestätigen"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSignUp}
          style={styles.button}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : "Registrieren"}
        </Button>
        <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
          Haben Sie bereits einen Account? <Text style={styles.linkHighlight}>Hier anmelden.</Text>
        </Text>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 12 },
  button: { marginTop: 10, paddingVertical: 5 },
  linkText: { color: '#4CAF50', textDecorationLine: 'underline', textAlign: 'center', marginTop: 10 },
  linkHighlight: { fontWeight: 'bold' },
});

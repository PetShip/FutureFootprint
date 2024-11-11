// contexts/SessionContext.js

import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Alert } from 'react-native';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [profile, setProfile] = useState(null);

  // Funktion zum Abrufen der Profildaten aus der 'users'-Tabelle
  const fetchProfile = async (userId) => {
    try {
      console.log('Attempting to fetch profile for user ID:', userId);
      const { data: profileData, error: profileError } = await supabase
        .from('users') // Verwenden Sie 'users' statt 'profiles'
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('Profile Data:', profileData);
      console.log('Profile Error:', profileError);

      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
        Alert.alert('Error', 'Failed to fetch user profile.');
        setProfile(null);
      } else {
        if (profileData) {
          setProfile(profileData);
          console.log('Profile fetched successfully:', profileData);
        } else {
          console.log('No profile found for user ID:', userId);
          setProfile(null);
        }
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      Alert.alert('Error', 'An unexpected error occurred while fetching profile.');
      setProfile(null);
    }
  };

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        console.log('Fetching session...');
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error fetching session:', error.message);
          Alert.alert('Error', 'Failed to fetch session.');
        }

        console.log('Fetched Session:', data.session);
        setSession(data.session);

        if (data.session?.user) {
          const emailVerified = data.session.user.email_confirmed_at ? true : false;
          setIsEmailVerified(emailVerified);
          await fetchProfile(data.session.user.id);
        } else {
          setProfile(null);
          setIsEmailVerified(false);
          console.log('No user session found.');
        }
      } catch (error) {
        console.error('Unexpected error fetching session:', error);
        Alert.alert('Error', 'An unexpected error occurred while fetching session.');
      }
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth State Changed:', session);
        setSession(session);

        if (session?.user) {
          const emailVerified = session.user.email_confirmed_at ? true : false;
          setIsEmailVerified(emailVerified);
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsEmailVerified(false);
          console.log('Auth state change: No user session.');
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        isEmailVerified,
        profile,
        fetchProfile,
        setSession,
        setProfile,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

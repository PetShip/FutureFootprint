// contexts/SessionContext.js

import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Fetch the initial session
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();

    // Set up the listener for auth state changes
    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("Session updated:", session);
    });

    // Clean up listener on component unmount
    return () => {
      authListener.data?.subscription?.unsubscribe?.(); // Optional chaining to safely call unsubscribe if available
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
};

// supabase.js

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Zugriff auf Umgebungsvariablen über Expo-Konfiguration
const supabaseUrl = Constants.manifest?.extra?.supabaseUrl || process.env.SUPABASE_URL;
const supabaseAnonKey = Constants.manifest?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY;

// Erstellung des Supabase-Clients
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

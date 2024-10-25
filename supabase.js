// supabase.js

import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project URL and Anon Key
const supabaseUrl = 'https://avpbjmhezmuhmgvgsadd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGJqbWhlem11aG1ndmdzYWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4NDk5MjEsImV4cCI6MjA0NDQyNTkyMX0.rOCkHVgeQOr32l8B2e-8lTBItjLCMGT67iRpbvBFZSc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

/**
 * Supabase client for the app. Auth/identity is owned by Supabase; the access
 * token it issues is sent as `Authorization: Bearer` to the Zenemic backend
 * (see lib/api.ts). The session is persisted in AsyncStorage so the user stays
 * logged in across app restarts.
 */
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

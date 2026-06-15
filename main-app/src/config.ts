/**
 * App configuration, read from Expo public env vars (inlined at build time).
 * Set these in `main-app/.env` (see `.env.example`). Restart with `npx expo start -c`
 * after changing them.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Create main-app/.env from .env.example and restart with \`npx expo start -c\`.`,
    );
  }
  return value;
}

export const config = {
  apiUrl: required('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL),
  supabaseUrl: required('EXPO_PUBLIC_SUPABASE_URL', process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: required('EXPO_PUBLIC_SUPABASE_ANON_KEY', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
};

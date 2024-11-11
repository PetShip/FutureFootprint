import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  },
  scheme: "futurefootprint", // Replace "futurefootprint" with your preferred scheme name
  ios: {
    bundleIdentifier: "com.yourcompany.futurefootprint",
  },
  android: {
    package: "com.yourcompany.futurefootprint",
  },
});

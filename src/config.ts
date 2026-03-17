export const config = {
  PORT: parseInt(process.env.PORT || '3000'),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
};
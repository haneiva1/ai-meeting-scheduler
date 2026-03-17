import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

export async function saveTokens(tokens: any) {
  await supabase.from('oauth_tokens').upsert({ id: 'google', tokens: JSON.stringify(tokens) });
}

export async function getTokens() {
  const { data } = await supabase.from('oauth_tokens').select('tokens').eq('id', 'google').single();
  if (!data) throw new Error('No Google tokens found. Please authenticate at /auth/google');
  return JSON.parse(data.tokens);
}
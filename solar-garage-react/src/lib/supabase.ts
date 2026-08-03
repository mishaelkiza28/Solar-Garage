import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const DEMO = !SUPABASE_URL || !SUPABASE_KEY;

export const sb: SupabaseClient | null = DEMO
  ? null
  : createClient(SUPABASE_URL, SUPABASE_KEY);

export const BUCKET = 'client-documents';

if (DEMO) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Solar Garage] Running in demo mode — set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in .env to connect live data.'
  );
}

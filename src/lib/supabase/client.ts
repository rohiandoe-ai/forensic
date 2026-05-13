import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Only initialize if we have the credentials to avoid runtime crash
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

if (!supabase) {
  console.error('CRITICAL: Supabase environment variables are missing. Authentication and database features will not work.');
}

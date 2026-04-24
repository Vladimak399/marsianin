import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
}

export function createSupabaseServerClient() {
  assertEnv();

  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: { persistSession: false }
  });
}

export function createSupabaseAdminClient() {
  assertEnv();

  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin write operations.');
  }

  return createClient(supabaseUrl!, supabaseServiceRoleKey, {
    auth: { persistSession: false }
  });
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase service role environment variables");
}

// Server-side Supabase client with service role key. Do not import this from client-side code.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

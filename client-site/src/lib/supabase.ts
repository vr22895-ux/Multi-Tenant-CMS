// client-site/src/lib/supabase.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
export const createClient = () => createSupabaseClient(supabaseUrl, supabaseKey);
export const COMPANY_ID = process.env.NEXT_PUBLIC_COMPANY_ID;

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });
const clientEnvPath = path.join(__dirname, 'client-site/.env.local');
const clientEnv = dotenv.config({ path: clientEnvPath }).parsed || {};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || clientEnv.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Connecting to:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function debug() {
    console.log('\n--- Checking Environment ---');
    console.log('NEXT_PUBLIC_COMPANY_ID in .env.local:', clientEnv.NEXT_PUBLIC_COMPANY_ID);

    console.log('\n--- Checking Database Companies ---');
    const { data: companies, error: cError } = await supabase.from('companies').select('*');
    if (cError) console.error(cError);
    else console.table(companies);

    console.log('\n--- Checking Database Posts (First 5) ---');
    const { data: posts, error: pError } = await supabase.from('post').select('slug, company_id').limit(5);
    if (pError) console.error(pError);
    else console.table(posts);
}

debug();

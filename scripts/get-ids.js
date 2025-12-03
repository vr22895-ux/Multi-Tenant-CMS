const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function getIds() {
    const { data, error } = await supabase.from('companies').select('id, name');
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

getIds();

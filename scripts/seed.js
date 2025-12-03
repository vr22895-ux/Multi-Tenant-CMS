const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars from the root directory
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase environment variables.');
    console.error('Checked path:', envPath);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding companies...');

    const companies = [
        {
            name: 'TechCorp',
            domain: 'techcorp.demo.com',
            api_key: 'key_techcorp_123'
        },
        {
            name: 'FoodBlog',
            domain: 'foodblog.demo.com',
            api_key: 'key_foodblog_456'
        }
    ];

    for (const company of companies) {
        const { error } = await supabase
            .from('companies')
            .upsert(company, { onConflict: 'api_key' });

        if (error) {
            console.error(`Error inserting ${company.name}:`, error.message);
        } else {
            console.log(`Inserted/Updated: ${company.name}`);
        }
    }

    console.log('Seeding complete!');
}

seed();

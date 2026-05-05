const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) env[key.trim()] = values.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket(name) {
  const { data, error } = await supabase.storage.getBucket(name);
  if (error) {
    console.log(`Bucket '${name}' does not exist. Trying to create...`);
    const { data: createData, error: createError } = await supabase.storage.createBucket(name, {
      public: true
    });
    if (createError) {
      console.error(`Error creating bucket '${name}':`, createError.message);
    } else {
      console.log(`Bucket '${name}' created successfully!`);
    }
  } else {
    console.log(`Bucket '${name}' already exists.`);
  }
}

async function main() {
  await createBucket('cars');
  await createBucket('avatars');
}

main();

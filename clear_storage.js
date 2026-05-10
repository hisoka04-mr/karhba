const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) env[key.trim()] = values.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearBucket(bucketName) {
  console.log(`Clearing bucket: ${bucketName}...`);
  
  // List all files in the bucket
  const { data: files, error: listError } = await supabase.storage.from(bucketName).list();
  
  if (listError) {
    console.error(`Error listing files in ${bucketName}:`, listError.message);
    return;
  }

  if (!files || files.length === 0) {
    console.log(`Bucket ${bucketName} is already empty.`);
    return;
  }

  // Delete all files
  const filePaths = files.map(file => file.name);
  const { error: deleteError } = await supabase.storage.from(bucketName).remove(filePaths);

  if (deleteError) {
    console.error(`Error deleting files in ${bucketName}:`, deleteError.message);
  } else {
    console.log(`Successfully cleared ${files.length} files from ${bucketName}.`);
  }
}

async function main() {
  console.log('--- STORAGE CLEANUP START ---');
  await clearBucket('cars');
  await clearBucket('avatars');
  console.log('--- STORAGE CLEANUP DONE ---');
  console.log('\nNOTE: To delete database records and accounts, please run the SQL script in clear_all_data.sql in your Supabase SQL Editor.');
}

main();

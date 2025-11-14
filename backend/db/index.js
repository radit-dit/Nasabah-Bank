require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
// Pastikan Anda menggunakan SERVICE_KEY jika backend akan menulis/mengupdate data.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY; 

if (!SUPABASE_URL || !SUPABASE_KEY) {
    // Gunakan sintaks error yang lebih jelas di Node.js
    throw new Error('Supabase credentials (URL/KEY) must be set in the .env file.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        // Menonaktifkan persistensi sesi karena ini adalah server, bukan browser
        persistSession: false, 
    },
});

module.exports = supabase;
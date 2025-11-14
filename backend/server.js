// rfid-local-server/server.js

// --- 1. REQUIRE DEPENDENCIES ---
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Digunakan saat Deployment di Orange Pi (Harus di-uncomment nanti)
// const { SerialPort } = require('serialport');
// const { ReadlineParser } = require('@serialport/parser-readline'); 

// Import client Supabase yang sudah dikonfigurasi (menggunakan .env)
const supabase = require('./supabaseClient'); 

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3000;

// --- 2. LOGIKA UTAMA RFID ---

// Logika ini akan menyimpan tag terakhir yang dibaca (baik dari mock atau SerialPort)
let lastRfidTag = null; 

/**
 * Fungsi untuk mencatat (log) tap kartu ke database Supabase.
 * Ini penting untuk audit keamanan di sisi backend.
 * @param {string} tagId - ID Tag RFID yang dibaca.
 */
async function logRfidTap(tagId) {
    console.log(`[SUPABASE LOG] Mencatat tap untuk ID: ${tagId}`);
    
    // GANTI 'tap_log' DENGAN NAMA TABEL LOG ANDA JIKA BERBEDA
    const { error } = await supabase
        .from('tap_log') 
        .insert({ 
            rfid_tag: tagId, 
            waktu_tap: new Date().toISOString() 
        });

    if (error) {
        console.error('[SUPABASE ERROR] Gagal mencatat tap:', error.message);
    } 
}


// A. LOGIKA MOCK RFID (Hanya untuk Pengujian Lokal di Laptop)
// HAPUS ATAU COMMENT BAGIAN INI SAAT DEPLOYMENT KE ORANGE PI
const MOCK_RFID_TAGS = ['12345678', '90123456', '88888888']; 
let tagIndex = 0;

setInterval(() => {
    const mockTag = MOCK_RFID_TAGS[tagIndex];
    
    // 1. Catat ke Supabase (Jika perlu)
    logRfidTap(mockTag);

    // 2. Simpan Tag Terakhir
    lastRfidTag = mockTag;

    // 3. Kirim ke Frontend (melalui WebSocket)
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'RFID_READ', tagId: lastRfidTag }));
        }
    });
    
    tagIndex = (tagIndex + 1) % MOCK_RFID_TAGS.length;
}, 5000); 
// -----------------------------------------------------------


/* // B. LOGIKA SERIAL PORT RFID (UNCOMMENT DAN GANTI DENGAN KODE INI SAAT DI ORANGE PI)

const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 }); 
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', data => {
    const rfidTag = data.trim();
    console.log(`[RFID READ] Tag Diterima: ${rfidTag}`);

    // 1. Catat ke Supabase
    logRfidTap(rfidTag); 

    // 2. Simpan Tag Terakhir
    lastRfidTag = rfidTag;

    // 3. Kirim ke Frontend (melalui WebSocket)
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'RFID_READ', tagId: lastRfidTag }));
        }
    });
});
*/


// --- 3. LOGIKA SERVER EXPRESS & WEBSOCKET ---

// Melayani file React yang sudah di-build dari folder 'build'
app.use(express.static('build')); 

// WebSocket Connection Handler
wss.on('connection', function connection(ws) {
    console.log('[WS] Frontend terhubung via WebSocket');
    // Jika perlu, Anda bisa mengirim data status awal di sini
});

// Listener Server
server.listen(PORT, () => {
    console.log(`Server lokal berjalan di http://localhost:${PORT}`);
    console.log('Pastikan frontend berjalan dan terhubung via WS.');
});
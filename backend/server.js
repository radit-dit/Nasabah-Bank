const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const rfidRoute = require('./routes/rfidRoute');
const supabase = require('./supabaseClient'); // pastikan supabaseClient juga CommonJS

dotenv.config();

app.get('/', (req, res) => {
  res.send("Backend berjalan!");
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/rfid", rfidRoute);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = 3000;

// --- RFID Logic ---
app.get('/api/anggota/:rfidTag', async (req, res) => {
    const rfidTag = req.params.rfidTag;

    try {
        const { data, error } = await supabase
            .from('anggota')
            .select(`
                id,
                nama, 
                saldo, 
                transaksi(waktu_transaksi, jenis_transaksi, jumlah)
            `)
            .eq('rfid_tag', rfidTag)
            .limit(1);

        if (error) throw error;
        
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Anggota tidak ditemukan.' });
        }

        // Response ke Frontend/Hardware
        res.status(201).json({ 
        message: 'Pendaftaran Berhasil.', 
        member: data[0]
    });

    } catch (error) {
        console.error('Error saat cek saldo:', error.message);
        res.status(500).json({ message: 'Gagal memproses permintaan.' });
    }
});

// --- API Anggota ---
app.get("/api/anggota/:rfidTag", async (req, res) => {
    const rfidTag = req.params.rfidTag;

    const { data, error } = await supabase
        .from("anggota")
        .select(`
            id,
            nama,
            saldo,
            transaksi(waktu_transaksi, jenis_transaksi, jumlah)
        `)
        .eq("rfid_tag", rfidTag)
        .limit(1);

    if (error) return res.status(500).json({ message: "Database error." });
    if (!data.length) return res.status(404).json({ message: "Anggota tidak ditemukan." });

    res.json({ message: "OK", member: data[0] });
});

server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

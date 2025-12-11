const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const rfidRoute = require('./routes/rfidRoute');
const supabase = require('./supabaseClient');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root
app.get('/', (req, res) => {
  res.send("Backend berjalan!");
});

// Route RFID
app.use("/api/rfid", rfidRoute);

// Ambil anggota berdasarkan RFID
app.get("/api/anggota/:rfidTag", async (req, res) => {
  const rfidTag = req.params.rfidTag.trim();
  try {
    const { data, error } = await supabase
      .from("anggota")
      .select(`
        id,
        nama,
        saldo,
        transaksi(waktu_transaksi, jenis_transaksi, jumlah)
      `)
      .eq("rfid_tag", rfidTag)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "OK", member: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Server + WebSocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

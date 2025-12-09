// rfidRoute.js
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// Buat satu instance supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const router = express.Router();

// SCAN RFID → AMBIL DATA ANGGOTA
router.post('/scan', async (req, res) => {
  try {
    const { rfid_tag } = req.body;

    if (!rfid_tag) {
      return res.status(400).json({ success: false, message: 'RFID tidak ada' });
    }

    // AMBIL DATA DARI SUPABASE
    const { data: member, error } = await supabase
      .from('members')
      .select('id, nama, saldo')
      .eq('rfid_tag', rfid_tag)
      .single();

    if (error || !member) {
      return res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' });
    }

    // AMBIL RIWAYAT TRANSAKSI
    const { data: history } = await supabase
      .from('transactions')
      .select('jenis_transaksi, jumlah, created_at')
      .eq('member_id', member.id)
      .order('created_at', { ascending: false })
      .limit(10);

    return res.json({
      success: true,
      member: {
        ...member,
        history: history || []
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

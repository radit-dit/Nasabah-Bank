import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";

export default function BankAccountDashboard() {
  const [accountData, setAccountData] = useState(null);
  
  useEffect(() => {
  async function fetchData() {
    const res = await fetch("http://localhost:3000/api/anggota/ID_ANGGOTA"); 
    const data = await res.json();
    setAccountData({
      name: data.nama,
      accountNumber: data.rfid_tag,
      balance: data.saldo,
      transactions: data.transaksi.map(t => ({
        id: t.id,
        date: t.waktu,
        description: t.jenis_transaksi,
        amount: t.jumlah,
        type: t.jumlah > 0 ? "credit" : "debit"
      }))
    });
  }
  
  if (!accountData) {
  return <div className="p-10 text-center text-gray-500">Loading...</div>;
}

  fetchData();
}, []);
}


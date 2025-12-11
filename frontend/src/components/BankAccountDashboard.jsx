import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from "lucide-react";

export default function BankAccountDashboard() {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3001/api/anggota/ID_ANGGOTA"); 
        const result = await res.json();

        if (result.member) {
          setAccountData({
            name: result.member.nama,
            accountNumber: result.member.rfid_tag,
            balance: result.member.saldo,
            transactions: result.member.transaksi?.map((t, index) => ({
              id: t.id || index,
              date: t.waktu_transaksi || t.created_at,
              description: t.jenis_transaksi,
              amount: t.jumlah,
              type: t.jumlah > 0 ? "credit" : "debit"
            })) || []
          });
        }
      } catch (err) {
        console.error("Error fetching account data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!accountData) {
    return <div className="p-10 text-center text-red-500">Data tidak ditemukan</div>;
  }

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold">{accountData.name}</h2>
      <p>RFID: {accountData.accountNumber}</p>
      <p>Saldo: Rp {accountData.balance}</p>

      <h3 className="mt-4 font-semibold">Riwayat Transaksi:</h3>
      {accountData.transactions.length > 0 ? (
        <ul>
          {accountData.transactions.map(tx => (
            <li key={tx.id}>
              {tx.date} - {tx.description} - Rp {tx.amount} ({tx.type})
            </li>
          ))}
        </ul>
      ) : (
        <p>Belum ada transaksi.</p>
      )}
    </div>
  );
}

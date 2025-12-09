import { useState } from "react";

export default function RFIDKiosk() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanRFID = async (rfidTag) => {
    setLoading(true);

    const res = await fetch("http://localhost:3000/rfid/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rfid_tag: rfidTag }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      alert("RFID tidak ditemukan!");
      setMember(null);
      return;
    }

    setMember(data.member);
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-[450px] bg-gray-800 rounded-2xl p-6 shadow-xl text-white">

        {/* JIKA BELUM SCAN */}
        {!member && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Silakan Scan Kartu</h1>
            <p className="text-gray-400 mb-6">
              Tempelkan kartu RFID kamu di reader
            </p>

            <button
              onClick={() => scanRFID("1234567890")}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
              disabled={loading}
            >
              {loading ? "Mengecek..." : "Simulasikan Scan RFID"}
            </button>
          </div>
        )}

        {/* JIKA SUDAH SCAN */}
        {!member && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">Data Anggota</h2>

            <div className="bg-gray-700 rounded-xl p-4 mb-4">
              <p className="text-gray-300">Nama</p>
              <h3 className="text-xl font-semibold">{member.nama}</h3>

              <p className="text-gray-300 mt-3">Saldo</p>
              <h3 className="text-xl font-semibold">Rp {member.saldo}</h3>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Riwayat Transaksi</h3>

              <div className="h-40 overflow-y-auto space-y-2">
                {member.history.length === 0 && (
                  <p className="text-gray-400">Tidak ada transaksi</p>
                )}

                {member.history.map((tx, i) => (
                  <div
                    key={i}
                    className="bg-gray-700 rounded-lg p-3 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">{tx.jenis_transaksi}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-bold">Rp {tx.jumlah}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTON RESET */}
            <button
              onClick={() => setMember(null)}
              className="mt-6 w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold"
            >
              Scan Kartu Lain
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const scanRFID = async (rfidTag) => {
  try {
    const res = await fetch("http://localhost:3000/rfid/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rfid_tag: rfidTag })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    setMember(data.member); // SIMPAN KE STATE
  } catch (error) {
    console.error(error);
  }
};
 {!member && (
  <div>
    <h2>{member.nama}</h2>
    <p>Saldo: Rp {member.saldo}</p>

    <h3>Riwayat Transaksi:</h3>
    {member.history.map((tx, i) => (
      <div key={i}>
        <p>{tx.jenis_transaksi} - Rp {tx.jumlah}</p>
        <small>{tx.created_at}</small>
      </div>
    ))}
  </div>
)}
  {!member && (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Silakan Scan Kartu</h1>
      <p className="text-gray-400 mb-6">
        Tempelkan kartu RFID kamu di reader
      </p>
      <button
        onClick={() => scanRFID("1234567890")}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold" 
        disabled={loading}
      >
        {loading ? "Mengecek..." : "Simulasikan Scan RFID"}
      </button>
    </div>
  )}
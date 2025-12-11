import { useState, useRef, useEffect } from "react";
import { fetchMember, fetchTransactions } from "./api";

export default function RFIDKiosk() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [member]);

  const scanRFID = async (rfidTag) => {
    setLoading(true);
    try {
      const memberData = await fetchMember(rfidTag);
      const transactions = await fetchTransactions(rfidTag);

      setMember({ ...memberData, history: transactions });
    } catch (err) {
      alert(err.message || "RFID not found");
      setMember(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const rfidtag = e.target.value.trim().replace(/\r?\n/g, '');;
      e.target.value = "";
      scanRFID(rfidtag);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-[500px] bg-white rounded-3xl p-8 shadow-xl text-gray-900">

        {!member && (
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Please Scan Your Card</h1>
            <p className="text-gray-600">Place your RFID card on the reader</p>
            <input
              ref={inputRef}
              type="text"
              placeholder="Scan your card..."
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold"
              disabled={loading}
              autoFocus
            />
            {loading && <p className="text-gray-500 mt-2">Processing...</p>}
          </div>
        )}

        {member && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Member Info</h2>
            <div className="bg-gray-50 rounded-xl p-5 shadow-inner space-y-2 border border-gray-200">
              <p className="text-gray-500">Name</p>
              <h3 className="text-xl font-semibold">{member.nama}</h3>

              <p className="text-gray-500 mt-3">Balance</p>
              <h3 className="text-xl font-semibold">${member.saldo}</h3>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Transaction History</h3>
              <div className="h-48 overflow-y-auto space-y-2">
                {member.history?.length === 0 && <p className="text-gray-500">No transactions</p>}
                {member.history?.map((tx, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center border border-gray-200">
                    <div>
                      <p className="font-semibold">{tx.jenis_transaksi}</p>
                      <p className="text-sm text-gray-500">{new Date(tx.waktu_transaksi).toLocaleString()}</p>
                    </div>
                    <p className="font-bold">${tx.jumlah}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setMember(null)} className="mt-6 w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 transition font-semibold text-white">
              Scan Another Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

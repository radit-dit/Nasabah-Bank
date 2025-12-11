const BASE_URL = "http://localhost:3001";

export async function fetchMember(rfidTag) {
  const res = await fetch(`${BASE_URL}/api/user/rfid/${rfidTag}`);
  if (!res.ok) throw new Error("Member not found");
  return res.json();
}

export async function fetchTransactions(rfidTag) {
  const res = await fetch(`${BASE_URL}/api/anggota/${rfidTag}`);
  if (!res.ok) throw new Error("Transactions not found");
  const data = await res.json();
  return data.transaksi || [];
}

export async function performTransaction(rfidTag, type, amount) {
  const res = await fetch(`${BASE_URL}/api/transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rfid_tag: rfidTag,
      jenis_transaksi: type,
      jumlah: amount
    }),
  });
  return res.json();
}

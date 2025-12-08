import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, RefreshCw, XCircle, ChevronDown, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

// ===============================================
// SETUP SUPABASE CLIENT
// ===============================================

const createClient = (typeof window !== 'undefined' && window.supabase && window.supabase.createClient)
    ? window.supabase.createClient
    : (url, key) => {
        console.error("Kesalahan Supabase: createClient tidak ditemukan. Pastikan library Supabase Client dimuat.");
        return { 
            from: () => ({ 
                select: () => ({ 
                    eq: () => ({ single: async () => ({ data: null, error: { message: "Supabase client not initialized." } }) }),
                    order: () => ({ limit: () => Promise.resolve({ data: [] }) }) 
                }) 
            }) 
        };
    };

const SUPABASE_URL = 'https://uapjdjnolfjleehvdcdh.supabase.co'; 
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STATUS = {
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    FULL_DASHBOARD: 'FULL_DASHBOARD',
};

// ===============================================
// UTILITAS FORMATTING
// ===============================================

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'Rp0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const formatAmountDisplay = (amount) => {
    const absAmount = Math.abs(amount);
    const sign = amount >= 0 ? '+' : '';
    return sign + formatCurrency(absAmount);
};

// ===============================================
// KOMPONEN BANK ACCOUNT DASHBOARD (Full Featured)
// ===============================================

const BankAccountDashboard = ({ accountData, onBack }) => {
  const [hiddenTransactions, setHiddenTransactions] = useState(new Set());
  const [showAllTransactions, setShowAllTransactions] = useState(true);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const toggleTransactionVisibility = (transactionId) => {
    setHiddenTransactions(prev => {
      const newHidden = new Set(prev);
      if (newHidden.has(transactionId)) {
        newHidden.delete(transactionId);
      } else {
        newHidden.add(transactionId);
      }
      return newHidden;
    });
  };

  const toggleAllTransactions = () => {
    if (showAllTransactions) {
      const allIds = new Set(accountData.transactions.map(t => t.id));
      setHiddenTransactions(allIds);
    } else {
      setHiddenTransactions(new Set());
    }
    setShowAllTransactions(!showAllTransactions);
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  const visibleTransactions = accountData.transactions.filter(
    transaction => !hiddenTransactions.has(transaction.id)
  );

  const displayBalance = isBalanceHidden ? '••••••••' : formatCurrency(accountData.balance);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto h-full">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-900">User Dashboard</h1>
              <p className="text-sm md:text-base text-gray-600">Welcome {accountData.name}!</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
                {accountData.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Account Info Card */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-500 rounded-lg shadow-lg p-6 md:p-8 lg:p-10 mb-4 md:mb-6 text-white">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <p className="text-blue-200 text-xs md:text-sm mb-1">Username</p>
              <p className="text-lg md:text-xl lg:text-2xl font-semibold">{accountData.name}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs md:text-sm mb-1">Card Number</p>
              <p className="text-base md:text-lg lg:text-xl font-mono">{accountData.accountNumber}</p>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-xs md:text-sm mb-1">Balance Available</p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold">{displayBalance}</p>
                </div>
                <button
                  onClick={toggleBalanceVisibility}
                  className="ml-4 p-2 bg-blue-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all"
                  title={isBalanceHidden ? "Show Balance" : "Hide Balance"}
                >
                  {isBalanceHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-blue-900">Transaction History</h2>
            <button
              onClick={toggleAllTransactions}
              className="px-3 py-2 bg-blue-500 text-white text-xs md:text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showAllTransactions ? 'Hide All' : 'Show All'}
            </button>
          </div>

          {visibleTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions to display</p>
              <p className="text-sm mt-2">Click "Show All" to view your transaction history</p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {visibleTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 md:p-4 lg:p-5 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTransactionVisibility(transaction.id)}
                      className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                      title="Hide transaction"
                    >
                      <span className="text-xs text-white">−</span>
                    </button>

                    <div className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${
                      transaction.jenis_transaksi === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-base md:text-lg lg:text-xl ${
                        transaction.jenis_transaksi === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.jenis_transaksi === 'credit' ? '↓' : '↑'}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm md:text-base lg:text-lg truncate">
                        {transaction.catatan}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">{formatDate(transaction.waktu_transaksi)}</p>
                    </div>
                  </div>

                  <div className={`text-sm md:text-base lg:text-lg font-semibold ml-2 ${
                    transaction.jenis_transaksi === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.jenis_transaksi === 'credit' ? '+' : ''}{formatCurrency(transaction.jumlah)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {hiddenTransactions.size > 0 && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {hiddenTransactions.size} transaction{hiddenTransactions.size > 1 ? 's' : ''} hidden
                </p>
                <button
                  onClick={() => setHiddenTransactions(new Set())}
                  className="text-blue-600 text-sm hover:text-blue-800 transition-colors"
                >
                  Show All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        {onBack && (
          <div className="mt-6 text-center">
            <button 
              onClick={onBack}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Kembali ke Layar Scan
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

// ===============================================
// KOMPONEN TAMPILAN QUICK VIEW (Success View)
// ===============================================

const SuccessView = ({ data, onViewFullDashboard }) => {
    return (
        <div className="w-full h-full min-h-screen p-4 md:p-8 lg:p-10 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="max-w-4xl mx-auto h-full">
                {/* Header Welcome */}
                <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 mb-6 flex justify-between items-center border-t-4 border-blue-600">
                    <h1 className="text-xl md:text-3xl font-bold text-blue-900">
                        Halo, {data.name} <span className='text-gray-400 text-sm md:text-base ml-2'>({data.accountNumber})</span>
                    </h1>
                    <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                </div>

                {/* Account Info Card */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-2xl p-6 md:p-8 mb-6 text-white transform hover:scale-[1.01] transition-transform duration-300">
                    <p className="text-blue-200 text-sm mb-1">Saldo Tersedia</p>
                    <p className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        {formatCurrency(data.balance)}
                    </p>
                    <p className="text-blue-300 mt-2 text-sm">Update terakhir: {new Date().toLocaleTimeString('id-ID')}</p>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-xl shadow-xl p-4 md:p-6">
                    <h2 className="text-lg md:text-2xl font-bold text-blue-900 mb-4 border-b pb-2">Riwayat Transaksi Terakhir</h2>
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                        {data.transactions.slice(0, 5).map((transaction) => (
                            <div
                                key={`${transaction.id}-${transaction.waktu_transaksi}`} 
                                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        transaction.jenis_transaksi === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                        <span className={`text-xl ${
                                            transaction.jenis_transaksi === 'credit' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {transaction.jenis_transaksi === 'credit' ? <ChevronDown size={20} /> : <ChevronDown size={20} className='rotate-180' />}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-800 truncate">{transaction.catatan}</p>
                                        <p className="text-xs text-gray-500">{formatDate(transaction.waktu_transaksi)}</p>
                                    </div>
                                </div>
                                <div className={`text-lg font-bold ml-2 flex-shrink-0 ${
                                    transaction.jenis_transaksi === 'credit' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {transaction.jenis_transaksi === 'credit' ? formatAmountDisplay(transaction.jumlah) : formatAmountDisplay(-transaction.jumlah)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Button to Full Dashboard */}
                <div className="mt-6 text-center">
                    <button 
                        onClick={onViewFullDashboard}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
                    >
                        <span>Lihat Dashboard Lengkap</span>
                        <ArrowRight className="w-6 h-6" />
                    </button>
                    <p className='text-sm text-gray-500 mt-4'>Atau tunggu untuk kembali ke layar utama...</p>
                </div>
            </div>
        </div>
    );
};

// ===============================================
// KOMPONEN UTAMA KIOSK
// ===============================================

export default function RfidKiosk() {
    const [status, setStatus] = useState(STATUS.IDLE);
    const [displayData, setDisplayData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleViewFullDashboard = () => {
        setStatus(STATUS.FULL_DASHBOARD);
    };

    const handleBackToScan = () => {
        setDisplayData(null);
        setStatus(STATUS.IDLE);
    };

    const fetchDataFromSupabase = useCallback(async (tagId) => {
        setStatus(STATUS.LOADING);
        setErrorMessage("");
        let anggotaId = null;

        try {
            const { data: anggota, error: errAnggota } = await supabase
                .from('anggota') 
                .select('id, nama, rfid_tag, saldo, nomor_akun') 
                .eq('rfid_tag', tagId)
                .single();

            if (errAnggota || !anggota) {
                if (errAnggota && errAnggota.code === 'PGRST116') {
                    throw new Error("Kartu tidak terdaftar di MetSchoo Bank.");
                }
                throw new Error("Gagal mengambil data anggota.");
            }
            
            anggotaId = anggota.id;

            const { data: riwayat, error: errRiwayat } = await supabase
                .from('transaksi') 
                .select('id, waktu_transaksi, catatan, jumlah, jenis_transaksi') 
                .eq('anggota_id', anggotaId)
                .order('waktu_transaksi', { ascending: false }) 
                .limit(20);

            if (errRiwayat) console.warn("Gagal mengambil riwayat transaksi:", errRiwayat);
            
            const formattedData = {
                name: anggota.nama,
                accountNumber: anggota.nomor_akun || 'N/A',
                balance: anggota.saldo,
                transactions: riwayat || [],
            };

            setDisplayData(formattedData);
            setStatus(STATUS.SUCCESS);

            setTimeout(() => {
                if (status !== STATUS.FULL_DASHBOARD) {
                    setStatus(STATUS.IDLE);
                }
            }, 15000);

        } catch (err) {
            console.error("Error Supabase:", err);
            setErrorMessage(err.message || "Terjadi kesalahan koneksi database.");
            setStatus(STATUS.ERROR);
            setTimeout(() => setStatus(STATUS.IDLE), 5000);
        }
    }, []);

    useEffect(() => {
        const wsUrl = 'ws://localhost:3000';
        let websocket = null;

        const connectWebSocket = () => {
            websocket = new WebSocket(wsUrl);

            websocket.onopen = () => {
                console.log('WebSocket: Terhubung ke Node.js Server');
            };

            websocket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'RFID_READ' && message.tagId && status === STATUS.IDLE) {
                        console.log(`WebSocket: Menerima Tag ID: ${message.tagId}`);
                        fetchDataFromSupabase(message.tagId);
                    }
                } catch (e) {
                    console.error('WebSocket: Error parsing message', e);
                }
            };

            websocket.onclose = () => {
                console.warn('WebSocket: Koneksi terputus. Mencoba menghubungkan kembali dalam 5 detik...');
                setTimeout(connectWebSocket, 5000);
            };

            websocket.onerror = (err) => {
                console.error('WebSocket: Error:', err.message);
                websocket.close(); 
            };
        };

        connectWebSocket();
        return () => websocket?.close(); 
    }, [fetchDataFromSupabase, status]); 

    // Full Dashboard View
    if (status === STATUS.FULL_DASHBOARD && displayData) {
        return <BankAccountDashboard accountData={displayData} onBack={handleBackToScan} />;
    }

    // Quick View after RFID scan
    if (status === STATUS.SUCCESS && displayData) {
        return <SuccessView data={displayData} onViewFullDashboard={handleViewFullDashboard} />;
    }

    // Idle/Loading/Error View
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50 text-white p-6 relative">
            <div className="w-full max-w-lg text-center p-10 bg-white rounded-2xl shadow-2xl border-b-8 border-blue-600">
                <h1 className="text-5xl font-extrabold text-blue-500 mb-2">MetSchoo Bank</h1>
                <p className="text-xl text-gray-400 mb-10">Sistem Keuangan Digital Sekolah</p>

                {status === STATUS.IDLE && (
                    <>
                        <CreditCard className="w-32 h-32 mx-auto mb-8 animate-pulse text-blue-500" />
                        <h2 className="text-3xl font-bold tracking-tight text-blue-500">SILAHKAN SCAN KARTU ANDA</h2>
                        <p className="mt-3 text-lg text-gray-500">Dekatkan kartu RFID ke reader untuk melihat saldo.</p>
                    </>
                )}

                {/* Button Demo Dashboard - Kanan Bawah */}
                {status === STATUS.IDLE && (
                    <button
                        onClick={() => {
                            // Data dummy untuk demo
                            setDisplayData({
                                name: "Dummy User",
                                accountNumber: "MSB-2024-001",
                                balance: 15750000,
                                transactions: [
                                    { id: 1, waktu_transaksi: "2024-11-14", catatan: "Transfer Masuk - Gaji", jumlah: 8500000, jenis_transaksi: "credit" },
                                    { id: 2, waktu_transaksi: "2024-11-13", catatan: "Belanja Online - Tokopedia", jumlah: 450000, jenis_transaksi: "debit" },
                                    { id: 3, waktu_transaksi: "2024-11-12", catatan: "Transfer ke Ibu", jumlah: 2000000, jenis_transaksi: "debit" },
                                    { id: 4, waktu_transaksi: "2024-11-11", catatan: "Tarik Tunai ATM", jumlah: 500000, jenis_transaksi: "debit" },
                                    { id: 5, waktu_transaksi: "2024-11-10", catatan: "Cashback Promo", jumlah: 150000, jenis_transaksi: "credit" },
                                    { id: 6, waktu_transaksi: "2024-11-09", catatan: "Bayar Listrik", jumlah: 350000, jenis_transaksi: "debit" },
                                    { id: 7, waktu_transaksi: "2024-11-08", catatan: "Transfer Masuk", jumlah: 1200000, jenis_transaksi: "credit" },
                                ]
                            });
                            setStatus(STATUS.FULL_DASHBOARD);
                        }}
                        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 font-semibold group"
                    >
                        <span>Lihat Dashboard</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
                {status === STATUS.LOADING && (
                    <>
                        <RefreshCw className="w-20 h-20 mx-auto mb-8 animate-spin text-yellow-400" />
                        <h2 className="text-3xl font-bold">MEMPROSES DATA...</h2>
                        <p className="mt-3 text-lg text-gray-500">Menghubungi Supabase.</p>
                    </>
                )}
                
                {status === STATUS.ERROR && (
                    <>
                        <XCircle className="w-24 h-24 mx-auto mb-8 text-red-600" />
                        <h2 className="text-3xl font-bold text-red-400">OPERASI GAGAL!</h2>
                        <p className="mt-3 text-lg text-red-300">{errorMessage || 'Terjadi kesalahan tidak terduga.'}</p>
                        <p className="mt-1 text-sm text-gray-500">Layar akan kembali normal dalam 5 detik.</p>
                    </>
                )}
            </div>
        </div>
    );
}
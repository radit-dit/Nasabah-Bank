import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";

export default function BankAccountDashboard() {
  const [accountData] = useState({
    name: "Ahmad Wijaya",
    accountNumber: "1234567890",
    balance: 15750000,
    transactions: [
      { id: 1, date: "2024-11-14", description: "Transfer Masuk - Gaji", amount: 8500000, type: "credit" },
      { id: 2, date: "2024-11-13", description: "Belanja Online - Tokopedia", amount: -450000, type: "debit" },
      { id: 3, date: "2024-11-12", description: "Transfer ke Ibu", amount: -2000000, type: "debit" },
      { id: 4, date: "2024-11-11", description: "Tarik Tunai ATM", amount: -500000, type: "debit" },
      { id: 5, date: "2024-11-10", description: "Cashback Promo", amount: 150000, type: "credit" },
      { id: 6, date: "2024-11-09", description: "Bayar Listrik", amount: -350000, type: "debit" },
      { id: 7, date: "2024-11-08", description: "Transfer Masuk", amount: 1200000, type: "credit" },
    ]
  });

  const [hiddenTransactions, setHiddenTransactions] = useState(new Set());
  const [showAllTransactions, setShowAllTransactions] = useState(true);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

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
      // Hide all transactions
      const allIds = new Set(accountData.transactions.map(t => t.id));
      setHiddenTransactions(allIds);
    } else {
      // Show all transactions
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

  const displayBalance = isBalanceHidden ? '*******' : formatCurrency(accountData.balance);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-900">User Dashboard</h1>
              <p className="text-sm md:text-base text-gray-600">Welcome User!</p>
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
                  <span className="text-white text-sm">
                    {isBalanceHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
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
                      transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-base md:text-lg lg:text-xl ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '↓' : '↑'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm md:text-base lg:text-lg truncate">{transaction.description}</p>
                      <p className="text-xs md:text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className={`text-sm md:text-base lg:text-lg font-semibold ml-2 ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : ''}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hidden Transactions Counter */}
          {hiddenTransactions.size > 0 && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300">
                  {hiddenTransactions.size} transaction{hiddenTransactions.size > 1 ? 's' : ''} hidden
                </p>
                <button
                  onClick={() => setHiddenTransactions(new Set())}
                  className="text-white text-sm hover:text-gray-200 transition-colors"
                >
                  Show All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
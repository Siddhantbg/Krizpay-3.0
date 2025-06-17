'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, Filter } from 'lucide-react';
import { Transaction, CryptoAsset } from '@/types/crypto';
import { formatCurrency, formatTimeAgo } from '@/utils/formatters';

interface RecentTransactionsProps {
  transactions: Transaction[];
  cryptoData: CryptoAsset[];
  showAll?: boolean;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  cryptoData,
  showAll = false
}) => {
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-green/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
          {showAll && (
            <button className="flex items-center space-x-2 text-text-secondary hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
          )}
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-text-secondary">No transactions yet</p>
          <p className="text-text-secondary text-sm mt-1">
            Your trading history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-green/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          {showAll ? 'All Transactions' : 'Recent Transactions'}
        </h3>
        <div className="flex items-center space-x-2">
          {showAll && (
            <button className="flex items-center space-x-2 text-text-secondary hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
          )}
          {!showAll && transactions.length > 5 && (
            <button className="text-primary-purple hover:text-primary-blue transition-colors text-sm font-medium">
              View All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {displayTransactions.map((transaction) => {
          const asset = cryptoData.find(c => c.id === transaction.assetId);
          
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'buy' 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  {transaction.type === 'buy' ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  {asset && (
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/32/8B5CF6/FFFFFF?text=${transaction.symbol.charAt(0)}`;
                      }}
                    />
                  )}
                  <div>
                    <p className="text-white font-medium">
                      {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.symbol.toUpperCase()}
                    </p>
                    <p className="text-text-secondary text-sm">
                      {transaction.amount.toFixed(6)} tokens at {formatCurrency(transaction.price)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'buy' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {transaction.type === 'buy' ? '-' : '+'}{formatCurrency(transaction.total)}
                </p>
                <p className="text-text-secondary text-sm">
                  {formatTimeAgo(transaction.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {showAll && transactions.length > 10 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 bg-gray-800/50 text-text-secondary hover:text-white border border-gray-600 rounded-lg transition-colors">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
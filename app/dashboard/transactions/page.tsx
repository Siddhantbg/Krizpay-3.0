'use client';

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter,
  Download,
  Search,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TransactionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Placeholder data for transactions
  const transactions = [
    {
      id: 1,
      type: 'received',
      asset: 'Bitcoin',
      symbol: 'BTC',
      amount: 0.025,
      value: 1250,
      from: 'Alex Johnson',
      to: 'Your Wallet',
      date: '2023-06-15T10:30:00',
      status: 'completed',
      description: 'Payment for design work'
    },
    {
      id: 2,
      type: 'sent',
      asset: 'Ethereum',
      symbol: 'ETH',
      amount: 0.5,
      value: 1400,
      from: 'Your Wallet',
      to: 'Marketplace',
      date: '2023-06-14T15:45:00',
      status: 'completed',
      description: 'NFT Purchase'
    },
    {
      id: 3,
      type: 'received',
      asset: 'Solana',
      symbol: 'SOL',
      amount: 5,
      value: 550,
      from: 'Trading Bot',
      to: 'Your Wallet',
      date: '2023-06-12T09:15:00',
      status: 'completed',
      description: 'Trading profit'
    },
    {
      id: 4,
      type: 'sent',
      asset: 'Bitcoin',
      symbol: 'BTC',
      amount: 0.01,
      value: 500,
      from: 'Your Wallet',
      to: 'Sarah Williams',
      date: '2023-06-10T18:20:00',
      status: 'completed',
      description: 'Dinner split'
    },
    {
      id: 5,
      type: 'received',
      asset: 'Cardano',
      symbol: 'ADA',
      amount: 100,
      value: 90,
      from: 'Staking Rewards',
      to: 'Your Wallet',
      date: '2023-06-08T00:00:00',
      status: 'completed',
      description: 'Staking reward'
    },
    {
      id: 6,
      type: 'sent',
      asset: 'Ethereum',
      symbol: 'ETH',
      amount: 0.2,
      value: 560,
      from: 'Your Wallet',
      to: 'DeFi Protocol',
      date: '2023-06-05T14:30:00',
      status: 'pending',
      description: 'Liquidity provision'
    },
  ];

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(tx => 
    tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple/50 focus:border-primary-purple/50"
            />
          </div>
          <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Date
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Export</span>
          </Button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-primary-green/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-4 text-left text-text-secondary font-medium text-sm">Type</th>
                <th className="pb-4 text-left text-text-secondary font-medium text-sm">Asset</th>
                <th className="pb-4 text-right text-text-secondary font-medium text-sm">Amount</th>
                <th className="pb-4 text-left text-text-secondary font-medium text-sm hidden md:table-cell">Description</th>
                <th className="pb-4 text-right text-text-secondary font-medium text-sm hidden lg:table-cell">Date</th>
                <th className="pb-4 text-right text-text-secondary font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-4">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${tx.type === 'received' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {tx.type === 'received' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="text-white font-medium">{tx.asset}</p>
                      <p className="text-text-secondary text-sm">{tx.symbol}</p>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <p className={`font-medium ${tx.type === 'received' ? 'text-green-400' : 'text-white'}`}>
                      {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.symbol}
                    </p>
                    <p className="text-text-secondary text-sm">${tx.value.toLocaleString()}</p>
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <p className="text-white">{tx.description}</p>
                    <p className="text-text-secondary text-sm">
                      {tx.type === 'received' ? 'From: ' : 'To: '}
                      {tx.type === 'received' ? tx.from : tx.to}
                    </p>
                  </td>
                  <td className="py-4 text-right hidden lg:table-cell">
                    <p className="text-white">{formatDate(tx.date)}</p>
                  </td>
                  <td className="py-4 text-right">
                    <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${tx.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-text-secondary">No transactions found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
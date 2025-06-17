'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search,
  SlidersHorizontal,
  Star,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MarketsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Placeholder data for crypto markets
  const cryptoMarkets = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 50000, change: 2.4, changeType: 'positive', marketCap: 950000000000, volume: 28000000000, starred: true },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 2800, change: -1.2, changeType: 'negative', marketCap: 336000000000, volume: 15000000000, starred: true },
    { id: 3, name: 'Solana', symbol: 'SOL', price: 110, change: 5.7, changeType: 'positive', marketCap: 45000000000, volume: 2500000000, starred: false },
    { id: 4, name: 'Cardano', symbol: 'ADA', price: 0.9, change: 0.8, changeType: 'positive', marketCap: 31000000000, volume: 1200000000, starred: false },
    { id: 5, name: 'Binance Coin', symbol: 'BNB', price: 320, change: -0.5, changeType: 'negative', marketCap: 49000000000, volume: 1800000000, starred: false },
    { id: 6, name: 'XRP', symbol: 'XRP', price: 0.5, change: 1.2, changeType: 'positive', marketCap: 25000000000, volume: 1100000000, starred: false },
    { id: 7, name: 'Polkadot', symbol: 'DOT', price: 18, change: -2.1, changeType: 'negative', marketCap: 18000000000, volume: 900000000, starred: false },
    { id: 8, name: 'Dogecoin', symbol: 'DOGE', price: 0.08, change: 3.5, changeType: 'positive', marketCap: 11000000000, volume: 800000000, starred: false },
  ];

  // Filter cryptocurrencies based on search query
  const filteredCryptos = cryptoMarkets.filter(crypto => 
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Markets</h1>
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple/50 focus:border-primary-purple/50"
            />
          </div>
          <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Market Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-primary-blue/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-4 text-left text-text-secondary font-medium text-sm">Asset</th>
                <th className="pb-4 text-right text-text-secondary font-medium text-sm">Price</th>
                <th className="pb-4 text-right text-text-secondary font-medium text-sm">24h Change</th>
                <th className="pb-4 text-right text-text-secondary font-medium text-sm hidden md:table-cell">Market Cap</th>
                <th className="pb-4 text-right text-text-secondary font-medium text-sm hidden lg:table-cell">Volume (24h)</th>
                <th className="pb-4 text-center text-text-secondary font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredCryptos.map((crypto) => (
                <tr key={crypto.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                        <Star className={`w-4 h-4 ${crypto.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </button>
                      <div>
                        <p className="text-white font-medium">{crypto.name}</p>
                        <p className="text-text-secondary text-sm">{crypto.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-white font-medium">
                      ${crypto.price < 1 ? crypto.price.toFixed(4) : crypto.price.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg ${crypto.changeType === 'positive' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {crypto.changeType === 'positive' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{crypto.changeType === 'positive' ? '+' : ''}{crypto.change}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right hidden md:table-cell">
                    <p className="text-white font-medium">
                      ${(crypto.marketCap / 1000000000).toFixed(1)}B
                    </p>
                  </td>
                  <td className="py-4 text-right hidden lg:table-cell">
                    <p className="text-white font-medium">
                      ${(crypto.volume / 1000000000).toFixed(1)}B
                    </p>
                  </td>
                  <td className="py-4 text-center">
                    <Button size="sm" variant="ghost" className="text-primary-purple hover:text-primary-blue hover:bg-primary-purple/10">
                      <Plus className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Add</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCryptos.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-text-secondary">No cryptocurrencies found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketsPage;
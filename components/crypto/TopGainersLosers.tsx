'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { CryptoAsset } from '@/types/crypto';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface TopGainersLosersProps {
  cryptoData: CryptoAsset[];
  onAssetSelect: (asset: CryptoAsset) => void;
}

const TopGainersLosers: React.FC<TopGainersLosersProps> = ({
  cryptoData,
  onAssetSelect
}) => {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');

  // Sort and get top gainers/losers
  const gainers = [...cryptoData]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  const losers = [...cryptoData]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  const currentData = activeTab === 'gainers' ? gainers : losers;

  return (
    <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-green/20 backdrop-blur-sm">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Market Movers</h3>
        <div className="flex bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'gainers'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Gainers
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'losers'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <TrendingDown className="w-4 h-4 inline mr-1" />
            Losers
          </button>
        </div>
      </div>

      {/* Asset List */}
      <div className="space-y-3">
        {currentData.map((asset, index) => (
          <div
            key={asset.id}
            onClick={() => onAssetSelect(asset)}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/32/8B5CF6/FFFFFF?text=${asset.symbol.charAt(0)}`;
                  }}
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                  asset.price_change_percentage_24h >= 0 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  {asset.price_change_percentage_24h >= 0 ? (
                    <ArrowUpRight className="w-2 h-2 text-green-400" />
                  ) : (
                    <ArrowDownLeft className="w-2 h-2 text-red-400" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-primary-purple transition-colors">
                  {asset.symbol.toUpperCase()}
                </p>
                <p className="text-text-secondary text-sm">{asset.name}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-white font-medium">
                {formatCurrency(asset.current_price)}
              </p>
              <p className={`text-sm font-medium ${
                asset.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPercentage(asset.price_change_percentage_24h)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-text-secondary text-xs text-center">
          Based on 24h price changes • Click to view details
        </p>
      </div>
    </div>
  );
};

export default TopGainersLosers;
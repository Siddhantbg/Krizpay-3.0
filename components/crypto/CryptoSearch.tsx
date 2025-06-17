'use client';

import React, { useState, useMemo } from 'react';
import { Search, Star, Plus, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CryptoAsset, PortfolioAsset } from '@/types/crypto';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatters';

interface CryptoSearchProps {
  cryptoData: CryptoAsset[];
  onAssetSelect: (asset: CryptoAsset) => void;
  onAddToPortfolio: (asset: CryptoAsset, amount: number) => void;
  portfolio: PortfolioAsset[];
}

const CryptoSearch: React.FC<CryptoSearchProps> = ({
  cryptoData,
  onAssetSelect,
  onAddToPortfolio,
  portfolio
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'change_24h'>('market_cap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<'all' | 'gainers' | 'losers'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filter and sort crypto data
  const filteredAndSortedData = useMemo(() => {
    let filtered = cryptoData.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply filters
    if (filterBy === 'gainers') {
      filtered = filtered.filter(asset => asset.price_change_percentage_24h > 0);
    } else if (filterBy === 'losers') {
      filtered = filtered.filter(asset => asset.price_change_percentage_24h < 0);
    }

    // Sort data
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortBy) {
        case 'market_cap':
          aValue = a.market_cap;
          bValue = b.market_cap;
          break;
        case 'price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'change_24h':
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        default:
          return 0;
      }

      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return filtered;
  }, [cryptoData, searchTerm, sortBy, sortOrder, filterBy]);

  const toggleFavorite = (assetId: string) => {
    setFavorites(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const isInPortfolio = (assetId: string) => {
    return portfolio.some(p => p.id === assetId);
  };

  const handleQuickAdd = (asset: CryptoAsset) => {
    const amount = 100 / asset.current_price; // $100 worth
    onAddToPortfolio(asset, amount);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-purple/20 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-600 text-white focus:border-primary-purple"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-primary-purple focus:outline-none"
            >
              <option value="all">All Assets</option>
              <option value="gainers">Gainers</option>
              <option value="losers">Losers</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setSortBy(sort as any);
                setSortOrder(order as any);
              }}
              className="px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-primary-purple focus:outline-none"
            >
              <option value="market_cap-desc">Market Cap (High to Low)</option>
              <option value="market_cap-asc">Market Cap (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="change_24h-desc">24h Change (High to Low)</option>
              <option value="change_24h-asc">24h Change (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-900/50 rounded-2xl border border-primary-blue/20 backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            Cryptocurrency Markets
          </h3>
          <p className="text-text-secondary text-sm mt-1">
            {filteredAndSortedData.length} assets found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/30">
              <tr>
                <th className="text-left p-4 text-text-secondary font-medium">#</th>
                <th className="text-left p-4 text-text-secondary font-medium">Asset</th>
                <th className="text-right p-4 text-text-secondary font-medium">Price</th>
                <th className="text-right p-4 text-text-secondary font-medium">24h Change</th>
                <th className="text-right p-4 text-text-secondary font-medium">Market Cap</th>
                <th className="text-right p-4 text-text-secondary font-medium">Volume</th>
                <th className="text-center p-4 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((asset, index) => (
                <tr
                  key={asset.id}
                  className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => onAssetSelect(asset)}
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-text-secondary text-sm">
                        {asset.market_cap_rank || index + 1}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(asset.id);
                        }}
                        className={`p-1 rounded transition-colors ${
                          favorites.includes(asset.id)
                            ? 'text-yellow-400 hover:text-yellow-500'
                            : 'text-gray-400 hover:text-yellow-400'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={favorites.includes(asset.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={asset.image}
                        alt={asset.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/32/8B5CF6/FFFFFF?text=${asset.symbol.charAt(0)}`;
                        }}
                      />
                      <div>
                        <p className="text-white font-medium">{asset.symbol.toUpperCase()}</p>
                        <p className="text-text-secondary text-sm">{asset.name}</p>
                      </div>
                      {isInPortfolio(asset.id) && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4 text-right">
                    <p className="text-white font-medium">
                      {formatCurrency(asset.current_price)}
                    </p>
                  </td>
                  
                  <td className="p-4 text-right">
                    <div className={`flex items-center justify-end space-x-1 ${
                      asset.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {asset.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {formatPercentage(asset.price_change_percentage_24h)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4 text-right">
                    <p className="text-white">{formatNumber(asset.market_cap)}</p>
                  </td>
                  
                  <td className="p-4 text-right">
                    <p className="text-text-secondary">{formatNumber(asset.total_volume)}</p>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(asset);
                        }}
                        disabled={isInPortfolio(asset.id)}
                        className="bg-primary-purple/20 text-primary-purple border border-primary-purple/30 hover:bg-primary-purple/30 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-text-secondary">No assets found</p>
            <p className="text-text-secondary text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoSearch;
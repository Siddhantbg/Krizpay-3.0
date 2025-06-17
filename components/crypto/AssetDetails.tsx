'use client';

import React, { useState } from 'react';
import { ArrowLeft, Star, Plus, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CryptoAsset } from '@/types/crypto';
import { formatCurrency, formatPercentage, formatNumber, formatSupply } from '@/utils/formatters';

interface AssetDetailsProps {
  asset: CryptoAsset;
  onBack: () => void;
  onAddToPortfolio: (asset: CryptoAsset, amount: number) => void;
  isInPortfolio: boolean;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({
  asset,
  onBack,
  onAddToPortfolio,
  isInPortfolio
}) => {
  const [amount, setAmount] = useState('');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '1y'>('7d');

  // Generate mock historical data
  const generateHistoricalData = (days: number) => {
    const data = [];
    const currentPrice = asset.current_price;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const randomChange = (Math.random() - 0.5) * 0.1;
      const price = currentPrice * (1 + randomChange * (i / days));
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: price,
        volume: Math.random() * asset.total_volume
      });
    }
    
    return data;
  };

  const handleAddToPortfolio = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onAddToPortfolio(asset, numAmount);
      setAmount('');
    }
  };

  const marketStats = [
    {
      label: 'Market Cap',
      value: formatNumber(asset.market_cap),
      rank: `#${asset.market_cap_rank}`
    },
    {
      label: '24h Volume',
      value: formatNumber(asset.total_volume),
      change: formatPercentage(5.2)
    },
    {
      label: 'Circulating Supply',
      value: formatSupply(asset.circulating_supply),
      total: asset.max_supply ? `/ ${formatSupply(asset.max_supply)}` : ''
    },
    {
      label: 'All-Time High',
      value: formatCurrency(asset.ath),
      change: formatPercentage(asset.ath_change_percentage)
    }
  ];

  const timeframeOptions = [
    { value: '24h', label: '24H', days: 1 },
    { value: '7d', label: '7D', days: 7 },
    { value: '30d', label: '30D', days: 30 },
    { value: '1y', label: '1Y', days: 365 }
  ];

  const selectedTimeframe = timeframeOptions.find(t => t.value === timeframe)!;
  const chartData = generateHistoricalData(selectedTimeframe.days);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-text-secondary text-sm">{label}</p>
          <p className="text-white font-medium">
            Price: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-purple/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Markets</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={asset.image}
              alt={asset.name}
              className="w-16 h-16 rounded-full"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/64/8B5CF6/FFFFFF?text=${asset.symbol.charAt(0)}`;
              }}
            />
            <div>
              <h1 className="text-3xl font-bold text-white">{asset.name}</h1>
              <p className="text-text-secondary text-lg">{asset.symbol.toUpperCase()}</p>
              <p className="text-text-secondary text-sm">Rank #{asset.market_cap_rank}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-3xl font-bold text-white mb-2">
              {formatCurrency(asset.current_price)}
            </p>
            <div className={`flex items-center justify-end space-x-2 ${
              asset.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {asset.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span className="text-lg font-semibold">
                {formatPercentage(asset.price_change_percentage_24h)}
              </span>
              <span className="text-text-secondary">24h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Chart */}
        <div className="lg:col-span-2 bg-gray-900/50 rounded-2xl p-6 border border-primary-blue/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Price Chart</h3>
            
            <div className="flex bg-gray-800/50 rounded-lg p-1">
              {timeframeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setTimeframe(option.value as any)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                    timeframe === option.value
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add to Portfolio */}
        <div className="space-y-6">
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-green/20 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4">Add to Portfolio</h3>
            
            {isInPortfolio && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">Already in your portfolio</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Amount</label>
                <Input
                  type="number"
                  step="0.000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-gray-800/50 border-gray-600 text-white focus:border-green-500"
                />
              </div>

              {amount && (
                <div className="p-3 bg-gray-800/30 rounded-lg">
                  <p className="text-text-secondary text-sm">Total Value</p>
                  <p className="text-white font-semibold">
                    {formatCurrency(parseFloat(amount || '0') * asset.current_price)}
                  </p>
                </div>
              )}

              <Button
                onClick={handleAddToPortfolio}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Portfolio
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-yellow/20 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Market Statistics</h3>
            
            <div className="space-y-4">
              {marketStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">{stat.label}</span>
                  <div className="text-right">
                    <p className="text-white font-medium">{stat.value}</p>
                    {stat.rank && (
                      <p className="text-text-secondary text-xs">{stat.rank}</p>
                    )}
                    {stat.change && (
                      <p className={`text-xs ${
                        stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.change}
                      </p>
                    )}
                    {stat.total && (
                      <p className="text-text-secondary text-xs">{stat.total}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;
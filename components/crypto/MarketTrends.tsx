'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { CryptoAsset } from '@/types/crypto';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface MarketTrendsProps {
  cryptoData: CryptoAsset[];
}

const MarketTrends: React.FC<MarketTrendsProps> = ({ cryptoData }) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  // Generate mock historical data for demonstration
  const generateMockData = (asset: CryptoAsset, days: number) => {
    const data = [];
    const currentPrice = asset.current_price;
    const volatility = 0.05; // 5% volatility

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic price movement
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = currentPrice * (1 + randomChange * (i / days));
      
      data.push({
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime(),
        price: price,
        volume: Math.random() * 1000000000
      });
    }
    
    return data;
  };

  // Get top 5 assets by market cap
  const topAssets = cryptoData.slice(0, 5);
  
  // Calculate market statistics
  const totalMarketCap = cryptoData.reduce((sum, asset) => sum + asset.market_cap, 0);
  const totalVolume = cryptoData.reduce((sum, asset) => sum + asset.total_volume, 0);
  const avgChange24h = cryptoData.reduce((sum, asset) => sum + asset.price_change_percentage_24h, 0) / cryptoData.length;

  const marketStats = [
    {
      label: 'Total Market Cap',
      value: formatCurrency(totalMarketCap),
      change: formatPercentage(avgChange24h),
      positive: avgChange24h >= 0
    },
    {
      label: '24h Volume',
      value: formatCurrency(totalVolume),
      change: '+5.2%',
      positive: true
    },
    {
      label: 'BTC Dominance',
      value: '42.3%',
      change: '-0.8%',
      positive: false
    }
  ];

  const timeframeOptions = [
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-text-secondary text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white font-medium">
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-blue/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
          Market Trends
        </h3>
        
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

      {/* Market Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {marketStats.map((stat, index) => (
          <div key={index} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
            <p className="text-text-secondary text-xs mb-1">{stat.label}</p>
            <p className="text-white font-semibold text-sm">{stat.value}</p>
            <p className={`text-xs font-medium ${
              stat.positive ? 'text-green-400' : 'text-red-400'
            }`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Price Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={generateMockData(topAssets[0] || cryptoData[0], timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return timeframe === '24h' 
                  ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
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

      {/* Top Movers */}
      <div>
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Top Movers (24h)
        </h4>
        <div className="space-y-2">
          {topAssets.slice(0, 3).map(asset => (
            <div key={asset.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-white text-sm font-medium">
                  {asset.symbol.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-white text-sm">
                  {formatCurrency(asset.current_price)}
                </p>
                <p className={`text-xs font-medium ${
                  asset.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatPercentage(asset.price_change_percentage_24h)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;
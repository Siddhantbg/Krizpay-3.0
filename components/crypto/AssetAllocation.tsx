'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PortfolioAsset, CryptoAsset } from '@/types/crypto';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface AssetAllocationProps {
  portfolio: PortfolioAsset[];
  cryptoData: CryptoAsset[];
}

const AssetAllocation: React.FC<AssetAllocationProps> = ({
  portfolio,
  cryptoData
}) => {
  // Calculate allocation data
  const allocationData = portfolio.map(asset => {
    const cryptoAsset = cryptoData.find(c => c.id === asset.id);
    if (!cryptoAsset) return null;

    const value = asset.amount * cryptoAsset.current_price;
    return {
      name: cryptoAsset.symbol.toUpperCase(),
      value,
      amount: asset.amount,
      price: cryptoAsset.current_price,
      color: getAssetColor(cryptoAsset.symbol)
    };
  }).filter(Boolean);

  const totalValue = allocationData.reduce((sum, item) => sum + (item?.value || 0), 0);

  // Add percentage to data
  const dataWithPercentage = allocationData.map(item => ({
    ...item,
    percentage: totalValue > 0 ? (item!.value / totalValue) * 100 : 0
  }));

  function getAssetColor(symbol: string): string {
    const colors = {
      'BTC': '#F7931A',
      'ETH': '#627EEA',
      'BNB': '#F3BA2F',
      'ADA': '#0033AD',
      'SOL': '#9945FF',
      'DOT': '#E6007A',
      'AVAX': '#E84142',
      'MATIC': '#8247E5',
      'LINK': '#375BD2',
      'UNI': '#FF007A'
    };
    return colors[symbol.toUpperCase() as keyof typeof colors] || '#8B5CF6';
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-text-secondary text-sm">
            {data.amount.toFixed(6)} tokens
          </p>
          <p className="text-green-400 font-medium">
            {formatCurrency(data.value)}
          </p>
          <p className="text-blue-400 text-sm">
            {formatPercentage(data.percentage)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (portfolio.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-blue/20 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-white mb-4">Asset Allocation</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <PieChart className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-text-secondary">No assets in portfolio</p>
          <p className="text-text-secondary text-sm mt-1">
            Add some crypto assets to see allocation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-blue/20 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-white mb-6">Asset Allocation</h3>
      
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercentage}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {dataWithPercentage.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Asset List */}
      <div className="space-y-3">
        {dataWithPercentage
          .sort((a, b) => (b?.percentage || 0) - (a?.percentage || 0))
          .map((asset, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: asset?.color }}
                />
                <span className="text-white font-medium">{asset?.name}</span>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">
                  {formatPercentage(asset?.percentage || 0)}
                </p>
                <p className="text-text-secondary text-sm">
                  {formatCurrency(asset?.value || 0)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AssetAllocation;
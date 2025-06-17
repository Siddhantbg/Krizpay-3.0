'use client';

import React from 'react';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2,
  DollarSign,
  Wallet,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const PortfolioPage: React.FC = () => {
  // Placeholder data for portfolio assets
  const assets = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', amount: 0.45, value: 22500, change: 2.4, changeType: 'positive' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', amount: 3.2, value: 8960, change: -1.2, changeType: 'negative' },
    { id: 3, name: 'Solana', symbol: 'SOL', amount: 42, value: 4620, change: 5.7, changeType: 'positive' },
    { id: 4, name: 'Cardano', symbol: 'ADA', amount: 2500, value: 2250, change: 0.8, changeType: 'positive' },
  ];

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  
  // Calculate percentages for allocation
  const assetsWithPercentage = assets.map(asset => ({
    ...asset,
    percentage: (asset.value / totalValue) * 100
  }));

  // Quick stats
  const quickStats = [
    { title: 'Total Assets', value: assets.length, icon: Wallet },
    { title: 'Top Performer', value: 'SOL +5.7%', icon: TrendingUp },
    { title: 'Last Updated', value: '2 mins ago', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <Button className="bg-gradient-to-r from-primary-purple to-primary-blue hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          Add New Asset
        </Button>
      </div>

      {/* Total Portfolio Value */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-primary-purple/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-text-secondary text-sm mb-1">Total Portfolio Value</h2>
            <div className="flex items-baseline space-x-3">
              <p className="text-white text-3xl font-bold">${totalValue.toLocaleString()}</p>
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+8.2%</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-3 bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-purple/20 to-primary-blue/20 border border-primary-purple/30 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary-purple" />
                </div>
                <div>
                  <p className="text-text-secondary text-xs">{stat.title}</p>
                  <p className="text-white font-medium">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-primary-green/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Asset Allocation</h2>
          </div>
        </div>

        <div className="space-y-4">
          {assetsWithPercentage.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-purple/20 to-primary-blue/20 border border-primary-purple/30 flex items-center justify-center">
                  <span className="text-white font-medium">{asset.symbol}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{asset.name}</p>
                  <p className="text-text-secondary text-sm">{asset.amount} {asset.symbol}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-white font-medium">${asset.value.toLocaleString()}</p>
                  <div className="flex items-center justify-end space-x-1">
                    {asset.changeType === 'positive' ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs ${asset.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.changeType === 'positive' ? '+' : ''}{asset.change}%
                    </span>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <p className="text-white font-medium">{asset.percentage.toFixed(1)}%</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder for future pie chart */}
        <div className="mt-6 p-6 rounded-xl border border-dashed border-gray-700 flex items-center justify-center">
          <div className="text-center">
            <PieChart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-text-secondary">Pie chart visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
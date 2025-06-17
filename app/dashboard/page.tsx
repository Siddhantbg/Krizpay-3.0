'use client';

import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  BarChart3, 
  Clock, 
  TrendingUp,
  Send,
  Download,
  CreditCard,
  Plus,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Placeholder data for dashboard
  const stats = [
    {
      title: 'Total Portfolio',
      value: '$12,345.67',
      change: '+5.2%',
      changeType: 'positive',
      icon: Wallet,
      color: 'from-primary-purple to-primary-blue'
    },
    {
      title: 'Top Asset',
      value: 'Bitcoin',
      change: '+3.8%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Recent Activity',
      value: '12 transactions',
      change: 'Last 7 days',
      changeType: 'neutral',
      icon: Clock,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Market Trend',
      value: 'Bullish',
      change: 'Most assets up',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  const recentTransactions = [
    {
      id: 'tx1',
      type: 'buy',
      asset: 'Bitcoin',
      amount: '0.05 BTC',
      value: '$2,150.00',
      date: '2 hours ago',
      status: 'completed'
    },
    {
      id: 'tx2',
      type: 'sell',
      asset: 'Ethereum',
      amount: '1.5 ETH',
      value: '$3,240.75',
      date: 'Yesterday',
      status: 'completed'
    },
    {
      id: 'tx3',
      type: 'transfer',
      asset: 'USDT',
      amount: '500 USDT',
      value: '$500.00',
      date: '3 days ago',
      status: 'pending'
    }
  ];

  const marketHighlights = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '$43,210.50',
      change: '+2.4%',
      marketCap: '$825.4B',
      volume: '$28.6B',
      changeType: 'positive'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: '$2,156.75',
      change: '+3.8%',
      marketCap: '$256.2B',
      volume: '$15.3B',
      changeType: 'positive'
    },
    {
      name: 'Cardano',
      symbol: 'ADA',
      price: '$1.25',
      change: '-0.6%',
      marketCap: '$42.1B',
      volume: '$2.1B',
      changeType: 'negative'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-text-secondary">
            Here's what's happening with your portfolio today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-gradient-to-r from-primary-purple to-primary-blue hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
          <Link href="/dashboard/portfolio">
            <Button variant="outline" className="border-gray-700 text-text-secondary hover:text-white hover:border-gray-600">
              View Portfolio
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 border border-primary-purple/20 hover:border-primary-purple/40 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${stat.changeType === 'positive' ? 'text-green-400 bg-green-500/10' : stat.changeType === 'negative' ? 'text-red-400 bg-red-500/10' : 'text-gray-400 bg-gray-500/10'}`}>
                {stat.changeType === 'positive' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                {stat.changeType === 'negative' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-text-secondary text-sm">{stat.title}</p>
              <p className="text-white text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-5 border border-primary-blue/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" className="text-text-secondary hover:text-white">
                View All
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${tx.type === 'buy' ? 'bg-green-500/20' : tx.type === 'sell' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                    {tx.type === 'buy' && <Download className="w-4 h-4 text-green-400" />}
                    {tx.type === 'sell' && <Send className="w-4 h-4 text-red-400" />}
                    {tx.type === 'transfer' && <CreditCard className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {tx.type === 'buy' ? 'Bought' : tx.type === 'sell' ? 'Sold' : 'Transferred'} {tx.asset}
                    </p>
                    <p className="text-text-secondary text-sm">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{tx.amount}</p>
                  <p className="text-text-secondary text-sm">{tx.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex justify-center space-x-4">
              <Button variant="outline" className="border-gray-700 text-text-secondary hover:text-white hover:border-gray-600">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button variant="outline" className="border-gray-700 text-text-secondary hover:text-white hover:border-gray-600">
                <Download className="w-4 h-4 mr-2" />
                Receive
              </Button>
              <Button variant="outline" className="border-gray-700 text-text-secondary hover:text-white hover:border-gray-600">
                <CreditCard className="w-4 h-4 mr-2" />
                Buy
              </Button>
            </div>
          </div>
        </div>

        {/* Market Highlights */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-5 border border-primary-purple/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Market Highlights</h2>
            <Link href="/dashboard/markets">
              <Button variant="ghost" className="text-text-secondary hover:text-white">
                View All
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {marketHighlights.map((coin, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                <div>
                  <p className="text-white font-medium">{coin.name}</p>
                  <p className="text-text-secondary text-sm">{coin.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{coin.price}</p>
                  <p className={`text-sm ${coin.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.change}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <Link href="/dashboard/markets">
              <Button className="w-full bg-gradient-to-r from-primary-purple to-primary-blue hover:opacity-90 transition-opacity">
                <BarChart3 className="w-4 h-4 mr-2" />
                Explore Markets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
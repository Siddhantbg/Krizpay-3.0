'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, CreditCard, Send, RadioReceiver as Receive, DollarSign, Users, Activity, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Balance',
      value: '$12,847.50',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      title: 'Monthly Transactions',
      value: '247',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Activity
    },
    {
      title: 'Active Contacts',
      value: '156',
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: 'Portfolio Growth',
      value: '+$2,340',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: TrendingUp
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'received',
      amount: '+$1,200.00',
      description: 'Salary Deposit',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'sent',
      amount: '-$89.99',
      description: 'Online Shopping',
      time: '5 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'received',
      amount: '+$450.00',
      description: 'Freelance Payment',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'sent',
      amount: '-$25.50',
      description: 'Coffee Shop',
      time: '2 days ago',
      status: 'completed'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-text-secondary">
              Here's what's happening with your account today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-primary-purple/20 hover:border-primary-purple/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-purple/20 to-primary-blue/20 border border-primary-purple/30 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-purple" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-text-secondary text-sm">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-primary-blue/20">
                <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-primary-purple/10 to-primary-blue/10 border border-primary-purple/20 hover:border-primary-purple/40 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-purple to-primary-blue flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">Send Money</p>
                      <p className="text-text-secondary text-sm">Transfer to contacts</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Receive className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">Request Money</p>
                      <p className="text-text-secondary text-sm">Get paid instantly</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">Pay Bills</p>
                      <p className="text-text-secondary text-sm">Utilities & services</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-primary-green/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
                  <button className="text-primary-purple hover:text-primary-blue transition-colors text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'received' 
                            ? 'bg-green-500/20 border border-green-500/30' 
                            : 'bg-red-500/20 border border-red-500/30'
                        }`}>
                          {transaction.type === 'received' ? (
                            <ArrowDownLeft className="w-5 h-5 text-green-400" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-text-secondary text-sm">{transaction.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'received' ? 'text-green-400' : 'text-white'
                        }`}>
                          {transaction.amount}
                        </p>
                        <p className="text-text-secondary text-sm capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
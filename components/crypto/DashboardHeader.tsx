'use client';

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { 
  Menu, 
  Bell, 
  RefreshCw, 
  TrendingUp, 
  DollarSign,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/auth/UserMenu';
import { formatCurrency } from '@/utils/formatters';

interface DashboardHeaderProps {
  user: User | null;
  totalValue: number;
  onMenuClick: () => void;
  refreshData: () => void;
  loading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  totalValue,
  onMenuClick,
  refreshData,
  loading
}) => {
  const [notifications] = useState([
    { id: 1, message: 'BTC reached your target price of $45,000', time: '2m ago', read: false },
    { id: 2, message: 'ETH is up 5.2% in the last hour', time: '15m ago', read: false },
    { id: 3, message: 'Your portfolio gained $234 today', time: '1h ago', read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-700 sticky top-0 z-30">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Portfolio Value */}
            <div className="hidden sm:flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Total Portfolio</p>
                  <p className="text-white text-xl font-bold">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+12.5%</span>
                <span className="text-text-secondary text-sm">24h</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-600">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                className="bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none w-32 lg:w-48"
              />
            </div>

            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              disabled={loading}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>

        {/* Mobile Portfolio Value */}
        <div className="sm:hidden mt-4 flex items-center justify-between">
          <div>
            <p className="text-text-secondary text-sm">Total Portfolio</p>
            <p className="text-white text-2xl font-bold">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+12.5%</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
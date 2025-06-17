'use client';

import React from 'react';
import { 
  PieChart, 
  TrendingUp, 
  CreditCard, 
  Settings, 
  X,
  Zap,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  activeView: 'portfolio' | 'markets' | 'transactions' | 'settings';
  onViewChange: (view: 'portfolio' | 'markets' | 'transactions' | 'settings') => void;
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeView,
  onViewChange,
  isOpen,
  onClose
}) => {
  const menuItems = [
    {
      id: 'portfolio' as const,
      label: 'Portfolio',
      icon: PieChart,
      description: 'Overview & Assets'
    },
    {
      id: 'markets' as const,
      label: 'Markets',
      icon: TrendingUp,
      description: 'Explore Crypto'
    },
    {
      id: 'transactions' as const,
      label: 'Transactions',
      icon: CreditCard,
      description: 'Trade History'
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      description: 'Preferences'
    }
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-purple to-primary-blue flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">KrizPay</h1>
                <p className="text-xs text-text-secondary">Crypto Dashboard</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {/* Back to Main App */}
          <a
            href="/"
            className="flex items-center space-x-3 p-3 rounded-xl text-text-secondary hover:text-white hover:bg-gray-800/50 transition-all duration-200 group"
          >
            <Home className="w-5 h-5" />
            <div>
              <div className="font-medium">Back to Home</div>
              <div className="text-xs text-text-secondary">Main Website</div>
            </div>
          </a>

          <div className="border-t border-gray-700 my-4"></div>

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group",
                activeView === item.id
                  ? "bg-gradient-to-r from-primary-purple/20 to-primary-blue/20 border border-primary-purple/30 text-white"
                  : "text-text-secondary hover:text-white hover:bg-gray-800/50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                activeView === item.id ? "text-primary-purple" : ""
              )} />
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-text-secondary">{item.description}</div>
              </div>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="bg-gradient-to-r from-primary-purple/10 to-primary-blue/10 rounded-xl p-4 border border-primary-purple/20">
            <h3 className="text-white font-semibold text-sm mb-1">Pro Features</h3>
            <p className="text-text-secondary text-xs mb-3">
              Unlock advanced analytics and alerts
            </p>
            <button className="w-full px-3 py-2 bg-gradient-to-r from-primary-purple to-primary-blue text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
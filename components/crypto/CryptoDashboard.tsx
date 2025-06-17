'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import PortfolioOverview from './PortfolioOverview';
import AssetAllocation from './AssetAllocation';
import TopGainersLosers from './TopGainersLosers';
import RecentTransactions from './RecentTransactions';
import PriceAlerts from './PriceAlerts';
import MarketTrends from './MarketTrends';
import CryptoSearch from './CryptoSearch';
import AssetDetails from './AssetDetails';
import { useCryptoData } from '@/hooks/useCryptoData';
import { usePortfolio } from '@/hooks/usePortfolio';
import { CryptoAsset, PortfolioAsset, Transaction } from '@/types/crypto';

const CryptoDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'portfolio' | 'markets' | 'transactions' | 'settings'>('portfolio');
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { 
    cryptoData, 
    loading: cryptoLoading, 
    error: cryptoError,
    refreshData 
  } = useCryptoData();

  const {
    portfolio,
    transactions,
    totalValue,
    addToPortfolio,
    removeFromPortfolio,
    addTransaction,
    loading: portfolioLoading
  } = usePortfolio(user?.uid);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  const handleAssetSelect = (asset: CryptoAsset) => {
    setSelectedAsset(asset);
  };

  const handleAddToPortfolio = async (asset: CryptoAsset, amount: number) => {
    await addToPortfolio(asset, amount);
  };

  const renderMainContent = () => {
    if (selectedAsset) {
      return (
        <AssetDetails
          asset={selectedAsset}
          onBack={() => setSelectedAsset(null)}
          onAddToPortfolio={handleAddToPortfolio}
          isInPortfolio={portfolio.some(p => p.id === selectedAsset.id)}
        />
      );
    }

    switch (activeView) {
      case 'portfolio':
        return (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <PortfolioOverview
              totalValue={totalValue}
              portfolio={portfolio}
              cryptoData={cryptoData}
              loading={portfolioLoading}
            />

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Asset Allocation */}
              <div className="xl:col-span-1">
                <AssetAllocation
                  portfolio={portfolio}
                  cryptoData={cryptoData}
                />
              </div>

              {/* Top Gainers/Losers */}
              <div className="xl:col-span-1">
                <TopGainersLosers
                  cryptoData={cryptoData}
                  onAssetSelect={handleAssetSelect}
                />
              </div>

              {/* Price Alerts */}
              <div className="xl:col-span-1">
                <PriceAlerts
                  userId={user?.uid}
                  cryptoData={cryptoData}
                />
              </div>

              {/* Recent Transactions */}
              <div className="lg:col-span-2 xl:col-span-2">
                <RecentTransactions
                  transactions={transactions}
                  cryptoData={cryptoData}
                />
              </div>

              {/* Market Trends */}
              <div className="lg:col-span-2 xl:col-span-1">
                <MarketTrends
                  cryptoData={cryptoData}
                />
              </div>
            </div>
          </div>
        );

      case 'markets':
        return (
          <div className="space-y-6">
            <CryptoSearch
              cryptoData={cryptoData}
              onAssetSelect={handleAssetSelect}
              onAddToPortfolio={handleAddToPortfolio}
              portfolio={portfolio}
            />
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            <RecentTransactions
              transactions={transactions}
              cryptoData={cryptoData}
              showAll={true}
            />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-purple/20">
              <h2 className="text-xl font-semibold text-white mb-4">Dashboard Settings</h2>
              <p className="text-text-secondary">Settings panel coming soon...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <DashboardSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <DashboardHeader
          user={user}
          totalValue={totalValue}
          onMenuClick={() => setIsSidebarOpen(true)}
          refreshData={refreshData}
          loading={cryptoLoading}
        />

        {/* Content */}
        <main className="p-4 lg:p-6">
          {cryptoError ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <p className="text-red-400 mb-4">Failed to load crypto data</p>
              <button
                onClick={refreshData}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            renderMainContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default CryptoDashboard;
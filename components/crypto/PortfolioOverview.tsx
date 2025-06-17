'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { PortfolioAsset, CryptoAsset } from '@/types/crypto';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface PortfolioOverviewProps {
  totalValue: number;
  portfolio: PortfolioAsset[];
  cryptoData: CryptoAsset[];
  loading: boolean;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  totalValue,
  portfolio,
  cryptoData,
  loading
}) => {
  const valueRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && valueRef.current) {
      // Animate the total value counter
      const counter = { value: 0 };
      gsap.to(counter, {
        value: totalValue,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          if (valueRef.current) {
            valueRef.current.textContent = formatCurrency(counter.value);
          }
        }
      });
    }
  }, [totalValue, loading]);

  useEffect(() => {
    if (statsRef.current) {
      const cards = statsRef.current.children;
      gsap.fromTo(cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }
  }, [portfolio]);

  // Calculate portfolio statistics
  const calculateStats = () => {
    if (portfolio.length === 0 || cryptoData.length === 0) {
      return {
        totalChange24h: 0,
        totalChangePercent24h: 0,
        totalAssets: 0,
        bestPerformer: null,
        worstPerformer: null
      };
    }

    let totalChange24h = 0;
    let bestPerformer = { symbol: '', change: -Infinity };
    let worstPerformer = { symbol: '', change: Infinity };

    portfolio.forEach(asset => {
      const cryptoAsset = cryptoData.find(c => c.id === asset.id);
      if (cryptoAsset) {
        const assetValue = asset.amount * cryptoAsset.current_price;
        const change24h = assetValue * (cryptoAsset.price_change_percentage_24h / 100);
        totalChange24h += change24h;

        if (cryptoAsset.price_change_percentage_24h > bestPerformer.change) {
          bestPerformer = {
            symbol: cryptoAsset.symbol.toUpperCase(),
            change: cryptoAsset.price_change_percentage_24h
          };
        }

        if (cryptoAsset.price_change_percentage_24h < worstPerformer.change) {
          worstPerformer = {
            symbol: cryptoAsset.symbol.toUpperCase(),
            change: cryptoAsset.price_change_percentage_24h
          };
        }
      }
    });

    const totalChangePercent24h = totalValue > 0 ? (totalChange24h / (totalValue - totalChange24h)) * 100 : 0;

    return {
      totalChange24h,
      totalChangePercent24h,
      totalAssets: portfolio.length,
      bestPerformer: bestPerformer.change !== -Infinity ? bestPerformer : null,
      worstPerformer: worstPerformer.change !== Infinity ? worstPerformer : null
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: '24h Change',
      value: formatCurrency(stats.totalChange24h),
      percentage: formatPercentage(stats.totalChangePercent24h),
      icon: stats.totalChange24h >= 0 ? TrendingUp : TrendingDown,
      color: stats.totalChange24h >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: stats.totalChange24h >= 0 ? 'from-green-500/20 to-emerald-500/20' : 'from-red-500/20 to-pink-500/20',
      borderColor: stats.totalChange24h >= 0 ? 'border-green-500/30' : 'border-red-500/30'
    },
    {
      title: 'Total Assets',
      value: stats.totalAssets.toString(),
      percentage: '',
      icon: DollarSign,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-purple-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Best Performer',
      value: stats.bestPerformer?.symbol || 'N/A',
      percentage: stats.bestPerformer ? formatPercentage(stats.bestPerformer.change) : '',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Worst Performer',
      value: stats.worstPerformer?.symbol || 'N/A',
      percentage: stats.worstPerformer ? formatPercentage(stats.worstPerformer.change) : '',
      icon: TrendingDown,
      color: 'text-red-400',
      bgColor: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/30'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900/50 rounded-2xl p-8 border border-primary-purple/20 backdrop-blur-sm">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
              <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Portfolio Value */}
      <div className="bg-gray-900/50 rounded-2xl p-8 border border-primary-purple/20 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-text-secondary text-lg mb-2">Total Portfolio Value</h2>
          <div 
            ref={valueRef}
            className="text-4xl lg:text-5xl font-bold gradient-text mb-4"
          >
            {formatCurrency(0)}
          </div>
          <div className={`flex items-center justify-center space-x-2 ${stats.totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.totalChange24h >= 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span className="text-lg font-semibold">
              {formatCurrency(stats.totalChange24h)} ({formatPercentage(stats.totalChangePercent24h)})
            </span>
            <span className="text-text-secondary">24h</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${stat.bgColor} rounded-xl p-4 border ${stat.borderColor} backdrop-blur-sm opacity-0`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              {stat.percentage && (
                <span className={`text-sm font-medium ${stat.color}`}>
                  {stat.percentage}
                </span>
              )}
            </div>
            <div>
              <p className="text-text-secondary text-sm">{stat.title}</p>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioOverview;
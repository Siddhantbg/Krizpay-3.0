'use client';

import { useState, useEffect, useCallback } from 'react';
import { CryptoAsset } from '@/types/crypto';

export const useCryptoData = () => {
  const [cryptoData, setCryptoData] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoData = useCallback(async () => {
    try {
      setError(null);
      
      // Using CoinGecko API (free tier)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d'
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform data to match our interface
      const transformedData: CryptoAsset[] = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        fully_diluted_valuation: coin.fully_diluted_valuation,
        total_volume: coin.total_volume,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
        market_cap_change_24h: coin.market_cap_change_24h,
        market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        max_supply: coin.max_supply,
        ath: coin.ath,
        ath_change_percentage: coin.ath_change_percentage,
        ath_date: coin.ath_date,
        atl: coin.atl,
        atl_change_percentage: coin.atl_change_percentage,
        atl_date: coin.atl_date,
        last_updated: coin.last_updated
      }));

      setCryptoData(transformedData);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch crypto data');
      
      // Fallback to mock data if API fails
      setCryptoData(getMockCryptoData());
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    setLoading(true);
    fetchCryptoData();
  }, [fetchCryptoData]);

  useEffect(() => {
    fetchCryptoData();
  }, [fetchCryptoData]);

  return {
    cryptoData,
    loading,
    error,
    refreshData
  };
};

// Mock data for fallback
const getMockCryptoData = (): CryptoAsset[] => [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 43250.50,
    market_cap: 847234567890,
    market_cap_rank: 1,
    fully_diluted_valuation: 908765432100,
    total_volume: 23456789012,
    high_24h: 44100.25,
    low_24h: 42800.75,
    price_change_24h: 1250.30,
    price_change_percentage_24h: 2.98,
    price_change_percentage_7d: 5.67,
    market_cap_change_24h: 25678901234,
    market_cap_change_percentage_24h: 3.12,
    circulating_supply: 19587234.5,
    total_supply: 19587234.5,
    max_supply: 21000000,
    ath: 69045.22,
    ath_change_percentage: -37.38,
    ath_date: '2021-11-10T14:24:11.849Z',
    atl: 67.81,
    atl_change_percentage: 63689.84,
    atl_date: '2013-07-06T00:00:00.000Z',
    last_updated: new Date().toISOString()
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 2650.75,
    market_cap: 318765432100,
    market_cap_rank: 2,
    fully_diluted_valuation: 318765432100,
    total_volume: 15678901234,
    high_24h: 2720.50,
    low_24h: 2580.25,
    price_change_24h: 85.25,
    price_change_percentage_24h: 3.32,
    price_change_percentage_7d: 7.89,
    market_cap_change_24h: 10234567890,
    market_cap_change_percentage_24h: 3.32,
    circulating_supply: 120234567.8,
    total_supply: 120234567.8,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -45.65,
    ath_date: '2021-11-10T14:24:19.604Z',
    atl: 0.432979,
    atl_change_percentage: 612345.67,
    atl_date: '2015-10-20T00:00:00.000Z',
    last_updated: new Date().toISOString()
  }
];